import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/projects/deepfake-detection';

const CharcoalTheme = {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceHover: '#2a2a2a',
    primary: '#f5f5f5',
    secondary: '#a0a0a0',
    accent: '#2563eb', // A slight blue accent for success/actions
    error: '#cf6679',
};

function Scene() {
    return (
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh', background: CharcoalTheme.background }}
            camera={{ position: [0, 0, 1] }}
        >
            <ambientLight intensity={0.5} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Canvas>
    );
}

function App() {
    const [option, setOption] = useState(null);
    const [textQuery, setTextQuery] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const options = ['Text', 'Image', 'Audio', 'Video'];

    const resetState = () => {
        setTextQuery('');
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const handleOptionSelect = async (opt) => {
        setOption(opt);
        resetState();
        if (opt === 'Image') {
            try {
                const response = await fetch('./placeholder.jpg');
                const blob = await response.blob();
                const defaultFile = new File([blob], 'placeholder.jpg', { type: 'image/jpeg' });
                setFile(defaultFile);
                setPreviewUrl('./placeholder.jpg');
            } catch (e) {
                console.error('Failed to load placeholder image', e);
            }
        } else if (opt === 'Text') {
            setTextQuery('is Benjamin Netanyahu dead');
        }
    };

    const checkText = async () => {
        if (!textQuery.trim()) {
            setError('Please enter some text before checking');
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/check-text`, { query: textQuery });
            setResult(res.data.result);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error occurred');
        }
        setLoading(false);
    };

    const checkMedia = async (endpoint) => {
        if (!file) {
            setError('Please upload a file before checking');
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API_BASE_URL}/api/${endpoint}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(res.data.result);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error occurred');
        }
        setLoading(false);
    };

    return (
        <>
            <Scene />
            <div className="app-container">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="main-title"
                >
                    Deepfake Detection
                </motion.h1>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, maxWidth: option === 'Image' ? 800 : 600 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="content-box"
                    style={{
                        background: CharcoalTheme.surface,
                        border: `1px solid ${CharcoalTheme.surfaceHover}`,
                        margin: '0 auto',
                    }}
                >
                    <div className="options-container">
                        <p className="options-subtitle">Choose the type of data you want to check:</p>
                        <div className="options-grid">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect(opt)}
                                    className="option-button"
                                    style={{
                                        background: option === opt ? CharcoalTheme.primary : 'transparent',
                                        color: option === opt ? CharcoalTheme.background : CharcoalTheme.primary,
                                        border: `2px solid ${CharcoalTheme.primary}`,
                                        fontWeight: option === opt ? 'bold' : 'normal',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {option && (
                            <motion.div
                                key={option}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="section-title" style={{ borderBottom: `1px solid ${CharcoalTheme.surfaceHover}` }}>
                                    {option === 'Text' ? 'Text News Verification' :
                                        option === 'Audio' ? 'Audio News Verification' :
                                            option === 'Image' ? 'Image Deepfake Detection' : 'Video Deepfake Detection'}
                                </h2>

                                <div className="input-group">
                                    {option === 'Text' ? (
                                        <textarea
                                            rows={5}
                                            className="text-input"
                                            placeholder="is Benjamin Netanyahu dead"
                                            value={textQuery}
                                            onChange={(e) => setTextQuery(e.target.value)}
                                            style={{
                                                background: CharcoalTheme.background,
                                                border: `1px solid ${CharcoalTheme.surfaceHover}`,
                                                color: CharcoalTheme.primary,
                                            }}
                                        />
                                    ) : (
                                        <div className="file-drop-area" style={{
                                            border: `2px dashed ${CharcoalTheme.surfaceHover}`,
                                            background: CharcoalTheme.background,
                                            padding: option === 'Image' ? '1rem' : '2rem',
                                            textAlign: 'center'
                                        }}>
                                            <label style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
                                                {option === 'Image' && previewUrl ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }} />
                                                        <div style={{ background: CharcoalTheme.surfaceHover, padding: '0.5rem 1.5rem', borderRadius: '6px', border: `1px solid ${CharcoalTheme.primary}`, fontWeight: 'bold' }}>
                                                            Click to Change Image
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ background: CharcoalTheme.surfaceHover, padding: '0.5rem 1.5rem', borderRadius: '6px', border: `1px solid ${CharcoalTheme.primary}`, fontWeight: 'bold', display: 'inline-block' }}>
                                                        Click to upload {option} file
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept={
                                                        option === 'Audio' ? 'audio/mp3,audio/wav,audio/m4a' :
                                                            option === 'Image' ? 'image/jpeg,image/png,image/jpg' :
                                                                'video/mp4,video/avi,video/quicktime,video/x-matroska'
                                                    }
                                                    onChange={(e) => {
                                                        const f = e.target.files[0];
                                                        setFile(f);
                                                        if (f && option === 'Image') {
                                                            setPreviewUrl(URL.createObjectURL(f));
                                                        } else {
                                                            setPreviewUrl(null);
                                                        }
                                                    }}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            {file && <p style={{ marginTop: '1rem', color: CharcoalTheme.secondary }}>Selected: {file.name}</p>}
                                        </div>
                                    )}

                                    <button
                                        className="submit-button"
                                        onClick={() => {
                                            if (option === 'Text') checkText();
                                            else checkMedia(`check-${option.toLowerCase()}`);
                                        }}
                                        disabled={loading}
                                        style={{
                                            background: CharcoalTheme.primary,
                                            color: CharcoalTheme.background,
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {loading ? 'Analyzing...' : 'Check'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="message-box"
                                style={{
                                    color: CharcoalTheme.error,
                                    background: 'rgba(207, 102, 121, 0.1)',
                                    border: `1px solid ${CharcoalTheme.error}`
                                }}
                            >
                                Error: {error}
                            </motion.div>
                        )}

                        {result !== null && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="message-box"
                                style={{
                                    color: CharcoalTheme.primary,
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    border: `1px solid ${CharcoalTheme.accent}`
                                }}
                            >
                                <strong>Result: </strong> {typeof result === 'object' ? JSON.stringify(result) : result}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </div>
        </>
    );
}

export default App;
