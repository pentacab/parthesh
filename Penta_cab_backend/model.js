const mongoose = require('mongoose');

// Car sub-schema (shared)
const carSchema = new mongoose.Schema({
    type: { type: String, enum: ['sedan', 'suv', 'innova', 'crysta'] },
    available: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
});

// Airport schema
const airportentrySchema = new mongoose.Schema({
    airportCity: String,
    airportName: String,
    airportCode: String,
    serviceType: { type: String, enum: ['drop', 'pick'] },
    otherLocation: String,
    dateTime: Date,
    distance: Number,
    cars: [carSchema]
}, { timestamps: true });

const AirportEntry = mongoose.model('AirportEntry', airportentrySchema);

// Outstation schema
const outstationSchema = new mongoose.Schema({
    city1: String,
    city2: String,
    dateTime: Date,
    distance: Number,
    tripType: { type: String, enum: ['one-way', 'two-way'], default: 'one-way' }, // ✅ new field
    cars: [carSchema]
}, { timestamps: true });
const OutstationEntry = mongoose.model('OutstationEntry', outstationSchema);

const localRideSchema = new mongoose.Schema({
    city: String,
    package: String,
    dateTime: Date,
    cars: [carSchema]
}, { timestamps: true });

const LocalRideEntry = mongoose.model('LocalRideEntry', localRideSchema);

// New Booking Request schema for all types of bookings
const bookingRequestSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true, required: true },
    serviceType: { type: String, enum: ['AIRPORT', 'LOCAL', 'OUTSTATION'], required: true },
    traveller: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        pickup: String,
        drop: String,
        pickupAddress: String,
        dropAddress: String,
        remark: String,
        gst: String,
        whatsapp: { type: Boolean, default: false },
        gstDetails: { type: Boolean, default: false }
    },
    route: String,
    cab: {
        type: String,
        price: Number,
        _id: String
    },
    date: String,
    time: String,
    estimatedDistance: String,
    paymentMethod: { type: String, default: '0' }, // 0 for cash, other for advance
    // Payment details for advance payments
    paymentDetails: {
        totalFare: { type: Number, default: 0 },
        amountPaid: { type: Number, default: 0 },
        remainingAmount: { type: Number, default: 0 },
        paymentStatus: { type: String, enum: ['pending', 'partial', 'full'], default: 'pending' },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        paymentDate: Date
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined', 'driver_sent'], 
        default: 'pending' 
    },
    driverDetails: {
        name: String,
        whatsappNumber: String,
        vehicleNumber: String
    },
    adminNotes: String
}, { timestamps: true });

const BookingRequest = mongoose.model('BookingRequest', bookingRequestSchema);

// SEO Management schema
const seoDataSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: String, required: true },
    metaTags: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const SEOData = mongoose.model('SEOData', seoDataSchema);

// Add this to your exports
module.exports = { AirportEntry, OutstationEntry, LocalRideEntry, BookingRequest, SEOData };

