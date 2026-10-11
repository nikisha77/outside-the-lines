const screens = [...document.querySelectorAll(".screen")];

const story = {
  currentMission: 0,
  discoveries: [],
  photoUrl: "",
  photoFile: null,
};

const missions = [
  {
    roman: "I",
    kicker: "The forgotten gate",
    title: "Find something that could unlock an ancient door.",
    hint: "There is no single right answer. A leaf, a twig, a stone—your imagination decides what it becomes.",
    labels: ["a leaf", "a stick", "a stone", "a flower", "tree bark", "a feather", "a shell", "a metal object"],
    names: {
      leaf: "The Golden Leaf-Key", stick: "The Crooked Way-Key", stone: "The Stone of Opening",
      flower: "The Blooming Key", bark: "The Barkbound Key", feather: "The Feather-Key",
      shell: "The Tideworn Key", metal: "The Silver Turning-Key",
    },
    lore: "It carries the shape of a road that no map has remembered.",
  },
  {
    roman: "II",
    kicker: "The sleeping guardian",
    title: "Find something that looks as if it could protect the forest.",
    hint: "Look for a brave shape, a watchful pattern, or a tiny creature—without touching or disturbing wildlife.",
    labels: ["a stone", "a leaf", "a stick", "tree bark", "a flower", "an insect", "a bird", "a shadow"],
    names: {
      stone: "The Mossback Guardian", leaf: "The Greenwing Sentinel", stick: "The Branch-Knight",
      bark: "The Keeper of Rings", flower: "The Petal Watcher", insect: "The Small Armoured One",
      bird: "The Far-Seeing Guardian", shadow: "The Quiet Watcher",
    },
    lore: "It keeps watch without asking the forest to be still.",
  },
  {
    roman: "III",
    kicker: "The last light",
    title: "Find a color or pattern the forest should never forget.",
    hint: "A bright petal, a painted wall, ripples, veins, spots—notice what you might normally walk past.",
    labels: ["a colorful flower", "a patterned leaf", "water ripples", "a colorful stone", "a painted surface", "tree bark", "a shadow pattern", "a cloud"],
    names: {
      flower: "The Ember Bloom", leaf: "The Map of Veins", water: "The Ripple-Light",
      stone: "The Painted Heart", surface: "The Borrowed Color", bark: "The Memory of Rings",
      shadow: "The Lace of Evening", cloud: "The Sky-Memory",
    },
    lore: "Its pattern becomes a promise: what is noticed is never entirely lost.",
  },
];

const chapterCopy = [
  {
    kicker: "Chapter one · The hush",
    title: "The forest remembered everyone but itself.",
    text: "At the edge of the path, you meet Eira—a fox with ink-dark paws. Names are disappearing from the trees, she tells you. Soon, even the way home will be forgotten.",
    action: "Follow Eira",
  },
  {
    kicker: "Chapter two · The gate",
    title: "A door appears where there was only bark.",
    text: () => `You hold up ${story.discoveries[0]?.name || "your discovery"}. The gate recognizes its shape. Roots unwind, and a green-lit path opens beneath your feet.`,
    action: "Cross the threshold",
  },
  {
    kicker: "Chapter three · The watcher",
    title: "Something has been waiting between the trees.",
    text: () => `${story.discoveries[1]?.name || "Your guardian"} takes its place beside ${story.discoveries[0]?.name || "the key"}. Together, they lead you toward the place where the forest keeps its last memory.`,
    action: "Seek the last memory",
  },
];

function showScreen(name) {
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setChapter(index) {
  const copy = chapterCopy[index];
  document.querySelector("#chapterKicker").textContent = copy.kicker;
  document.querySelector("#chapterTitle").textContent = copy.title;
  document.querySelector("#chapterText").textContent = typeof copy.text === "function" ? copy.text() : copy.text;
  document.querySelector("#continueStory").innerHTML = `${copy.action} <span aria-hidden="true">→</span>`;
  document.querySelectorAll(".chapter-progress span").forEach((bar, barIndex) => {
    bar.classList.toggle("filled", barIndex <= index);
  });
  showScreen("chapter");
}

function setMission(index) {
  story.currentMission = index;
  const mission = missions[index];
  document.querySelector("#missionCounter").textContent = `${index + 1} of 3`;
  document.querySelector("#missionRoman").textContent = mission.roman;
  document.querySelector("#missionKicker").textContent = mission.kicker;
  document.querySelector("#missionTitle").textContent = mission.title;
  document.querySelector("#missionHint").textContent = mission.hint;
  showScreen("mission");
}

document.querySelector("#beginButton").addEventListener("click", () => showScreen("choose"));
document.querySelector("#forestTheme").addEventListener("click", () => setChapter(0));
document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => showScreen(button.dataset.back)));
document.querySelector("#continueStory").addEventListener("click", () => setMission(story.currentMission));

const photoInput = document.querySelector("#photoInput");
const photoPreview = document.querySelector("#photoPreview");
const artifactImage = document.querySelector("#artifactImage");
const objectName = document.querySelector("#objectName");
const analysisText = document.querySelector("#analysisText");
const modelDot = document.querySelector(".model-dot");

photoInput.addEventListener("change", async () => {
  const [file] = photoInput.files;
  if (!file) return;
  setPhoto(file);
  showScreen("discovery");
  await analyzePhoto(file);
});

document.querySelector("#describeInstead").addEventListener("click", () => {
  story.photoFile = null;
  story.photoUrl = createPlaceholderArtwork(story.currentMission);
  photoPreview.src = story.photoUrl;
  artifactImage.src = story.photoUrl;
  objectName.value = "";
  objectName.focus();
  analysisText.textContent = "Describe your discovery in your own words";
  showScreen("discovery");
});

document.querySelector("#retryPhoto").addEventListener("click", () => photoInput.click());

function setPhoto(file) {
  if (story.photoUrl?.startsWith("blob:")) URL.revokeObjectURL(story.photoUrl);
  story.photoFile = file;
  story.photoUrl = URL.createObjectURL(file);
  photoPreview.src = story.photoUrl;
  artifactImage.src = story.photoUrl;
  objectName.value = "";
  document.querySelector("#artifactCaption").textContent = "Interpreting your discovery…";
}

async function analyzePhoto(file) {
  modelDot.classList.add("loading");
  analysisText.textContent = "Loading the open CLIP model on your device…";
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm");
    analysisText.textContent = "Looking closely without uploading your photo…";
    const classifier = await pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", {
      device: "wasm",
      progress_callback: (progress) => {
        if (progress?.status === "progress" && progress.progress) {
          analysisText.textContent = `Downloading open model · ${Math.round(progress.progress)}%`;
        }
      },
    });
    const results = await classifier(file, missions[story.currentMission].labels);
    const suggestion = results[0]?.label?.replace(/^a |^an /, "") || "outdoor discovery";
    objectName.value = suggestion;
    document.querySelector("#artifactCaption").textContent = suggestion;
    analysisText.textContent = `Local suggestion: ${suggestion} · You can rename it`;
  } catch (error) {
    console.warn("Local model unavailable", error);
    analysisText.textContent = "The local model could not load. Name the object yourself to continue.";
    objectName.placeholder = "e.g. a curled yellow leaf";
  } finally {
    modelDot.classList.remove("loading");
  }
}

function artifactFor(input, missionIndex) {
  const normalized = input.toLowerCase();
  const mission = missions[missionIndex];
  const key = Object.keys(mission.names).find((candidate) => normalized.includes(candidate));
  return {
    source: input,
    name: key ? mission.names[key] : customArtifactName(input, missionIndex),
    lore: mission.lore,
    image: story.photoUrl,
  };
}

function customArtifactName(input, missionIndex) {
  const titleCase = input.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/^(A|An|The)\s/, "");
  if (missionIndex === 0) return `The ${titleCase} Key`;
  if (missionIndex === 1) return `The ${titleCase} Guardian`;
  return `The Memory of ${titleCase}`;
}

document.querySelector("#weaveButton").addEventListener("click", () => {
  const value = objectName.value.trim();
  if (!value) {
    objectName.focus();
    analysisText.textContent = "Give your discovery a name first.";
    return;
  }
  const artifact = artifactFor(value, story.currentMission);
  story.discoveries[story.currentMission] = artifact;
  document.querySelector("#artifactName").textContent = artifact.name;
  document.querySelector("#artifactLore").textContent = artifact.lore;
  document.querySelector("#artifactCaption").textContent = value;
  showScreen("artifact");
});

document.querySelector("#returnStory").addEventListener("click", () => {
  if (story.currentMission < 2) {
    story.currentMission += 1;
    setChapter(story.currentMission);
  } else {
    renderEnding();
  }
});

function renderEnding() {
  const [key, guardian, memory] = story.discoveries;
  document.querySelector("#endingText").textContent =
    `With ${key.name}, ${guardian.name}, and ${memory.name}, you return the forest's memories. ` +
    "Eira touches one ink-dark paw to the path. The trees remember their names—and, because you noticed them, a little of your world too.";
  const row = document.querySelector("#keepsakeRow");
  row.innerHTML = "";
  story.discoveries.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "keepsake";
    card.style.setProperty("--tilt", `${index === 1 ? 1 : index === 0 ? -4 : 4}deg`);
    card.innerHTML = `<img src="${item.image}" alt="${escapeHtml(item.source)}"><span>${escapeHtml(item.name)}</span>`;
    row.appendChild(card);
  });
  showScreen("ending");
}

document.querySelector("#restartButton").addEventListener("click", () => {
  story.currentMission = 0;
  story.discoveries = [];
  showScreen("welcome");
});

document.querySelector("#narrateButton").addEventListener("click", () => {
  speechSynthesis.cancel();
  const text = `${document.querySelector("#chapterTitle").textContent}. ${document.querySelector("#chapterText").textContent}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
});

document.querySelector("#shareButton").addEventListener("click", async () => {
  const text = "I helped the forest remember in Outside the Lines—an outdoor story shaped by real-world discoveries.";
  if (navigator.share) await navigator.share({ title: "Outside the Lines", text, url: location.href });
  else {
    await navigator.clipboard.writeText(`${text} ${location.href}`);
    document.querySelector("#shareButton").textContent = "Link copied";
  }
});

const aboutDialog = document.querySelector("#aboutDialog");
document.querySelector("#aboutButton").addEventListener("click", () => aboutDialog.showModal());
document.querySelector("#closeAbout").addEventListener("click", () => aboutDialog.close());

function createPlaceholderArtwork(index) {
  const palettes = [["#39533d", "#d4bd76"], ["#6d583f", "#b9c897"], ["#42516d", "#d88f62"]];
  const [base, accent] = palettes[index];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><defs><filter id="n"><feTurbulence baseFrequency=".04" numOctaves="4"/></filter></defs><rect width="800" height="1000" fill="${base}"/><circle cx="400" cy="390" r="210" fill="${accent}" opacity=".75"/><path d="M90 810 Q280 420 430 810 T780 760" fill="none" stroke="#efe6cc" stroke-width="18" opacity=".7"/><rect width="800" height="1000" filter="url(#n)" opacity=".13"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = value;
  return node.innerHTML;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
}
