import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY. Add it to .env.local." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages supplied." }, { status: 400 });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions:
        "You are Lumina, a helpful, concise AI assistant. Use clear formatting and practical answers. If you are unsure, say so.",
      input: messages.map((message: { role: "user" | "assistant"; content: string }) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return NextResponse.json({ message: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "The AI request failed. Check your API key and model name." },
      { status: 500 }
    );
  }
}