# EnglishOM Blog System - API Documentation

## Overview

This document provides comprehensive API documentation for the EnglishOM Blog System. The system uses **tRPC** for all backend communication, providing end-to-end type safety from server to client.

---

## Authentication & Authorization

All protected procedures require user authentication via Manus OAuth. Admin-only procedures require the user to have an `admin` role.

### User Roles
- **user**: Regular authenticated user (can comment, favorite articles, subscribe)
- **admin**: Administrator (can create/edit posts, manage categories, send notifications)

---

## API Procedures

### Blog Posts Management

#### `blog.posts.list` - Get Published Posts
**Type**: Public Query  
**Input**:
```typescript
{
  limit: number (1-100, default: 10),
  offset: number (default: 0),
  categoryId?: number,
  search?: string
}
```
**Output**: `{ posts: BlogPost[], total: number }`

#### `blog.posts.create` - Create New Post
**Type**: Admin Mutation  
**Input**:
```typescript
{
  titleEn: string,
  titleAr: string,
  contentEn: string (HTML),
  contentAr: string (HTML),
  categoryId: number,
  authorId: number,
  featuredImageUrl?: string,
  excerpt?: string,
  status: "draft" | "published" | "scheduled",
  publishedAt?: Date,
  tags?: number[]
}
```
**Output**: `{ id: number, slug: string }`

#### `blog.posts.update` - Update Post
**Type**: Admin Mutation  
**Input**:
```typescript
{
  id: number,
  titleEn?: string,
  titleAr?: string,
  contentEn?: string,
  contentAr?: string,
  categoryId?: number,
  status?: "draft" | "published" | "scheduled",
  tags?: number[]
}
```

#### `blog.posts.delete` - Delete Post
**Type**: Admin Mutation  
**Input**: `{ id: number }`

#### `blog.posts.getBySlug` - Get Post by Slug
**Type**: Public Query  
**Input**: `{ slug: string }`  
**Output**: `BlogPost`

#### `blog.posts.getRelated` - Get Related Posts
**Type**: Public Query  
**Input**: `{ postId: number, limit: number }`  
**Output**: `BlogPost[]`

---

### Categories Management

#### `blog.categories.list` - Get All Categories
**Type**: Public Query  
**Output**: `BlogCategory[]`

#### `blog.categories.create` - Create Category
**Type**: Admin Mutation  
**Input**:
```typescript
{
  nameEn: string,
  nameAr: string,
  slug: string,
  description?: string
}
```

#### `blog.categories.update` - Update Category
**Type**: Admin Mutation  
**Input**:
```typescript
{
  id: number,
  nameEn?: string,
  nameAr?: string,
  description?: string
}
```

#### `blog.categories.delete` - Delete Category
**Type**: Admin Mutation  
**Input**: `{ id: number }`

---

### Tags Management

#### `blog.tags.list` - Get All Tags
**Type**: Public Query  
**Output**: `BlogTag[]`

#### `blog.tags.create` - Create Tag
**Type**: Admin Mutation  
**Input**:
```typescript
{
  nameEn: string,
  nameAr: string,
  slug: string
}
```

#### `blog.tags.addToPost` - Add Tag to Post
**Type**: Admin Mutation  
**Input**: `{ postId: number, tagId: number }`

#### `blog.tags.removeFromPost` - Remove Tag from Post
**Type**: Admin Mutation  
**Input**: `{ postId: number, tagId: number }`

#### `blog.tags.getPostsByTag` - Get Posts by Tag
**Type**: Public Query  
**Input**: `{ tagId: number, limit: number }`  
**Output**: `BlogPost[]`

---

### Comments System

#### `blog.comments.create` - Create Comment
**Type**: Protected Mutation  
**Input**:
```typescript
{
  postId: number,
  content: string,
  parentCommentId?: number
}
```
**Output**: `{ id: number }`

#### `blog.comments.list` - Get Post Comments
**Type**: Public Query  
**Input**: `{ postId: number, limit: number }`  
**Output**: `BlogComment[]`

#### `blog.comments.delete` - Delete Comment
**Type**: Protected Mutation  
**Input**: `{ id: number }`

#### `blog.comments.approve` - Approve Comment
**Type**: Admin Mutation  
**Input**: `{ id: number }`

#### `blog.comments.reject` - Reject Comment
**Type**: Admin Mutation  
**Input**: `{ id: number }`

---

### Email Notifications System

#### `blog.email.subscribe` - Subscribe to Newsletter
**Type**: Public Mutation  
**Input**:
```typescript
{
  email: string,
  name?: string
}
```

#### `blog.email.unsubscribe` - Unsubscribe from Newsletter
**Type**: Public Mutation  
**Input**: `{ email: string }`

#### `blog.email.getSubscribers` - Get Active Subscribers
**Type**: Admin Query  
**Output**: `EmailSubscriber[]`

#### `blog.email.sendNotification` - Send Email Notification
**Type**: Admin Mutation  
**Input**:
```typescript
{
  postId: number,
  subject: string,
  body: string
}
```
**Output**: `{ count: number }`

#### `blog.email.getPendingNotifications` - Get Pending Notifications
**Type**: Admin Query  
**Output**: `EmailNotification[]`

#### `blog.email.updateNotificationStatus` - Update Notification Status
**Type**: Admin Mutation  
**Input**:
```typescript
{
  id: number,
  status: "sent" | "failed",
  failureReason?: string
}
```

---

### Analytics

#### `blog.analytics.getPostStats` - Get Post Statistics
**Type**: Admin Query  
**Input**:
```typescript
{
  postId: number,
  daysBack: number (default: 30)
}
```
**Output**: `PostAnalytics`

---

## Database Schema

### blog_posts
```sql
CREATE TABLE blog_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  titleEn TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  contentEn LONGTEXT NOT NULL,
  contentAr LONGTEXT NOT NULL,
  excerptEn TEXT,
  excerptAr TEXT,
  categoryId INT NOT NULL,
  authorId INT NOT NULL,
  featuredImageUrl VARCHAR(500),
  status ENUM('draft', 'published', 'scheduled'),
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES blog_categories(id),
  FOREIGN KEY (authorId) REFERENCES users(id)
);
```

### blog_categories
```sql
CREATE TABLE blog_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### blog_tags
```sql
CREATE TABLE blog_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### blog_post_tags
```sql
CREATE TABLE blog_post_tags (
  postId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (postId, tagId),
  FOREIGN KEY (postId) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES blog_tags(id) ON DELETE CASCADE
);
```

### blog_comments
```sql
CREATE TABLE blog_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  parentCommentId INT,
  status ENUM('pending', 'approved', 'rejected'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (parentCommentId) REFERENCES blog_comments(id) ON DELETE CASCADE
);
```

### email_subscribers
```sql
CREATE TABLE email_subscribers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(320) UNIQUE NOT NULL,
  name VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  isVerified BOOLEAN DEFAULT FALSE,
  unsubscribedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### email_notifications
```sql
CREATE TABLE email_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,
  subscriberEmail VARCHAR(320) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body LONGTEXT NOT NULL,
  status ENUM('pending', 'sent', 'failed'),
  sentAt TIMESTAMP,
  failureReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

---

## Integration Guide for englishom.com

### Step 1: Setup Database Connection
Update your `.env` file with the MySQL connection string:
```
DATABASE_URL=mysql://username:password@host:port/englishom_blog
```

### Step 2: Run Migrations
Execute the migration files in order:
```bash
mysql -u username -p database_name < drizzle/0001_shiny_newton_destine.sql
mysql -u username -p database_name < drizzle/0002_absurd_boom_boom.sql
```

### Step 3: Initialize tRPC Client
```typescript
import { trpc } from '@/lib/trpc';

// Create a post
const post = await trpc.blog.posts.create.mutate({
  titleEn: 'Learn English',
  titleAr: 'تعلم اللغة الإنجليزية',
  contentEn: '<p>Content here</p>',
  contentAr: '<p>محتوى هنا</p>',
  categoryId: 1,
  authorId: 1,
  status: 'published'
});

// Get posts
const { posts } = await trpc.blog.posts.list.query({
  limit: 10,
  categoryId: 1
});
```

### Step 4: Subscribe Users to Newsletter
```typescript
// Subscribe
await trpc.blog.email.subscribe.mutate({
  email: 'student@example.com',
  name: 'Student Name'
});

// Send notification when new post is published
await trpc.blog.email.sendNotification.mutate({
  postId: 1,
  subject: 'New English Lesson Available',
  body: 'Check out our latest lesson on phrasal verbs!'
});
```

---

## Error Handling

All tRPC procedures return typed responses. Errors include:
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Resource not found
- `BAD_REQUEST`: Invalid input parameters
- `INTERNAL_SERVER_ERROR`: Server error

---

## Performance Considerations

1. **Pagination**: Always use limit/offset for large datasets
2. **Caching**: Implement client-side caching for categories and tags
3. **Search**: Use full-text search for better performance on large post collections
4. **Images**: Store featured images in S3 or CDN, not in database

---

## Support

For issues or questions, contact the development team or refer to the main documentation at `/home/ubuntu/englishom-blog/DATABASE_STRUCTURE.md`.
