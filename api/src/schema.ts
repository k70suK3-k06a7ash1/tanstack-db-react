import { pgTable, varchar, boolean, bigint } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: varchar('id').primaryKey(),
  text: varchar('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
})

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert