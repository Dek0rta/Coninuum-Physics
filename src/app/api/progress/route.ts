import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ProgressSchema = z.object({
  card_id: z.string().min(1),
  rating: z.enum(["again", "hard", "good", "easy"]),
});

const EASE_QUALITY: Record<string, number> = {
  again: 0,
  hard: 2,
  good: 4,
  easy: 5,
};

function nextInterval(
  interval: number,
  easeFactor: number,
  quality: number
): { interval: number; easeFactor: number } {
  const newEf = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  let newInterval: number;

  if (quality < 3) {
    newInterval = 1;
  } else if (interval === 0) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEf);
  }

  return { interval: newInterval, easeFactor: newEf };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { card_id, rating } = parsed.data;
    const quality = EASE_QUALITY[rating];

    // Get existing progress
    const { data: existing } = await supabase
      .from("flashcard_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("card_id", card_id)
      .maybeSingle();

    const currentInterval = existing?.interval ?? 0;
    const currentEf = existing?.ease_factor ?? 2.5;
    const currentReps = existing?.repetitions ?? 0;

    const { interval, easeFactor } = nextInterval(currentInterval, currentEf, quality);
    const nextReview = new Date(Date.now() + interval * 86400000).toISOString().split("T")[0];

    const upsertData = {
      user_id: user.id,
      card_id,
      ease_factor: easeFactor,
      interval,
      next_review: nextReview,
      repetitions: currentReps + 1,
    };

    if (existing) {
      await supabase
        .from("flashcard_progress")
        .update({ ease_factor: easeFactor, interval, next_review: nextReview, repetitions: currentReps + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("flashcard_progress").insert(upsertData);
    }

    return NextResponse.json({
      data: { interval, nextReview, easeFactor },
      error: null,
    });
  } catch (error) {
    console.error("Progress route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("flashcard_progress")
      .select("*")
      .eq("user_id", user.id)
      .lte("next_review", today);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
