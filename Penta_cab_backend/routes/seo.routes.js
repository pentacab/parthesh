const express = require('express');
const router = express.Router();
const {
    getAllSEOData,
    getSEODataByPage,
    createSEOData,
    updateSEOData,
    deleteSEOData,
    toggleSEOStatus
} = require('../controllers/seo.controller');

// Public routes (for frontend to fetch SEO data)
router.get('/seo', getAllSEOData); // Get all SEO data
router.get('/seo/page/:page', getSEODataByPage); // Get SEO data by page name

// Admin routes (for admin panel)
router.post('/admin/seo', createSEOData); // Create new SEO data
router.put('/admin/seo/:id', updateSEOData); // Update SEO data
router.delete('/admin/seo/:id', deleteSEOData); // Delete SEO data
router.patch('/admin/seo/:id/toggle', toggleSEOStatus); // Toggle SEO status

module.exports = router;
