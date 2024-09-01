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
      return NextResponse.json({
        error: "OpenAI API key is missing",
        success: false,
      });
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
              text: `Analyze the text in the provided image and extract the following information as a JSON object:
                    SKU: The SKU number, which follows the text 'sku number:', 'sku:', or is the first alphanumeric code in the text.
                    Name: The Name of the item, typically is something in the inventory, like device,tool, accessaries
                    Price: The price, which is in the format of a dollar sign followed by a numeric value, such as '$99.99'.
                    Location: The location, which is typically a word like 'Aisle' followed by a number.
                    The image text may vary in format, but it will always contain these three pieces of information. Return the extracted information in this JSON format:

                    {
                      "name":"extracted_name",
                      "sku": "extracted_sku_value",
                      "price": "extracted_price_value",
                      "location": "extracted_location_value"
                    }
              `,
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
    console.log(response.choices[0].message);
    // Return the response
    return NextResponse.json({ object: response.choices[0].message.content });
  } catch (err) {
    console.error("Error processing request:", err);

    return NextResponse.json({ error: `System Error: ${err}`, success: false });
  }
}
