import { Elysia } from "elysia";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { todos, type Todo, type NewTodo } from './schema';
import { eq } from 'drizzle-orm';

// Load environment variables from .env file
import { config } from 'dotenv';
config({ path: '../.env' });

const connectionString = process.env.DATABASE_URL ?? "";
const client = postgres(connectionString);
const db = drizzle(client);

const app = new Elysia()
  .use((app) => 
    app.onRequest(({ set }) => {
      set.headers['Access-Control-Allow-Origin'] = '*';
      set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      set.headers['Access-Control-Allow-Headers'] = 'Content-Type';
    })
  )
  .options('*', ({ set }) => {
    set.headers['Access-Control-Allow-Origin'] = '*';
    set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    set.headers['Access-Control-Allow-Headers'] = 'Content-Type';
    return '';
  })
  .get("/", () => "Hello Elysia")
  .get("/todos", async () => {
    const allTodos = await db.select().from(todos);
    return allTodos;
  })
  .post("/todos", async ({ body }) => {
    const newTodo = body as NewTodo;
    const [insertedTodo] = await db.insert(todos).values(newTodo).returning();
    return insertedTodo;
  })
  .put("/todos/:id", async ({ params, body }) => {
    const updatedTodo = body as Partial<Todo>;
    const [result] = await db
      .update(todos)
      .set(updatedTodo)
      .where(eq(todos.id, params.id))
      .returning();
    return result;
  })
  .delete("/todos/:id", async ({ params }) => {
    await db.delete(todos).where(eq(todos.id, params.id));
    return { message: "Todo deleted" };
  })
  .listen(Number(process.env.PORT) || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
