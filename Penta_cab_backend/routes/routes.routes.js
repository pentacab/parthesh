const express = require('express');
const router = express.Router();

// Route data storage (in a real app, this would come from a database)
let routes = [
  {
    id: "1",
    routeName: "Ahmedabad to Mumbai",
    from: "Ahmedabad",
    to: "Mumbai",
    description: `<p>Experience a comfortable journey from Ahmedabad to Mumbai with our premium cab service. This popular route takes you through scenic landscapes and bustling cities.</p>
    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop" alt="Ahmedabad to Mumbai route" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Route Highlights</h2>
    <ul>
      <li>Well-maintained highways</li>
      <li>Multiple rest stops available</li>
      <li>Professional drivers with local knowledge</li>
      <li>Comfortable seating and climate control</li>
    </ul>
    <p>Book your journey today and enjoy a hassle-free travel experience!</p>`,
    seoTitle: "Ahmedabad to Mumbai Cab Service | Penta CAB",
    seoDescription: "Book reliable cab service from Ahmedabad to Mumbai. Professional drivers, comfortable vehicles, and competitive pricing. Available 24/7.",
    seoKeywords: ["ahmedabad to mumbai cab", "mumbai cab service", "intercity travel", "cab booking"],
    status: "active",
    tags: ["intercity", "mumbai", "ahmedabad", "outstation"],
    lastBooking: "2024-01-18",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z"
  },
  {
    id: "2",
    routeName: "Mumbai Airport Transfer",
    from: "Mumbai Airport",
    to: "Mumbai City",
    description: `<p>Quick and reliable airport transfer service in Mumbai. Our drivers track your flight and ensure timely pickup and drop-off.</p>
    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop" alt="Mumbai Airport" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Airport Transfer Features</h2>
    <ul>
      <li>Flight tracking and monitoring</li>
      <li>Meet and greet service</li>
      <li>Luggage assistance</li>
      <li>24/7 availability</li>
    </ul>`,
    seoTitle: "Mumbai Airport Transfer Service | Penta CAB",
    seoDescription: "Professional Mumbai airport transfer service. Flight tracking, meet & greet, luggage assistance. Book now for reliable airport transportation.",
    seoKeywords: ["mumbai airport transfer", "airport cab mumbai", "mumbai airport taxi", "airport pickup"],
    status: "active",
    tags: ["airport", "mumbai", "transfer", "pickup"],
    lastBooking: "2024-01-19",
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2023-11-15T10:00:00Z"
  },
  {
    id: "3",
    routeName: "Local City Tour",
    from: "City Center",
    to: "Various Locations",
    description: `<p>Explore the city with our comprehensive local tour packages. Visit all major attractions and hidden gems with our knowledgeable drivers.</p>
    <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop" alt="City tour" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Tour Packages</h2>
    <ul>
      <li>Half-day city tour (4 hours)</li>
      <li>Full-day city tour (8 hours)</li>
      <li>Custom itinerary planning</li>
      <li>Multi-language guides available</li>
    </ul>`,
    seoTitle: "City Tour Service | Local Sightseeing | Penta CAB",
    seoDescription: "Explore the city with our local tour packages. Professional guides, comfortable vehicles, and customizable itineraries for the perfect city experience.",
    seoKeywords: ["city tour", "local sightseeing", "tour packages", "city exploration"],
    status: "active",
    tags: ["local", "tour", "sightseeing", "city"],
    lastBooking: "2024-01-17",
    createdAt: "2023-10-20T10:00:00Z",
    updatedAt: "2023-10-20T10:00:00Z"
  },
  {
    id: "4",
    routeName: "Delhi to Jaipur",
    from: "Delhi",
    to: "Jaipur",
    description: `<p>Discover the royal heritage of Rajasthan with our Delhi to Jaipur round-trip service. Experience the Pink City in comfort and style.</p>
    <img src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=400&fit=crop" alt="Delhi to Jaipur" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Round Trip Benefits</h2>
    <ul>
      <li>Same driver for both journeys</li>
      <li>Flexible return timing</li>
      <li>Luggage storage during stay</li>
      <li>Local recommendations and tips</li>
    </ul>`,
    seoTitle: "Delhi to Jaipur Cab Service | Round Trip | Penta CAB",
    seoDescription: "Book round-trip cab service from Delhi to Jaipur. Same driver, flexible timing, and comfortable journey to the Pink City of Rajasthan.",
    seoKeywords: ["delhi to jaipur cab", "jaipur round trip", "rajasthan travel", "pink city tour"],
    status: "active",
    tags: ["delhi", "jaipur", "round trip", "rajasthan"],
    lastBooking: "2024-01-10",
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2023-12-15T10:00:00Z"
  },
  {
    id: "5",
    routeName: "Mumbai to Pune",
    from: "Mumbai",
    to: "Pune",
    description: `<p>Fast and efficient service between Mumbai and Pune. Perfect for business travelers and weekend getaways to the cultural capital of Maharashtra.</p>
    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop" alt="Mumbai to Pune" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Why Choose This Route</h2>
    <ul>
      <li>Express highway connectivity</li>
      <li>Minimal traffic delays</li>
      <li>Comfortable business-class seating</li>
      <li>WiFi and charging ports available</li>
    </ul>`,
    seoTitle: "Mumbai to Pune Cab Service | Express Highway | Penta CAB",
    seoDescription: "Fast and comfortable cab service from Mumbai to Pune via express highway. Business-class amenities, WiFi, and reliable timing for your journey.",
    seoKeywords: ["mumbai to pune cab", "pune travel", "express highway", "business travel"],
    status: "active",
    tags: ["mumbai", "pune", "express", "business"],
    lastBooking: "2024-01-20",
    createdAt: "2023-12-20T10:00:00Z",
    updatedAt: "2023-12-20T10:00:00Z"
  }
];

// Get all routes with enhanced pagination
router.get('/routes', (req, res) => {
  try {
    const { 
      status, 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc'
    } = req.query;
    
    let filteredRoutes = [...routes];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => route.status === status);
    }
    
    
    // Search functionality (searches in routeName, from, to, description, and tags)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredRoutes = filteredRoutes.filter(route => 
        route.routeName.toLowerCase().includes(searchTerm) ||
        route.from.toLowerCase().includes(searchTerm) ||
        route.to.toLowerCase().includes(searchTerm) ||
        route.description.toLowerCase().includes(searchTerm) ||
        route.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sorting functionality
    filteredRoutes.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'routeName':
          aValue = a.routeName.toLowerCase();
          bValue = b.routeName.toLowerCase();
          break;
        case 'from':
          aValue = a.from.toLowerCase();
          bValue = b.from.toLowerCase();
          break;
        case 'to':
          aValue = a.to.toLowerCase();
          bValue = b.to.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastBooking':
          aValue = new Date(a.lastBooking);
          bValue = new Date(b.lastBooking);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default: // createdAt
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
    const total = filteredRoutes.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    // Get paginated data
    const paginatedRoutes = filteredRoutes.slice(startIndex, endIndex);
    
    // Calculate pagination metadata
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    
    // Count routes by status
    const statusCounts = {
      total: routes.length,
      active: routes.filter(r => r.status === 'active').length,
      inactive: routes.filter(r => r.status === 'inactive').length
    };
    
    res.json({
      success: true,
      data: paginatedRoutes,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, total)
      },
      statusCounts,
      filters: {
        status: status || 'all',
        search: search || '',
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes',
      error: error.message
    });
  }
});

// Get single route by ID
router.get('/routes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const route = routes.find(r => r.id === id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route',
      error: error.message
    });
  }
});

// Create new route
router.post('/routes', (req, res) => {
  try {
    const { 
      routeName, 
      from, 
      to, 
      description, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      status, 
      tags 
    } = req.body;
    
    // Validation
    if (!routeName || !from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Route name, from, and to are required'
      });
    }
    
    const newRoute = {
      id: Date.now().toString(),
      routeName,
      from,
      to,
      description: description || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      seoKeywords: seoKeywords || [],
      status: status || 'active',
      tags: tags || [],
      lastBooking: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    routes.push(newRoute);
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: newRoute
    });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route',
      error: error.message
    });
  }
});

// Update route
router.put('/routes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      routeName, 
      from, 
      to, 
      description, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      status, 
      tags 
    } = req.body;
    
    const routeIndex = routes.findIndex(r => r.id === id);
    
    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Update route
    const updatedRoute = {
      ...routes[routeIndex],
      routeName: routeName || routes[routeIndex].routeName,
      from: from || routes[routeIndex].from,
      to: to || routes[routeIndex].to,
      description: description || routes[routeIndex].description,
      seoTitle: seoTitle || routes[routeIndex].seoTitle,
      seoDescription: seoDescription || routes[routeIndex].seoDescription,
      seoKeywords: seoKeywords || routes[routeIndex].seoKeywords,
      status: status || routes[routeIndex].status,
      tags: tags || routes[routeIndex].tags,
      updatedAt: new Date().toISOString()
    };
    
    routes[routeIndex] = updatedRoute;
    
    res.json({
      success: true,
      message: 'Route updated successfully',
      data: updatedRoute
    });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route',
      error: error.message
    });
  }
});

// Delete route
router.delete('/routes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const routeIndex = routes.findIndex(r => r.id === id);
    
    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    routes.splice(routeIndex, 1);
    
    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
      error: error.message
    });
  }
});

// Toggle route status (active/inactive)
router.patch('/routes/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const routeIndex = routes.findIndex(r => r.id === id);
    
    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    const updatedRoute = {
      ...routes[routeIndex],
      status: status,
      updatedAt: new Date().toISOString()
    };
    
    routes[routeIndex] = updatedRoute;
    
    res.json({
      success: true,
      message: `Route ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: updatedRoute
    });
  } catch (error) {
    console.error('Error toggling route status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route status',
      error: error.message
    });
  }
});

// Get route statistics
router.get('/routes/stats/summary', (req, res) => {
  try {
    const totalRoutes = routes.length;
    const activeRoutes = routes.filter(r => r.status === 'active').length;
    const inactiveRoutes = routes.filter(r => r.status === 'inactive').length;
    
    // Get recent routes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRoutes = routes.filter(r => new Date(r.createdAt) > sevenDaysAgo).length;
    
    // Get routes by type
    const typeStats = routes.reduce((acc, route) => {
      acc[route.type] = (acc[route.type] || 0) + 1;
      return acc;
    }, {});
    
    // Get routes by month (for the last 6 months)
    const monthlyStats = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    routes.forEach(route => {
      const routeDate = new Date(route.createdAt);
      if (routeDate > sixMonthsAgo) {
        const monthKey = routeDate.toISOString().slice(0, 7); // YYYY-MM format
        monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      data: {
        total: totalRoutes,
        active: activeRoutes,
        inactive: inactiveRoutes,
        recent: recentRoutes,
        typeStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching route statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route statistics',
      error: error.message
    });
  }
});

// Bulk operations for routes
router.post('/routes/bulk', (req, res) => {
  try {
    const { operation, routeIds, data } = req.body;
    
    if (!operation || !routeIds || !Array.isArray(routeIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation and routeIds array are required'
      });
    }
    
    let updatedRoutes = [];
    let deletedCount = 0;
    
    switch (operation) {
      case 'delete':
        // Bulk delete
        routeIds.forEach(id => {
          const index = routes.findIndex(r => r.id === id);
          if (index !== -1) {
            routes.splice(index, 1);
            deletedCount++;
          }
        });
        break;
        
      case 'updateStatus':
        // Bulk status update
        if (!data || !data.status) {
          return res.status(400).json({
            success: false,
            message: 'Status is required for updateStatus operation'
          });
        }
        
        routeIds.forEach(id => {
          const index = routes.findIndex(r => r.id === id);
          if (index !== -1) {
            routes[index] = {
              ...routes[index],
              status: data.status,
              updatedAt: new Date().toISOString()
            };
            updatedRoutes.push(routes[index]);
          }
        });
        break;
        
      case 'updateType':
        // Bulk type update
        if (!data || !data.type) {
          return res.status(400).json({
            success: false,
            message: 'Type is required for updateType operation'
          });
        }
        
        routeIds.forEach(id => {
          const index = routes.findIndex(r => r.id === id);
          if (index !== -1) {
            routes[index] = {
              ...routes[index],
              type: data.type,
              updatedAt: new Date().toISOString()
            };
            updatedRoutes.push(routes[index]);
          }
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: delete, updateStatus, updateType'
        });
    }
    
    res.json({
      success: true,
      message: `Bulk ${operation} operation completed successfully`,
      data: {
        processedCount: routeIds.length,
        deletedCount: operation === 'delete' ? deletedCount : undefined,
        updatedRoutes: updatedRoutes.length > 0 ? updatedRoutes : undefined
      }
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation',
      error: error.message
    });
  }
});

module.exports = router;
