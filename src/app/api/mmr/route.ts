import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { applyMmrDelta } from "@/lib/mmr";

const MmrUpdateSchema = z.object({
  question_id: z.string().min(1),
  topic: z.enum(["mechanics", "electricity", "waves", "thermodynamics"]),
  correct: z.boolean(),
  difficulty: z.number().int().min(100).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = MmrUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("mmr, rank, streak, last_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { question_id, topic, correct, difficulty } = parsed.data;
    const mmrResult = applyMmrDelta(profile.mmr, difficulty, correct);

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastActive = profile.last_active;
    let newStreak = profile.streak;

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (lastActive === yesterday) {
        newStreak = profile.streak + 1;
      } else if (!lastActive) {
        newStreak = 1;
      } else {
        newStreak = 1; // streak broken
      }
    }

    // Batch update profile and insert attempt
    const [updateResult, attemptResult] = await Promise.all([
      supabase
        .from("profiles")
        .update({
          mmr: mmrResult.after,
          rank: mmrResult.rankChanged ? mmrResult.newRank : profile.rank,
          streak: newStreak,
          last_active: today,
        })
        .eq("id", user.id),

      supabase.from("quiz_attempts").insert({
        user_id: user.id,
        topic,
        question_id,
        correct,
        mmr_before: mmrResult.before,
        mmr_after: mmrResult.after,
        mmr_delta: mmrResult.delta,
      }),
    ]);

    if (updateResult.error) {
      console.error("Profile update error:", updateResult.error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        mmr_before: mmrResult.before,
        mmr_after: mmrResult.after,
        mmr_delta: mmrResult.delta,
        rank_changed: mmrResult.rankChanged,
        new_rank: mmrResult.newRank,
        streak: newStreak,
      },
      error: null,
    });
  } catch (error) {
    console.error("MMR route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
