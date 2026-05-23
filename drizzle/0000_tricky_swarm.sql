CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"district" text NOT NULL,
	"date" date NOT NULL,
	"coordinator" text NOT NULL,
	"conducted_by" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"beneficiaries" integer DEFAULT 0 NOT NULL,
	"cases_identified" integer DEFAULT 0 NOT NULL,
	"cases_referred" integer DEFAULT 0 NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"follow_up" text DEFAULT '' NOT NULL,
	"linked_cases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_id" text NOT NULL,
	"name" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text,
	"email" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "app_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "case_diary_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"case_id" text NOT NULL,
	"date" date NOT NULL,
	"action" text NOT NULL,
	"by" text NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_hearings" (
	"id" text PRIMARY KEY NOT NULL,
	"case_id" text NOT NULL,
	"date" date NOT NULL,
	"court" text NOT NULL,
	"purpose" text DEFAULT '' NOT NULL,
	"outcome" text DEFAULT '' NOT NULL,
	"next_date" date,
	"by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"client" text NOT NULL,
	"respondent" text NOT NULL,
	"court" text NOT NULL,
	"case_no" text DEFAULT '' NOT NULL,
	"fir_no" text DEFAULT '' NOT NULL,
	"section" text DEFAULT '' NOT NULL,
	"ps" text DEFAULT '' NOT NULL,
	"type" text NOT NULL,
	"district" text NOT NULL,
	"advocate" text NOT NULL,
	"worker" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"facts" text DEFAULT '' NOT NULL,
	"grounds" text DEFAULT '' NOT NULL,
	"relief" text DEFAULT '' NOT NULL,
	"documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"category" text NOT NULL,
	"project" text NOT NULL,
	"description" text NOT NULL,
	"approved_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monthly_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"member" text NOT NULL,
	"month" text NOT NULL,
	"type" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"assigned_to" text NOT NULL,
	"case_id" text,
	"deadline" date NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"type" text NOT NULL,
	"loc" text NOT NULL,
	"dist" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"qual" text DEFAULT '' NOT NULL,
	"join" date NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"terminated_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "activity_participants" ADD CONSTRAINT "activity_participants_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_diary_entries" ADD CONSTRAINT "case_diary_entries_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_hearings" ADD CONSTRAINT "case_hearings_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;