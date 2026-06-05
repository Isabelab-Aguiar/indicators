ALTER TABLE "access_requests" ALTER COLUMN "esf_id" DROP NOT NULL;
ALTER TABLE "access_requests" ADD COLUMN "esf_name" text;
ALTER TABLE "access_requests" ADD COLUMN "cnes" text;
