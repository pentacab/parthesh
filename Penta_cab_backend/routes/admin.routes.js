const router = require('express').Router();
const { AirportEntry, OutstationEntry, LocalRideEntry } = require('../model.js');

// POST /add-service  (AirportEntry)
router.post('/add-service', async (req, res) => {
  try {
    const entry = new AirportEntry(req.body);
    await entry.save();
    res.status(201).json({ message: 'Service entry saved' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /add-outstation
router.post('/add-outstation', async (req, res) => {
  try {
    const entry = new OutstationEntry(req.body);
    await entry.save();
    res.status(201).json({ message: 'Outstation booking saved' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// POST /add-local-bulk (expects 4 entries)
router.post('/add-local-bulk', async (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length !== 4) {
      return res.status(400).json({ error: 'Expected 4 entries for 4 packages' });
    }
    await LocalRideEntry.insertMany(entries);
    res.status(201).json({ message: 'All packages saved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/populate-outstation (sample seed)
router.post('/api/populate-outstation', async (req, res) => {
  try {
    const sample = [  {
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
      }];
    await OutstationEntry.deleteMany({});
    const result = await OutstationEntry.insertMany(sample);
    res.json({
      message: `Successfully populated database with ${result.length} outstation routes`,
      routes: result.map(r => `${r.city1} → ${r.city2} (${r.distance} km)`)
    });
  } catch (error) {
    console.error('❌ Error populating outstation data:', error);
    res.status(500).json({ error: 'Failed to populate database' });
  }
});

module.exports = router;
