CREATE TABLE `publicDashboardStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wordsWrittenToday` int NOT NULL DEFAULT 0,
	`audioMinutesListened` int NOT NULL DEFAULT 0,
	`voiceRecordingsToday` int NOT NULL DEFAULT 0,
	`shieldsEarnedToday` int NOT NULL DEFAULT 0,
	`shieldCompletionRate` int NOT NULL DEFAULT 0,
	`recordedStoriesCount` int NOT NULL DEFAULT 0,
	`totalSpeakingSeconds` int NOT NULL DEFAULT 0,
	`passedStudentsCount` int NOT NULL DEFAULT 0,
	`quizSuccessRate` int NOT NULL DEFAULT 0,
	`citiesCount` int NOT NULL DEFAULT 53,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publicDashboardStats_id` PRIMARY KEY(`id`)
);
