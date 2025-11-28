const express = require('express');
const router = express.Router();

// Blog data storage (in a real app, this would come from a database)
let blogs = [
  {
    id: "1",
    title: "Welcome to Penta CAB Blog",
    content: `<p>This is our first blog post about our amazing cab services. We are committed to providing the best transportation solutions for our customers.</p>
    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop" alt="Modern taxi service" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>Our fleet consists of modern, well-maintained vehicles that ensure your comfort and safety during your journey.</p>
    <h2>Why Choose Penta CAB?</h2>
    <ul>
      <li>Professional drivers with years of experience</li>
      <li>24/7 availability</li>
      <li>Competitive pricing</li>
      <li>Clean and comfortable vehicles</li>
    </ul>`,
    excerpt: "Discover the best cab services in your city with Penta CAB.",
    author: "Admin",
    publishedAt: "2024-01-15",
    status: "published",
    tags: ["travel", "cab", "services"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Top 10 Places to Visit in Mumbai",
    content: `<p>Explore the vibrant city of Mumbai with our curated list of must-visit destinations. From historical landmarks to modern attractions, Mumbai has something for everyone.</p>
    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop" alt="Mumbai skyline" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Must-Visit Locations</h2>
    <p>Mumbai, the financial capital of India, offers a unique blend of history, culture, and modernity.</p>
    <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop" alt="Gateway of India" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>Our experienced drivers know all the best routes to help you navigate this bustling metropolis efficiently.</p>`,
    excerpt: "Discover Mumbai's most iconic destinations.",
    author: "Admin",
    publishedAt: "2024-01-10",
    status: "published",
    tags: ["mumbai", "travel", "destinations"],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  },
  {
    id: "3",
    title: "Best Cab Booking Tips for Travelers",
    content: `<p>Learn the essential tips for booking cabs efficiently and getting the best deals for your travel needs.</p>
    <img src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=400&fit=crop" alt="Cab booking app" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Smart Booking Strategies</h2>
    <p>Booking a cab doesn't have to be complicated. Follow these simple tips to ensure a smooth experience:</p>
    <ol>
      <li>Book in advance during peak hours</li>
      <li>Check multiple apps for the best rates</li>
      <li>Consider traffic conditions when planning</li>
      <li>Always verify driver details before getting in</li>
    </ol>
    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop" alt="Happy traveler" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>With Penta CAB, you can rest assured that your journey will be comfortable and reliable.</p>`,
    excerpt: "Essential tips for smart cab booking and travel planning.",
    author: "Admin",
    publishedAt: "2024-01-08",
    status: "published",
    tags: ["tips", "booking", "travel"],
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-08T10:00:00Z"
  }
];

// Get all blogs with enhanced pagination
router.get('/blogs', (req, res) => {
  try {
    const { 
      status, 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      author 
    } = req.query;
    
    let filteredBlogs = [...blogs];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredBlogs = filteredBlogs.filter(blog => blog.status === status);
    }
    
    // Filter by author
    if (author) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    // Search functionality (searches in title, excerpt, content, and tags)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.excerpt.toLowerCase().includes(searchTerm) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sorting functionality
    filteredBlogs.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'publishedAt':
          aValue = new Date(a.publishedAt || a.createdAt);
          bValue = new Date(b.publishedAt || b.createdAt);
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
    const total = filteredBlogs.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    // Get paginated data
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    
    // Calculate pagination metadata
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    
    // Count blogs by status
    const statusCounts = {
      total: blogs.length,
      published: blogs.filter(b => b.status === 'published').length,
      draft: blogs.filter(b => b.status === 'draft').length
    };
    
    res.json({
      success: true,
      data: paginatedBlogs,
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
        author: author || '',
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// Get single blog by ID
router.get('/blogs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const blog = blogs.find(b => b.id === id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// Create new blog
router.post('/blogs', (req, res) => {
  try {
    const { title, content, excerpt, author, status, tags } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const newBlog = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      author: author || 'Admin',
      status: status || 'draft',
      tags: tags || [],
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    blogs.push(newBlog);
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
});

// Update blog
router.put('/blogs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, author, status, tags } = req.body;
    
    const blogIndex = blogs.findIndex(b => b.id === id);
    
    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Update blog
    const updatedBlog = {
      ...blogs[blogIndex],
      title: title || blogs[blogIndex].title,
      content: content || blogs[blogIndex].content,
      excerpt: excerpt || blogs[blogIndex].excerpt,
      author: author || blogs[blogIndex].author,
      status: status || blogs[blogIndex].status,
      tags: tags || blogs[blogIndex].tags,
      publishedAt: status === 'published' && blogs[blogIndex].status !== 'published' 
        ? new Date().toISOString().split('T')[0] 
        : blogs[blogIndex].publishedAt,
      updatedAt: new Date().toISOString()
    };
    
    blogs[blogIndex] = updatedBlog;
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
});

// Delete blog
router.delete('/blogs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const blogIndex = blogs.findIndex(b => b.id === id);
    
    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    blogs.splice(blogIndex, 1);
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
});

// Toggle blog status (publish/unpublish)
router.patch('/blogs/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const blogIndex = blogs.findIndex(b => b.id === id);
    
    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const updatedBlog = {
      ...blogs[blogIndex],
      status: status,
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : blogs[blogIndex].publishedAt,
      updatedAt: new Date().toISOString()
    };
    
    blogs[blogIndex] = updatedBlog;
    
    res.json({
      success: true,
      message: `Blog post ${status === 'published' ? 'published' : 'unpublished'} successfully`,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error toggling blog status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog status',
      error: error.message
    });
  }
});

// Get blog statistics
router.get('/blogs/stats/summary', (req, res) => {
  try {
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.status === 'published').length;
    const draftBlogs = blogs.filter(b => b.status === 'draft').length;
    
    // Get recent blogs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBlogs = blogs.filter(b => new Date(b.createdAt) > sevenDaysAgo).length;
    
    // Get blogs by author
    const authorStats = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1;
      return acc;
    }, {});
    
    // Get blogs by month (for the last 6 months)
    const monthlyStats = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    blogs.forEach(blog => {
      const blogDate = new Date(blog.createdAt);
      if (blogDate > sixMonthsAgo) {
        const monthKey = blogDate.toISOString().slice(0, 7); // YYYY-MM format
        monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        recent: recentBlogs,
        authorStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog statistics',
      error: error.message
    });
  }
});

// Bulk operations for blogs
router.post('/blogs/bulk', (req, res) => {
  try {
    const { operation, blogIds, data } = req.body;
    
    if (!operation || !blogIds || !Array.isArray(blogIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation and blogIds array are required'
      });
    }
    
    let updatedBlogs = [];
    let deletedCount = 0;
    
    switch (operation) {
      case 'delete':
        // Bulk delete
        blogIds.forEach(id => {
          const index = blogs.findIndex(b => b.id === id);
          if (index !== -1) {
            blogs.splice(index, 1);
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
        
        blogIds.forEach(id => {
          const index = blogs.findIndex(b => b.id === id);
          if (index !== -1) {
            blogs[index] = {
              ...blogs[index],
              status: data.status,
              publishedAt: data.status === 'published' ? new Date().toISOString().split('T')[0] : blogs[index].publishedAt,
              updatedAt: new Date().toISOString()
            };
            updatedBlogs.push(blogs[index]);
          }
        });
        break;
        
      case 'updateAuthor':
        // Bulk author update
        if (!data || !data.author) {
          return res.status(400).json({
            success: false,
            message: 'Author is required for updateAuthor operation'
          });
        }
        
        blogIds.forEach(id => {
          const index = blogs.findIndex(b => b.id === id);
          if (index !== -1) {
            blogs[index] = {
              ...blogs[index],
              author: data.author,
              updatedAt: new Date().toISOString()
            };
            updatedBlogs.push(blogs[index]);
          }
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: delete, updateStatus, updateAuthor'
        });
    }
    
    res.json({
      success: true,
      message: `Bulk ${operation} operation completed successfully`,
      data: {
        processedCount: blogIds.length,
        deletedCount: operation === 'delete' ? deletedCount : undefined,
        updatedBlogs: updatedBlogs.length > 0 ? updatedBlogs : undefined
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
