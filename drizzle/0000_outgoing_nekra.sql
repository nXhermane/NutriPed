CREATE TABLE `anthropometric_measures` (
	`anthropometric_measure_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`anthropometric_measure_name` text(200) NOT NULL,
	`anthropometric_measure_code` text(10) NOT NULL,
	`anthropometric_measure_validation_rules` text,
	`anthropometric_measure_available_unit` text,
	`anthropometric_measure_unit` text(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `biochemical_references` (
	`biochemical_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`biochemical_reference_name` text(255) NOT NULL,
	`biochemical_reference_code` text(10) NOT NULL,
	`biochemical_reference_unit` text(10) NOT NULL,
	`biochemical_reference_available_units` text NOT NULL,
	`biochemical_reference_ranges` text NOT NULL,
	`biochemical_reference_source` text(255) NOT NULL,
	`biochemical_reference_notes` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `clinical_sign_references` (
	`clinical_sign_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`clinical_sign_reference_name` text(255) NOT NULL,
	`clinical_sign_reference_code` text(10) NOT NULL,
	`clinical_sign_reference_description` text NOT NULL,
	`clinical_sign_reference_evaluation_rule` text NOT NULL,
	`clinical_sign_reference_data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `diagnostic_rules` (
	`diagnostic_rule_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`diagnostic_rule_name` text(255) NOT NULL,
	`diagnostic_rule_code` text(10) NOT NULL,
	`diagnostic_rule_conditions` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `growth_reference_charts` (
	`growth_reference_chart_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`growth_reference_chart_code` text(10) NOT NULL,
	`growth_reference_chart_name` text(255) NOT NULL,
	`growth_reference_chart_standard` text NOT NULL,
	`growth_reference_sex` text NOT NULL,
	`growth_reference_chart_data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `growth_reference_tables` (
	`growth_reference_table_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`growth_reference_table_name` text(255) NOT NULL,
	`growth_reference_table_code` text(10) NOT NULL,
	`growth_reference_table_standard` text NOT NULL,
	`growth_reference_table_data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `indicators` (
	`indicator_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`indicator_name` text(255) NOT NULL,
	`indicator_code` text(10) NOT NULL,
	`indicator_needed_measure_codes` text NOT NULL,
	`indicator_axe_x` text NOT NULL,
	`indicator_axe_y` text NOT NULL,
	`indicator_available_ref_charts` text NOT NULL,
	`indicator_usage_conditions` text NOT NULL,
	`indicator_interpretations` text NOT NULL,
	`indicator_z_score_computing_strategy` text NOT NULL,
	`indicator_standard_shape` text NOT NULL,
	`indicator_available_ref_tables` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nutritional_assessment_results` (
	`nutritional_assessment_result_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`nutritional_assessment_result_global_diagnostics` text NOT NULL,
	`nutritional_assessment_result_growth_indicator_values` text NOT NULL,
	`nutritional_assessment_result_clinical_analysis` text NOT NULL,
	`nutritional_assessment_result_biological_interpretation` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nutritional_diagnostics` (
	`nutritional_diagnostic_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`patient_id` text(50) NOT NULL,
	`patient_data_id` text(50) NOT NULL,
	`nutritional_diagnostic_results_id` text(50),
	`nutritional_diagnostic_date` text(50) NOT NULL,
	`nutritional_diagnostic_notes` text NOT NULL,
	`nutritional_diagnostic_at_init` integer NOT NULL,
	`nutritional_diagnostic_modification_histories` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nutritional_risk_factors` (
	`nutritional_risk_factor_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`nutritional_risk_factor_clinical_sign_code` text(10) NOT NULL,
	`nutritional_risk_factor_associated_nutrients` text NOT NULL,
	`nutritional_risk_factor_recommended_tests` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient_diagnostic_data` (
	`patient_diagnostic_data_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`patient_diagnostic_data_sex` text NOT NULL,
	`patient_diagnostic_data_birthday` text(50) NOT NULL,
	`patient_diagnostic_data_anthrop_measures` text NOT NULL,
	`patient_diagnostic_data_clinical_signs` text NOT NULL,
	`patient_diagnostic_data_biological_test_results` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medical_records` (
	`medical_record_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`patient_id` text(50) NOT NULL,
	`anthropometric_data` text NOT NULL,
	`biological_data` text NOT NULL,
	`clinical_data` text NOT NULL,
	`complications` text NOT NULL,
	`data_fields_response` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `appetite_test_references` (
	`appetite_test_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`code` text(255) NOT NULL,
	`product_type` text,
	`appetite_test_table` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `complications` (
	`complication_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`code` text(255) NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_care_journals` (
	`daily_care_journal_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`date` text(50) NOT NULL,
	`day_number` integer NOT NULL,
	`monitoring_values` text NOT NULL,
	`observations` text NOT NULL,
	`treatment_actions` text NOT NULL,
	`appetite_test_results` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medicines` (
	`medicine_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`code` text(255) NOT NULL,
	`category` text NOT NULL,
	`administration_routes` text NOT NULL,
	`base_dosage` text NOT NULL,
	`dosage_ranges` text NOT NULL,
	`warnings` text,
	`contraindications` text,
	`interactions` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `milks` (
	`milk_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`type` text NOT NULL,
	`dose_formula` text NOT NULL,
	`condition` text NOT NULL,
	`recommended_milk_per_day` text NOT NULL,
	`recommendation_per_ranges` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orientation_references` (
	`orientation_reference_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`name` text(255) NOT NULL,
	`code` text(255) NOT NULL,
	`admission_criteria` text NOT NULL,
	`admission_types` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient_care_sessions` (
	`patient_care_session_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`patient_id` text(50) NOT NULL,
	`start_date` text(50) NOT NULL,
	`end_date` text(50),
	`orientation` text NOT NULL,
	`care_phases` text NOT NULL,
	`current_state_id` text(50) NOT NULL,
	`daily_journals` text NOT NULL,
	`current_daily_journal_id` text(50),
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient_current_states` (
	`patient_current_state_id` text PRIMARY KEY NOT NULL,
	`created_at` text(50) NOT NULL,
	`updated_at` text(50) NOT NULL,
	`anthropometric_data` text NOT NULL,
	`clinical_sign_data` text NOT NULL,
	`biological_data` text NOT NULL,
	`appetite_test_result` text NOT NULL,
	`complication_data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`patient_id` text PRIMARY KEY NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL,
	`patient_name` text(200) NOT NULL,
	`patient_sex` text NOT NULL,
	`patient_birthday` text(50) NOT NULL,
	`patient_parents` text NOT NULL,
	`patient_contact` text NOT NULL,
	`patient_address` text NOT NULL,
	`patient_registration_date` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `units` (
	`unit_id` text PRIMARY KEY NOT NULL,
	`createdAt` text(50) NOT NULL,
	`updatedAt` text(50) NOT NULL,
	`unit_name` text(200) NOT NULL,
	`unit_code` text(10) NOT NULL,
	`unit_conversion_factor` integer NOT NULL,
	`unit_base_unit` text(10) NOT NULL,
	`unit_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`reminder_id` text PRIMARY KEY NOT NULL,
	`reminder_title` text NOT NULL,
	`reminder_message` text NOT NULL,
	`reminder_trigger` text NOT NULL,
	`reminder_created_at` text NOT NULL,
	`reminder_is_active` text NOT NULL,
	`reminder_actions` text NOT NULL,
	`reminder_updated_at` text NOT NULL
);
