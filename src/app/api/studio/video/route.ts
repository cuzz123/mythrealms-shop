import { NextRequest, NextResponse } from "next/server";

const VIDEO_API_URL = process.env.VIDEO_GEN_API_URL || "";
const VIDEO_API_KEY = process.env.VIDEO_GEN_API_KEY || "";
const PROVIDER = process.env.VIDEO_GEN_PROVIDER || "seedance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      negativePrompt,
      duration = 5,
      width = 1280,
      height = 720,
      seed,
      referenceImage,
      fps = 24,
    } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    if (!VIDEO_API_KEY || !VIDEO_API_URL) {
      return NextResponse.json(
        { success: false, error: "VIDEO_GEN_API_KEY or VIDEO_GEN_API_URL not configured" },
        { status: 500 }
      );
    }

    let videoUrl = "";
    let taskId: string | undefined;

    switch (PROVIDER) {
      case "seedance": {
        const res = await fetch(VIDEO_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VIDEO_API_KEY}`,
          },
          body: JSON.stringify({
            model: "seedance2.0",
            prompt,
            negative_prompt: negativePrompt,
            duration,
            width,
            height,
            seed,
            fps,
            reference_image: referenceImage,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Seedance video generation failed");
        videoUrl = data.video_url || data.data?.video_url || "";
        taskId = data.task_id || data.id;
        break;
      }

      case "kling": {
        const createRes = await fetch(VIDEO_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VIDEO_API_KEY}`,
          },
          body: JSON.stringify({
            model_name: "kling-v1-6",
            prompt,
            negative_prompt: negativePrompt,
            duration: String(duration),
            mode: "std",
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData.message || "Kling task creation failed");
        taskId = createData.data?.task_id;

        let attempts = 0;
        while (attempts < 60) {
          await new Promise((r) => setTimeout(r, 3000));
          const pollRes = await fetch(`${VIDEO_API_URL}/${taskId}`, {
            headers: { Authorization: `Bearer ${VIDEO_API_KEY}` },
          });
          const pollData = await pollRes.json();
          if (pollData.data?.task_status === "succeed") {
            videoUrl = pollData.data?.task_result?.videos?.[0]?.url || "";
            break;
          }
          if (pollData.data?.task_status === "failed") {
            throw new Error(pollData.data?.task_status_msg || "Kling generation failed");
          }
          attempts++;
        }
        if (!videoUrl) throw new Error("Video generation timed out");
        break;
      }

      default: {
        const res = await fetch(VIDEO_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${VIDEO_API_KEY}`,
          },
          body: JSON.stringify({
            prompt,
            negative_prompt: negativePrompt,
            duration,
            width,
            height,
            seed,
            fps,
            reference_image: referenceImage,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || data.message || "Video generation failed");
        videoUrl = data.video_url || data.videoUrl || data.url || "";
        taskId = data.task_id || data.taskId;
        break;
      }
    }

    return NextResponse.json({ success: true, videoUrl, taskId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
