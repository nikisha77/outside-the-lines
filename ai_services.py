"""Open-model and media services used by the Streamlit app."""

from __future__ import annotations

import hashlib
import io
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance


ROOT = Path(__file__).parent
COMIC_PATH = ROOT / "assets" / "comic-stories.png"
CACHE_DIR = ROOT / ".cache"


def _panel_image(panel: int) -> Image.Image:
    image = Image.open(COMIC_PATH).convert("RGB")
    width, height = image.size
    gutter = max(4, width // 160)
    panel_width = width // 3
    left = panel * panel_width + gutter
    right = (panel + 1) * panel_width - gutter
    return image.crop((left, gutter, right, height - gutter))


def animated_scene(panel: int, chapter: int, size: tuple[int, int] = (900, 560)) -> bytes:
    """Create a compact animated WebP entirely in Python.

    Each chapter has its own camera rhythm: anticipation, action, and impact.
    The motion is deliberately comic-book-like while generated model frames can
    later replace the source panel without changing the interface.
    """
    source = _panel_image(panel)
    target_w, target_h = size
    frames: list[Image.Image] = []
    count = 20

    for index in range(count):
        phase = index / count
        wave = np.sin(phase * np.pi * 2)
        if chapter == 0:
            zoom = 1.02 + 0.035 * phase
            dx, dy = int(6 * wave), int(-3 * phase)
        elif chapter == 1:
            zoom = 1.07 + 0.025 * wave
            dx, dy = int(-22 * phase), int(5 * wave)
        else:
            impact = max(0.0, 1 - abs(phase - 0.48) * 8)
            zoom = 1.04 + 0.05 * impact
            dx, dy = int(10 * wave * impact), int(7 * np.cos(phase * 8 * np.pi) * impact)

        ratio = max(target_w / source.width, target_h / source.height) * zoom
        resized = source.resize((int(source.width * ratio), int(source.height * ratio)), Image.Resampling.LANCZOS)
        left = max(0, (resized.width - target_w) // 2 + dx)
        top = max(0, (resized.height - target_h) // 2 + dy)
        frame = resized.crop((left, top, left + target_w, top + target_h))
        frame = ImageEnhance.Color(frame).enhance(1.03)

        draw = ImageDraw.Draw(frame, "RGBA")
        if chapter == 1:
            for n in range(4):
                y = 390 + n * 25
                draw.arc((55 - n * 8, y, 260 + n * 18, y + 55), 190, 342, fill=(255, 255, 255, 115), width=4)
        if chapter == 2 and 0.38 < phase < 0.64:
            cx, cy = target_w // 2, target_h // 2
            for radius in (115, 150, 185):
                draw.arc((cx-radius, cy-radius, cx+radius, cy+radius), 205, 330, fill=(255, 222, 91, 130), width=5)
        frames.append(frame)

    output = io.BytesIO()
    frames[0].save(output, format="WEBP", save_all=True, append_images=frames[1:], duration=72, loop=0, quality=82)
    return output.getvalue()


def identify_photo(uploaded_bytes: bytes, labels: list[str] | None = None) -> str:
    """Describe an outdoor photo locally with the open CLIP model.

    Importing the model lazily keeps startup quick and allows the story to remain
    playable before the weights have been downloaded.
    """
    candidates = labels or [
        "a leaf", "a twig", "a stone", "a flower", "grass", "tree bark",
        "a seed pod", "a feather", "a path", "a shadow pattern",
    ]
    try:
        import open_clip
        import torch

        model, _, preprocess = open_clip.create_model_and_transforms(
            "ViT-B-32", pretrained="laion2b_s34b_b79k"
        )
        tokenizer = open_clip.get_tokenizer("ViT-B-32")
        image = preprocess(Image.open(io.BytesIO(uploaded_bytes)).convert("RGB")).unsqueeze(0)
        text = tokenizer(candidates)
        with torch.inference_mode():
            image_features = model.encode_image(image)
            text_features = model.encode_text(text)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            scores = (100 * image_features @ text_features.T).softmax(dim=-1)
        return candidates[int(scores.argmax())]
    except Exception:
        return "outdoor discovery"


def narration(text: str, voice: str = "af_heart") -> bytes | None:
    """Generate natural speech using the open-weight Kokoro model."""
    try:
        # Standard HTTP is more reliable than the optional Xet transfer helper
        # on small local setups, and finite timeouts keep the UI responsive.
        os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
        os.environ.setdefault("HF_HUB_ETAG_TIMEOUT", "15")
        os.environ.setdefault("HF_HUB_DOWNLOAD_TIMEOUT", "45")
        import soundfile as sf
        from kokoro import KPipeline

        CACHE_DIR.mkdir(exist_ok=True)
        digest = hashlib.sha256(f"{voice}:{text}".encode()).hexdigest()[:18]
        cached = CACHE_DIR / f"voice-{digest}.wav"
        if cached.exists():
            return cached.read_bytes()

        pipeline = KPipeline(lang_code="a")
        chunks = [audio for _, _, audio in pipeline(text, voice=voice, speed=0.95)]
        if not chunks:
            return None
        audio = np.concatenate(chunks)
        sf.write(cached, audio, 24000, format="WAV")
        return cached.read_bytes()
    except Exception:
        return None

