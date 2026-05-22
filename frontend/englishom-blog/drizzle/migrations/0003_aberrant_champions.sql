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
--> statement-breakpoint
CREATE INDEX `post_id_idx` ON `post_ratings` (`postId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `post_ratings` (`userId`);--> statement-breakpoint
CREATE INDEX `unique_rating` ON `post_ratings` (`postId`,`userId`);