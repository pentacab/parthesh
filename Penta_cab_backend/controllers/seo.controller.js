const { SEOData } = require('../model');

// Get all SEO data
const getAllSEOData = async (req, res) => {
    try {
        const seoData = await SEOData.find().sort({ page: 1 });
        res.status(200).json({
            success: true,
            data: seoData
        });
    } catch (error) {
        console.error('Error fetching SEO data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SEO data',
            error: error.message
        });
    }
};

// Get SEO data by page
const getSEODataByPage = async (req, res) => {
    try {
        const { page } = req.params;
        const seoData = await SEOData.findOne({ page: page });
        
        if (!seoData) {
            return res.status(404).json({
                success: false,
                message: 'SEO data not found for this page'
            });
        }

        res.status(200).json({
            success: true,
            data: seoData
        });
    } catch (error) {
        console.error('Error fetching SEO data by page:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SEO data',
            error: error.message
        });
    }
};

// Create new SEO data
const createSEOData = async (req, res) => {
    try {
        const { page, title, description, keywords, metaTags, status } = req.body;

        // Check if SEO data already exists for this page
        const existingSEO = await SEOData.findOne({ page });
        if (existingSEO) {
            return res.status(400).json({
                success: false,
                message: 'SEO data already exists for this page'
            });
        }

        const seoData = new SEOData({
            page,
            title,
            description,
            keywords,
            metaTags,
            status: status || 'active'
        });

        await seoData.save();

        res.status(201).json({
            success: true,
            message: 'SEO data created successfully',
            data: seoData
        });
    } catch (error) {
        console.error('Error creating SEO data:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating SEO data',
            error: error.message
        });
    }
};

// Update SEO data
const updateSEOData = async (req, res) => {
    try {
        const { id } = req.params;
        const { page, title, description, keywords, metaTags, status } = req.body;

        // Check if SEO data exists
        const existingSEO = await SEOData.findById(id);
        if (!existingSEO) {
            return res.status(404).json({
                success: false,
                message: 'SEO data not found'
            });
        }

        // If page name is being changed, check if new page name already exists
        if (page && page !== existingSEO.page) {
            const pageExists = await SEOData.findOne({ page, _id: { $ne: id } });
            if (pageExists) {
                return res.status(400).json({
                    success: false,
                    message: 'SEO data already exists for this page'
                });
            }
        }

        const updateData = {
            lastUpdated: new Date()
        };

        if (page) updateData.page = page;
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (keywords) updateData.keywords = keywords;
        if (metaTags) updateData.metaTags = metaTags;
        if (status) updateData.status = status;

        const updatedSEO = await SEOData.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'SEO data updated successfully',
            data: updatedSEO
        });
    } catch (error) {
        console.error('Error updating SEO data:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating SEO data',
            error: error.message
        });
    }
};

// Delete SEO data
const deleteSEOData = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSEO = await SEOData.findByIdAndDelete(id);
        if (!deletedSEO) {
            return res.status(404).json({
                success: false,
                message: 'SEO data not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'SEO data deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting SEO data:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting SEO data',
            error: error.message
        });
    }
};

// Toggle SEO status
const toggleSEOStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const seoData = await SEOData.findById(id);
        if (!seoData) {
            return res.status(404).json({
                success: false,
                message: 'SEO data not found'
            });
        }

        const newStatus = seoData.status === 'active' ? 'inactive' : 'active';
        const updatedSEO = await SEOData.findByIdAndUpdate(
            id,
            { status: newStatus, lastUpdated: new Date() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `SEO data ${newStatus} successfully`,
            data: updatedSEO
        });
    } catch (error) {
        console.error('Error toggling SEO status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling SEO status',
            error: error.message
        });
    }
};

module.exports = {
    getAllSEOData,
    getSEODataByPage,
    createSEOData,
    updateSEOData,
    deleteSEOData,
    toggleSEOStatus
};
