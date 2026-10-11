# Outside the Lines

A Streamlit adventure that turns three real-world discoveries into a moving,
hand-drawn story. The application stack is Python from end to end.

## Open models

- **OpenCLIP ViT-B/32** interprets trail photos in Python.
- **Kokoro-82M** performs the narration with a natural voice in Python.
- **Pillow** creates chapter-specific animated WebP scenes in Python.

No Gemini, proprietary model API, JavaScript application, Node build, account,
or location tracker is required. Model weights are fetched once and cached.

## Run

```bash
cd outside-the-lines
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/streamlit run app.py
```

Open <http://localhost:8501>. The story itself works immediately. OpenCLIP and
Kokoro download their model weights the first time their features are used.

## Structure

- `app.py` — Streamlit screens, navigation, session state, and UI
- `story_data.py` — all three stories and their outdoor missions
- `ai_services.py` — animation, photo understanding, and narration
- `assets/` — the supplied comic reference art and its story panels
- `requirements.txt` — the complete Python environment
