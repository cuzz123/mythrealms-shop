import { NextRequest, NextResponse } from "next/server";

const IMAGE_API_URL = process.env.IMAGE_GEN_API_URL || "https://api.openai.com/v1/images/generations";
const IMAGE_API_KEY = process.env.IMAGE_GEN_API_KEY || "";
const PROVIDER = process.env.IMAGE_GEN_PROVIDER || "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      negativePrompt,
      width = 1024,
      height = 1024,
      seed,
      model,
      referenceImage,
    } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    if (!IMAGE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "IMAGE_GEN_API_KEY not configured" },
        { status: 500 }
      );
    }

    let imageUrl: string;

    switch (PROVIDER) {
      case "openai": {
        const res = await fetch(IMAGE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${IMAGE_API_KEY}`,
          },
          body: JSON.stringify({
            model: model || "dall-e-3",
            prompt,
            n: 1,
            size: `${width}x${height}`,
            response_format: "url",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "OpenAI image generation failed");
        imageUrl = data.data?.[0]?.url || "";
        break;
      }

      case "stability": {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "png");
        if (negativePrompt) formData.append("negative_prompt", negativePrompt);
        if (seed) formData.append("seed", String(seed));

        const res = await fetch(IMAGE_API_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${IMAGE_API_KEY}` },
          body: formData,
        });
        if (!res.ok) throw new Error(`Stability API error: ${res.statusText}`);
        const blob = await res.blob();
        imageUrl = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")}`;
        break;
      }

      case "volcano": {
        const res = await fetch(IMAGE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${IMAGE_API_KEY}`,
          },
          body: JSON.stringify({
            prompt,
            negative_prompt: negativePrompt,
            width,
            height,
            seed,
            model: model || "image2.0",
            reference_image: referenceImage,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Volcano image generation failed");
        imageUrl = data.data?.image_url || data.data?.url || "";
        break;
      }

      case "agnes": {
        // Agnes OpenAI-compatible chat API — generates image via prompt enhancement
        const res = await fetch(`${IMAGE_API_URL}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${IMAGE_API_KEY}`,
          },
          body: JSON.stringify({
            model: model || "agnes-text-v1.0",
            messages: [
              { role: "system", content: "You are an AI image URL finder. Based on the user's description, return a JSON object with a single key 'url' containing a valid Unsplash image URL that matches the description. Format: {\"url\": \"https://images.unsplash.com/...\"}. Return ONLY the JSON, no other text." },
              { role: "user", content: prompt },
            ],
            max_tokens: 300,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Agnes API error");
        const content = data.choices?.[0]?.message?.content || "";
        try {
          const parsed = JSON.parse(content);
          imageUrl = parsed.url || "";
        } catch {
          const urlMatch = content.match(/https?:\/\/[^\s"']+\.(png|jpg|jpeg|webp)/i);
          imageUrl = urlMatch ? urlMatch[0] : "";
        }
        if (!imageUrl) throw new Error("Agnes could not find a matching image URL");
        break;
      }

      default: {
        const res = await fetch(IMAGE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${IMAGE_API_KEY}`,
          },
          body: JSON.stringify({ prompt, negative_prompt: negativePrompt, width, height, seed, model, reference_image: referenceImage }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Image generation failed");
        imageUrl = data.image_url || data.imageUrl || data.url || "";
        break;
      }
    }

    if (!imageUrl) throw new Error("No image URL returned from API");

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
