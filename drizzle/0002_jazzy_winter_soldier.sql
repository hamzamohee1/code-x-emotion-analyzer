CREATE TABLE `emotionFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`analysisId` int NOT NULL,
	`aiPredictedEmotion` varchar(64) NOT NULL,
	`aiConfidence` int NOT NULL,
	`userCorrectedEmotion` varchar(64),
	`userConfidence` int,
	`isCorrected` boolean NOT NULL DEFAULT false,
	`feedback` text,
	`helpfulnessRating` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emotionFeedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `emotionFeedback` ADD CONSTRAINT `emotionFeedback_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emotionFeedback` ADD CONSTRAINT `emotionFeedback_analysisId_emotionAnalyses_id_fk` FOREIGN KEY (`analysisId`) REFERENCES `emotionAnalyses`(`id`) ON DELETE no action ON UPDATE no action;