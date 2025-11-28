# SEO Management System

This document describes the SEO management system for Penta Cab application.

## Overview

The SEO management system allows you to:
- Store and manage SEO data for different pages
- Dynamically update meta tags, titles, and descriptions
- Admin interface for managing SEO content
- API endpoints for CRUD operations

## Database Schema

### SEOData Model
```javascript
{
  page: String (required, unique), // Page name (e.g., "Home", "About Us")
  title: String (required), // Page title
  description: String (required), // Meta description
  keywords: String (required), // SEO keywords
  metaTags: String (required), // Additional meta tags
  status: String (enum: ['active', 'inactive']), // Status
  lastUpdated: Date, // Last update timestamp
  createdAt: Date, // Creation timestamp
  updatedAt: Date // Update timestamp
}
```

## API Endpoints

### Public Routes (Frontend)
- `GET /seo` - Get all SEO data
- `GET /seo/page/:page` - Get SEO data by page name

### Admin Routes (Admin Panel)
- `POST /admin/seo` - Create new SEO data
- `PUT /admin/seo/:id` - Update SEO data
- `DELETE /admin/seo/:id` - Delete SEO data
- `PATCH /admin/seo/:id/toggle` - Toggle SEO status

## Setup Instructions

### 1. Database Setup
Make sure MongoDB is running and the connection is configured in your environment variables.

### 2. Seed Initial Data
Run the seed script to populate the database with initial SEO data:

```bash
cd backend
node scripts/seedSEOData.js
```

### 3. Environment Variables
Ensure the following environment variables are set:
- `MONGODB_URI` - MongoDB connection string

## Usage

### Frontend Integration

1. **Dynamic SEO Component**: The `DynamicSEO` component automatically fetches and applies SEO data to the current page.

2. **SEO Hook**: Use the `useSEO` hook to fetch SEO data for specific pages:
```typescript
import { useSEO } from '@/hooks/useSEO';

const { seoData, loading, error } = useSEO('Home');
```

3. **SEO Service**: Use the `seoService` for API calls:
```typescript
import { seoService } from '@/services/seoService';

// Get all SEO data
const response = await seoService.getAllSEOData();

// Get SEO data by page
const response = await seoService.getSEODataByPage('Home');
```

### Admin Panel

1. Navigate to the admin panel
2. Go to SEO Management section
3. View, create, edit, or delete SEO entries
4. Toggle status between active/inactive

## File Structure

```
backend/
├── controllers/
│   └── seo.controller.js          # SEO API controllers
├── routes/
│   └── seo.routes.js             # SEO API routes
├── scripts/
│   └── seedSEOData.js            # Database seeding script
└── model.js                      # Database models (includes SEOData)

frontend/
├── src/
│   ├── components/
│   │   └── DynamicSEO.tsx        # Dynamic SEO component
│   ├── hooks/
│   │   └── useSEO.ts            # SEO data hook
│   ├── services/
│   │   └── seoService.ts        # SEO API service
│   └── app/
│       ├── layout.tsx           # Root layout with DynamicSEO
│       └── admin/
│           └── components/
│               ├── SEOManagement.tsx  # Admin SEO management
│               └── SEOForm.tsx        # Admin SEO form
```

## Features

### Dynamic Meta Tags
- Page titles are updated dynamically
- Meta descriptions are applied automatically
- Open Graph and Twitter meta tags are updated
- Keywords and custom meta tags are applied

### Admin Management
- Create new SEO entries for different pages
- Edit existing SEO data
- Delete SEO entries
- Toggle active/inactive status
- Real-time preview of SEO data

### Fallback System
- Default SEO data is used if no data is found
- Graceful error handling
- Loading states for better UX

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "page": "Home",
    "title": "Penta Cab - Premium Taxi Services",
    "description": "Book reliable taxi services...",
    "keywords": "taxi, cab, booking",
    "metaTags": "transportation, reliable",
    "status": "active",
    "lastUpdated": "2023-09-05T10:30:00.000Z",
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Testing

### Manual Testing
1. Start the backend server
2. Start the frontend development server
3. Navigate to different pages and verify meta tags
4. Use the admin panel to manage SEO data
5. Check browser developer tools for meta tag updates

### API Testing
Use tools like Postman or curl to test the API endpoints:

```bash
# Get all SEO data
curl http://localhost:5000/seo

# Get SEO data by page
curl http://localhost:5000/seo/page/Home

# Create new SEO data
curl -X POST http://localhost:5000/admin/seo \
  -H "Content-Type: application/json" \
  -d '{
    "page": "Test Page",
    "title": "Test Title",
    "description": "Test Description",
    "keywords": "test, keywords",
    "metaTags": "test, meta",
    "status": "active"
  }'
```

## Troubleshooting

### Common Issues

1. **Meta tags not updating**: Check if the DynamicSEO component is properly included in the layout
2. **API errors**: Verify backend server is running and database connection is established
3. **CORS issues**: Ensure CORS is properly configured in the backend
4. **Database connection**: Check MongoDB connection string and ensure database is accessible

### Debug Tips

1. Check browser console for JavaScript errors
2. Use browser developer tools to inspect meta tags
3. Check backend logs for API errors
4. Verify environment variables are set correctly
