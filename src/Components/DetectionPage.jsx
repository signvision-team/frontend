import React, { useState, useRef, useEffect } from "react";
import { Camera as CameraIcon, ArrowLeft } from "lucide-react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const API_URL = "https://detection-dcmj.onrender.com/predict";

let lastApiCall = 0;

const DetectionPage = ({ navigate }) => {
    const [isActive, setIsActive] = useState(false);
    const [prediction, setPrediction] = useState("");
    const [sentence, setSentence] = useState("");

    const predictionBufferRef = useRef([]);
    const cameraRef = useRef(null);

    const lastHandTime = useRef(Date.now());
    const isPaused = useRef(false);
    const lastSpoken = useRef("");

    // 🔊 Speech
    const speak = (text) => {
        if (!text || text === lastSpoken.current) return;

        lastSpoken.current = text;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    // 📊 Stable prediction
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

        setSentence((prev) => prev + " " + finalWord);

        speak(finalWord);

        if (cameraRef.current) cameraRef.current.stop();
    };

    useEffect(() => {
        if (!isActive || !window) return;

        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        hands.onResults(async (results) => {
            // 🧠 NO HAND DETECTED
            if (!results.multiHandLandmarks?.length) {
                const now = Date.now();
                const diff = now - lastHandTime.current;

                if (diff > 1200 && !isPaused.current) {
                    const finalWord = getStablePrediction(
                        predictionBufferRef.current
                    );

                    if (finalWord) {
                        setSentence((prev) => prev + " " + finalWord);
                        speak(finalWord);
                    }

                    predictionBufferRef.current = [];
                    isPaused.current = true;
                    setPrediction("...pause...");
                }

                return;
            }

            // 🟢 HAND DETECTED
            lastHandTime.current = Date.now();
            isPaused.current = false;

            const landmarks = results.multiHandLandmarks[0];

            if (!landmarks || landmarks.length !== 21) return;

            const features = [];
            landmarks.forEach((lm) => {
                features.push(lm.x, lm.y);
            });

            // ⏱ debounce API
            const now = Date.now();
            if (now - lastApiCall < 300) return;
            lastApiCall = now;

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

        const videoElement = document.querySelector("video");

        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480,
        });

        camera.start();
        cameraRef.current = camera;

        return () => {
            if (cameraRef.current) cameraRef.current.stop();
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
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: "100%",
                            borderRadius: "12px",
                        }}
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

                <div className="btn-group">
                    <button onClick={isActive ? stopDetection : startDetection}>
                        {isActive ? "Stop" : "Start"}
                    </button>

                    <button onClick={() => navigate("DASHBOARD")}>
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DetectionPage;