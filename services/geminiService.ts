
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

export async function mergeClothingItem(baseUserImage: string, clothingImage: string, itemCategory: string): Promise<string> {
  if (!navigator.onLine) {
    throw new Error("اتصال اینترنت برقرار نیست. برای اعمال لباس، لطفاً به اینترنت متصل شوید.");
  }
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const parseDataUrl = (dataUrl: string) => {
      const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) throw new Error("Invalid image data URL format.");
      return { mimeType: match[1], data: match[2] };
    };

    const userImageData = parseDataUrl(baseUserImage);
    const clothingImageData = parseDataUrl(clothingImage);

    const userImagePart = { inlineData: userImageData };
    const clothingImagePart = { inlineData: clothingImageData };
    const textPart = {
      text: `Take the clothing item from the second image (a ${itemCategory}) and realistically place it onto the person in the first image. Ensure the final output is only the composed image, without any additional text or commentary.`
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [userImagePart, clothingImagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType: string = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("The API did not return an image.");

  } catch (error) {
    console.error("Error calling Gemini API for image merging:", error);
    if (error instanceof Error) {
        throw new Error(`Error merging images: ${error.message}`);
    }
    throw new Error("An unknown error occurred while merging the images.");
  }
}


export async function getStyleAdvice(imageBase64: string, userPrompt: string): Promise<string> {
  if (!navigator.onLine) {
    throw new Error("اتصال اینترنت برقرار نیست. برای استفاده از مشاوره هوش مصنوعی، لطفاً به اینترنت متصل شوید.");
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Extract base64 data and mime type from data URL
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image data URL format.");
    }
    const mimeType = match[1];
    const base64Data = match[2];
    
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    const textPart = {
      text: userPrompt
    };
    
    const systemInstruction = "You are a friendly and helpful fashion stylist from Iran. Analyze the user's photo where they are virtually trying on clothes. Provide constructive, positive, and encouraging feedback in Persian. Comment on the fit, color combination, and suggest occasions where the outfit might be suitable. Keep the tone light and conversational.";

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.9,
        }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The API returned an empty response.");
    }
    
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("یک خطای ناشناخته در ارتباط با دستیار هوش مصنوعی رخ داد.");
  }
}