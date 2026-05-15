import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const Session = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => User.id)
});

export const Account = sqliteTable("accounts", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => User.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const Verification = sqliteTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
	updatedAt: integer("updated_at", { mode: "timestamp" })
});

export const Project = sqliteTable("projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	userId: text("user_id").notNull().references(() => User.id),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const Task = sqliteTable("tasks", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	status: text("status").notNull().default("todo"),
	priority: text("priority").notNull().default("medium"),
	projectId: text("project_id").notNull().references(() => Project.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => User.id),
	dueDate: integer("due_date", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});
