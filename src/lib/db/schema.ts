import { pgTable, text, uuid, timestamp, date, integer, boolean, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── People ───────────────────────────────────────────────────────────────────

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  displayName: text("display_name"),
  email: text("email").unique(),
  role: text("role"),
  company: text("company"),
  relationship: text("relationship"),
  area: text("area"),
  preferredChannel: text("preferred_channel"),
  notes: text("notes"),
  aliases: text("aliases").array().default([]),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const peopleRelations = relations(people, ({ many }) => ({
  transcriptionParticipants: many(transcriptionParticipants),
  ownedProjects: many(projects),
  assignedTasks: many(tasks),
  commitments: many(commitments),
}))

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").references(() => people.id, { onDelete: "set null" }),
  status: text("status").default("active"),
  priority: text("priority").default("P2"),
  deadline: date("deadline"),
  description: text("description"),
  metaInstitucional: text("meta_institucional"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_projects_status").on(table.status),
])

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(people, { fields: [projects.ownerId], references: [people.id] }),
  tasks: many(tasks),
  decisions: many(decisions),
  commitments: many(commitments),
}))

// ─── Transcriptions ───────────────────────────────────────────────────────────

export const transcriptions = pgTable("transcriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  meetingDate: timestamp("meeting_date", { withTimezone: true }),
  rawContent: text("raw_content").notNull(),
  fileUrl: text("file_url"),
  fileFormat: text("file_format"),
  durationMinutes: integer("duration_minutes"),
  status: text("status").default("uploaded"),
  errorMessage: text("error_message"),
  aiModelUsed: text("ai_model_used"),
  tokenCount: integer("token_count"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const transcriptionsRelations = relations(transcriptions, ({ one, many }) => ({
  participants: many(transcriptionParticipants),
  minutes: one(minutes),
  tasks: many(tasks),
  decisions: many(decisions),
  commitments: many(commitments),
}))

// ─── Transcription Participants ───────────────────────────────────────────────

export const transcriptionParticipants = pgTable("transcription_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  transcriptionId: uuid("transcription_id").notNull().references(() => transcriptions.id, { onDelete: "cascade" }),
  personId: uuid("person_id").references(() => people.id, { onDelete: "set null" }),
  speakerName: text("speaker_name").notNull(),
  isConfirmed: boolean("is_confirmed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  uniqueIndex("uq_transcription_speaker").on(table.transcriptionId, table.speakerName),
  index("idx_transcription_participants_person").on(table.personId),
  index("idx_transcription_participants_transcription").on(table.transcriptionId),
])

export const transcriptionParticipantsRelations = relations(transcriptionParticipants, ({ one }) => ({
  transcription: one(transcriptions, { fields: [transcriptionParticipants.transcriptionId], references: [transcriptions.id] }),
  person: one(people, { fields: [transcriptionParticipants.personId], references: [people.id] }),
}))

// ─── Minutes ──────────────────────────────────────────────────────────────────

export const minutes = pgTable("minutes", {
  id: uuid("id").primaryKey().defaultRandom(),
  transcriptionId: uuid("transcription_id").notNull().unique().references(() => transcriptions.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  keyTopics: jsonb("key_topics").default([]),
  rawAiResponse: jsonb("raw_ai_response"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const minutesRelations = relations(minutes, ({ one, many }) => ({
  transcription: one(transcriptions, { fields: [minutes.transcriptionId], references: [transcriptions.id] }),
  tasks: many(tasks),
  decisions: many(decisions),
}))

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  transcriptionId: uuid("transcription_id").references(() => transcriptions.id, { onDelete: "set null" }),
  minutesId: uuid("minutes_id").references(() => minutes.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  assigneeId: uuid("assignee_id").references(() => people.id, { onDelete: "set null" }),
  assigneeName: text("assignee_name"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_tasks_assignee").on(table.assigneeId),
  index("idx_tasks_status").on(table.status),
  index("idx_tasks_due_date").on(table.dueDate),
])

export const tasksRelations = relations(tasks, ({ one }) => ({
  transcription: one(transcriptions, { fields: [tasks.transcriptionId], references: [transcriptions.id] }),
  minutesRecord: one(minutes, { fields: [tasks.minutesId], references: [minutes.id] }),
  assignee: one(people, { fields: [tasks.assigneeId], references: [people.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}))

// ─── Decisions ────────────────────────────────────────────────────────────────

export const decisions = pgTable("decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transcriptionId: uuid("transcription_id").references(() => transcriptions.id, { onDelete: "set null" }),
  minutesId: uuid("minutes_id").references(() => minutes.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  decidedBy: uuid("decided_by").references(() => people.id, { onDelete: "set null" }),
  decidedByName: text("decided_by_name"),
  impact: text("impact"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_decisions_transcription").on(table.transcriptionId),
])

export const decisionsRelations = relations(decisions, ({ one }) => ({
  transcription: one(transcriptions, { fields: [decisions.transcriptionId], references: [transcriptions.id] }),
  minutesRecord: one(minutes, { fields: [decisions.minutesId], references: [minutes.id] }),
  decidedByPerson: one(people, { fields: [decisions.decidedBy], references: [people.id] }),
  project: one(projects, { fields: [decisions.projectId], references: [projects.id] }),
}))

// ─── Commitments ──────────────────────────────────────────────────────────────

export const commitments = pgTable("commitments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  withWhomId: uuid("with_whom_id").references(() => people.id, { onDelete: "set null" }),
  deadline: date("deadline"),
  status: text("status").default("pending"),
  type: text("type"),
  context: text("context"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  transcriptionId: uuid("transcription_id").references(() => transcriptions.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("idx_commitments_deadline").on(table.deadline),
  index("idx_commitments_status").on(table.status),
])

export const commitmentsRelations = relations(commitments, ({ one }) => ({
  withWhom: one(people, { fields: [commitments.withWhomId], references: [people.id] }),
  project: one(projects, { fields: [commitments.projectId], references: [projects.id] }),
  transcription: one(transcriptions, { fields: [commitments.transcriptionId], references: [transcriptions.id] }),
}))
