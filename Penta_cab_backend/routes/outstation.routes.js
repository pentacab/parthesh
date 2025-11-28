const router = require('express').Router();
const sendEmail = require('../services/email.service');
const { OutstationEntry } = require('../model');
const { generateBookingConfirmationTemplate } = require('../utils/emailTemplates');

// CRUD listing with pagination
router.get('/api/outstation-routes', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const routes = await OutstationEntry.find()
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await OutstationEntry.countDocuments();

    res.json({
      routes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRoutes: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route updated successfully', route });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/intercity/search
router.post('/api/intercity/search', async (req, res) => {
  const { city1, city2, tripType } = req.body;
  try {
    const entry = await OutstationEntry.findOne({
      city1: { $regex: `^${city1}$`, $options: 'i' },
      city2: { $regex: `^${city2}$`, $options: 'i' },
      tripType
    });
    if (!entry) return res.status(404).json({ message: "No intercity rides found for your selection." });
    const availableCars = entry.cars.filter(c => c.available === true);
    res.json({ cars: availableCars, distance: entry.distance });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// GET /api/available-outstation-cities
router.get('/api/available-outstation-cities', async (req, res) => {
  try {
    const entries = await OutstationEntry.find({ 'cars.available': true }).select('city1 city2 -_id');
    const fromCities = new Set();
    const map = {};
    entries.forEach(e => {
      fromCities.add(e.city1);
      (map[e.city1] ||= new Set()).add(e.city2);
    });
    const formatted = {};
    for (const from in map) formatted[from] = [...map[from]];
    res.json({ cityMap: formatted, fromCities: [...fromCities] });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// POST /send-route-email (outstation launch)
router.post('/send-route-email', async (req, res) => {
  const { email, route, cars } = req.body;
  if (!email || !route) return res.status(400).json({ error: 'Missing email or route' });

  try {
    const availableCars = (cars || [])
      .filter(c => c.available)
      .map(c => `<li><strong>${c.type.toUpperCase()}</strong>: ₹${c.price}</li>`).join('');

    await sendEmail({
      to: email,
      subject: '🚗 New Outstation Route Launched!',
      html: `
        <h2>🚗 New Outstation Cab Route: ${route}</h2>
        <p>Hello,</p>
        <p>We’re excited to announce a new outstation route: <strong>${route}</strong>.</p>
        <ul>${availableCars || '<li>No cars currently available</li>'}</ul>
        <p>✅ Book now!</p><br/><p><strong>MakeRide Team</strong></p>`
    });

    return res.json({ message: 'Email sent successfully' });
  } catch (err) { res.status(500).json({ error: 'Email sending failed' }); }
});

// POST /send-intercity-email
router.post('/send-intercity-email', async (req, res) => {
  const { email, route, cab, traveller, date, time, bookingId, paymentMethod, totalFare } = req.body;
  if (!email || !route || !cab) return res.status(400).json({ error: 'Missing required data' });
  
  try {
    // Generate the modern email template
    const html = generateBookingConfirmationTemplate({
      serviceType: 'OUTSTATION',
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
    
    await sendEmail({ 
      from: `"MakeRide Admin" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "🚗 Intercity Booking Confirmation", 
      html 
    });
    return res.json({ message: "Intercity booking email sent successfully" });
  } catch (err) { 
    console.error('Email sending error:', err);
    return res.status(500).json({ error: "Email failed to send" }); 
  }
});

// POST /send-intercity-inquiry
router.post('/send-intercity-inquiry', async (req, res) => {
  const { 
    from, 
    to, 
    tripType, 
    departureDate, 
    pickupTime, 
    returnDate, 
    returnTime, 
    name, 
    phoneNumber 
  } = req.body;
  
  if (!from || !to || !departureDate || !pickupTime || !name || !phoneNumber) {
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
        <title>New Intercity Cab Inquiry</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          
          .email-header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
          
          .email-body {
            padding: 32px 24px;
          }
          
          .inquiry-summary {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid #667eea;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .detail-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          
          .detail-label {
            font-weight: 600;
            color: #34495e;
            min-width: 120px;
            font-size: 14px;
          }
          
          .detail-value {
            color: #2c3e50;
            flex: 1;
            font-size: 14px;
            word-break: break-word;
          }
          
          .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 12px;
            margin: 16px 0;
            text-align: center;
            color: #856404;
            font-weight: 500;
          }
          
          .email-footer {
            background-color: #f8f9fa;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          
          .company-name {
            font-weight: 600;
            color: #667eea;
            font-size: 16px;
            margin-bottom: 4px;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 0;
              border-radius: 0;
            }
            
            .email-body {
              padding: 24px 16px;
            }
            
            .email-header {
              padding: 20px 16px;
            }
            
            .detail-row {
              flex-direction: column;
              gap: 4px;
            }
            
            .detail-label {
              min-width: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>
              <span>🚗</span>
              <span>New Intercity Cab Inquiry</span>
            </h1>
          </div>
          
          <div class="email-body">
            <div class="highlight">
              📋 A new intercity cab inquiry has been submitted through the website
            </div>
            
            <div class="inquiry-summary">
              <h3 class="section-title">
                <span>📍</span>
                <span>Route Information</span>
              </h3>
              
              <div class="detail-row">
                <span class="detail-label">From:</span>
                <span class="detail-value">${from}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">To:</span>
                <span class="detail-value">${to}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Trip Type:</span>
                <span class="detail-value">${tripType === 'one-way' ? 'One Way' : 'Round Trip'}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Departure Date:</span>
                <span class="detail-value">${departureDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Pickup Time:</span>
                <span class="detail-value">${pickupTime}</span>
              </div>
              
              ${returnDate && returnTime ? `
                <div class="detail-row">
                  <span class="detail-label">Return Date:</span>
                  <span class="detail-value">${returnDate}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Return Time:</span>
                  <span class="detail-value">${returnTime}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="inquiry-summary">
              <h3 class="section-title">
                <span>👤</span>
                <span>Customer Details</span>
              </h3>
              
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Phone Number:</span>
                <span class="detail-value">
                  <a href="tel:${phoneNumber}" style="color: #667eea; text-decoration: none;">
                    ${phoneNumber}
                  </a>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">WhatsApp:</span>
                <span class="detail-value">
                  <a href="https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}" style="color: #25d366; text-decoration: none;">
                    💬 Contact on WhatsApp
                  </a>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Inquiry Time:</span>
                <span class="detail-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              </div>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="company-name">Penta Cabs - Admin Panel</div>
            <p style="color: #6c757d; font-size: 14px; margin-top: 8px;">
              Please respond to this inquiry promptly for better customer service.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send inquiry email to admin
    await sendEmail({
      to: 'mayankpandeyji2001@gmail.com',
      subject: `🚗 New Intercity Inquiry: ${from} to ${to} - ${name}`,
      html: inquiryHtml
    });
    
    return res.json({ message: "Inquiry email sent to admin successfully" });
  } catch (err) { 
    console.error('Inquiry email sending error:', err);
    return res.status(500).json({ error: "Failed to send inquiry email" }); 
  }
});

module.exports = router;
