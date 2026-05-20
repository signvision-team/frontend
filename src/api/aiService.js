const AI_API = import.meta.env.VITE_AI_API;

export const predictSign = async (features) => {
  try {
    // ✅ Validate input first
    if (!features || !Array.isArray(features)) {
      throw new Error("Invalid features input");
    }

    // ✅ Add timeout support
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec

    const res = await fetch(`${AI_API}/predict`, {
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
      throw new Error(data.message || "Prediction failed");
    }

    // ✅ safer extraction (handles different backend formats)
    const prediction =
      data.prediction || data.result || data.class || null;

    return prediction;
  } catch (error) {
    console.error("AI Prediction Error:", error.message);
    return null;
  }
};