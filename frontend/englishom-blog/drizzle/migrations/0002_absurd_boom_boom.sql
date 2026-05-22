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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `email_notifications` (`postId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `email_notifications` (`status`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `email_notifications` (`createdAt`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `email_subscribers` (`email`);--> statement-breakpoint
CREATE INDEX `is_active_idx` ON `email_subscribers` (`isActive`);