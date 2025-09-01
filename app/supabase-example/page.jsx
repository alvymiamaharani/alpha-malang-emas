// File: app/supabase-example/page.jsx
"use client";

import { useEffect, useState } from "react";
import { TodoForm } from "./todo-form";
import { TodoList } from "./todo-list";
import { supabase } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  async function getTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  const refresh = async () => setTodos(await getTodos());

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl py-10 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-6">Supabase Example - (Todos)</h1>

      <TodoForm onSuccess={refresh} />
      {todos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">All tasks</h2>
          <TodoList todos={todos} onChange={refresh} />
        </section>
      )}
    </main>
  );
}