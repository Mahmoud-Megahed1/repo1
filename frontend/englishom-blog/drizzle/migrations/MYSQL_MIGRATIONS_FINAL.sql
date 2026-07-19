-- ============================================================================
-- EnglishOM Blog System - MySQL Database Migrations
-- ============================================================================
-- This file contains all database migrations for the EnglishOM Blog System
-- Run this file in your MySQL database to create all required tables
-- Compatible with: MySQL 8.0+, TiDB, MariaDB 10.5+
-- ============================================================================

-- ============================================================================
-- MIGRATION 0000: Users Table
-- ============================================================================
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

-- ============================================================================
-- MIGRATION 0001: Blog Tables (Categories, Posts, Comments, Tags, Media, CTA, Analytics)
-- ============================================================================

CREATE TABLE `blog_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`date` date NOT NULL,
	`views` int DEFAULT 0,
	`uniqueVisitors` int DEFAULT 0,
	`commentsCount` int DEFAULT 0,
	`sharesCount` int DEFAULT 0,
	`avgTimeOnPage` int,
	`bounceRate` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_analytics_id` PRIMARY KEY(`id`)
);

CREATE TABLE `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`iconUrl` varchar(512),
	`colorHex` varchar(7) DEFAULT '#2167D1',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE `blog_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`parentCommentId` int,
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`isHelpfulCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`approvedAt` timestamp,
	CONSTRAINT `blog_comments_id` PRIMARY KEY(`id`)
);

CREATE TABLE `blog_cta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`buttonTextEn` varchar(100),
	`buttonTextAr` varchar(100),
	`buttonUrl` varchar(512) NOT NULL,
	`buttonStyle` enum('primary','secondary','outline') DEFAULT 'primary',
	`position` enum('top','middle','bottom','sidebar') DEFAULT 'bottom',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_cta_id` PRIMARY KEY(`id`)
);

CREATE TABLE `blog_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(512) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` varchar(100),
	`fileSize` int,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_media_id` PRIMARY KEY(`id`)
);

CREATE TABLE `blog_post_tags` (
	`postId` int NOT NULL,
	`tagId` int NOT NULL
);

CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`contentEn` longtext NOT NULL,
	`contentAr` longtext NOT NULL,
	`excerptEn` text,
	`excerptAr` text,
	`featuredImageUrl` varchar(512),
	`featuredImageKey` varchar(512),
	`categoryId` int NOT NULL,
	`authorId` int NOT NULL,
	`status` enum('draft','published','scheduled') DEFAULT 'draft',
	`publishedAt` timestamp,
	`scheduledFor` timestamp,
	`readingTimeMinutes` int DEFAULT 5,
	`viewsCount` int DEFAULT 0,
	`isFeatured` boolean DEFAULT false,
	`customAuthorNameEn` varchar(255),
	`customAuthorNameAr` varchar(255),
	`showDate` boolean DEFAULT true,
	`dateDisplayType` varchar(20) DEFAULT 'published',
	`metaDescriptionEn` varchar(160),
	`metaDescriptionAr` varchar(160),
	`metaKeywordsEn` varchar(255),
	`metaKeywordsAr` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deletedAt` timestamp,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE `blog_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_tags_slug_unique` UNIQUE(`slug`)
);

-- Create indexes for better query performance
CREATE INDEX `analytics_post_date_idx` ON `blog_analytics` (`postId`,`date`);
CREATE INDEX `slug_idx` ON `blog_categories` (`slug`);
CREATE INDEX `comment_post_idx` ON `blog_comments` (`postId`);
CREATE INDEX `comment_user_idx` ON `blog_comments` (`userId`);
CREATE INDEX `comment_status_idx` ON `blog_comments` (`status`);
CREATE INDEX `media_post_idx` ON `blog_media` (`postId`);
CREATE INDEX `media_user_idx` ON `blog_media` (`uploadedBy`);
CREATE INDEX `post_slug_idx` ON `blog_posts` (`slug`);
CREATE INDEX `post_category_idx` ON `blog_posts` (`categoryId`);
CREATE INDEX `post_author_idx` ON `blog_posts` (`authorId`);
CREATE INDEX `post_status_idx` ON `blog_posts` (`status`);
CREATE INDEX `tag_slug_idx` ON `blog_tags` (`slug`);

-- ============================================================================
-- MIGRATION 0002: Email Notification Tables
-- ============================================================================

CREATE TABLE `email_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`subscriberEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_notifications_id` PRIMARY KEY(`id`)
);

CREATE TABLE `email_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`verificationToken` varchar(255),
	`isVerified` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_subscribers_email_unique` UNIQUE(`email`)
);

-- Create indexes for email tables
CREATE INDEX `post_id_idx` ON `email_notifications` (`postId`);
CREATE INDEX `status_idx` ON `email_notifications` (`status`);
CREATE INDEX `created_at_idx` ON `email_notifications` (`createdAt`);
CREATE INDEX `email_idx` ON `email_subscribers` (`email`);
CREATE INDEX `is_active_idx` ON `email_subscribers` (`isActive`);

-- ============================================================================
-- MIGRATION 0003: Post Ratings Table
-- ============================================================================

CREATE TABLE `post_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`isHelpful` boolean,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_ratings_id` PRIMARY KEY(`id`)
);

-- Create indexes for ratings table
CREATE INDEX `post_id_idx` ON `post_ratings` (`postId`);
CREATE INDEX `user_id_idx` ON `post_ratings` (`userId`);
CREATE INDEX `unique_rating` ON `post_ratings` (`postId`,`userId`);

-- ============================================================================
-- SUMMARY OF TABLES CREATED
-- ============================================================================
-- Total Tables: 11
-- 1. users - User authentication and roles
-- 2. blog_posts - Blog articles with bilingual content
-- 3. blog_categories - Article categories
-- 4. blog_comments - Comments and nested replies
-- 5. blog_tags - Article tags/labels
-- 6. blog_post_tags - Junction table for post-tag relationships
-- 7. blog_media - Media files (images, documents)
-- 8. blog_cta - Call-to-action sections
-- 9. blog_analytics - Post analytics and statistics
-- 10. email_subscribers - Newsletter subscribers
-- 11. email_notifications - Email notification queue
-- 12. post_ratings - Post ratings and reviews (5-star system)
--
-- Total Indexes: 20+ for optimal query performance
--
-- ============================================================================
-- NOTES FOR DEPLOYMENT
-- ============================================================================
-- 1. Ensure MySQL 8.0+ or compatible database is running
-- 2. Create a new database: CREATE DATABASE englishom_blog;
-- 3. Run this entire SQL file in your database
-- 4. Verify all tables are created: SHOW TABLES;
-- 5. Check table structure: DESCRIBE table_name;
-- 6. Update DATABASE_URL in .env file with correct connection string
-- ============================================================================
