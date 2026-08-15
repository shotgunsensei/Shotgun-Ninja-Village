CREATE TABLE IF NOT EXISTS "signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "village_forum_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"is_original" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "village_forum_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_slug" varchar(64) NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(140) NOT NULL,
	"excerpt" varchar(240) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "village_sessions" (
	"token_hash" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "village_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"callsign" varchar(24) NOT NULL,
	"bio" varchar(400) DEFAULT '' NOT NULL,
	"avatar_color" varchar(24) DEFAULT 'crimson' NOT NULL,
	"role" varchar(24) DEFAULT 'member' NOT NULL,
	"tier" varchar(24) DEFAULT 'free' NOT NULL,
	"status" varchar(24) DEFAULT 'active' NOT NULL,
	"newsletter_opt_in" boolean DEFAULT false NOT NULL,
	"archetype" varchar(24),
	"watched_transmissions" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"terms_accepted_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "village_forum_posts" ADD CONSTRAINT "village_forum_posts_topic_id_village_forum_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."village_forum_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "village_forum_posts" ADD CONSTRAINT "village_forum_posts_author_id_village_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."village_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "village_forum_topics" ADD CONSTRAINT "village_forum_topics_author_id_village_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."village_users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "village_sessions" ADD CONSTRAINT "village_sessions_user_id_village_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."village_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_posts_topic_idx" ON "village_forum_posts" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_posts_author_idx" ON "village_forum_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_posts_created_idx" ON "village_forum_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_topics_category_idx" ON "village_forum_topics" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_topics_last_posted_idx" ON "village_forum_topics" USING btree ("last_posted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_topics_author_idx" ON "village_forum_topics" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_sessions_user_idx" ON "village_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_sessions_expiry_idx" ON "village_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "village_users_email_unique" ON "village_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "village_users_callsign_unique" ON "village_users" USING btree ("callsign");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "village_users_last_seen_idx" ON "village_users" USING btree ("last_seen_at");
