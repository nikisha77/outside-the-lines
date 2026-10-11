"""Outside the Lines — a Python-only interactive outdoor story app."""

from __future__ import annotations

import html
from pathlib import Path

import streamlit as st

from ai_services import animated_scene, identify_photo, narration
from story_data import STORIES


ROOT = Path(__file__).parent

st.set_page_config(page_title="Outside the Lines", page_icon="🌿", layout="wide")

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,750&display=swap');
    :root { --ink:#17261f; --paper:#f5f0e4; --gold:#e5bc62; }
    .stApp { background: radial-gradient(circle at 80% 0%, #e8dcb5 0, transparent 28%), #f5f0e4; color:var(--ink); }
    [data-testid="stHeader"] { background:transparent; }
    .block-container { max-width:1180px; padding-top:2rem; padding-bottom:4rem; }
    h1,h2,h3 { font-family:'Fraunces',serif !important; letter-spacing:-.025em; }
    p,button,label,input { font-family:'DM Sans',sans-serif !important; }
    .brand { font:700 .78rem 'DM Sans'; letter-spacing:.23em; text-transform:uppercase; color:#506258; }
    .hero-title { font:750 clamp(3.1rem,8vw,7.2rem)/.86 'Fraunces'; letter-spacing:-.06em; max-width:900px; margin:.55rem 0 1.2rem; }
    .deck { font-size:1.15rem; line-height:1.65; max-width:680px; color:#45534b; }
    .story-card { min-height:180px; border:1px solid #b4b6a8; border-radius:22px; padding:1.35rem; background:#fffaf0; box-shadow:0 14px 35px #40504412; }
    .story-card h3 { font-size:1.55rem; margin:.35rem 0; }
    .eyebrow { font:700 .74rem 'DM Sans'; letter-spacing:.18em; text-transform:uppercase; color:#866b2e; }
    .chapter-title { font:750 clamp(2rem,4.5vw,4rem)/1.02 'Fraunces'; max-width:820px; margin:.4rem 0 1rem; }
    .chapter-copy { font:400 clamp(1rem,1.55vw,1.22rem)/1.72 'DM Sans'; max-width:760px; color:#34443b; }
    .mission { background:#15261f; color:#f7f1df; border-radius:20px; padding:1.3rem 1.5rem; margin:1.25rem 0; }
    .mission b { color:#efc76e; }
    [data-testid="stImage"] img { border-radius:22px; box-shadow:0 18px 55px #1b2c2440; }
    .stButton>button { border-radius:999px; min-height:3rem; padding:0 1.35rem; font-weight:700; border:1px solid #263d32; }
    .stButton>button[kind="primary"] { background:#1a3126; color:white; }
    .artifact { border-left:4px solid #e2b65d; padding:.65rem 1rem; background:#fffaf2; border-radius:0 14px 14px 0; }
    </style>
    """,
    unsafe_allow_html=True,
)


DEFAULTS = {"screen": "home", "story": None, "chapter": 0, "discoveries": []}
for key, value in DEFAULTS.items():
    if key not in st.session_state:
        st.session_state[key] = value.copy() if isinstance(value, list) else value


@st.cache_data(show_spinner=False)
def scene_bytes(panel: int, chapter: int) -> bytes:
    return animated_scene(panel, chapter)


@st.cache_data(show_spinner=False)
def describe_photo(image_bytes: bytes) -> str:
    return identify_photo(image_bytes)


@st.cache_data(show_spinner=False)
def voice_bytes(text: str) -> bytes | None:
    return narration(text)


def go(screen: str, *, chapter: int | None = None) -> None:
    st.session_state.screen = screen
    if chapter is not None:
        st.session_state.chapter = chapter
    st.rerun()


def reset() -> None:
    st.session_state.story = None
    st.session_state.chapter = 0
    st.session_state.discoveries = []
    go("choose")


st.markdown('<div class="brand">Outside the Lines · an open-weight adventure</div>', unsafe_allow_html=True)

if st.session_state.screen == "home":
    st.markdown('<div class="hero-title">The next chapter is outside.</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="deck">Choose a hand-drawn comedy, watch it move, then step away from the screen. '
        'Three small discoveries from the real world become part of your story—privately, through open models.</div>',
        unsafe_allow_html=True,
    )
    st.write("")
    if st.button("Choose an adventure  →", type="primary"):
        go("choose")

elif st.session_state.screen == "choose":
    st.markdown("## Pick your story")
    st.caption("Three stories · three outdoor missions each · no location tracking")
    columns = st.columns(3)
    for (slug, story), column in zip(STORIES.items(), columns):
        with column:
            st.image(ROOT / "assets" / f"{slug}.png", width="stretch")
            st.markdown(
                f'<div class="story-card"><span class="eyebrow">Adventure 0{story["panel"] + 1}</span>'
                f'<h3>{html.escape(story["title"])}</h3><p>{html.escape(story["tagline"])}</p></div>',
                unsafe_allow_html=True,
            )
            if st.button("Enter story", key=f"choose-{slug}", width="stretch"):
                st.session_state.story = slug
                st.session_state.chapter = 0
                st.session_state.discoveries = []
                go("chapter")

elif st.session_state.screen == "chapter":
    story = STORIES[st.session_state.story]
    index = st.session_state.chapter
    chapter = story["chapters"][index]
    artifact = st.session_state.discoveries[-1] if st.session_state.discoveries else "Your discovery"
    body = chapter["body"].format(artifact=artifact)

    top_left, top_right = st.columns([1, 4])
    with top_left:
        if st.button("← Stories"):
            reset()
    with top_right:
        st.progress((index + 1) / 3, text=f"Chapter {index + 1} of 3")

    st.image(scene_bytes(story["panel"], index), width="stretch")
    st.markdown(f'<div class="eyebrow">{html.escape(chapter["eyebrow"])}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="chapter-title">{html.escape(chapter["title"])}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="chapter-copy">{html.escape(body)}</div>', unsafe_allow_html=True)

    if st.button("▶ Listen with natural narration"):
        with st.spinner("Kokoro is performing this chapter…"):
            audio = voice_bytes(f'{chapter["title"]}. {body}')
        if audio:
            st.audio(audio, format="audio/wav", autoplay=True)
            st.caption("Generated with the open-weight Kokoro voice model—not browser speech synthesis.")
        else:
            st.warning("The voice model could not load. Check your connection once so its weights can be cached.")

    st.markdown(
        f'<div class="mission"><b>Your outside mission</b><br>{html.escape(chapter["mission"])}</div>',
        unsafe_allow_html=True,
    )
    if st.button(f'{chapter["button"]}  →', type="primary"):
        go("discover")

elif st.session_state.screen == "discover":
    story = STORIES[st.session_state.story]
    index = st.session_state.chapter
    chapter = story["chapters"][index]
    st.markdown(f'<div class="eyebrow">Outside mission · {index + 1} of 3</div>', unsafe_allow_html=True)
    st.markdown(f"## {chapter['mission']}")
    st.info("Stay on a safe path. Photograph fallen or ordinary objects—never disturb plants or approach wildlife.")
    uploaded = st.file_uploader("Take or choose a photo", type=["jpg", "jpeg", "png", "webp"])

    suggestion = ""
    if uploaded:
        image_bytes = uploaded.getvalue()
        st.image(image_bytes, caption="Your real-world discovery", width=420)
        with st.spinner("OpenCLIP is looking at the photo on this Python server…"):
            suggestion = describe_photo(image_bytes)
    name = st.text_input("What did you find?", value=suggestion, placeholder="e.g. a curled yellow leaf")
    st.caption("You always have the final word—rename the model’s suggestion if it is wrong.")

    left, right = st.columns(2)
    with left:
        if st.button("← Back to story", width="stretch"):
            go("chapter")
    with right:
        if st.button("Weave it into the story", type="primary", width="stretch", disabled=not name.strip()):
            st.session_state.discoveries.append(name.strip())
            if index < 2:
                go("chapter", chapter=index + 1)
            else:
                go("ending")

elif st.session_state.screen == "ending":
    story = STORIES[st.session_state.story]
    st.balloons()
    st.markdown('<div class="eyebrow">Adventure complete</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="chapter-title">{html.escape(story["title"])}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="chapter-copy">{html.escape(story["ending"])}</div>', unsafe_allow_html=True)
    st.markdown("### Your discoveries")
    for item in st.session_state.discoveries:
        st.markdown(f'<div class="artifact">✦ {html.escape(item)}</div><br>', unsafe_allow_html=True)
    if st.button("Choose another story", type="primary"):
        reset()

