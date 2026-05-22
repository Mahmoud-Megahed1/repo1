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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `blog_post_tags` (
	`postId` int NOT NULL,
	`tagId` int NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE INDEX `analytics_post_date_idx` ON `blog_analytics` (`postId`,`date`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `blog_categories` (`slug`);--> statement-breakpoint
CREATE INDEX `comment_post_idx` ON `blog_comments` (`postId`);--> statement-breakpoint
CREATE INDEX `comment_user_idx` ON `blog_comments` (`userId`);--> statement-breakpoint
CREATE INDEX `comment_status_idx` ON `blog_comments` (`status`);--> statement-breakpoint
CREATE INDEX `media_post_idx` ON `blog_media` (`postId`);--> statement-breakpoint
CREATE INDEX `media_user_idx` ON `blog_media` (`uploadedBy`);--> statement-breakpoint
CREATE INDEX `post_slug_idx` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `post_category_idx` ON `blog_posts` (`categoryId`);--> statement-breakpoint
CREATE INDEX `post_author_idx` ON `blog_posts` (`authorId`);--> statement-breakpoint
CREATE INDEX `post_status_idx` ON `blog_posts` (`status`);--> statement-breakpoint
CREATE INDEX `tag_slug_idx` ON `blog_tags` (`slug`);