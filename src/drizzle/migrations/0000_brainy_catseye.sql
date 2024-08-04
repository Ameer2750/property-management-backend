CREATE TABLE IF NOT EXISTS "user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"awsId" varchar(255) NOT NULL,
	"arn" varchar(255) NOT NULL,
	"accountStatus" boolean DEFAULT false NOT NULL,
	"refreshToken" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "awsIdIndex" ON "user" USING btree ("awsId");