CREATE TABLE "todos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" bigint NOT NULL
);
