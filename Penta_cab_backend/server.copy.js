// server.js
const express = require('express');
const mongoose = require('mongoose');
const { AirportEntry, OutstationEntry, LocalRideEntry, BookingRequest } = require('./model');
const cors = require('cors');
const sendEmail = require('./services/email.service');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//  NEW (clean, no deprecated options)
mongoose.connect('mongodb+srv://Mayank20078657:Mayank20078657@cluster0.nxcumti.mongodb.net/AdminServiceforCabs')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API endpoint
app.post('/add-service', async (req, res) => {
  try {
    const entry = new AirportEntry(req.body);
    await entry.save();
    res.status(201).json({ message: 'Service entry saved' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const airportData = [
  // Delhi NCR Airports
  { name: "Indira Gandhi International Airport", iata: "DEL", city: "Delhi" },
  { name: "Hindon Airport", iata: "QAH", city: "Ghaziabad" }, // Civil enclave for Delhi NCR
  { name: "Noida International Airport (Jewar)", iata: "DXN", city: "Noida" }, // Under construction but worth including

  // Major Airports across India (original + 10 more)
  { name: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", city: "Mumbai" },
  { name: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru" },
  { name: "Rajiv Gandhi International Airport", iata: "HYD", city: "Hyderabad" },
  { name: "Sardar Vallabhbhai Patel International Airport", iata: "AMD", city: "Ahmedabad" },
  { name: "Cochin International Airport", iata: "COK", city: "Kochi" },
  { name: "Pune Airport", iata: "PNQ", city: "Pune" },
  { name: "Chennai International Airport", iata: "MAA", city: "Chennai" },
  { name: "Netaji Subhas Chandra Bose International Airport", iata: "CCU", city: "Kolkata" },
  { name: "Dabolim Airport", iata: "GOI", city: "Goa" },
  { name: "Lokpriya Gopinath Bordoloi International Airport", iata: "GAU", city: "Guwahati" },
  { name: "Jay Prakash Narayan Airport", iata: "PAT", city: "Patna" },
  { name: "Sri Guru Ram Dass Jee International Airport", iata: "ATQ", city: "Amritsar" },
  { name: "Dr. Babasaheb Ambedkar International Airport", iata: "NAG", city: "Nagpur" },
  { name: "Shaheed Bhagat Singh International Airport", iata: "IXC", city: "Chandigarh" },

  // ✈️ 10 more major airports
  { name: "Veer Savarkar International Airport", iata: "IXZ", city: "Port Blair" },
  { name: "Biju Patnaik International Airport", iata: "BBI", city: "Bhubaneswar" },
  { name: "Lal Bahadur Shastri International Airport", iata: "VNS", city: "Varanasi" },
  { name: "Birsa Munda Airport", iata: "IXR", city: "Ranchi" },
  { name: "Devi Ahilya Bai Holkar Airport", iata: "IDR", city: "Indore" },
  { name: "Maharaja Bir Bikram Airport", iata: "IXA", city: "Agartala" },
  { name: "Gaya International Airport", iata: "GAY", city: "Gaya" },
  { name: "Surat International Airport", iata: "STV", city: "Surat" },
  { name: "Tirupati Airport", iata: "TIR", city: "Tirupati" },
  { name: "Bagdogra Airport", iata: "IXB", city: "Siliguri" }
];



app.get('/api/airports', (req, res) => {
  res.json(airportData);
});


app.post('/add-outstation', async (req, res) => {
  try {
    const entry = new OutstationEntry(req.body);
    await entry.save();
    res.status(201).json({ message: 'Outstation booking saved' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all outstation routes with pagination
app.get('/api/outstation-routes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const routes = await OutstationEntry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single outstation route by ID
app.get('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update outstation route
app.put('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ message: 'Route updated successfully', route });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete outstation route
app.delete('/api/outstation-routes/:id', async (req, res) => {
  try {
    const route = await OutstationEntry.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all local services with pagination
app.get('/api/local-services', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { city: { $regex: req.query.search, $options: 'i' } },
          { package: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }

    const services = await LocalRideEntry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single local service by ID
app.get('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update local service
app.put('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete local service
app.delete('/api/local-services/:id', async (req, res) => {
  try {
    const service = await LocalRideEntry.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all airport services with pagination
app.get('/api/airport-services', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { airportCity: { $regex: req.query.search, $options: 'i' } },
          { otherLocation: { $regex: req.query.search, $options: 'i' } },
          { serviceType: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }

    const services = await AirportEntry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single airport service by ID
app.get('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update airport service
app.put('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete airport service
app.delete('/api/airport-services/:id', async (req, res) => {
  try {
    const service = await AirportEntry.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const nodemailer = require('nodemailer');

app.post('/send-route-email', async (req, res) => {
  const { email, route } = req.body;

  if (!email || !route) return res.status(400).json({ error: 'Missing email or route' });

  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });

    // const { email, route, cars } = req.body; // Make sure to send `cars` too

    const availableCars = cars
      .filter(car => car.available)
      .map(car => `<li><strong>${car.type.toUpperCase()}</strong>: ₹${car.price}</li>`)
      .join('');

    const mailOptions = {
      to: email,
      subject: '🚗 New Outstation Route Launched!',
      html: `
    <h2>🚗 New Outstation Cab Route: ${route}</h2>
    <p>Hello,</p>
    <p>We're excited to announce a new outstation travel route between <strong>${route}</strong>.</p>

    <p>Here are the available cab options for this route:</p>
    <ul>
      ${availableCars || '<li>No cars currently available</li>'}
    </ul>

    <p>✅ Book now and be the first to enjoy this new route!</p>
    <p>Visit our booking portal or contact us for details.</p>

    <br />
    <p>Thanks,</p>
    <p><strong>MakeRide Team</strong></p>
  `
    };


    await sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Email sending failed' });
  }
});


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
app.post('/send-airport-email', async (req, res) => {
  const { email, route, cars } = req.body;

  if (!email || !route || !cars) {
    return res.status(400).json({ error: 'Missing email, route, or car data' });
  }

  try {
    const availableCars = cars
      .filter(car => car.available)
      .map(car => `<li><strong>${car.type.toUpperCase()}</strong>: ₹${car.price}</li>`)
      .join('');

    const mailOptions = {
      to: email,
      subject: '🛫 New Airport Route Now Available!',
      html: `
        <h2>🛫 New Airport Route: ${route}</h2>
        <p>Hello,</p>
        <p>We’ve just launched a new airport cab route: <strong>${route}</strong>.</p>

        <p>Here are the available cab options:</p>
        <ul>
          ${availableCars || '<li>No cars currently available</li>'}
        </ul>

        <p>✅ Book now and enjoy reliable airport transfers.</p>
        <p>Visit our website to book your ride today!</p>

        <br />
        <p>Thanks,</p>
        <p><strong>MakeRide Team</strong></p>
      `
    };

    await sendEmail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Save local ride
// app.post('/add-local', async (req, res) => {
//   try {
//     const entry = new LocalRideEntry(req.body);
//     await entry.save();
//     res.status(201).json({ message: 'Local ride saved' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// Save multiple local rides
app.post('/add-local-bulk', async (req, res) => {
  try {
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length !== 4) {
      return res.status(400).json({ error: 'Expected 4 entries for 4 packages' });
    }

    await LocalRideEntry.insertMany(entries);
    res.status(201).json({ message: 'All packages saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Email route
// app.post('/send-local-email', async (req, res) => {
//   const { email, route, cars } = req.body;

//   if (!email || !route || !cars) {
//     return res.status(400).json({ error: 'Missing email, route, or car data' });
//   }

//   try {
//     const availableCars = cars
//       .filter(car => car.available)
//       .map(car => `<li><strong>${car.type.toUpperCase()}</strong>: ₹${car.price}</li>`)
//       .join('');

//     const mailOptions = {
//       from: `"MakeRide Admin" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: '🛺 New Local Ride Package Available!',
//       html: `
//         <h2>🚖 Local Ride - ${route}</h2>
//         <p>Hello,</p>
//         <p>We've added a new local ride package in your city!</p>
//         <p><strong>Package:</strong> ${route}</p>
//         <p><strong>Available Cabs:</strong></p>
//         <ul>
//           ${availableCars || '<li>No cars currently listed</li>'}
//         </ul>
//         <p>✅ Book now and enjoy city rides with comfort.</p>
//         <br />
//         <p>Thanks,</p>
//         <p><strong>MakeRide Team</strong></p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: 'Local ride email sent' });
//   } catch (err) {
//     console.error('Email error:', err);
//     res.status(500).json({ error: 'Failed to send email' });
//   }
// })

const cities = require('./cities.json');

app.get('/api/cities', (req, res) => {
  res.json(cities);
});

// POST /api/local-ride/search cabs for user 
app.post('/api/local-ride/search', async (req, res) => {
  const { city, package: ridePackage } = req.body;

  try {
    const entry = await LocalRideEntry.findOne({
      city: { $regex: `^${city}$`, $options: 'i' }, // case-insensitive city match
      package: ridePackage,
    });

    if (!entry) {
      return res.status(404).json({ message: "No rides found for the selected city and package." });
    }

    const availableCars = entry.cars.filter(car => car.available);
    res.json({ cars: availableCars });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error." });
  }
});


// POST /api/intercity/search - match city1, city2, and tripType
app.post('/api/intercity/search', async (req, res) => {
  const { city1, city2, tripType } = req.body;

  try {
    const entry = await OutstationEntry.findOne({
      city1: { $regex: `^${city1}$`, $options: 'i' }, // case-insensitive match
      city2: { $regex: `^${city2}$`, $options: 'i' },
      tripType
    });

    if (!entry) {
      return res.status(404).json({ message: "No intercity rides found for your selection." });
    }

    const availableCars = entry.cars.filter(car => car.available === true);

    res.json({ cars: availableCars, distance: entry.distance });
  } catch (err) {
    console.error("Intercity search error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

app.post('/api/search-cabs-forairport', async (req, res) => {
  const { serviceType, airportCity, otherLocation, date, time } = req.body;

  console.log('Received search:', req.body); // ✅ log input

  try {
    const sanitize = str => str.trim().toLowerCase();

    const entry = await AirportEntry.findOne({
      airportCity: { $regex: new RegExp(`^${sanitize(airportCity)}$`, 'i') },
      otherLocation: { $regex: new RegExp(`^${sanitize(otherLocation)}$`, 'i') },
      serviceType
    });


    if (!entry) {
      console.log('No matching entry found');
      return res.status(404).json({ message: 'No matching cabs found.' });
    }

    const availableCabs = entry.cars.filter(car => car.available);
    console.log('Available cabs:', availableCabs); // ✅ log matched cabs

    return res.json({ cabs: availableCabs });
  } catch (err) {
    console.error('Error searching cabs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// allow users to see only the cities where cabs are available in databse of admin
// GET route to fetch cities where at least one car is available
app.get('/api/available-cities', async (req, res) => {
  try {
    const entries = await LocalRideEntry.find({
      'cars.available': true
    }).select('city -_id');

    // Extract unique city names
    const uniqueCities = [...new Set(entries.map(entry => entry.city))];

    res.json({ cities: uniqueCities });
  } catch (error) {
    console.error('Error fetching available cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update otherLocation options dynamically when a user selects an airportCity.
app.get('/api/available-airports', async (req, res) => {
  try {
    const entries = await AirportEntry.find({ 'cars.available': true })
      .select('airportCity otherLocation serviceType -_id');

    // Group data
    const result = {};

    entries.forEach(entry => {
      const { airportCity, otherLocation, serviceType } = entry;

      if (!result[airportCity]) {
        result[airportCity] = { drop: new Set(), pick: new Set() };
      }
      result[airportCity][serviceType].add(otherLocation);
    });

    // Convert Set to Array
    const formattedResult = Object.entries(result).map(([city, services]) => ({
      airportCity: city,
      dropLocations: [...services.drop],
      pickLocations: [...services.pick]
    }));

    res.json({ airports: formattedResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Options should be based on actual entries from the admin (from the OutstationEntry collection)
app.get('/api/available-outstation-cities', async (req, res) => {
  try {
    const entries = await OutstationEntry.find({ 'cars.available': true }).select('city1 city2 -_id');

    const cityPairs = new Set();
    const fromCities = new Set();
    const cityMap = {}; // city1 => Set(city2s)

    entries.forEach(entry => {
      fromCities.add(entry.city1);

      if (!cityMap[entry.city1]) {
        cityMap[entry.city1] = new Set();
      }
      cityMap[entry.city1].add(entry.city2);
    });

    // Convert to plain arrays
    const formatted = {};
    for (const from in cityMap) {
      formatted[from] = [...cityMap[from]];
    }

    res.json({ cityMap: formatted, fromCities: [...fromCities] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/send-local-email', async (req, res) => {
  

  try {

    console.log("loggggg-----...");

    const { email, route, car, traveller } = req.body;

    if (!email || !route || !car || !traveller) {
      return res.status(400).json({ error: 'Missing data for email' });
    }

    const htmlContent = `
    <h2>🚖 Local Ride Booking</h2>
    <p><strong>Route:</strong> ${route}</p>
    <p><strong>Car Selected:</strong> ${car.type.toUpperCase()} - ₹${car.price}</p>
    <hr />
    <h3>👤 Traveller Details</h3>
    <p><strong>Name:</strong> ${traveller.name}</p>
    <p><strong>Mobile:</strong> ${traveller.mobile}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Pickup:</strong> ${traveller.pickupAddress}</p>
    <p><strong>Drop:</strong> ${traveller.dropAddress}</p>
    <p><strong>Remark:</strong> ${traveller.remark}</p>
    ${traveller.gst ? `<p><strong>GST:</strong> ${traveller.gst}</p>` : ''}
    <br/>
    <p>Thanks,</p>
    <p><strong>MakeRide Team</strong></p>
  `;

    const mailOptions = {
      to: email,
      subject: '🧾 Your Local Ride Booking Confirmation',
      html: htmlContent
    };

    console.log("code comes heere -->>>...");
    
    await sendEmail(mailOptions);
    res.json({ message: 'Local ride email sent' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/send-intercity-email', async (req, res) => {
  const { email, route, cab, traveller } = req.body;

  if (!email || !route || !cab) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    const html = `
      <h2>🚖 Intercity Booking Confirmation</h2>
      <p><strong>Route:</strong> ${route}</p>
      <p><strong>Cab:</strong> ${cab.type.toUpperCase()} - ₹${cab.price}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <hr/>
      <h3>🧍 Traveller Details</h3>
      <p><strong>Name:</strong> ${traveller.name}</p>
      <p><strong>Mobile:</strong> ${traveller.mobile}</p>
      <p><strong>Pickup:</strong> ${traveller.pickup}</p>
      <p><strong>Drop:</strong> ${traveller.drop}</p>
      <p><strong>Remark:</strong> ${traveller.remark || '-'}</p>
      <p><strong>GST:</strong> ${traveller.gst || '-'}</p>
      <br/>
      <p>Thanks,</p>
      <p><strong>MakeRide Team</strong></p>
    `;

    await sendEmail({
      to: email,
      subject: "🚖 Your Intercity Ride is Confirmed!",
      html
    });

    res.json({ message: "Email sent" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

// API endpoint to populate outstation database with sample data
app.post('/api/populate-outstation', async (req, res) => {
  try {
    const sampleOutstationData = [
      {
        city1: "Delhi",
        city2: "Agra",
        dateTime: new Date(),
        distance: 200,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2500 },
          { type: "suv", available: true, price: 3500 },
          { type: "innova", available: true, price: 4000 },
          { type: "crysta", available: true, price: 4500 }
        ]
      },
      {
        city1: "Delhi",
        city2: "Jaipur",
        dateTime: new Date(),
        distance: 280,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 3000 },
          { type: "suv", available: true, price: 4200 },
          { type: "innova", available: true, price: 4800 },
          { type: "crysta", available: true, price: 5500 }
        ]
      },
      {
        city1: "Mumbai",
        city2: "Pune",
        dateTime: new Date(),
        distance: 150,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2000 },
          { type: "suv", available: true, price: 2800 },
          { type: "innova", available: true, price: 3200 },
          { type: "crysta", available: true, price: 3800 }
        ]
      },
      {
        city1: "Mumbai",
        city2: "Nashik",
        dateTime: new Date(),
        distance: 180,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2200 },
          { type: "suv", available: true, price: 3100 },
          { type: "innova", available: true, price: 3600 },
          { type: "crysta", available: true, price: 4200 }
        ]
      },
      {
        city1: "Bangalore",
        city2: "Mysore",
        dateTime: new Date(),
        distance: 140,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 1800 },
          { type: "suv", available: true, price: 2500 },
          { type: "innova", available: true, price: 3000 },
          { type: "crysta", available: true, price: 3500 }
        ]
      },
      {
        city1: "Bangalore",
        city2: "Chennai",
        dateTime: new Date(),
        distance: 350,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 4500 },
          { type: "suv", available: true, price: 6200 },
          { type: "innova", available: true, price: 7200 },
          { type: "crysta", available: true, price: 8500 }
        ]
      },
      {
        city1: "Hyderabad",
        city2: "Warangal",
        dateTime: new Date(),
        distance: 160,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2000 },
          { type: "suv", available: true, price: 2800 },
          { type: "innova", available: true, price: 3300 },
          { type: "crysta", available: true, price: 3900 }
        ]
      },
      {
        city1: "Chennai",
        city2: "Pondicherry",
        dateTime: new Date(),
        distance: 160,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2000 },
          { type: "suv", available: true, price: 2800 },
          { type: "innova", available: true, price: 3300 },
          { type: "crysta", available: true, price: 3900 }
        ]
      },
      {
        city1: "Kolkata",
        city2: "Digha",
        dateTime: new Date(),
        distance: 180,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 2200 },
          { type: "suv", available: true, price: 3100 },
          { type: "innova", available: true, price: 3600 },
          { type: "crysta", available: true, price: 4200 }
        ]
      },
      {
        city1: "Ahmedabad",
        city2: "Vadodara",
        dateTime: new Date(),
        distance: 110,
        tripType: "one-way",
        cars: [
          { type: "sedan", available: true, price: 1500 },
          { type: "suv", available: true, price: 2100 },
          { type: "innova", available: true, price: 2500 },
          { type: "crysta", available: true, price: 3000 }
        ]
      }
    ];

    // Clear existing data
    await OutstationEntry.deleteMany({});
    console.log('Cleared existing outstation data');

    // Insert sample data
    const result = await OutstationEntry.insertMany(sampleOutstationData);
    console.log(`✅ Successfully added ${result.length} outstation routes to database`);

    res.json({
      message: `Successfully populated database with ${result.length} outstation routes`,
      routes: result.map(route => `${route.city1} → ${route.city2} (${route.distance} km)`)
    });

  } catch (error) {
    console.error('❌ Error populating outstation data:', error);
    res.status(500).json({ error: 'Failed to populate database' });
  }
});



app.post('/api/send-airport-email', async (req, res) => {
  const { email, route, cab, traveller, date, time, serviceType, otherLocation } = req.body;
  if (!email || !cab) return res.status(400).json({ error: 'Missing fields' });

  const html = `
    <h2>🛫 Airport ${serviceType === 'drop' ? 'Drop' : 'Pickup'} Booking Confirmed</h2>
    <p><strong>Route:</strong> ${route}</p>
    <p><strong>From/To:</strong> ${otherLocation}</p>
    <p><strong>Date & Time:</strong> ${date} at ${time}</p>
    <p><strong>Cab:</strong> ${cab.type.toUpperCase()} – ₹${cab.price}</p>
    <hr/>
    <h3>🧍 Traveller Details</h3>
    <p><strong>Name:</strong> ${traveller.name}</p>
    <p><strong>Mobile:</strong> ${traveller.mobile}</p>
    <p><strong>Pickup Address:</strong> ${traveller.pickup || '-'}</p>
    <p><strong>Drop Address:</strong> ${traveller.drop || '-'}</p>
    <p><strong>Remark:</strong> ${traveller.remark || '-'}</p>
    <p><strong>GST:</strong> ${traveller.gst || '-'}</p>
    <br/>
    <p>Thanks,</p>
    <p><strong>MakeRide Team</strong></p>
  `;

  try {
    await sendEmail({
      to: email,
      subject: `Your Airport Ride Booking`,
      html
    });
    return res.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Email failed' });
  }
});

// New API endpoints for managing booking requests

// Create a new booking request
app.post('/api/create-booking-request', async (req, res) => {
  try {
    const bookingRequest = new BookingRequest(req.body);
    await bookingRequest.save();
    res.status(201).json({
      message: 'Booking request created successfully',
      bookingId: bookingRequest._id
    });
  } catch (err) {
    console.error('Error creating booking request:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all booking requests for admin dashboard
app.get('/api/booking-requests', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookingRequests = await BookingRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BookingRequest.countDocuments();

    res.json({
      bookingRequests,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching booking requests:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update booking request status (accept/decline)
app.put('/api/booking-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!bookingRequest) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    res.json({
      message: 'Booking request status updated successfully',
      bookingRequest
    });
  } catch (err) {
    console.error('Error updating booking request status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add driver details to accepted booking
app.put('/api/booking-requests/:id/driver-details', async (req, res) => {
  try {
    const { id } = req.params;
    const { driverDetails } = req.body;

    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      id,
      {
        driverDetails,
        status: 'driver_sent'
      },
      { new: true }
    );

    if (!bookingRequest) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    // Send email to user with driver details
    const html = `
      <h2>🚖 Your Driver Details</h2>
      <p><strong>Route:</strong> ${bookingRequest.route}</p>
      <p><strong>Date:</strong> ${bookingRequest.date}</p>
      <p><strong>Time:</strong> ${bookingRequest.time}</p>
      <hr/>
      <h3>👨‍💼 Driver Information</h3>
      <p><strong>Name:</strong> ${driverDetails.name}</p>
      <p><strong>WhatsApp:</strong> ${driverDetails.whatsappNumber}</p>
      <p><strong>Vehicle Number:</strong> ${driverDetails.vehicleNumber}</p>
      <br/>
      <p>Your driver will contact you shortly. Please ensure you're available at the pickup location.</p>
      <br/>
      <p>Thanks,</p>
      <p><strong>MakeRide Team</strong></p>
    `;

    await sendEmail({
      to: bookingRequest.traveller.email,
      subject: "🚖 Your Driver Details - MakeRide",
      html
    });

    res.json({
      message: 'Driver details added and email sent successfully',
      bookingRequest
    });
  } catch (err) {
    console.error('Error adding driver details:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send decline email
app.post('/api/send-decline-email', async (req, res) => {
  try {
    const { email, route, reason } = req.body;

    const html = `
      <h2>📝 Booking Update</h2>
      <p>We regret to inform you that we are unable to fulfill your booking request at this time.</p>
      <p><strong>Route:</strong> ${route}</p>
      <p><strong>Reason:</strong> ${reason || 'Service temporarily unavailable'}</p>
      <hr/>
      <p>We apologize for any inconvenience caused. Please feel free to contact us for alternative arrangements or future bookings.</p>
      <br/>
      <p>Thanks,</p>
      <p><strong>MakeRide Team</strong></p>
    `;

    await sendEmail({
      to: email,
      subject: "📝 Booking Update - MakeRide",
      html
    });

    res.json({ message: 'Decline email sent successfully' });
  } catch (err) {
    console.error('Error sending decline email:', err);
    res.status(500).json({ error: 'Failed to send decline email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
