CREATE TABLE "legal_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"document_type" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"issuing_authority" text NOT NULL,
	"citation" text DEFAULT '' NOT NULL,
	"source_kind" text DEFAULT 'primary' NOT NULL,
	"source_url" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'current' NOT NULL,
	"date_published" date,
	"date_effective" date,
	"plain_language_summary" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"audience_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
