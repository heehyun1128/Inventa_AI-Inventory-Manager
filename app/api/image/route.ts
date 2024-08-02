import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const reqBody = await req.json();
    const base64Image = reqBody.data;

    if (!openai.apiKey) {
      console.error("OpenAI API key is missing");
      return NextResponse.json({ error: 'OpenAI API key is missing', success: false });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create a brief description and details of all the items in this picture.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });
console.log(response.choices[0].message)
    // Return the response
    return NextResponse.json({ message: response.choices[0].message.content});
  } catch (err) {
    console.error("Error processing request:", err);

 
    return NextResponse.json({ error: `System Error: ${err}`, success: false });
  }
}
