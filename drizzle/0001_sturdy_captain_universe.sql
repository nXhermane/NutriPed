CREATE TABLE `reminders` (
	`reminder_id` text PRIMARY KEY NOT NULL,
	`reminder_title` text NOT NULL,
	`reminder_message` text NOT NULL,
	`reminder_scheduled_time` text NOT NULL,
	`reminder_created_at` text NOT NULL,
	`reminder_repeat` text NOT NULL,
	`reminder_is_active` text NOT NULL,
	`reminder_actions` text NOT NULL,
	`reminder_updated_at` text NOT NULL
);
