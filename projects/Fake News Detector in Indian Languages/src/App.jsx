import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/projects/multilingual-news-detector";

function ParticleField() {
    const ref = useRef();
    const points = useMemo(() => {
        const arr = new Float32Array(1800);
        for (let i = 0; i < arr.length; i += 3) {
            arr[i] = (Math.random() - 0.5) * 14;
            arr[i + 1] = (Math.random() - 0.5) * 10;
            arr[i + 2] = (Math.random() - 0.5) * 6;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.03;
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    });

    return (
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.2}>
            <Points ref={ref} positions={points} stride={3}>
                <PointMaterial transparent color="#6f7880" size={0.028} sizeAttenuation depthWrite={false} />
            </Points>
        </Float>
    );
}

export default function App() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verdict, setVerdict] = useState("");
    const [sources, setSources] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const claimToVerify = text.trim() || "Is Benjamin Netanyahu Dead";

        setError("");
        setLoading(true);
        setVerdict("");
        setSources([]);

        try {
            const response = await fetch(`${API_BASE_URL}/api/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: claimToVerify }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Request failed");
            }

            setVerdict(data.verdict || "");
            setSources(Array.isArray(data.sources) ? data.sources : []);
        } catch (requestError) {
            setError(requestError.message || "Could not verify this claim right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="bg-canvas" aria-hidden="true">
                <Canvas camera={{ position: [0, 0, 6], fov: 58 }}>
                    <ambientLight intensity={0.35} />
                    <ParticleField />
                </Canvas>
            </div>

            <motion.main
                className="panel"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <motion.h1
                    className="title"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    News Checker
                </motion.h1>

                <motion.p
                    className="subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    Fake News Detector for Indian languages
                </motion.p>

                <form onSubmit={handleSubmit} className="checker-form">
                    <label htmlFor="news-input" className="label">
                        Paste news here:
                    </label>
                    <textarea
                        id="news-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Is Benjamin Netanyahu Dead"
                        rows={7}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Searching the web and verifying..." : "Check Veracity"}
                    </button>
                </form>

                {error && <p className="error-text">{error}</p>}

                {verdict && (
                    <motion.section
                        className="result-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <h2>Analysis Complete</h2>
                        <pre className="verdict-text">{verdict}</pre>

                        <details>
                            <summary>View Raw Search Sources</summary>
                            {sources.length > 0 ? (
                                <div className="source-list">
                                    {sources.map((source, idx) => (
                                        <pre key={idx}>{source}</pre>
                                    ))}
                                </div>
                            ) : (
                                <p>No web sources found.</p>
                            )}
                        </details>
                    </motion.section>
                )}
            </motion.main>
        </div>
    );
}
