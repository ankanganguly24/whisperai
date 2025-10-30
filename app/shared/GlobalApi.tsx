import axios from "axios";

export const AIChatModel = async (messages: any) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_KRAVIX_STUDIO_API_KEY;
    
    if (!apiKey) {
      console.error("API Key is missing! Check your .env file");
      return { 
        role: "assistant", 
        content: "Error: API key not configured" 
      };
    }

    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      {
        message: messages,
        aiModel: "gpt-4.1-mini",
        outputType: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    console.log("API Response:", response.data);

    const aiResponseText = response.data.aiResponse || response.data.response || response.data.content;

    return {
      role: "assistant",
      content: aiResponseText,
    };
  } catch (error: any) {
    console.error("API Error:", error.response?.status, error.response?.data);
    return {
      role: "assistant",
      content: "Sorry, I couldn't process that. Please try again.",
    };
  }
};