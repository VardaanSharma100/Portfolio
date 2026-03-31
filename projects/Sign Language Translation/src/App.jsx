import React, { useState } from 'react'
import VideoUploader from './components/VideoUploader'
import AnimationCanvas from './components/AnimationCanvas'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/projects/sign-language-translation'
const PLACEHOLDER_VIDEO = `${API_BASE_URL}/api/temp_videos/-_3bUhnn4PU_1-8-rgb_front.mp4`

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(PLACEHOLDER_VIDEO)

    const handleFileSelect = (file) => {
        setSelectedFile(file)
        setVideoPreviewUrl(URL.createObjectURL(file))
        setError(null)
        setResult(null)
    }

    const handleTranslate = async () => {
        if (!selectedFile && videoPreviewUrl !== PLACEHOLDER_VIDEO) {
            setError('Select a video first')
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            let response;
            if (selectedFile) {
                const formData = new FormData()
                formData.append('file', selectedFile)

                response = await axios.post(`${API_BASE_URL}/api/translate`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                // translate placeholder
                const formData = new FormData()
                formData.append('use_placeholder', 'true')
                response = await axios.post(`${API_BASE_URL}/api/translate`, formData)
            }

            if (response.data.status === 'success') {
                setResult(response.data.translation)
            } else {
                setError('Translation failed.')
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error processing video')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="overlay"></div>
            <AnimationCanvas />

            <div className="app-shell">
                <h1 className="main-title">Sign Language Translation</h1>

                <div className="panel">
                    <p className="subtitle">Choose the video you want to translate:</p>

                    <div className="video-player-container">
                        <video
                            src={videoPreviewUrl}
                            controls
                            width="100%"
                            style={{ borderRadius: '8px', marginBottom: '16px' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <VideoUploader onFileSelect={handleFileSelect} />

                    {selectedFile && (
                        <div className="file-info">
                            📂 {selectedFile.name} • {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                    )}

                    <button
                        onClick={handleTranslate}
                        disabled={(!selectedFile && videoPreviewUrl !== PLACEHOLDER_VIDEO) || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Translating...
                            </>
                        ) : (
                            'Translate'
                        )}
                    </button>

                    {error && (
                        <div className="error-message">
                            ✗ {error}
                        </div>
                    )}

                    {result && (
                        <div className="result-box">
                            <div className="result-text">"{result}"</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default App
