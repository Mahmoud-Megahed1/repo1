# EnglishOM Blog System - Architecture & Database Design

## Overview

The EnglishOM Blog System is a fully integrated premium content platform built on top of the existing EnglishOM platform infrastructure. It shares the same authentication system, MongoDB database cluster, design system, and admin dashboard while providing specialized blog functionality.

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 19 + Tailwind CSS 4 | User interface and responsive design |
| Backend | Express.js + tRPC | API and server logic |
| Database | MySQL/TiDB | Data persistence |
| ORM | Drizzle ORM | Type-safe database queries |
| Authentication | Manus OAuth | User authentication and authorization |
| Storage | S3 (Cloud Storage) | Featured images and media files |
| State Management | React Query + tRPC | Data fetching and caching |
| Styling | Tailwind CSS with CSS Variables | Theme system (dark/light mode) |
| Internationalization | Custom i18n system | Arabic/English support with RTL/LTR |

## Database Schema

### Core Tables

#### blog_posts
Stores all blog articles with multilingual support and metadata.

```sql
blog_posts:
  - id (int, PK, auto-increment)
  - slug (varchar, unique, indexed) -- SEO-friendly URL
  - title_en (text) -- English title
  - title_ar (text) -- Arabic title
  - content_en (longtext) -- English content (HTML/Markdown)
  - content_ar (longtext) -- Arabic content (HTML/Markdown)
  - excerpt_en (text) -- English excerpt
  - excerpt_ar (text) -- Arabic excerpt
  - featured_image_url (varchar) -- S3 URL to featured image
  - featured_image_key (varchar) -- S3 storage key
  - category_id (int, FK) -- Reference to blog_categories
  - author_id (int, FK) -- Reference to users table
  - status (enum: draft, published, scheduled) -- Publication status
  - published_at (timestamp) -- Publication date
  - scheduled_for (timestamp, nullable) -- For scheduled posts
  - reading_time_minutes (int) -- Estimated reading time
  - views_count (int, default: 0) -- Article view counter
  - is_featured (boolean, default: false) -- Featured on homepage
  - meta_description_en (varchar) -- SEO meta description
  - meta_description_ar (varchar) -- Arabic SEO meta description
  - meta_keywords_en (varchar) -- SEO keywords
  - meta_keywords_ar (varchar) -- Arabic SEO keywords
  - created_at (timestamp)
  - updated_at (timestamp)
  - deleted_at (timestamp, nullable) -- Soft delete
```

#### blog_categories
Organizes blog posts into categories.

```sql
blog_categories:
  - id (int, PK, auto-increment)
  - slug (varchar, unique, indexed)
  - name_en (varchar) -- English category name
  - name_ar (varchar) -- Arabic category name
  - description_en (text, nullable)
  - description_ar (text, nullable)
  - icon_url (varchar, nullable) -- Category icon
  - color_hex (varchar) -- Category color (#2167D1, #4CA853, #F5BB41)
  - display_order (int, default: 0) -- Sort order
  - is_active (boolean, default: true)
  - created_at (timestamp)
  - updated_at (timestamp)
```

#### blog_comments
Stores user comments on articles with moderation support.

```sql
blog_comments:
  - id (int, PK, auto-increment)
  - post_id (int, FK) -- Reference to blog_posts
  - user_id (int, FK) -- Reference to users table
  - parent_comment_id (int, FK, nullable) -- For nested replies
  - content (text) -- Comment text
  - status (enum: pending, approved, rejected) -- Moderation status
  - is_helpful_count (int, default: 0) -- Helpful votes
  - created_at (timestamp)
  - updated_at (timestamp)
  - approved_at (timestamp, nullable)
```

#### blog_tags
Tags for better content organization and discovery.

```sql
blog_tags:
  - id (int, PK, auto-increment)
  - slug (varchar, unique, indexed)
  - name_en (varchar)
  - name_ar (varchar)
  - usage_count (int, default: 0)
  - created_at (timestamp)
```

#### blog_post_tags
Junction table for many-to-many relationship between posts and tags.

```sql
blog_post_tags:
  - post_id (int, FK)
  - tag_id (int, FK)
  - PRIMARY KEY (post_id, tag_id)
```

#### blog_translations
Manages content translations and localization metadata.

```sql
blog_translations:
  - id (int, PK, auto-increment)
  - post_id (int, FK)
  - language (varchar) -- 'en', 'ar'
  - title (text)
  - content (longtext)
  - excerpt (text)
  - meta_description (varchar)
  - meta_keywords (varchar)
  - translator_id (int, FK, nullable)
  - is_complete (boolean, default: false)
  - created_at (timestamp)
  - updated_at (timestamp)
```

#### blog_media
Manages all uploaded media files for articles.

```sql
blog_media:
  - id (int, PK, auto-increment)
  - post_id (int, FK, nullable) -- Associated post
  - file_key (varchar) -- S3 storage key
  - file_url (varchar) -- S3 public URL
  - file_name (varchar)
  - file_type (varchar) -- mime type
  - file_size (int) -- in bytes
  - uploaded_by (int, FK) -- Reference to users
  - created_at (timestamp)
```

#### blog_cta
Call-to-action blocks for conversion optimization.

```sql
blog_cta:
  - id (int, PK, auto-increment)
  - post_id (int, FK, nullable) -- Associated post
  - title_en (varchar)
  - title_ar (varchar)
  - description_en (text)
  - description_ar (text)
  - button_text_en (varchar)
  - button_text_ar (varchar)
  - button_url (varchar)
  - button_style (enum: primary, secondary, outline)
  - position (enum: top, middle, bottom, sidebar)
  - is_active (boolean, default: true)
  - created_at (timestamp)
  - updated_at (timestamp)
```

#### blog_analytics
Tracks blog performance metrics.

```sql
blog_analytics:
  - id (int, PK, auto-increment)
  - post_id (int, FK)
  - date (date)
  - views (int, default: 0)
  - unique_visitors (int, default: 0)
  - comments_count (int, default: 0)
  - shares_count (int, default: 0)
  - avg_time_on_page (int) -- in seconds
  - bounce_rate (decimal)
  - created_at (timestamp)
```

## API Architecture

### tRPC Routers

#### blog.posts
- `list(filters, pagination)` - Get paginated blog posts with filtering
- `getBySlug(slug)` - Get single article by slug
- `create(data)` - Create new post (admin only)
- `update(id, data)` - Update post (admin only)
- `delete(id)` - Delete post (admin only)
- `publish(id)` - Publish draft post (admin only)
- `schedule(id, scheduledFor)` - Schedule post for future publication
- `incrementViews(id)` - Track article view

#### blog.categories
- `list()` - Get all categories
- `create(data)` - Create category (admin only)
- `update(id, data)` - Update category (admin only)
- `delete(id)` - Delete category (admin only)

#### blog.comments
- `list(postId, pagination)` - Get approved comments for post
- `create(postId, content)` - Create new comment (authenticated only)
- `delete(id)` - Delete own comment or admin override
- `approve(id)` - Approve pending comment (admin only)
- `reject(id)` - Reject pending comment (admin only)
- `listPending()` - Get pending comments for moderation (admin only)

#### blog.media
- `upload(file, postId)` - Upload media file to S3
- `delete(id)` - Delete media file (admin only)
- `list(postId)` - Get media files for post

#### blog.search
- `search(query, filters)` - Full-text search across posts
- `suggestions(query)` - Search suggestions for autocomplete

#### blog.analytics
- `getPostStats(postId)` - Get analytics for specific post
- `getDashboardStats()` - Get overall blog analytics (admin only)

## Frontend Architecture

### Page Structure

```
/blog
  ├── / (Homepage)
  │   ├── Hero Section
  │   ├── Featured Articles Grid
  │   ├── Categories Filter
  │   ├── Search Bar
  │   └── Newsletter CTA
  │
  ├── /[slug] (Article Detail)
  │   ├── Article Header (Title, Meta, Author)
  │   ├── Featured Image
  │   ├── Article Content
  │   ├── Share Buttons
  │   ├── Comments Section
  │   ├── Related Articles
  │   └── CTA Blocks
  │
  ├── /category/[slug] (Category Archive)
  │   ├── Category Header
  │   ├── Articles Grid
  │   └── Pagination
  │
  └── /admin (Admin Dashboard)
      ├── Dashboard Overview
      ├── Posts Management
      │   ├── Posts List
      │   ├── Create/Edit Post
      │   └── Rich Text Editor
      ├── Categories Management
      ├── Comments Moderation
      ├── Media Manager
      └── Analytics
```

### Component Hierarchy

```
App
├── Navbar (Sticky)
│   ├── Logo
│   ├── Navigation Links
│   ├── Search Bar
│   ├── Language Toggle (AR/EN)
│   ├── Theme Toggle (Dark/Light)
│   └── CTA Button
│
├── Main Routes
│   ├── BlogHome
│   │   ├── HeroSection
│   │   ├── FeaturedArticles
│   │   ├── CategoriesFilter
│   │   └── ArticlesGrid
│   │
│   ├── ArticleDetail
│   │   ├── ArticleHeader
│   │   ├── ArticleContent
│   │   ├── ShareButtons
│   │   ├── CommentsSection
│   │   └── RelatedArticles
│   │
│   └── AdminDashboard
│       ├── Sidebar Navigation
│       ├── PostsManager
│       ├── CategoriesManager
│       ├── CommentsModeration
│       └── Analytics
│
└── Footer
    ├── Links
    ├── Social Media
    └── Copyright
```

## Authentication & Authorization

### User Roles

| Role | Permissions |
|------|-------------|
| Visitor | View published articles, add comments (if registered) |
| User | View articles, add comments, edit own comments |
| Editor | Create/edit/publish articles, manage categories |
| Admin | Full access to all features, moderation, analytics |

### Protected Procedures

All admin operations use `protectedProcedure` with role-based checks:

```typescript
adminProcedure: protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
})
```

## Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Blue | #2167D1 | Links, buttons, primary actions |
| Success Green | #4CA853 | Success states, positive actions |
| Accent Yellow | #F5BB41 | Highlights, featured content |
| Background | CSS Variable | Theme-dependent |
| Text | CSS Variable | Theme-dependent |

### Theme Implementation

- **Dark Mode (Default)**: Dark background with light text
- **Light Mode**: Light background with dark text
- CSS Variables for dynamic theme switching
- Theme preference stored in localStorage
- RTL/LTR support for Arabic/English

### Typography

- **Headlines**: Bold, premium sans-serif
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for technical content
- **Line Height**: 1.6+ for comfortable reading

## Internationalization (i18n)

### Language Support

- **English (LTR)**: Primary language
- **Arabic (RTL)**: Secondary language with automatic text direction

### Implementation

- Language preference stored in localStorage
- All UI strings in translation files
- Content stored separately for each language
- Automatic RTL/LTR CSS class switching
- Date/time formatting per locale

## Performance Optimization

- Image optimization and lazy loading
- Database query optimization with indexes
- Pagination for large article lists
- Caching strategy for frequently accessed content
- CDN delivery for static assets
- Minified CSS and JavaScript

## Security Considerations

- SQL injection prevention via Drizzle ORM
- XSS protection through React's built-in escaping
- CSRF protection via session cookies
- Rate limiting for API endpoints
- Comment moderation to prevent spam
- File upload validation
- HTTPS enforcement

## Scalability

- Modular component architecture
- Separation of concerns (frontend/backend)
- Database indexing for performance
- Pagination for large datasets
- Caching layer for frequently accessed data
- S3 storage for unlimited media capacity

## Deployment

- Single deployment for integrated blog system
- No separate subdomain required
- Integrated with existing EnglishOM infrastructure
- Database migrations managed via Drizzle
- Environment variables for configuration
- Automated backups via platform infrastructure
