const screens = [...document.querySelectorAll(".screen")];

const story = {
  theme: "barnaby",
  currentMission: 0,
  discoveries: [],
  photoUrl: "",
  photoFile: null,
};

const adventures = {
  barnaby: {
    title: "Barnaby’s Great Bush Disaster",
    world: "a bright backyard comedy with an orange cat, a smug squirrel, a fence, and a thorny bush",
    palette: [["#f1a33a", "#4e7a3d"], ["#e88731", "#92b75f"], ["#d86f2e", "#315a38"]],
    fallbackNames: ["Launch Charm", "Landing Plan", "Peace Offering"],
    chapters: [
      { kicker:"Chapter one · The hunter", title:"The ultimate backyard predator chooses his target.", text:"Barnaby—ambitious, orange, and magnificently chubby—locks onto a squirrel perched on the fence with a prized acorn. He sinks into the grass, tail ticking like a metronome, calculates one heroic jump, and completely forgets to account for gravity.", action:"Begin the hunt", scene:"Barnaby narrows his eyes. The squirrel takes another extremely casual bite." },
      { kicker:"Chapter two · The launch", title:"One glorious second of flight.", text:()=>`${story.discoveries[0]?.name || "Your launch charm"} gives Barnaby exactly the confidence he did not need. His back paws wiggle, the grass bends, and—SWISH!—he launches toward the fence. For one shining heartbeat he looks majestic. Then his ambitious arc begins curving sharply downward.`, action:"Follow the arc", scene:"Barnaby stretches for the fence while the squirrel watches, deeply unconvinced." },
      { kicker:"Chapter three · The landing", title:"Only the tail survives with dignity.", text:()=>`${story.discoveries[1]?.name || "Your landing plan"} cannot arrive fast enough. RUSTLE! THUD! Barnaby disappears headfirst into the thorny bush. Stars and leaves burst upward; two striped legs and one furious tail conduct a silent orchestra while the squirrel keeps eating.`, action:"Negotiate a truce", scene:"The bush vibrates. The squirrel’s grin grows wider. Barnaby pretends this was tactical." },
    ],
    missions: [
      { roman:"I", kicker:"A hunter’s confidence", title:"Find Barnaby a lucky launch charm.", hint:"Step outside and photograph a fallen leaf, twig, feather, stone, or other small object that looks fast or brave. Leave living things where they are.", labels:["a fallen leaf","a stick","a feather","a stone","a seed pod","a flower","tree bark","a pine cone"], names:{leaf:"The Turbo Leaf",stick:"The Spring-Loaded Twig",feather:"The Flight Feather",stone:"The Courage Pebble",seed:"The Rocket Pod",flower:"The Brave Bloom",bark:"The Hunter’s Badge",pine:"The Acorn-Seeker"}, lore:"Barnaby is certain it improves aerodynamics. The laws of physics remain unavailable for comment." },
      { roman:"II", kicker:"Emergency landing", title:"Find something that could inspire a softer landing.", hint:"Look for a cushion-like patch of moss, broad leaf, soft grass, petal, or rounded shape. Photograph it without stepping off a safe path.", labels:["soft grass","a broad leaf","moss","a flower petal","a feather","a round stone","a pile of leaves","tree bark"], names:{grass:"The Grass Mattress",leaf:"The Emergency Parachute",moss:"The Mossy Crash Pad",petal:"The Petal Pillow",feather:"The Soft-Landing Plan",stone:"The Roll-Safe Boulder",pile:"The Leaf Cushion",bark:"The Bark Brake"}, lore:"It is an excellent plan, provided someone remembers it before becoming airborne." },
      { roman:"III", kicker:"Backyard diplomacy", title:"Find a symbol for a peace offering.", hint:"Choose an acorn-like seed, a colorful leaf, a flower, or a friendly pattern. Do not feed or approach wildlife.", labels:["an acorn","a seed pod","a colorful leaf","a flower","a striped pattern","a round object","a small stone","a heart shape"], names:{acorn:"The Royal Acorn",seed:"The Snackless Treaty Pod",leaf:"The Squirrel Accord",flower:"The Bloom of No Hard Feelings",striped:"The Tail-to-Tail Treaty",round:"The Roundtable Token",stone:"The Dignity Pebble",heart:"The Backyard Peace Crest"}, lore:"It offers friendship, restored dignity, and absolutely no admission that the squirrel won." },
    ],
    endingTitle:"The backyard signs a very smug truce.",
    ending:([charm,landing,treaty])=>`${charm.name} begins the legend, ${landing.name} improves the next attempt, and ${treaty.name} ends the conflict. Barnaby backs out of the bush wearing three leaves like medals. The squirrel accepts the truce, finishes its acorn, and saves one final grin for the ultimate backyard predator.`,
  },
  leo: {
    title: "Leo and the Lunch-Lover",
    world: "a sunny mountain trail comedy with a giant boulder, a terrified hiker, and a determined goat",
    palette: [["#6d8e42", "#d7b16a"], ["#7d9250", "#c88e55"], ["#47633f", "#e2bd73"]],
    fallbackNames: ["Picnic Decoy", "Escape Marker", "Trail Treaty"],
    chapters: [
      { kicker:"Chapter one · The wrapper", title:"One tiny rustle starts everything.", text:"Leo chooses a quiet spot beside a massive boulder and unwraps his sandwich. From nowhere appears Billy, the hungriest mountain goat in the territory. Billy’s eyes lock onto lunch. Leo freezes. The wrapper crackles once more—and peaceful hiking officially ends.", action:"Protect the picnic", scene:"Billy lowers his horns. Leo slowly lifts the sandwich out of reach." },
      { kicker:"Chapter two · The chase", title:"Around the boulder they go.", text:()=>`Leo tries ${story.discoveries[0]?.name || "your picnic decoy"}, but Billy has standards and wants the real sandwich. Leo bolts with his blanket, loose fruit, and lunch flapping everywhere. Billy gallops behind in a storm of hooves, dust, and circular motion trails.`, action:"Run another lap", scene:"Leo rounds the rock at full speed. Billy gains ground with every determined BAAA!" },
      { kicker:"Chapter three · The chomp", title:"Billy closes in on the backpack.", text:()=>`${story.discoveries[1]?.name || "Your escape marker"} points toward the trail, but the chase has become an infinite loop. CHOMP! Billy’s teeth snap inches from Leo’s pack. Around and around they race—the mountain’s fastest and most absurd game of ring-around-the-rosy.`, action:"Make trail peace", scene:"Leo spots an exit. Billy spots the sandwich. Both commit completely." },
    ],
    missions: [
      { roman:"I", kicker:"Picnic misdirection", title:"Find something shaped like a harmless lunch decoy.", hint:"Look for a sandwich-shaped stone, leaf bundle, or round fruit-like form. Never feed or lure wild animals.", labels:["a flat stone","a folded leaf","a round object","a seed pod","a brown leaf","a triangle shape","a flower","tree bark"], names:{stone:"The Granite Sandwich",leaf:"The Leaf-Wrapped Decoy",round:"The Phantom Apple",seed:"The Picnic Pod",brown:"The Toasted Leaf",triangle:"The Trail Sandwich",flower:"The Salad Surprise",bark:"The Bark Baguette"}, lore:"It resembles lunch from a distance and common sense from much farther away." },
      { roman:"II", kicker:"Break the loop", title:"Find a trail marker that points toward escape.", hint:"Search for an arrow shape, forked branch, path bend, cairn-like stone, or strong directional shadow.", labels:["an arrow shape","a forked branch","a path","a stone marker","a shadow","a trail sign","a line pattern","a pointed leaf"], names:{arrow:"The Boulder-Break Arrow",branch:"The Fork of Freedom",path:"The Picnic Escape Route",stone:"The Tiny Trail Cairn",shadow:"The Shadow Shortcut",sign:"The Way-Out Marker",line:"The Sprinting Line",leaf:"The Pointed Exit"}, lore:"It points away from the endless lap and toward a place where lunches remain zipped away." },
      { roman:"III", kicker:"Respect the wild", title:"Find a symbol for a fair trail treaty.", hint:"Choose a balanced shape, paired leaves, circle, or calm color. Keep food secured and give wildlife plenty of space.", labels:["two leaves","a circle shape","a balanced stone","a calm flower","a knot","a trail symbol","a blue object","a green object"], names:{leaves:"The Two-Leaf Accord",circle:"The No-Chase Circle",stone:"The Balanced Boulder Pact",flower:"The Peaceful Picnic Bloom",knot:"The Secure-Pack Promise",symbol:"The Wild-Trail Treaty",blue:"The Open-Sky Agreement",green:"The Leave-No-Lunch Pact"}, lore:"The terms are simple: Leo secures his food, and Billy gets the whole mountain—not the sandwich." },
    ],
    endingTitle:"The mountain’s fastest picnic ends in peace.",
    ending:([decoy,marker,treaty])=>`${decoy.name} buys one ridiculous lap, ${marker.name} breaks the circle, and ${treaty.name} settles the dispute. Leo zips every crumb safely away. Billy loses interest, poses heroically on the boulder, and lets out one final BAAA! as if the entire chase were his guided tour.`,
  },
  maya: {
    title: "Maya’s Flying Masterpiece",
    world: "a breezy park hillside comedy with a flying canvas, a sprinting artist, loose papers, and an excited dog",
    palette: [["#6ba66a", "#73b9d1"], ["#72a652", "#e2b868"], ["#4f8e5b", "#da765f"]],
    fallbackNames: ["Wind Anchor", "Canvas Catcher", "Final Color"],
    chapters: [
      { kicker:"Chapter one · The gust", title:"The wind edits the composition.", text:"Maya settles at her easel on a beautiful park hillside, ready to paint the perfect landscape. The trees lean. Her scarf lifts. Before she can hold the frame, one enormous gust catches the canvas broadside and turns the masterpiece into a kite.", action:"Chase the painting", scene:"The canvas rises. Maya’s peaceful afternoon leaves the ground with it." },
      { kicker:"Chapter two · Airborne", title:"The masterpiece develops an escape plan.", text:()=>`${story.discoveries[0]?.name || "Your wind anchor"} arrives one gust too late. Brushes, sketches, and the canvas stream down the slope. Maya lunges after them, arms outstretched, while the runaway painting bobs just beyond her fingertips.`, action:"Sprint downhill", scene:"Paper spins through the air. Maya runs faster as her scarf snaps in the wind." },
      { kicker:"Chapter three · The rescue", title:"Downhill, faster than dignity.", text:()=>`${story.discoveries[1]?.name || "Your canvas catcher"} gives Maya one last idea. She races through sweeping wind lines with frantic after-image legs. A small dog joins in, barking like a rescue captain, while the canvas dips, climbs, and refuses to land.`, action:"Catch the masterpiece", scene:"Maya, dog, papers, and painting zoom toward one soft-looking patch of grass." },
    ],
    missions: [
      { roman:"I", kicker:"Read the breeze", title:"Find a natural wind warning or anchor shape.", hint:"Look for bending grass, a sturdy stone, a low branch, a fallen pine cone, or leaves showing the wind’s direction.", labels:["bending grass","a heavy stone","a branch","a pine cone","windblown leaves","a rooted plant","a low stump","a sheltered spot"], names:{grass:"The Breeze Alarm",stone:"The Pocket Easel Anchor",branch:"The Wind-Fork",pine:"The Pine-Cone Paperweight",leaves:"The Gust Compass",plant:"The Rooted Reminder",stump:"The Studio Stopper",shelter:"The Calm-Air Corner"}, lore:"It notices the gust before the artist does and refuses to become a kite." },
      { roman:"II", kicker:"Catch the canvas", title:"Find something shaped like a hook, net, or catcher.", hint:"Search for a forked twig, curved leaf, web-like pattern, loop, or safe natural bowl. Do not disturb webs or living plants.", labels:["a forked stick","a curved leaf","a web pattern","a loop shape","a bowl shape","a long branch","a fence gap","a hooked shadow"], names:{stick:"The Canvas Catching Fork",leaf:"The Green Scoop",web:"The Masterpiece Net",loop:"The Art-Rescue Loop",bowl:"The Wind Bowl",branch:"The Long-Reach Brush",fence:"The Frame Trap",shadow:"The Shadow Hook"}, lore:"Its shape says: one more bounce, then this runaway exhibition is closing." },
      { roman:"III", kicker:"Finish outdoors", title:"Find the final color or pattern for Maya’s recovered painting.", hint:"Notice a flower, leaf vein, cloud, stone, shadow, or patch of sky you would usually pass without looking.", labels:["a colorful flower","leaf veins","a cloud","a colorful stone","a shadow pattern","blue sky","tree bark","a striped pattern"], names:{flower:"The Hillside Bloom",leaf:"The Living Brushstroke",cloud:"The Wind’s Signature",stone:"The Grounded Color",shadow:"The Dancing Shade",sky:"The Open-Sky Blue",bark:"The Woodland Texture",striped:"The Racing Stripe"}, lore:"It is the one detail the studio could never provide: a mark earned by chasing the day itself." },
    ],
    endingTitle:"The flying masterpiece lands better than it began.",
    ending:([anchor,catcher,color])=>`${anchor.name} teaches Maya to read the breeze, ${catcher.name} snags the frame above the grass, and ${color.name} becomes the painting’s final stroke. The little dog receives an official portrait in the corner. The canvas is wind-bent, grass-stained, and finally alive.`,
  },
};

const currentAdventure = () => adventures[story.theme];
document.body.dataset.adventure = story.theme;

function showScreen(name) {
  screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setChapter(index) {
  const copy = currentAdventure().chapters[index];
  const chapterScreen = document.querySelector('[data-screen="chapter"]');
  chapterScreen.dataset.chapter = String(index);
  chapterScreen.dataset.theme = story.theme;
  chapterScreen.dataset.mood = index === 2 ? "ember" : index === 1 ? "mist" : "golden";
  document.querySelector("#chapterKicker").textContent = copy.kicker;
  document.querySelector("#chapterTitle").textContent = copy.title;
  document.querySelector("#chapterText").textContent = typeof copy.text === "function" ? copy.text() : copy.text;
  document.querySelector("#sceneCaption").textContent = copy.scene;
  document.querySelector("#continueStory").innerHTML = `${copy.action} <span aria-hidden="true">→</span>`;
  document.querySelectorAll(".chapter-progress span").forEach((bar, barIndex) => {
    bar.classList.toggle("filled", barIndex <= index);
  });
  const priorArtifact = story.discoveries[index - 1];
  const sceneArtifactImage = document.querySelector("#sceneArtifactImage");
  if (priorArtifact) sceneArtifactImage.setAttribute("href", priorArtifact.image);
  else sceneArtifactImage.removeAttribute("href");
  document.querySelectorAll(".story-line").forEach((line) => {
    line.style.animation = "none";
    requestAnimationFrame(() => { line.style.animation = ""; });
  });
  showScreen("chapter");
}

function setMission(index) {
  story.currentMission = index;
  const mission = currentAdventure().missions[index];
  document.querySelector("#missionCounter").textContent = `${index + 1} of 3`;
  document.querySelector("#missionRoman").textContent = mission.roman;
  document.querySelector("#missionKicker").textContent = mission.kicker;
  document.querySelector("#missionTitle").textContent = mission.title;
  document.querySelector("#missionHint").textContent = mission.hint;
  showScreen("mission");
}

document.querySelector("#beginButton").addEventListener("click", () => showScreen("choose"));
document.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
  story.theme = button.dataset.theme;
  story.currentMission = 0;
  story.discoveries = [];
  document.body.dataset.adventure = story.theme;
  setChapter(0);
}));
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
    const results = await classifier(file, currentAdventure().missions[story.currentMission].labels);
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
  const mission = currentAdventure().missions[missionIndex];
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
  return `The ${titleCase} ${currentAdventure().fallbackNames[missionIndex]}`;
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
  const adventure = currentAdventure();
  document.querySelector("#endingKicker").textContent = `${adventure.title} · complete`;
  document.querySelector("#endingTitle").textContent = adventure.endingTitle;
  document.querySelector("#endingText").textContent = adventure.ending(story.discoveries);
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
  showScreen("choose");
});

document.querySelector("#narrateButton").addEventListener("click", () => {
  speechSynthesis.cancel();
  const text = `${document.querySelector("#chapterTitle").textContent}. ${document.querySelector("#chapterText").textContent}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
});

let motionPaused = false;
document.querySelector("#motionButton").addEventListener("click", () => {
  motionPaused = !motionPaused;
  document.body.classList.toggle("motion-paused", motionPaused);
  const button = document.querySelector("#motionButton");
  button.textContent = motionPaused ? "▶" : "Ⅱ";
  button.setAttribute("aria-label", motionPaused ? "Play scene motion" : "Pause scene motion");
  document.querySelector("#sceneStatus").textContent = motionPaused ? "Scene paused" : "Scene in motion";
});

const gemmaDialog = document.querySelector("#gemmaDialog");
const directorToast = document.querySelector("#directorToast");
const directorText = document.querySelector("#directorText");
let gemmaDirector = null;

document.querySelector("#gemmaButton").addEventListener("click", () => gemmaDialog.showModal());
document.querySelector("#closeGemma").addEventListener("click", () => gemmaDialog.close());
document.querySelector("#skipGemma").addEventListener("click", () => gemmaDialog.close());
document.querySelector("#enableGemma").addEventListener("click", async () => {
  gemmaDialog.close();
  await directSceneWithGemma();
});

async function directSceneWithGemma() {
  const chapterScreen = document.querySelector('[data-screen="chapter"]');
  directorToast.classList.add("visible");
  directorToast.querySelector(".model-dot").classList.add("loading");
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm");
    if (!gemmaDirector) {
      directorText.textContent = "Downloading Gemma 3 270M · this happens once…";
      gemmaDirector = await pipeline("text-generation", "onnx-community/gemma-3-270m-it-ONNX", {
        device: navigator.gpu ? "webgpu" : "wasm",
        dtype: "q4",
        progress_callback: (progress) => {
          if (progress?.status === "progress" && progress.progress) {
            directorText.textContent = `Downloading Gemma · ${Math.round(progress.progress)}%`;
          }
        },
      });
    }
    directorText.textContent = "Gemma is reading the scene…";
    const discovery = story.discoveries[Math.max(0, story.currentMission - 1)]?.name || "an unnamed outdoor discovery";
    const prompt = `You direct an animated hand-painted ${currentAdventure().world} scene. Chapter: ${document.querySelector("#chapterTitle").textContent}. Artifact: ${discovery}. Choose exactly one mood from golden, mist, ember. Reply with only that one word.`;
    const result = await gemmaDirector(prompt, { max_new_tokens: 8, do_sample: false, return_full_text: false });
    const generated = String(result?.[0]?.generated_text || "").toLowerCase();
    const mood = ["golden", "mist", "ember"].find((candidate) => generated.includes(candidate)) || "golden";
    chapterScreen.dataset.mood = mood;
    document.querySelector("#sceneStatus").textContent = `Gemma direction · ${mood}`;
    directorText.textContent = `Gemma chose a ${mood} atmosphere`;
  } catch (error) {
    console.warn("Gemma scene direction unavailable", error);
    directorText.textContent = "Gemma could not load; handcrafted motion remains active.";
  } finally {
    directorToast.querySelector(".model-dot").classList.remove("loading");
    setTimeout(() => directorToast.classList.remove("visible"), 4500);
  }
}

document.querySelector("#shareButton").addEventListener("click", async () => {
  const text = `I completed ${currentAdventure().title} in Outside the Lines—an outdoor story shaped by real-world discoveries.`;
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
  const [base, accent] = currentAdventure().palette[index];
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
