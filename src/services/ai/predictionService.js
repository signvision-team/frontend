const AI_API = import.meta.env.VITE_AI_API || "https://detection-dcmj.onrender.com";

export const predictSign = async (features) => {
  try {
    const res = await fetch(AI_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Prediction failed");

    return data.prediction;
  } catch (error) {
    console.error(error);
    return null;
  }
};