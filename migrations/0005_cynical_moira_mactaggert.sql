CREATE TABLE `timetable_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timetable_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`activity` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`name` text NOT NULL,
	`room` text,
	`type` text,
	`teacher` text,
	`is_break` integer NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`timetable_id`) REFERENCES `timetables`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timetables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`course_code` text NOT NULL,
	`semester` integer NOT NULL,
	`college` text NOT NULL,
	`empty` integer NOT NULL,
	`url` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
DROP TABLE `day`;--> statement-breakpoint
DROP TABLE `timetable`;