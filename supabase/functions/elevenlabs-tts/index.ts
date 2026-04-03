import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const { text, voiceId, mode } = await req.json();
  const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

  if (!ELEVENLABS_API_KEY) {
    return new Response(JSON.stringify({ error: "No API key" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let url: string;
    let body: Record<string, unknown>;

    if (mode === "music") {
      url = "https://api.elevenlabs.io/v1/music";
      body = { prompt: text, duration_seconds: 30 };
    } else if (mode === "sfx") {
      url = "https://api.elevenlabs.io/v1/sound-generation";
      body = { text, duration_seconds: 5, prompt_influence: 0.3 };
    } else {
      const vid = voiceId || "JBFqnCBsd6RMkjVDRZzb";
      url = `https://api.elevenlabs.io/v1/text-to-speech/${vid}?output_format=mp3_44100_128`;
      body = {
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.4,
          speed: 0.95,
        },
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = base64Encode(audioBuffer);

    return new Response(JSON.stringify({ audio: audioBase64 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
