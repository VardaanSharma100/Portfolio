import React, { useRef } from 'react'

const VideoUploader = ({ onFileSelect, videoPreview }) => {
    const fileInputRef = useRef(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
            if (validTypes.includes(file.type)) {
                onFileSelect(file)
            } else {
                alert('Only MP4, MOV, AVI, MKV supported')
            }
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('dragover')
    }

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('dragover')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('dragover')

        const files = e.dataTransfer?.files
        if (files && files.length > 0) {
            const file = files[0]
            const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
            if (validTypes.includes(file.type)) {
                onFileSelect(file)
            } else {
                alert('Only MP4, MOV, AVI, MKV supported')
            }
        }
    }

    return (
        <div
            className="upload-area"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="upload-icon">📹</div>
            <div className="upload-text">Drag video or click</div>
            <div className="upload-hint">MP4, MOV, AVI, MKV</div>
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
            />
        </div>
    )
}

export default VideoUploader
