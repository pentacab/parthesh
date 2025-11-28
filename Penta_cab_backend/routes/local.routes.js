const router = require('express').Router();
// const transporter = require('../services/email.service');
const sendEmail = require('../services/email.service');
const { LocalRideEntry } = require('../model');
const { generateBookingConfirmationTemplate } = require('../utils/emailTemplates');

// GET /api/local-services (pagination + search)
router.get('/api/local-services', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = { $or: [
        { city:    { $regex: req.query.search, $options: 'i' } },
        { package: { $regex: req.query.search, $options: 'i' } },
      ]};
    }

    const services = await LocalRideEntry.find(query)
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await LocalRideEntry.countDocuments(query);

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

// GET one
router.get('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update
router.put('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service updated successfully', service });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE
router.delete('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/local-ride/search
router.post('/api/local-ride/search', async (req, res) => {
  const { city, package: ridePackage } = req.body;
  try {
    const entry = await LocalRideEntry.findOne({
      city: { $regex: `^${city}$`, $options: 'i' },
      package: ridePackage,
    });
    if (!entry) return res.status(404).json({ message: "No rides found for the selected city and package." });
    const availableCars = entry.cars.filter(c => c.available);
    res.json({ cars: availableCars });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// GET /api/available-cities
router.get('/api/available-cities', async (req, res) => {
  try {
    const entries = await LocalRideEntry.find({ 'cars.available': true }).select('city -_id');
    const uniqueCities = [...new Set(entries.map(e => e.city))];
    res.json({ cities: uniqueCities });
  } catch (err) { res.status(500).json({ error: 'Internal server error' }); }
});

// POST /send-local-email
router.post('/send-local-email', async (req, res) => {
  try {
    const { email, route, car, traveller, date, time, bookingId, paymentMethod, totalFare } = req.body;
    if (!email || !route || !car || !traveller) {
      return res.status(400).json({ error: 'Missing data for email' });
    }

    // Generate the modern email template
    const html = generateBookingConfirmationTemplate({
      serviceType: 'LOCAL',
      route,
      car,
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

    console.log("code comes here-->>");
    await sendEmail({ 
      to: email, 
      subject: '🚖 Local Ride Booking Confirmation', 
      html 
    });
    return res.json({ message: 'Local ride email sent successfully' });
  } catch (err) { 
    console.error('Email sending error:', err);
    return res.status(500).json({ error: 'Failed to send email' }); 
  }
});

// POST /send-local-inquiry
router.post('/send-local-inquiry', async (req, res) => {
  const { 
    city, 
    package: packageType, 
    date, 
    pickupTime, 
    name, 
    phoneNumber 
  } = req.body;
  
  if (!city || !packageType || !date || !pickupTime || !name || !phoneNumber) {
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
        <title>New Local Cab Inquiry</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .email-header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 24px; text-align: center; }
          .email-header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 12px; }
          .email-body { padding: 32px 24px; }
          .inquiry-summary { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #28a745; }
          .section-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
          .detail-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .detail-label { font-weight: 600; color: #34495e; min-width: 120px; font-size: 14px; }
          .detail-value { color: #2c3e50; flex: 1; font-size: 14px; word-break: break-word; }
          .highlight { background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 12px; margin: 16px 0; text-align: center; color: #155724; font-weight: 500; }
          .email-footer { background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef; }
          .company-name { font-weight: 600; color: #28a745; font-size: 16px; margin-bottom: 4px; }
          @media (max-width: 600px) { .email-container { margin: 0; border-radius: 0; } .email-body { padding: 24px 16px; } .email-header { padding: 20px 16px; } .detail-row { flex-direction: column; gap: 4px; } .detail-label { min-width: auto; } }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1><span>🚖</span><span>New Local Cab Inquiry</span></h1>
          </div>
          <div class="email-body">
            <div class="highlight">📋 A new local cab inquiry has been submitted through the website</div>
            <div class="inquiry-summary">
              <h3 class="section-title"><span>📍</span><span>Service Information</span></h3>
              <div class="detail-row"><span class="detail-label">City:</span><span class="detail-value">${city}</span></div>
              <div class="detail-row"><span class="detail-label">Package:</span><span class="detail-value">${packageType}</span></div>
              <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${date}</span></div>
              <div class="detail-row"><span class="detail-label">Pickup Time:</span><span class="detail-value">${pickupTime}</span></div>
            </div>
            <div class="inquiry-summary">
              <h3 class="section-title"><span>👤</span><span>Customer Details</span></h3>
              <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value">${name}</span></div>
              <div class="detail-row"><span class="detail-label">Phone Number:</span><span class="detail-value"><a href="tel:${phoneNumber}" style="color: #28a745; text-decoration: none;">${phoneNumber}</a></span></div>
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
      subject: `🚖 New Local Inquiry: ${city} - ${packageType} - ${name}`,
      html: inquiryHtml
    });
    
    return res.json({ message: "Local inquiry email sent to admin successfully" });
  } catch (err) { 
    console.error('Local inquiry email sending error:', err);
    return res.status(500).json({ error: "Failed to send local inquiry email" }); 
  }
});

module.exports = router;
