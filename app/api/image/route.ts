import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key is missing.", { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages,
      max_tokens: 1000,
    });

    return NextResponse.json(response.choices[0].message);
  } catch (e) {
    console.log("error:", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
