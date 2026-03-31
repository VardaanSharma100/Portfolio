# Sign Language Translator Backend

A high-performance FastAPI backend for translating sign language videos to English text using deep learning model/

## Architecture

```
backend/
├── main.py                      # FastAPI application
├── pipelines/
│   ├── inference.py            # Translation pipeline
│   └── train.py                # Training script
├── models/
│   ├── caption_model.py        # Transformer model
│   └── __init__.py
├── preprocessing/
│   ├── caption_dataset.py      # Dataset handling
│   ├── collate.py              # Data collation
│   └── __init__.py
├── config/
│   ├── config.py               # Configuration
│   └── hyperparameters.py      # Hyperparameters
├── data/
│   ├── vocab.txt               # Vocabulary
│   ├── processed/              # Processed data
│   └── raw/                    # Raw data
├── weights/
│   └── caption_model.pth       # Model weights
├── scripts/
│   ├── creating_npy.py         # Create numpy files
│   ├── creating_vocab.py       # Create vocabulary
│   └── glossify_csv.py         # Glossify CSV
├── utils/
│   └── caption_dataloader.py   # Data loader
├── test/
│   └── evaluation.py           # Evaluation metrics
├── requirements.txt
├── .env.example
└── main.py
```

## Technology Stack

- **FastAPI** - Modern async Python web framework
- **Uvicorn** - ASGI server
- **PyTorch 2.0+** - Deep learning inference
- **MediaPipe 0.10.10** - Pose keypoint extraction
- **Groq API** - Fast LLM inference
- **NumPy/Pandas** - Data processing
- **Python 3.11**

## Features

🚀 **FastAPI Backend**
- RESTful API with automatic documentation
- Async request handling
- CORS support for frontend integration
- Error handling and validation

🧠 **Deep Learning Pipeline**
- **Encoder**: MediaPipe Holistic for multi-modal keypoint detection
  - Pose (33 landmarks)
  - Hand gestures (21 landmarks per hand)
  - Facial landmarks (20 lip points)
- **Decoder**: Transformer-based sequence-to-sequence model
- **Output**: Groq LLM for gloss-to-natural-text conversion

📹 **Video Processing**
- Support for MP4, MOV, AVI, MKV formats
- Real-time keypoint extraction at 12 FPS
- Confidence-based landmark filtering
- Automatic frame interpolation

🤖 **AI Translation**
- Custom transformer architecture
- Vocab size: 11,922 tokens
- Greedy decoding with temperature control
- Groq llama-3.1-8b-instant for semantic conversion

## Setup Instructions

### Prerequisites
- Python 3.11+
- Groq API key (https://console.groq.com)
- GPU support optional (CUDA-enabled for faster inference)

### Installation

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure API key:
```bash
cp .env.example .env
# Edit .env and add GROQ_API_KEY
```

5. Start server:
```bash
uvicorn main:app --reload
```

Server runs on `http://localhost:8000`

## API Documentation

Interactive API docs available at: `http://localhost:8000/docs`

### Endpoints

#### Health Check
```
GET /
```
Status and available endpoints.

#### Translate Video
```
POST /api/translate
Content-Type: multipart/form-data

Body:
{
  "file": <video_file>  # MP4, MOV, AVI, or MKV
}

Response:
{
  "status": "success",
  "translation": "The translated English sentence",
  "filename": "video.mp4"
}
```

#### Model Info
```
GET /api/models
```
Returns model architecture and configuration details.

## Configuration

### Environment Variables (.env)

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Model Hyperparameters (config/hyperparameters.py)

- `vocab_size`: 11922
- `enc_feat_dim`: 285 (pose + hands + lips dimensions)
- `bos_id`: 1 (Beginning of sequence token)
- `eos_id`: 2 (End of sequence token)
- `pad_id`: 0 (Padding token)
- `max_len`: 128 (Maximum sequence length)
- `temperature`: 0.8 (Sampling temperature)

### Server Configuration (main.py)

```python
# Change port
uvicorn.run(app, host="0.0.0.0", port=8000)

# Update CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deep Learning Pipeline

### 1. Keypoint Extraction

MediaPipe Holistic extracts 3D landmarks:
```
Pose:       33 landmarks × 3 (x,y,z) = 99 dims
Left Hand:  21 landmarks × 3 (x,y,z) = 63 dims
Right Hand: 21 landmarks × 3 (x,y,z) = 63 dims
Lips:       20 landmarks × 3 (x,y,z) = 60 dims
─────────────────────────────────────────────
Total:                              = 285 dims
```

Resampled to 12 FPS with confidence-based filtering.

### 2. Transformer Encoder
- Input: Variable-length keypoint sequences
- Processing: Multi-head self-attention with positional encoding
- Output: Encoded feature representation

### 3. Transformer Decoder
- Greedy decoding with temperature control
- Beam search compatible
- Token-by-token generation
- EOS token detection

### 4. Groq LLM Conversion
- Input: Gloss sequence (sign language tokens)
- Model: llama-3.1-8b-instant
- Output: Natural English sentence
- Prompt: Pre-configured for gloss-to-sentence conversion

## Performance

### Processing Times
- Keypoint extraction: 1-3 seconds (depends on video length)
- Model inference: 0.5-1 second (gloss generation)
- LLM conversion: 0.5-2 seconds (gloss-to-sentence)
- **Total: ~3-6 seconds per video**

### Optimization
- GPU acceleration: ~2x faster inference with CUDA
- Batch processing: Process multiple videos in parallel
- Model caching: Weights loaded once at startup
- Connection pooling: Efficient Groq API calls

## Training (Optional)

### Prepare Data
```bash
# Create numpy keypoint files
python scripts/creating_npy.py

# Generate vocabulary
python scripts/creating_vocab.py

# Glossify CSV labels
python scripts/glossify_csv.py
```

### Train Model
```bash
pip install tensorboard
python pipelines/train.py
```

Configuration in `config/config.py` and `config/hyperparameters.py`.

## Evaluation

```bash
python test/evaluation.py
```

Computes BLEU, METEOR, and other metrics.

## Deployment

### Production Server
```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment
```bash
export GROQ_API_KEY=your_key
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### MediaPipe Issues
```bash
pip install mediapipe==0.10.10 --force-reinstall
```

### Model Not Loading
- Verify `backend/weights/caption_model.pth` exists
- Check file size (should be ~100MB+)
- Try: `torch.load('weights/caption_model.pth')`

### Groq API Errors
- Verify API key validity
- Check rate limits in Groq dashboard
- Ensure internet connection

### Out of Memory
- Use GPU: Set `device = torch.device('cuda')`
- Process smaller videos
- Reduce batch size in training

### Port Already in Use
```bash
uvicorn main:app --port 8001
```

## API Testing

### With cURL
```bash
curl -X POST "http://localhost:8000/api/translate" \
  -F "file=@video.mp4"
```

### With Python
```python
import requests

with open('video.mp4', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/api/translate', files=files)
    print(response.json())
```

### Interactive Testing
Visit `http://localhost:8000/docs`

## Use Cases

- **Real-time Translation**: Process videos from webcam streams
- **Batch Processing**: Translate multiple videos efficiently
- **Model Inference**: Export trained models for production
- **Research**: Fine-tune on domain-specific sign language

## References

- **MediaPipe**: https://mediapipe.dev
- **PyTorch**: https://pytorch.org
- **Groq API**: https://console.groq.com
- **FastAPI**: https://fastapi.tiangolo.com
- **Sign Language Research**: ASL (American Sign Language) linguistics

## License

Proprietary - All rights reserved

## Support

For technical issues:
1. Check `http://localhost:8000/docs` for API details
2. Review backend logs from uvicorn output
3. Verify all dependencies: `pip list`
4. Test individual components in isolation
