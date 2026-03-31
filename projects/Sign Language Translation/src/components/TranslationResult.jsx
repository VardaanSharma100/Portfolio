import React from 'react'

const TranslationResult = ({ result, error, isLoading }) => {
    return (
        <div className="result-section">
            <h2>Translation Result</h2>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {isLoading && (
                <div className="loading">
                    <span className="loading-spinner"></span>
                    <span>Processing video...</span>
                </div>
            )}

            {result && !isLoading && (
                <div className="result-content">
                    <div className="result-title">Generated Text:</div>
                    <div className="result-text">"{result}"</div>
                    <div className="success-message">
                        ✓ Translation completed successfully
                    </div>
                </div>
            )}

            {!result && !error && !isLoading && (
                <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    paddingTop: '2rem'
                }}>
                    <p style={{ fontSize: '1.2rem' }}>Upload a video to see the translation here</p>
                </div>
            )}
        </div>
    )
}

export default TranslationResult
