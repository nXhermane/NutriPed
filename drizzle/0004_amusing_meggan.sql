CREATE TABLE `formula_field_references` (
	`field_id` text PRIMARY KEY NOT NULL,
	`field_code` text(50) NOT NULL,
	`field_formula` text NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_phase_references` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`next_phase_code` text,
	`prev_phase_code` text,
	`applicabily_conditions` text NOT NULL,
	`failure_criteria` text NOT NULL,
	`transition_criteria` text NOT NULL,
	`recommended_treatments` text NOT NULL,
	`monitoring_elements` text NOT NULL,
	`follow_up_actions` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `care_phases` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`monitoring_parameters` text NOT NULL,
	`on_going_treatments` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_care_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`treatment_id` text NOT NULL,
	`status` text NOT NULL,
	`type` text NOT NULL,
	`action` text NOT NULL,
	`effective_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_care_records` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`treatment_actions` text NOT NULL,
	`monitoring_tasks` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_monitoring_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`monitoring_id` text NOT NULL,
	`status` text NOT NULL,
	`task` text NOT NULL,
	`effective_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` text NOT NULL,
	`requires_response` integer NOT NULL,
	`decision_type` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monitoring_elements` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`category` text NOT NULL,
	`source` text NOT NULL,
	`frequency` text NOT NULL,
	`duration` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monitoring_parameters` (
	`id` text PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`next_task_date` text,
	`last_execution_date` text,
	`element` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `next_medicines` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`administration_routes` text NOT NULL,
	`dosage_cases` text NOT NULL,
	`warnings` text NOT NULL,
	`contraindications` text NOT NULL,
	`interactions` text NOT NULL,
	`notes` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `next_milks` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`notes` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `next_nutritional_products` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`dosage_tables` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `next_orientation_references` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`criteria` text NOT NULL,
	`treatment_phase` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `on_going_treatments` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`status` text NOT NULL,
	`next_action_date` text,
	`last_execution_date` text,
	`recommendation` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient_care_session_aggregates` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`status` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`current_phase` text,
	`current_daily_record` text,
	`phase_history` text NOT NULL,
	`daily_records` text NOT NULL,
	`inbox` text NOT NULL,
	`responses` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recommended_treatments` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`treatment_triggers` text NOT NULL,
	`duration` text NOT NULL,
	`frequency` text NOT NULL,
	`ajustment_percentage` integer,
	`type` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_response_summaries` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`response` text NOT NULL,
	`timestamp` text NOT NULL,
	`decision_data` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `medical_records` ADD `orientation_records` text NOT NULL;