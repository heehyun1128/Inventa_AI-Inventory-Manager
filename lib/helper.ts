export const parsePicDescription = (description: string) => {
    try {
      const jsonStr = (description as any).object
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .trim();
  
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  export const renderParsedDescription = (parsedDescription: any) => {
    if (parsedDescription?.error) return parsedDescription.error;
    return parsedDescription?.sku;
  };
  