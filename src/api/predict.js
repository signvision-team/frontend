const API_URL = "https://detection-dcmj.onrender.com";

export const predictSign = async (features) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
    });

    const data = await res.json();
    return data.prediction;
  } catch (error) {
    console.error("API Error:", error);
    return "Error";
  }
};