CREATE TABLE IF NOT EXISTS "c4_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"consultations_last6m" integer DEFAULT 0 NOT NULL,
	"blood_pressure_last6m" integer DEFAULT 0 NOT NULL,
	"weight_height_last12m" boolean DEFAULT false NOT NULL,
	"acs_visits_last12m" integer DEFAULT 0 NOT NULL,
	"acs_visits_interval_days" integer DEFAULT 0 NOT NULL,
	"hba1c_last12m" boolean DEFAULT false NOT NULL,
	"feet_evaluation_last12m" boolean DEFAULT false NOT NULL,
	"score" numeric(5, 2),
	"classification" varchar(20),
	"periodo" varchar(10) NOT NULL,
	"microarea" varchar(50) DEFAULT '' NOT NULL,
	"acs" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_c4_nome_periodo" UNIQUE("esf_id","nome","periodo")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c4_scores" ADD CONSTRAINT "c4_scores_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c4_esf_periodo" ON "c4_scores" USING btree ("esf_id","periodo");