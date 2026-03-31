# Fake News Detector in Indian Languages

This project is centered on a GenAI-powered FastAPI service that verifies news claims using web evidence and Gemini.

## Backend Focus

- Framework: FastAPI
- GenAI model: Gemini (`gemini-2.5-flash`)
- Web evidence source: DuckDuckGo search via `ddgs`
- Environment-based secret management via `.env`

## How The Backend Works

1. Client sends a claim to `POST /api/check`.
2. Service fetches related web results (`ddgs`).
3. Service builds a fact-checking prompt with claim + evidence.
4. Gemini generates a verdict summary in the user language when possible.
5. API returns:
	 - `verdict` (model output)
	 - `sources` (raw search context)

## API Endpoints

- `GET /health` -> service health status.
- `POST /api/check` -> claim verification endpoint.

Example request:

```json
{
	"text": "India has announced a nationwide internet blackout tomorrow."
}
```

Example response:

```json
{
	"verdict": "**VERDICT:** Misleading ...",
	"sources": ["SOURCE 1: ...", "SOURCE 2: ..."]
}
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Run API:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend URL: `http://127.0.0.1:8000`

## Minimal Frontend Note

Frontend exists in `frontend/` and consumes `POST /api/check`, but the primary logic and verification pipeline live in the FastAPI backend.
