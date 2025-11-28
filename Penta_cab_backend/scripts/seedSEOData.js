const mongoose = require('mongoose');
const { SEOData } = require('../model');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/penta_cabs');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Initial SEO data for all frontend pages
const initialSEOData = [
    {
        page: "Home",
        title: "Penta Cab - Premium Taxi Services in India | Book Online",
        description: "Book reliable taxi services with Penta Cab. Airport transfers, local rides, and outstation trips across India. 24/7 customer support and competitive pricing.",
        keywords: "taxi booking, cab service, airport transfer, local rides, outstation trips, India taxi, online booking",
        metaTags: "taxi booking, cab service, reliable transport, online booking, 24/7 support",
        status: "active"
    },
    {
        page: "About Us",
        title: "About Penta Cab - Your Trusted Travel Partner Since 2010",
        description: "Learn about Penta Cab's journey, mission, and commitment to providing safe and comfortable taxi services. Meet our team and discover our values.",
        keywords: "about penta cab, taxi company, travel partner, company history, our team, mission vision",
        metaTags: "about us, company history, taxi service provider, our team, mission vision",
        status: "active"
    },
    {
        page: "Contact Us",
        title: "Contact Penta Cab - Customer Support & Booking Help",
        description: "Contact Penta Cab for bookings, support, or inquiries. We're here to help with your travel needs. Call, email, or visit our office.",
        keywords: "contact penta cab, customer support, booking help, customer service, phone number, email support",
        metaTags: "contact us, customer service, booking support, help center, customer care",
        status: "active"
    },
    {
        page: "Blog",
        title: "Penta Cab Blog | Travel Tips, News & Updates",
        description: "Read our latest blog posts about travel tips, taxi booking guides, city information, and Penta Cab news. Stay updated with travel insights.",
        keywords: "travel blog, taxi tips, booking guide, travel news, city information, Penta Cab blog",
        metaTags: "travel blog, taxi tips, booking guide, travel insights, city guides",
        status: "active"
    },
    {
        page: "Cab Booking",
        title: "Book Your Taxi Online | Penta Cab Easy Booking System",
        description: "Book your taxi online with Penta Cab. Easy booking process, multiple payment options, instant confirmation. Choose from sedan, SUV, or luxury vehicles.",
        keywords: "taxi booking online, cab booking system, online taxi booking, instant booking, payment options",
        metaTags: "online booking, instant confirmation, multiple payment options, easy booking",
        status: "active"
    },
    {
        page: "Cab Lists",
        title: "Our Vehicle Fleet | Sedan, SUV, Luxury Cars | Penta Cab",
        description: "Explore Penta Cab's diverse vehicle fleet. From comfortable sedans to spacious SUVs and luxury cars. Choose the perfect vehicle for your journey.",
        keywords: "vehicle fleet, sedan cars, SUV vehicles, luxury cars, car types, vehicle options",
        metaTags: "vehicle fleet, car types, sedan, SUV, luxury vehicles, fleet options",
        status: "active"
    },
    {
        page: "Cab Detail",
        title: "Vehicle Details & Specifications | Penta Cab Fleet",
        description: "Detailed information about Penta Cab vehicles. Specifications, features, capacity, and pricing for all our taxi models.",
        keywords: "vehicle specifications, car features, taxi details, vehicle capacity, car models",
        metaTags: "vehicle details, car specifications, taxi features, vehicle information",
        status: "active"
    },
    {
        page: "Intercity Booking",
        title: "Intercity Taxi Booking | City to City Travel | Penta Cab",
        description: "Book intercity taxi services with Penta Cab. Travel between cities with comfort and reliability. Mumbai to Pune, Delhi to Agra, and more routes.",
        keywords: "intercity taxi, city to city travel, intercity booking, Mumbai Pune, Delhi Agra, intercity routes",
        metaTags: "intercity travel, city to city taxi, intercity booking, long distance travel",
        status: "active"
    },
    {
        page: "Outstation Booking",
        title: "Outstation Taxi Booking | Long Distance Travel | Penta Cab",
        description: "Book outstation taxi services for long-distance travel. One-way and round-trip options available. Comfortable and reliable outstation taxi service.",
        keywords: "outstation taxi, long distance travel, one way taxi, round trip taxi, outstation booking",
        metaTags: "outstation travel, long distance taxi, one way booking, round trip taxi",
        status: "active"
    },
    {
        page: "Routes",
        title: "Popular Taxi Routes | Penta Cab Intercity & Outstation Services",
        description: "Explore popular taxi routes with Penta Cab. Mumbai to Pune, Delhi to Agra, Bangalore to Mysore and more. Book your intercity journey with us.",
        keywords: "taxi routes, intercity travel, outstation routes, Mumbai Pune, Delhi Agra, Bangalore Mysore, popular routes",
        metaTags: "intercity travel, popular routes, outstation booking, city to city taxi",
        status: "active"
    },
    {
        page: "Popular Route Info",
        title: "Popular Route Information | Distance, Time & Pricing | Penta Cab",
        description: "Get detailed information about popular taxi routes. Distance, travel time, pricing, and booking details for major city connections.",
        keywords: "route information, travel distance, journey time, route pricing, popular destinations",
        metaTags: "route details, travel information, distance time, route pricing",
        status: "active"
    },
    {
        page: "Confirm",
        title: "Booking Confirmation | Penta Cab Trip Details",
        description: "Your taxi booking has been confirmed with Penta Cab. View your trip details, driver information, and contact details for your upcoming journey.",
        keywords: "booking confirmation, trip details, driver information, confirmed booking, taxi confirmation",
        metaTags: "booking confirmed, trip details, driver info, booking status",
        status: "active"
    },
    {
        page: "Admin",
        title: "Admin Panel | Penta Cab Management System",
        description: "Penta Cab admin panel for managing bookings, routes, vehicles, and customer services. Secure access to administrative functions.",
        keywords: "admin panel, management system, booking management, route management, admin access",
        metaTags: "admin dashboard, management panel, booking admin, system administration",
        status: "active"
    },
    {
        page: "Test API",
        title: "API Testing | Penta Cab Development Tools",
        description: "API testing and development tools for Penta Cab system. Test endpoints and verify system functionality.",
        keywords: "API testing, development tools, system testing, API endpoints, development",
        metaTags: "API test, development tools, system testing, API development",
        status: "active"
    },
    {
        page: "Test Booking",
        title: "Booking Test | Penta Cab Test Environment",
        description: "Test booking functionality and system integration for Penta Cab services. Development and testing environment.",
        keywords: "booking test, test environment, system testing, booking functionality, development",
        metaTags: "test booking, development testing, booking test, system test",
        status: "active"
    }
];

// Seed function
const seedSEOData = async () => {
    try {
        await connectDB();
        
        // Clear existing SEO data
        await SEOData.deleteMany({});
        console.log('Cleared existing SEO data');
        
        // Insert initial SEO data
        const insertedData = await SEOData.insertMany(initialSEOData);
        console.log(`Successfully seeded ${insertedData.length} SEO entries`);
        
        // Display the seeded data
        console.log('\nSeeded SEO Data:');
        insertedData.forEach(item => {
            console.log(`- ${item.page}: ${item.title}`);
        });
        
    } catch (error) {
        console.error('Error seeding SEO data:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seed function if this script is executed directly
if (require.main === module) {
    seedSEOData();
}

module.exports = { seedSEOData };
