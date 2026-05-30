CREATE TABLE IF NOT EXISTS "c2_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"esf_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"first_consult_until_day30" boolean DEFAULT false NOT NULL,
	"prenatal_consults" integer DEFAULT 0 NOT NULL,
	"weight_height_records" integer DEFAULT 0 NOT NULL,
	"first_acs_visit_until_day30" boolean DEFAULT false NOT NULL,
	"second_acs_visit_until_month6" boolean DEFAULT false NOT NULL,
	"vaccines_complete" boolean DEFAULT false NOT NULL,
	"score" numeric(5, 2),
	"classification" varchar(20),
	"periodo" varchar(10) NOT NULL,
	"microarea" varchar(50) DEFAULT '' NOT NULL,
	"acs" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_c2_nome_periodo" UNIQUE("esf_id","nome","periodo")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "c2_scores" ADD CONSTRAINT "c2_scores_esf_id_esfs_id_fk" FOREIGN KEY ("esf_id") REFERENCES "public"."esfs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_c2_esf_periodo" ON "c2_scores" USING btree ("esf_id","periodo");