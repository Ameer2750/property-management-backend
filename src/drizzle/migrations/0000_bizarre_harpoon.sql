CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"user_id" integer,
	"block_no" varchar(255),
	"locality" varchar(255),
	"city" varchar(255),
	"state" varchar(255),
	"pincode" varchar(255),
	"country" varchar(255) DEFAULT 'India'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bed_allocation" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"tenant_id" integer,
	"bed_number" integer,
	"occupied_since" timestamp DEFAULT now(),
	"status" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document" (
	"id" serial PRIMARY KEY NOT NULL,
	"rent_agreement_id" integer,
	"file_path" varchar(255) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "floor" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"floor_number" integer NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inspection" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"room_id" integer,
	"inspection_date" timestamp NOT NULL,
	"inspector_name" varchar(255) NOT NULL,
	"comments" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"rent_agreement_id" integer,
	"amount" numeric NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenance_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"room_id" integer,
	"user_id" integer,
	"description" varchar(1000) NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"assigned_to" varchar(255),
	"cost" numeric,
	"completion_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"rent_agreement_id" integer,
	"amount" numeric NOT NULL,
	"payment_date" timestamp NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"is_advance" boolean DEFAULT false,
	"payment_for_period" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property" (
	"id" serial PRIMARY KEY NOT NULL,
	"address_id" integer,
	"name" varchar(255) NOT NULL,
	"contact" varchar(255) NOT NULL,
	"description" varchar(1000),
	"gender_preference" varchar(200),
	"suitability" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_owner" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rent_agreement" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"room_id" integer,
	"user_id" integer,
	"rent_cycle" varchar(50) NOT NULL,
	"grace_period" integer NOT NULL,
	"fine_for_late_payment" boolean,
	"fine_for_late_payment_amount" numeric,
	"extra_charges" boolean DEFAULT false,
	"security_deposit" numeric,
	"agreement_duration" integer,
	"lock_in_period" integer,
	"notice_period" integer,
	"advance_payment" numeric,
	"pending_amount" numeric,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"floor_id" integer,
	"name" varchar(255) NOT NULL,
	"room_type_id" integer,
	"available_beds" integer NOT NULL,
	"occupied_beds" integer NOT NULL,
	"bed_rate" numeric NOT NULL,
	"availability_status" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_feature" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_room_feature" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer,
	"feature_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer,
	"name" varchar(255),
	"rent" numeric,
	"square_footage" integer,
	"occupancy_limit" integer,
	"bed_rate" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"property_id" integer,
	"room_id" integer,
	"move_in_date" timestamp NOT NULL,
	"move_out_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bed_allocation" ADD CONSTRAINT "bed_allocation_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bed_allocation" ADD CONSTRAINT "bed_allocation_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document" ADD CONSTRAINT "document_rent_agreement_id_rent_agreement_id_fk" FOREIGN KEY ("rent_agreement_id") REFERENCES "public"."rent_agreement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "floor" ADD CONSTRAINT "floor_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection" ADD CONSTRAINT "inspection_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inspection" ADD CONSTRAINT "inspection_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_rent_agreement_id_rent_agreement_id_fk" FOREIGN KEY ("rent_agreement_id") REFERENCES "public"."rent_agreement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_rent_agreement_id_rent_agreement_id_fk" FOREIGN KEY ("rent_agreement_id") REFERENCES "public"."rent_agreement"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property" ADD CONSTRAINT "property_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_owner" ADD CONSTRAINT "property_owner_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "property_owner" ADD CONSTRAINT "property_owner_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rent_agreement" ADD CONSTRAINT "rent_agreement_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rent_agreement" ADD CONSTRAINT "rent_agreement_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rent_agreement" ADD CONSTRAINT "rent_agreement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "room_floor_id_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_room_type_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_room_feature" ADD CONSTRAINT "room_room_feature_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_room_feature" ADD CONSTRAINT "room_room_feature_feature_id_room_feature_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."room_feature"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_type" ADD CONSTRAINT "room_type_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant" ADD CONSTRAINT "tenant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant" ADD CONSTRAINT "tenant_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenant" ADD CONSTRAINT "tenant_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
