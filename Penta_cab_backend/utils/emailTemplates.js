// Email Template Utility for Penta Cab
// Fixed version with better email client compatibility

const generateEmailTemplate = (bookingData) => {
  const { type, route, car, traveller, date, time, serviceType } = bookingData;
  
  // Determine the appropriate icon and title based on booking type
  let icon, title, carLabel;
  switch (type) {
    case 'LOCAL':
      icon = '🚖';
      title = 'Local Ride Booking';
      carLabel = 'Car Selected';
      break;
    case 'AIRPORT':
      icon = '🛫';
      title = serviceType === 'drop' ? 'Airport Drop Booking' : 'Airport Pickup Booking';
      carLabel = 'Car Selected';
      break;
    case 'OUTSTATION':
      icon = '🚗';
      title = 'Intercity Booking';
      carLabel = 'Car Selected';
      break;
    default:
      icon = '🚖';
      title = 'Booking Confirmation';
      carLabel = 'Car Selected';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .booking-id-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
        }
        
        .booking-id-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .booking-id-value {
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          letter-spacing: 1px;
        }
        
        .info-section {
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #667eea;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: inline-block;
          text-align: center;
          line-height: 30px;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .payment-status {
          background: #28a745;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header {
            padding: 25px 15px;
          }
          
          .email-body {
            padding: 25px 15px;
          }
          
          .booking-id-value {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Booking Confirmed!</div>
          <div class="header-subtitle">Your ride is ready to go</div>
        </div>
        
        <div class="email-body">
          <div class="booking-id-section">
            <div class="booking-id-label">Booking ID</div>
            <div class="booking-id-value">${bookingData.bookingId || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🚗</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${bookingData.car?.type ? bookingData.car.type.toUpperCase() + ' AC taxi vehicle' : 'AC taxi vehicle'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Guest Information
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">Mr/Mrs - ${traveller?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">+91 ${traveller?.mobile || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📅</span>
              Trip Schedule
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${time || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">💳</span>
              Payment Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">Cash/UPI - ${bookingData.paymentMethod === '0' ? 'Cash' : bookingData.paymentMethod === '20' ? 'UPI/Card (20% Advance)' : bookingData.paymentMethod === '100' ? 'UPI/Card (100% Advance)' : 'Cash'}</span>
            </div>
            <div class="payment-status">
              Total Charges: ${bookingData.totalFare || car?.price || 0}/- INR ${bookingData.paymentMethod === '20' ? '(20% done)' : bookingData.paymentMethod === '100' ? '(100% done)' : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Pickup Location
            </div>
            <div class="detail-value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🎯</span>
              Drop Location
            </div>
            <div class="detail-value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="footer-tagline">Your trusted travel partner</div>
          
          <div class="contact-info">
            <div class="contact-item">📧 info@pentacab.com</div>
            <div class="contact-item">📱 +91-7600839900</div>
            <div class="contact-item">🌐 pentacabsfrontend-production.up.railway.app</div>
          </div>
          
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
            <p>Thank you for choosing Penta Cab! Our team will contact you shortly with driver details.</p>
            <p style="margin-top: 8px;">© 2024 Penta Cab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for booking confirmation emails
const generateBookingConfirmationTemplate = (bookingData) => {
  return generateEmailTemplate({
    ...bookingData,
    type: bookingData.serviceType || 'LOCAL'
  });
};

// Template for driver details emails
const generateDriverDetailsTemplate = (bookingData, driverDetails) => {
  const { route, date, time, car, traveller, bookingId, paymentMethod, totalFare } = bookingData;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Driver Details - Penta Cab</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .booking-id-section {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
        }
        
        .booking-id-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .booking-id-value {
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          letter-spacing: 1px;
        }
        
        .info-section {
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #28a745;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #28a745;
          color: white;
          display: inline-block;
          text-align: center;
          line-height: 30px;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .payment-status {
          background: #28a745;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .driver-section {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .vehicle-section {
          background: linear-gradient(135deg, #fd7e14 0%, #e8590c 100%);
          color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .whatsapp-button {
          display: inline-block;
          background: #25d366;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 15px;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header {
            padding: 25px 15px;
          }
          
          .email-body {
            padding: 25px 15px;
          }
          
          .booking-id-value {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Driver Details Assigned!</div>
          <div class="header-subtitle">Your chauffeur is ready</div>
        </div>
        
        <div class="email-body">
          <div class="booking-id-section">
            <div class="booking-id-label">Booking ID</div>
            <div class="booking-id-value">${bookingId || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🚗</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${car?.type ? car.type.toUpperCase() + ' AC taxi vehicle' : 'AC taxi vehicle'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Guest Information
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">Mr/Mrs - ${traveller?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">+91 ${traveller?.mobile || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📅</span>
              Trip Schedule
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${time || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">💳</span>
              Payment Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">Cash/UPI - ${paymentMethod === '0' ? 'Cash' : paymentMethod === '20' ? 'UPI/Card (20% Advance)' : paymentMethod === '100' ? 'UPI/Card (100% Advance)' : 'Cash'}</span>
            </div>
            <div class="payment-status">
              Total Charges: ${totalFare || car?.price || 0}/- INR ${paymentMethod === '20' ? '(20% done)' : paymentMethod === '100' ? '(100% done)' : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Pickup Location
            </div>
            <div class="detail-value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🎯</span>
              Drop Location
            </div>
            <div class="detail-value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
          </div>
          
          <div class="driver-section">
            <div class="section-title">
              <span class="section-icon">👨‍💼</span>
              Chauffeur Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Chauffeur:</span>
              <span class="detail-value">${driverDetails?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mob. No:</span>
              <span class="detail-value">${driverDetails?.whatsappNumber || 'N/A'}</span>
            </div>
            <a href="https://wa.me/${driverDetails?.whatsappNumber?.replace(/[^0-9]/g, '') || ''}" class="whatsapp-button">
              💬 Contact Driver on WhatsApp
            </a>
          </div>
          
          <div class="vehicle-section">
            <div class="section-title">
              <span class="section-icon">🚙</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Cab:</span>
              <span class="detail-value">${car?.name || car?.type || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Reg. no/car number:</span>
              <span class="detail-value">${driverDetails?.vehicleNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="footer-tagline">Your trusted travel partner</div>
          
          <div class="contact-info">
            <div class="contact-item">📧 info@pentacab.com</div>
            <div class="contact-item">📱 +91-7600839900</div>
            <div class="contact-item">🌐 pentacabsfrontend-production.up.railway.app</div>
          </div>
          
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
            <p>Safe travels! 🚗✨</p>
            <p style="margin-top: 8px;">© 2024 Penta Cab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for decline emails
const generateDeclineTemplate = (route, reason) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .decline-info {
          background: #fff5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
          border-left: 4px solid #dc3545;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .apology-note {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Booking Update</div>
        </div>
        
        <div class="email-body">
          <div class="decline-info">
            <p style="margin-bottom: 16px; font-size: 16px; color: #2c3e50;">
              We regret to inform you that we are unable to fulfill your booking request at this time.
            </p>
            
            <div class="detail-row">
              <span class="detail-label">Route:</span>
              <span class="detail-value">${route}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Reason:</span>
              <span class="detail-value">${reason || 'Service temporarily unavailable'}</span>
            </div>
          </div>
          
          <div class="apology-note">
            <p>We sincerely apologize for any inconvenience this may cause.</p>
            <p style="margin-top: 8px;">Please feel free to contact us for alternative arrangements.</p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="contact-info">
            <div class="contact-item">📧 info@pentacab.com</div>
            <div class="contact-item">📱 +91-7600839900</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateEmailTemplate,
  generateBookingConfirmationTemplate,
  generateDriverDetailsTemplate,
  generateDeclineTemplate
};
