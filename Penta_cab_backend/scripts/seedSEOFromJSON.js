const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

// Load SEO data from JSON file
const loadSEODataFromJSON = () => {
    try {
        const jsonPath = path.join(__dirname, '../data/seoData.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error loading SEO data from JSON:', error);
        return [];
    }
};

// Seed function
const seedSEODataFromJSON = async () => {
    try {
        await connectDB();
        
        // Load data from JSON file
        const seoDataArray = loadSEODataFromJSON();
        
        if (seoDataArray.length === 0) {
            console.log('No SEO data found in JSON file');
            return;
        }
        
        // Clear existing SEO data
        await SEOData.deleteMany({});
        console.log('Cleared existing SEO data');
        
        // Insert SEO data from JSON
        const insertedData = await SEOData.insertMany(seoDataArray);
        console.log(`Successfully seeded ${insertedData.length} SEO entries from JSON`);
        
        // Display the seeded data
        console.log('\nSeeded SEO Data:');
        insertedData.forEach(item => {
            console.log(`- ${item.page}: ${item.title}`);
        });
        
    } catch (error) {
        console.error('Error seeding SEO data from JSON:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seed function if this script is executed directly
if (require.main === module) {
    seedSEODataFromJSON();
}

module.exports = { seedSEODataFromJSON };
