const API_URL = "https://detection-dcmj.onrender.com";
const API_URL = import.meta.env.VITE_AI_API || "http://127.0.0.1:8000/predict";

export const predictSign = async (features) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec timeout

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Prediction failed from server");
    }

    if (!data || typeof data.prediction === "undefined") {
      throw new Error("Invalid response from AI model");
    }

    return data.prediction;
  } catch (error) {
    console.error("AI API Error:", error.message);

    if (error.name === "AbortError") {
      return "Timeout";
    }

    return "Error";
  }
};