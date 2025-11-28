const router = require('express').Router();
const sendEmail = require('../services/email.service');
const { AirportEntry } = require('../model');
const { generateBookingConfirmationTemplate } = require('../utils/emailTemplates');

// GET /api/airport-services (pagination + search)
router.get('/api/airport-services', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = { $or: [
        { airportCity:  { $regex: req.query.search, $options: 'i' } },
        { otherLocation:{ $regex: req.query.search, $options: 'i' } },
        { serviceType:  { $regex: req.query.search, $options: 'i' } },
      ]};
    }

    const services = await AirportEntry.find(query)
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await AirportEntry.countDocuments(query);

    res.json({
      services,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalServices: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service updated successfully', service });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/search-cabs-forairport
router.post('/api/search-cabs-forairport', async (req, res) => {
  const { serviceType, airportCity, otherLocation } = req.body;
  try {
    const sanitize = s => s.trim().toLowerCase();
    const entry = await AirportEntry.findOne({
      airportCity:   { $regex: new RegExp(`^${sanitize(airportCity)}$`, 'i') },
      otherLocation: { $regex: new RegExp(`^${sanitize(otherLocation)}$`, 'i') },
      serviceType
    });
    if (!entry) return res.status(404).json({ message: 'No matching cabs found.' });
    const availableCabs = entry.cars.filter(c => c.available);
    res.json({ cabs: availableCabs });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/available-airports
router.get('/api/available-airports', async (req, res) => {
  try {
    const entries = await AirportEntry.find({ 'cars.available': true })
      .select('airportCity otherLocation serviceType -_id');

    const grouped = {};
    entries.forEach(e => {
      if (!grouped[e.airportCity]) grouped[e.airportCity] = { drop: new Set(), pick: new Set() };
      grouped[e.airportCity][e.serviceType].add(e.otherLocation);
    });

    const formattedResult = Object.entries(grouped).map(([city, services]) => ({
      airportCity: city,
      dropLocations: [...services.drop],
      pickLocations: [...services.pick]
    }));

    res.json({ airports: formattedResult });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// POST /send-airport-email (admin announcement)
router.post('/send-airport-email', async (req, res) => {
  const { email, route, cars } = req.body;
  if (!email || !route || !cars) {
    return res.status(400).json({ error: 'Missing email, route, or car data' });
  }
  try {
    const availableCars = cars.filter(c => c.available)
      .map(c => `<li><strong>${c.type.toUpperCase()}</strong>: ₹${c.price}</li>`).join('');
    await sendEmail({
      to: email,
      subject: '🛫 New Airport Route Now Available!',
      html: `<h2>🛫 New Airport Route: ${route}</h2>
             <ul>${availableCars || '<li>No cars currently available</li>'}</ul>
             <p>✅ Book now and enjoy reliable airport transfers.</p>`
    });
    res.json({ message: 'Email sent successfully' });
  } catch (err) { res.status(500).json({ error: 'Failed to send email' }); }
});

// POST /api/send-airport-email (booking confirmation)
router.post('/api/send-airport-email', async (req, res) => {
  const { email, route, cab, traveller, date, time, serviceType, otherLocation, bookingId, paymentMethod, totalFare } = req.body;
  if (!email || !cab) return res.status(400).json({ error: 'Missing fields' });

  // Generate the modern email template
  const html = generateBookingConfirmationTemplate({
    serviceType: 'AIRPORT',
    route,
    car: cab,
    traveller: {
      ...traveller,
      email: email
    },
    date,
    time,
    bookingId,
    paymentMethod,
    totalFare
  });

  try {
    await sendEmail({
      to: email,
      subject: `🛫 Airport ${serviceType === 'drop' ? 'Drop' : 'Pickup'} Booking Confirmation`,
      html
    });
    res.json({ message: 'Airport booking email sent successfully' });
  } catch (err) { 
    console.error('Email sending error:', err);
    res.status(500).json({ error: 'Email failed to send' }); 
  }
});

// POST /send-airport-inquiry
router.post('/send-airport-inquiry', async (req, res) => {
  const { 
    airportCity, 
    serviceType, 
    otherLocation, 
    date, 
    pickupTime, 
    name, 
    phoneNumber 
  } = req.body;
  
  if (!airportCity || !serviceType || !otherLocation || !date || !pickupTime || !name || !phoneNumber) {
    return res.status(400).json({ error: 'Missing required fields for inquiry' });
  }
  
  try {
    // Generate inquiry email template
    const inquiryHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Airport Cab Inquiry</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .email-header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 24px; text-align: center; }
          .email-header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 12px; }
          .email-body { padding: 32px 24px; }
          .inquiry-summary { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #17a2b8; }
          .section-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
          .detail-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .detail-label { font-weight: 600; color: #34495e; min-width: 120px; font-size: 14px; }
          .detail-value { color: #2c3e50; flex: 1; font-size: 14px; word-break: break-word; }
          .highlight { background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 12px; margin: 16px 0; text-align: center; color: #0c5460; font-weight: 500; }
          .email-footer { background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef; }
          .company-name { font-weight: 600; color: #17a2b8; font-size: 16px; margin-bottom: 4px; }
          @media (max-width: 600px) { .email-container { margin: 0; border-radius: 0; } .email-body { padding: 24px 16px; } .email-header { padding: 20px 16px; } .detail-row { flex-direction: column; gap: 4px; } .detail-label { min-width: auto; } }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1><span>🛫</span><span>New Airport Cab Inquiry</span></h1>
          </div>
          <div class="email-body">
            <div class="highlight">📋 A new airport cab inquiry has been submitted through the website</div>
            <div class="inquiry-summary">
              <h3 class="section-title"><span>🛫</span><span>Airport Service Information</span></h3>
              <div class="detail-row"><span class="detail-label">Airport:</span><span class="detail-value">${airportCity}</span></div>
              <div class="detail-row"><span class="detail-label">Service Type:</span><span class="detail-value">${serviceType === 'pickup' ? 'Airport Pickup' : 'Airport Drop'}</span></div>
              <div class="detail-row"><span class="detail-label">${serviceType === 'pickup' ? 'Pickup Location:' : 'Drop Location:'}</span><span class="detail-value">${otherLocation}</span></div>
              <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${date}</span></div>
              <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${pickupTime}</span></div>
            </div>
            <div class="inquiry-summary">
              <h3 class="section-title"><span>👤</span><span>Customer Details</span></h3>
              <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value">${name}</span></div>
              <div class="detail-row"><span class="detail-label">Phone Number:</span><span class="detail-value"><a href="tel:${phoneNumber}" style="color: #17a2b8; text-decoration: none;">${phoneNumber}</a></span></div>
              <div class="detail-row"><span class="detail-label">WhatsApp:</span><span class="detail-value"><a href="https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none;">💬 Contact on WhatsApp</a></span></div>
              <div class="detail-row"><span class="detail-label">Inquiry Time:</span><span class="detail-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span></div>
            </div>
          </div>
          <div class="email-footer">
            <div class="company-name">Penta Cabs - Admin Panel</div>
            <p style="color: #6c757d; font-size: 14px; margin-top: 8px;">Please respond to this inquiry promptly for better customer service.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send inquiry email to admin
    await sendEmail({
      to: 'mayankpandeyji2001@gmail.com',
      subject: `🛫 New Airport Inquiry: ${airportCity} ${serviceType === 'pickup' ? 'Pickup' : 'Drop'} - ${name}`,
      html: inquiryHtml
    });
    
    return res.json({ message: "Airport inquiry email sent to admin successfully" });
  } catch (err) { 
    console.error('Airport inquiry email sending error:', err);
    return res.status(500).json({ error: "Failed to send airport inquiry email" }); 
  }
});

module.exports = router;
