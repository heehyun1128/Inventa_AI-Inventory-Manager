import axios from "axios";

// Function to upload the image to OpenAI's API
export const uploadImageToOpenAI = async (imageURL: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your OpenAI API key

  try {
    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this image" },
          {
            type: "image_url",
            image_url: {
              url: imageURL, 
              detail: "low",
            },
          },
        ],
      },
    ];

    const response = await axios.post("/api/image", { messages }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response from OpenAI:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
