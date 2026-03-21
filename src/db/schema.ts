/**
 * Database Schema — DakkapellenKosten.nl
 *
 * Lead generation marketplace: homeowners → leads → companies buy via credits.
 * CMS: articles, pages, media for content management.
 * All money values in CENTS (integer).
 */

import {
    pgTable,
    uuid,
    text,
    varchar,
    integer,
    boolean,
    timestamp,
    numeric,
    jsonb,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// Enums
// ============================================

export const userRoleEnum = pgEnum("user_role", ["company", "admin", "editor"]);

export const leadStatusEnum = pgEnum("lead_status", [
    "new",        // Just submitted, matching in progress
    "matching",   // Being matched to companies
    "available",  // Matched, awaiting company acceptance
    "fulfilled",  // Max companies accepted (3)
    "expired",    // No companies accepted in time
    "cancelled",  // Homeowner cancelled
]);

export const leadAcceptanceStatusEnum = pgEnum("lead_acceptance_status", [
    "notified",   // Company was notified
    "accepted",   // Company accepted (credits deducted)
    "declined",   // Company declined
    "contacted",  // Company contacted the customer
    "won",        // Project won
    "lost",       // Project lost
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "trialing", "active", "past_due", "canceled",
]);

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
    "purchase",   // Bought credits
    "spend",      // Spent on lead
    "refund",     // Admin refund
    "adjustment", // Admin adjustment
]);

export const dakkapelTypeEnum = pgEnum("dakkapel_type", [
    "prefab", "traditioneel", "weet_niet",
]);

export const breedteEnum = pgEnum("breedte_type", [
    "2m", "3m", "4m", "5m_plus", "weet_niet",
]);

export const materiaalEnum = pgEnum("materiaal_type", [
    "kunststof", "hout", "polyester", "aluminium", "weet_niet",
]);

export const timelineEnum = pgEnum("timeline_type", [
    "zo_snel_mogelijk", "1_3_maanden", "3_6_maanden", "6_plus_maanden", "weet_niet",
]);

export const contentStatusEnum = pgEnum("content_status", [
    "draft", "published", "scheduled",
]);

// ============================================
// Users (company accounts + admins + editors)
// ============================================

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("company"),
    emailVerified: timestamp("email_verified"),
    emailVerifyToken: varchar("email_verify_token", { length: 64 }),
    emailVerifyTokenExpiry: timestamp("email_verify_token_expiry"),
    resetToken: varchar("reset_token", { length: 64 }),
    resetTokenExpiry: timestamp("reset_token_expiry"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Companies (dakkapel specialists)
// ============================================

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique(),
    kvkNumber: varchar("kvk_number", { length: 20 }),
    vatId: varchar("vat_id", { length: 30 }),
    description: text("description"),
    logoUrl: text("logo_url"),
    coverImageUrl: text("cover_image_url"),

    // Contact
    phone: varchar("phone", { length: 30 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 255 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    postalCode: varchar("postal_code", { length: 10 }),

    // Matching profile
    latitude: numeric("latitude", { precision: 10, scale: 8 }),
    longitude: numeric("longitude", { precision: 11, scale: 8 }),
    serviceRadiusKm: integer("service_radius_km").default(30),

    // Capabilities
    specialisaties: text("specialisaties").array(),
    materialen: text("materialen").array(),
    certificeringen: text("certificeringen").array(),
    garantieTermijn: varchar("garantie_termijn", { length: 100 }),
    foundedYear: integer("founded_year"),
    yearsExperience: integer("years_experience"),

    // Rating & activity
    avgRating: numeric("avg_rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    avgResponseHrs: integer("avg_response_hrs"),
    isVerified: boolean("is_verified").default(false),
    isPublic: boolean("is_public").default(false),

    // Social
    instagramUrl: text("instagram_url"),
    facebookUrl: text("facebook_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
});

// ============================================
// Company Members (users ↔ companies)
// ============================================

export const companyMembers = pgTable("company_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull().default("owner"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Company Photos (portfolio)
// ============================================

export const companyPhotos = pgTable("company_photos", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: varchar("caption", { length: 120 }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Service Areas (company coverage zones)
// ============================================

export const serviceAreas = pgTable("service_areas", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    postalCodePrefix: varchar("postal_code_prefix", { length: 4 }).notNull(),
    city: varchar("city", { length: 100 }),
    province: varchar("province", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Leads (homeowner quote requests)
// ============================================

export const leads = pgTable("leads", {
    id: uuid("id").defaultRandom().primaryKey(),
    publicToken: varchar("public_token", { length: 64 }).notNull().unique(),
    status: leadStatusEnum("status").notNull().default("new"),

    // Customer info
    naam: varchar("naam", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    telefoon: varchar("telefoon", { length: 30 }).notNull(),
    postcode: varchar("postcode", { length: 7 }).notNull(),
    city: varchar("city", { length: 100 }),

    // Project details
    dakkapelType: dakkapelTypeEnum("dakkapel_type").notNull(),
    breedte: breedteEnum("breedte").notNull(),
    materiaal: materiaalEnum("materiaal"),
    budgetMinCents: integer("budget_min_cents"),
    budgetMaxCents: integer("budget_max_cents"),
    timeline: timelineEnum("timeline"),
    extraNotes: text("extra_notes"),
    photoUrl: text("photo_url"),

    // Location (resolved from postcode)
    latitude: numeric("latitude", { precision: 10, scale: 8 }),
    longitude: numeric("longitude", { precision: 11, scale: 8 }),

    // Matching
    matchCount: integer("match_count").default(0),
    acceptCount: integer("accept_count").default(0),

    // Fraud protection
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),

    // Assignment
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    followUpAt: timestamp("follow_up_at"),
});

// ============================================
// Lead Matches (companies matched to a lead)
// ============================================

export const leadMatches = pgTable("lead_matches", {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    matchScore: integer("match_score").default(0),
    distanceKm: numeric("distance_km", { precision: 6, scale: 1 }),
    status: leadAcceptanceStatusEnum("status").notNull().default("notified"),
    creditsCharged: integer("credits_charged").default(0),

    notifiedAt: timestamp("notified_at").defaultNow().notNull(),
    viewedAt: timestamp("viewed_at"),
    acceptedAt: timestamp("accepted_at"),
    declinedAt: timestamp("declined_at"),
    contactedAt: timestamp("contacted_at"),
    wonAt: timestamp("won_at"),
    lostAt: timestamp("lost_at"),
    declineReason: text("decline_reason"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    uniqueLeadCompany: uniqueIndex("lead_matches_lead_company_idx").on(table.leadId, table.companyId),
}));

// ============================================
// Subscriptions (Stripe yearly)
// ============================================

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }).unique(),
    plan: varchar("plan", { length: 50 }).notNull().default("standard"),
    status: subscriptionStatusEnum("status").notNull().default("trialing"),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
    trialEndsAt: timestamp("trial_ends_at"),
    currentPeriodEnd: timestamp("current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Credit Balances (per company)
// ============================================

export const creditBalances = pgTable("credit_balances", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }).unique(),
    balance: integer("balance").notNull().default(0),
    totalPurchased: integer("total_purchased").notNull().default(0),
    totalSpent: integer("total_spent").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Credit Transactions (audit log)
// ============================================

export const creditTransactions = pgTable("credit_transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    type: creditTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    description: text("description"),

    leadMatchId: uuid("lead_match_id").references(() => leadMatches.id, { onDelete: "set null" }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    adminUserId: uuid("admin_user_id").references(() => users.id, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Reviews (customers reviewing companies)
// ============================================

export const reviews = pgTable("reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    leadMatchId: uuid("lead_match_id").references(() => leadMatches.id, { onDelete: "set null" }),
    authorName: varchar("author_name", { length: 100 }).notNull(),
    authorCity: varchar("author_city", { length: 100 }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// CMS: Articles (blog posts)
// ============================================

export const articles = pgTable("articles", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content"),
    featuredImage: text("featured_image"),
    category: varchar("category", { length: 100 }),

    // SEO
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),

    // Publishing
    status: contentStatusEnum("status").notNull().default("draft"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at"),
    scheduledAt: timestamp("scheduled_at"),

    // Soft delete
    deletedAt: timestamp("deleted_at"),
    deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// CMS: Pages (SEO landing pages)
// ============================================

export const pages = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    content: text("content"),
    featuredImage: text("featured_image"),

    // SEO
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    canonicalUrl: text("canonical_url"),
    structuredData: jsonb("structured_data"),

    // Location targeting
    city: varchar("city", { length: 100 }),
    service: varchar("service", { length: 100 }),

    // Publishing
    status: contentStatusEnum("status").notNull().default("draft"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at"),

    // Soft delete
    deletedAt: timestamp("deleted_at"),
    deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// CMS: Media Library
// ============================================

export const media = pgTable("media", {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    filename: varchar("filename", { length: 500 }).notNull(),
    altText: varchar("alt_text", { length: 500 }),
    mimeType: varchar("mime_type", { length: 100 }),
    sizeBytes: integer("size_bytes"),
    width: integer("width"),
    height: integer("height"),
    folder: varchar("folder", { length: 100 }),
    uploadedById: uuid("uploaded_by_id").references(() => users.id, { onDelete: "set null" }),

    // Soft delete
    deletedAt: timestamp("deleted_at"),
    deletedBy: uuid("deleted_by").references(() => users.id, { onDelete: "set null" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// CMS: Internal Links (structured tracking)
// ============================================

export const internalLinks = pgTable("internal_links", {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceType: varchar("source_type", { length: 20 }).notNull(),
    sourceId: uuid("source_id").notNull(),
    targetType: varchar("target_type", { length: 20 }).notNull(),
    targetId: uuid("target_id").notNull(),
    anchorText: varchar("anchor_text", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// CRM: Lead Notes
// ============================================

export const leadNotes = pgTable("lead_notes", {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Content Revisions (version history)
// ============================================

export const contentRevisions = pgTable("content_revisions", {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 20 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    revisionNumber: integer("revision_number").notNull(),
    title: varchar("title", { length: 500 }),
    content: text("content"),
    excerpt: text("excerpt"),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: text("seo_description"),
    metadata: jsonb("metadata"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
    entityRevision: uniqueIndex("content_revisions_entity_idx")
        .on(table.entityType, table.entityId, table.revisionNumber),
}));

// ============================================
// Audit Events (real audit trail)
// ============================================

export const auditEvents = pgTable("audit_events", {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    actorName: varchar("actor_name", { length: 255 }),
    action: varchar("action", { length: 50 }).notNull(),
    entityType: varchar("entity_type", { length: 30 }).notNull(),
    entityId: uuid("entity_id"),
    entityTitle: varchar("entity_title", { length: 500 }),
    diff: jsonb("diff"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Redirects (301 management)
// ============================================

export const redirects = pgTable("redirects", {
    id: uuid("id").defaultRandom().primaryKey(),
    fromPath: varchar("from_path", { length: 500 }).notNull().unique(),
    toPath: varchar("to_path", { length: 500 }).notNull(),
    statusCode: integer("status_code").notNull().default(301),
    hitCount: integer("hit_count").notNull().default(0),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Settings (key-value config)
// ============================================

export const settings = pgTable("settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Content Locks (prevents concurrent editing)
// ============================================

export const contentLocks = pgTable("content_locks", {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 20 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lockedAt: timestamp("locked_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
}, (table) => ({
    entityLock: uniqueIndex("content_locks_entity_idx").on(table.entityType, table.entityId),
}));

// ============================================
// Lead Tasks
// ============================================

export const leadTasks = pgTable("lead_tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    dueAt: timestamp("due_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
    companyMembers: many(companyMembers),
    articles: many(articles),
    pages: many(pages),
    media: many(media),
    leadNotes: many(leadNotes),
}));

export const companiesRelations = relations(companies, ({ many, one }) => ({
    members: many(companyMembers),
    photos: many(companyPhotos),
    serviceAreas: many(serviceAreas),
    leadMatches: many(leadMatches),
    subscription: one(subscriptions),
    creditBalance: one(creditBalances),
    creditTransactions: many(creditTransactions),
    reviews: many(reviews),
}));

export const companyMembersRelations = relations(companyMembers, ({ one }) => ({
    company: one(companies, { fields: [companyMembers.companyId], references: [companies.id] }),
    user: one(users, { fields: [companyMembers.userId], references: [users.id] }),
}));

export const companyPhotosRelations = relations(companyPhotos, ({ one }) => ({
    company: one(companies, { fields: [companyPhotos.companyId], references: [companies.id] }),
}));

export const serviceAreasRelations = relations(serviceAreas, ({ one }) => ({
    company: one(companies, { fields: [serviceAreas.companyId], references: [companies.id] }),
}));

export const leadsRelations = relations(leads, ({ many }) => ({
    matches: many(leadMatches),
    notes: many(leadNotes),
    tasks: many(leadTasks),
}));

export const leadMatchesRelations = relations(leadMatches, ({ one }) => ({
    lead: one(leads, { fields: [leadMatches.leadId], references: [leads.id] }),
    company: one(companies, { fields: [leadMatches.companyId], references: [companies.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    company: one(companies, { fields: [subscriptions.companyId], references: [companies.id] }),
}));

export const creditBalancesRelations = relations(creditBalances, ({ one }) => ({
    company: one(companies, { fields: [creditBalances.companyId], references: [companies.id] }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
    company: one(companies, { fields: [creditTransactions.companyId], references: [companies.id] }),
    leadMatch: one(leadMatches, { fields: [creditTransactions.leadMatchId], references: [leadMatches.id] }),
    adminUser: one(users, { fields: [creditTransactions.adminUserId], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    company: one(companies, { fields: [reviews.companyId], references: [companies.id] }),
    leadMatch: one(leadMatches, { fields: [reviews.leadMatchId], references: [leadMatches.id] }),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
    author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
    author: one(users, { fields: [pages.authorId], references: [users.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
    uploadedBy: one(users, { fields: [media.uploadedById], references: [users.id] }),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
    lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
    author: one(users, { fields: [leadNotes.authorId], references: [users.id] }),
}));

export const contentRevisionsRelations = relations(contentRevisions, ({ one }) => ({
    author: one(users, { fields: [contentRevisions.authorId], references: [users.id] }),
}));

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
    actor: one(users, { fields: [auditEvents.actorId], references: [users.id] }),
}));

export const redirectsRelations = relations(redirects, ({ one }) => ({
    creator: one(users, { fields: [redirects.createdBy], references: [users.id] }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
    updater: one(users, { fields: [settings.updatedBy], references: [users.id] }),
}));

export const contentLocksRelations = relations(contentLocks, ({ one }) => ({
    user: one(users, { fields: [contentLocks.userId], references: [users.id] }),
}));

export const leadTasksRelations = relations(leadTasks, ({ one }) => ({
    lead: one(leads, { fields: [leadTasks.leadId], references: [leads.id] }),
    assignee: one(users, { fields: [leadTasks.assignedTo], references: [users.id] }),
}));
