// File: app/supabase-example/todo-list.jsx
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { supabaseDeleteByUrl } from "@/lib/supabase/storage";

export function TodoList({ todos, onChange }) {
  async function deleteTodo(id, image_url) {
    try {
      // 1. Hapus file dari bucket jika ada image_url
      if (image_url && image_url !== "null") {
        await supabaseDeleteByUrl(image_url);
      }

      // 2. Hapus todo dari tabel
      const { error: dbError } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);
      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }
    } catch (error) {
      console.error("Error deleting todo or file:", error);
      throw error;
    }
  }
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo.id}>
          <CardHeader>
            <CardTitle className="text-lg">{todo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todo.description && (
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>
            )}
            {todo.image_url && (
              <div className="relative aspect-video max-w-sm">
                <Image
                  src={todo.image_url}
                  alt={todo.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await deleteTodo(todo.id, todo.image_url);
                onChange();
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
