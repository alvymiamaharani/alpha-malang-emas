// File: app/supabase-example/todo-form.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabaseUpload } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

export function TodoForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function addTodo({ title, description, image_url }) {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, description, image_url }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const onSubmit = async ({ title, description }) => {
    setLoading(true);
    let image_url = null;
    if (file) {
      const path = `todos/${Date.now()}_${file.name}`;
      image_url = await supabaseUpload(file, path);
    }
    await addTodo({ title, description, image_url });
    reset();
    setFile(null);
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Title"
            {...register("title")}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
          <Textarea
            placeholder="Description (optional)"
            {...register("description")}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add Todo"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
