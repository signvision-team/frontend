import React, { useState, useRef, useEffect } from "react";
import { Camera as CameraIcon, ArrowLeft } from "lucide-react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const API_URL = "https://detection-dcmj.onrender.com/predict";

const DetectionPage = ({ navigate }) => {
    const [isActive, setIsActive] = useState(false);
    const [prediction, setPrediction] = useState("");
    const [sentence, setSentence] = useState("");

    const videoRef = useRef(null);
    const cameraRef = useRef(null);
    const handsRef = useRef(null);

    const lastApiCall = useRef(0);
    const predictionBufferRef = useRef([]);

    const lastHandTime = useRef(Date.now());
    const isPaused = useRef(false);
    const lastSpoken = useRef("");

    const speak = (text) => {
        if (!text || text === lastSpoken.current) return;

        lastSpoken.current = text;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const getStablePrediction = (buffer) => {
        if (!buffer.length) return "";

        const freq = {};
        buffer.forEach((p) => (freq[p] = (freq[p] || 0) + 1));

        return Object.keys(freq).reduce((a, b) =>
            freq[a] > freq[b] ? a : b
        );
    };

    const startDetection = () => setIsActive(true);

    const stopDetection = () => {
        setIsActive(false);

        const finalWord = getStablePrediction(predictionBufferRef.current);

        if (finalWord) {
            setSentence((prev) => (prev ? prev + " " + finalWord : finalWord));
            speak(finalWord);
        }

        if (cameraRef.current) cameraRef.current.stop();
    };

    useEffect(() => {
        if (!isActive) return;

        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        handsRef.current = hands;

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        hands.onResults(async (results) => {
            if (!results.multiHandLandmarks?.length) {
                const diff = Date.now() - lastHandTime.current;

                if (diff > 1200 && !isPaused.current) {
                    const finalWord = getStablePrediction(
                        predictionBufferRef.current
                    );

                    if (finalWord) {
                        setSentence((prev) =>
                            prev ? prev + " " + finalWord : finalWord
                        );
                        speak(finalWord);
                    }

                    predictionBufferRef.current = [];
                    isPaused.current = true;
                    setPrediction("...pause...");
                }

                return;
            }

            lastHandTime.current = Date.now();
            isPaused.current = false;

            const landmarks = results.multiHandLandmarks[0];
            if (!landmarks || landmarks.length !== 21) return;

            const features = landmarks.flatMap((lm) => [lm.x, lm.y]);

            const now = Date.now();
            if (now - lastApiCall.current < 300) return;
            lastApiCall.current = now;

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ features }),
                });

                const data = await res.json();

                if (data.prediction) {
                    predictionBufferRef.current.push(data.prediction);

                    if (predictionBufferRef.current.length > 10) {
                        predictionBufferRef.current.shift();
                    }

                    const stable = getStablePrediction(
                        predictionBufferRef.current
                    );

                    setPrediction(stable);
                }
            } catch (err) {
                console.log("API ERROR:", err);
            }
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await hands.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
        });

        camera.start();
        cameraRef.current = camera;

        return () => {
            camera.stop();
            hands.close?.();
        };
    }, [isActive]);

    return (
        <div className="detection-page-wrapper">
            <div className="detection-card">

                <div className="detection-header">
                    <h2>Real-time Detection</h2>
                </div>

                <div className="video-area">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: "100%", borderRadius: "12px" }}
                    />

                    {!isActive && (
                        <div className="camera-off-state">
                            <CameraIcon size={50} />
                            <p>Camera Off</p>
                        </div>
                    )}
                </div>

                <div className="model-status-text">
                    {isActive ? prediction : "Start camera"}
                </div>

                <div className="sentence-box">
                    <strong>Sentence:</strong> {sentence}
                </div>

                <div
  className="btn-group"
  style={{
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "25px",
    flexWrap: "wrap"
  }}
>
  {/* START / STOP BUTTON */}
  <button
    onClick={
      isActive
        ? stopDetection
        : startDetection
    }
    style={{
      background: isActive
        ? "linear-gradient(135deg, #ff4d4d, #d93636)"
        : "linear-gradient(135deg, #4a67ff, #6d83ff)",
      color: "#fff",
      border: "none",
      padding: "14px 30px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "0.95rem",
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minWidth: "150px",
      transition: "all 0.3s ease",
      boxShadow: isActive
        ? "0 10px 25px rgba(255,77,77,0.35)"
        : "0 10px 25px rgba(74,103,255,0.35)"
    }}
  >
    {isActive ? "Stop Detection" : "Start Detection"}
  </button>

  {/* BACK BUTTON */}
  <button
    onClick={() =>
      navigate("DASHBOARD")
    }
    style={{
      background:
        "rgba(255,255,255,0.06)",
      color: "#fff",
      border:
        "1px solid rgba(255,255,255,0.12)",
      padding: "14px 26px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minWidth: "140px",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease"
    }}
  >
    
    Back
  </button>
</div>

            </div>
        </div>
    );
};

export default DetectionPage;