// Quick script to seed SEO data
const { seedSEOData } = require('./scripts/seedSEOData');

console.log('Starting SEO data seeding...');
seedSEOData().then(() => {
    console.log('SEO data seeding completed successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('Error seeding SEO data:', error);
    process.exit(1);
});
