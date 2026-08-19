
// =====================================================
// LOGAN BRUSH CHALLENGE by ValEM
// =====================================================
//
// À PERSONNALISER :
// title / artist / link youtube
//
// day : 0=dimanche, 1=lundi, ... 5=vendredi
// period : "matin" ou "soir"
//
// =====================================================

const challenges = [
  {
    id: 1, day: 0, period: "soir",
    title: "Sexy and I Know It",
    artist: "LMFAO",
    youtube: "https://youtu.be/wyx6JDQCslE?si=PK6YghhpouN5hfrm",
    tease: "Premier challenge, Logan. Montre-nous directement de quoi tu es capable. 😈"
  },
  {
    id: 2, day: 1, period: "matin",
    title: "Gangnam Style",
    artist: "PSY",
    youtube: "https://youtu.be/9bZkp7q19f0?si=TJhnEBu45AwGNX4k",
    tease: "T'es réveillé ? Parfait. Maintenant, fais le show ! 🕺"
  },
  {
    id: 3, day: 1, period: "soir",
    title: "Logobitombo",
    artist: "Moussier Tombola",
    youtube: "https://youtu.be/9NmGDZMy3G0?si=LGVIi03fuYQEQ5sh",
    tease: "Tu as 2 minutes. Fais-en quelque chose de mémorable. 😎"
  },
  {
    id: 4, day: 2, period: "matin",
    title: "Libérée, Délivrée",
    artist: "Anaïs Delva",
    youtube: "https://youtu.be/vzgInDxzyGU?si=qj2EoRHj2YDCHxq0",
    tease: "Celle-là, tu vas devoir l'assumer jusqu'au bout. ❄️😂"
  },
  {
    id: 5, day: 2, period: "soir",
    title: "Ce matin va être une pure soirée",
    artist: "Fatal Bazooka feat. Big Ali, PZK & Dogg Soso",
    youtube: "https://youtu.be/AS4GlgkW5Fc?si=38QeEeMZ-cr-j--Z",
    tease: "Prestation totalement libre. Surprends-nous ! 🤨"
  },
  {
    id: 6, day: 3, period: "matin",
    title: "Ça m'énerve",
    artist: "Helmut Fritz",
    youtube: "https://youtu.be/4mNDYWhRSaw?si=2SXFv9qWJYumPfKd",
    tease: "Tu es à mi-parcours. Pas question de baisser le niveau maintenant. 🔥"
  },
  {
    id: 7, day: 3, period: "soir",
    title: "Marly-Gomont",
    artist: "Kamini",
    youtube: "https://youtu.be/GGPXjiwlWZc?si=2o8PtkIi9yEMQB-Q",
    tease: "Chante, danse, mime… ou invente-nous quelque chose. À toi de jouer ! 😁"
  },
  {
    id: 8, day: 4, period: "matin",
    title: "Chef, un p'tit verre on a soif",
    artist: "Le Grand Jojo",
    youtube: "https://youtu.be/Dv-vqcR4GY4?si=sKjsv6l82KDv_HQ7",
    tease: "Un grand classique belge. Tu en fais ce que tu veux… mais fais-le bien. 🇧🇪😂"
  },
  {
    id: 9, day: 4, period: "soir",
    title: "Cotton Eye Joe",
    artist: "Rednex",
    youtube: "https://youtu.be/mOYZaiDZ7BM?si=RK51DB6SAbqbDuhz",
    tease: "Dernier soir à l'internat : tu nous dois une prestation digne de ce nom. 🤠"
  },
  {
    id: 10, day: 5, period: "matin",
    title: "Never gonna give you up",
    artist: "Rick Astley",
    youtube: "https://youtu.be/DLzxrzFCyOs?si=Sexi5dh4BeC9I2L7",
    tease: "Dernier challenge de la semaine. Don't give up ! 🏁"
  }
];

// Le matin va de 04:00 à 13:59.
// Le soir va de 14:00 à 03:59.
// Les jours sans challenge restent automatiquement en « RELÂCHE ».
function currentPeriod(hour) {
  return (hour >= 4 && hour < 14) ? "matin" : "soir";
}

const days = [
  "Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"
];

const $ = (selector) => document.querySelector(selector);

let stream = null;
let recorder = null;
let chunks = [];
let recordedFile = null;
let timerInterval = null;
let remaining = 120;
let currentObjectUrl = null;

// -----------------------------------------------------
// SEMAINE / PROGRESSION
// -----------------------------------------------------

function getMondayKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${dd}`;
}

function storageKey() {
  return `loganBrushDone-${getMondayKey()}`;
}

function getDone() {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "{}");
  } catch {
    return {};
  }
}

function saveDone(done) {
  localStorage.setItem(storageKey(), JSON.stringify(done));
}

function updateProgress() {
  const done = getDone();
  const count = challenges.filter(c => done[c.id]).length;

  $("#progressText").textContent = `${count}/10`;
  $("#progressBar").style.width = `${count * 10}%`;

  const c = getCurrentChallenge();
  if (c && done[c.id]) {
    $("#validateBtn").textContent = "✅ Challenge du jour validé ✅";
    $("#validateBtn").disabled = true;
  } else {
    $("#validateBtn").textContent = "🔥 Challenge du jour fait 🔥";
    $("#validateBtn").disabled = false;
  }
}

// -----------------------------------------------------
// CRÉNEAUX
// -----------------------------------------------------

function getCurrentChallenge(date = new Date()) {
  const period = currentPeriod(date.getHours());

  return challenges.find(
    c => c.day === date.getDay() && c.period === period
  );
}

function getNextChallenge() {
  const now = new Date();

  // Recherche toutes les 30 minutes sur les 8 prochains jours.
  for (let i = 1; i <= 8 * 48; i++) {
    const d = new Date(now.getTime() + i * 30 * 60 * 1000);
    const c = getCurrentChallenge(d);

    // Évite d'annoncer comme « prochain » le challenge actuellement ouvert.
    if (c && (!getCurrentChallenge(now) || c.id !== getCurrentChallenge(now).id)) {
      return { c, d };
    }
  }

  return null;
}

function formatMoment(date, period) {
  return `${days[date.getDay()]} ${period}`;
}


function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "").split("/")[0];
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
      return u.searchParams.get("v");
    }
  } catch (error) {
    console.error("Lien YouTube invalide :", url, error);
  }

  return "";
}

function loadInlineYouTube(challenge) {
  const videoId = getYouTubeId(challenge.youtube);
  if (!videoId) return;

  const panel = $("#youtubePanel");
  const frame = $("#youtubeFrame");

  panel.classList.remove("hidden");

  frame.src =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
}

// -----------------------------------------------------
// AFFICHAGE
// -----------------------------------------------------

function render() {
  const now = new Date();

const dateText = now.toLocaleDateString("fr-BE", {
  day: "2-digit",
  month: "long"
});

$("#slotLabel").textContent =
  `${days[now.getDay()]} ${dateText} • ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

  const c = getCurrentChallenge(now);

  const ytFrame = $("#youtubeFrame");
  const ytPanel = $("#youtubePanel");
  if (ytFrame && ytPanel && ytFrame.dataset.challengeId !== String(c?.id || "")) {
    ytFrame.src = "";
    ytFrame.dataset.challengeId = String(c?.id || "");
    ytPanel.classList.add("hidden");
  }

  if (!c) {
    $("#challengeBox").classList.add("hidden");
    $("#offBox").classList.remove("hidden");

    const next = getNextChallenge();

    $("#nextChallenge").textContent = next
      ? `Prochain challenge : ${formatMoment(next.d, next.c.period)}.`
      : "À bientôt.";

    return;
  }

  $("#offBox").classList.add("hidden");
  $("#challengeBox").classList.remove("hidden");

  $("#challengeNumber").textContent = `Challenge #${c.id}`;
  $("#tease").textContent = c.tease;
  $("#songTitle").textContent = c.title;
  $("#songArtist").textContent = c.artist;
  

  updateProgress();

  $("#validateBtn").onclick = () => {
    const done = getDone();
    done[c.id] = true;
    saveDone(done);
    updateProgress();
  };
}

// -----------------------------------------------------
// CAMÉRA / VIDÉO
// -----------------------------------------------------

function supportsWebRecording() {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder
  );
}

function cleanupObjectUrl() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

async function openCamera() {
  $("#resultPanel").classList.add("hidden");
  $("#fallbackPanel").classList.add("hidden");
  cleanupObjectUrl();

  if (!supportsWebRecording()) {
    $("#cameraPanel").classList.add("hidden");
    $("#fallbackPanel").classList.remove("hidden");
    return;
  }

  $("#cameraPanel").classList.remove("hidden");

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true
    });

    $("#preview").srcObject = stream;
  } catch (error) {
    console.error(error);
    $("#cameraPanel").classList.add("hidden");
    $("#fallbackPanel").classList.remove("hidden");
  }
}

function resetTimer() {
  remaining = 120;
  $("#timer").textContent = "02:00";
  $("#timer").classList.remove("done");
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remaining -= 1;

    const minutes = Math.floor(Math.max(remaining,0) / 60);
    const seconds = Math.max(remaining,0) % 60;

    $("#timer").textContent =
      `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    if (remaining <= 0) {
      $("#timer").classList.add("done");
      stopRecording();
    }
  }, 1000);
}

function stopTracks() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

function pickMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4"
  ];

  return candidates.find(type => MediaRecorder.isTypeSupported(type)) || "";
}

function showRecordedFile(file) {
  recordedFile = file;
  cleanupObjectUrl();

  currentObjectUrl = URL.createObjectURL(file);
  $("#resultVideo").src = currentObjectUrl;

  $("#cameraPanel").classList.add("hidden");
  $("#fallbackPanel").classList.add("hidden");
  $("#resultPanel").classList.remove("hidden");

  if (navigator.share) {
    $("#shareHint").textContent =
      "Vas dans WhatsApp pour partager la vidéo";
  } else {
    $("#shareHint").textContent =
      "Si le partage direct n'est pas disponible, enregistre la vidéo puis partage-la via la galerie";
  }
}

function startRecording() {
  if (!stream || !window.MediaRecorder) return;

  chunks = [];
  resetTimer();

  const mimeType = pickMimeType();
  const options = mimeType ? { mimeType } : undefined;

  try {
    recorder = new MediaRecorder(stream, options);
  } catch (error) {
    console.error(error);
    $("#cameraPanel").classList.add("hidden");
    $("#fallbackPanel").classList.remove("hidden");
    stopTracks();
    return;
  }

  recorder.ondataavailable = event => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  recorder.onstop = () => {
    const type =
      recorder.mimeType ||
      (mimeType || "video/webm");

    const blob = new Blob(chunks, { type });

    const extension = type.includes("mp4") ? "mp4" : "webm";

    const file = new File(
      [blob],
      `logan-brush-${Date.now()}.${extension}`,
      { type }
    );

    showRecordedFile(file);
    stopTracks();
  };

  recorder.start();

  $("#startBtn").disabled = true;
  $("#stopBtn").disabled = false;

  startTimer();
}

function stopRecording() {
  clearInterval(timerInterval);

  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
  }

  $("#startBtn").disabled = false;
  $("#stopBtn").disabled = true;
}

async function shareVideo() {
  if (!recordedFile) return;

  if (
    navigator.canShare &&
    navigator.canShare({ files: [recordedFile] })
  ) {
    try {
      await navigator.share({
        title: "Logan Brush Challenge",
        text: "Mon Brush Challenge est validé 😎🦷🔥",
        files: [recordedFile]
      });
      return;
    } catch (error) {
      // L'utilisateur peut simplement fermer la feuille de partage.
      if (error?.name === "AbortError") return;
      console.error(error);
    }
  }

  // Secours : téléchargement local de la vidéo.
  const a = document.createElement("a");
  a.href = URL.createObjectURL(recordedFile);
  a.download = recordedFile.name;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(a.href), 1000);

  alert(
    "La vidéo a été enregistrée sur le téléphone. Tu peux maintenant la partager depuis la galerie ou les téléchargements."
  );
}

// -----------------------------------------------------
// ÉVÉNEMENTS
// -----------------------------------------------------


$("#youtubeBtn").addEventListener("click", () => {
  const challenge = getCurrentChallenge();
  if (challenge) loadInlineYouTube(challenge);
});

$("#cameraBtn").addEventListener("click", openCamera);
$("#startBtn").addEventListener("click", startRecording);
$("#stopBtn").addEventListener("click", stopRecording);
$("#shareBtn").addEventListener("click", shareVideo);

$("#redoBtn").addEventListener("click", () => {
  recordedFile = null;
  openCamera();
});

$("#fallbackVideo").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (file) showRecordedFile(file);
});

$("#resetBtn").addEventListener("click", () => {
  localStorage.removeItem(storageKey());
  updateProgress();
});

window.addEventListener("pagehide", () => {
  clearInterval(timerInterval);
  stopTracks();
  cleanupObjectUrl();
});

// L'heure affichée se met à jour sans recharger la page.
render();
setInterval(render, 60 * 1000);
