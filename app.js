// =====================================================
// BRUSH CHALLENGE by ValEM
// =====================================================
//
// A PERSONNALISER :
// title / artist / link Spotify
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
    spotify: "https://open.spotify.com/intl-fr/track/70Vdd1gx5tn84jkAU31ASv?si=f84674583518428b",
    tease: "Premier challenge : fais deviner le morceau grâce à ton show ! 😈"
  },
  {
    id: 2, day: 1, period: "matin",
    title: "Gangnam Style",
    artist: "PSY",
    spotify: "https://open.spotify.com/intl-fr/track/7LHjM2QyZsloOfRmxKnQ39?si=4a7ca6feda6d40e8",
    tease: "À toi de mettre la puce à l'oreille… Sans donner la réponse trop facilement ! 😎"
  },
  {
    id: 3, day: 1, period: "soir",
    title: "Logobitombo",
    artist: "Moussier Tombola",
    spotify: "https://open.spotify.com/intl-fr/track/5L3i9murWmBM62XVDV9JDk?si=db50252d5621497c",
    tease: "Mime, danse, fais du playback muet ou improvise ! 🎭"
  },
  {
    id: 4, day: 2, period: "matin",
    title: "Libérée, Délivrée",
    artist: "Anaïs Delva",
    spotify: "https://open.spotify.com/intl-fr/track/5pqhqSdrxLXDZY9eeCAtSJ?si=86ad5945e8c7400d",
    tease: "Fais deviner ça sans prononcer le titre, hé ! ❄️😂"
  },
  {
    id: 5, day: 2, period: "soir",
    title: "Ce matin va être une pure soirée",
    artist: "Fatal Bazooka feat. Big Ali, PZK & Dogg Soso",
    spotify: "https://open.spotify.com/intl-fr/track/5XENYfZngvQn29g1ZAjeNE?si=3bd1307e73ee4805",
    tease: "Transforme ton brossage impec en indices de star ! 🤨"
  },
  {
    id: 6, day: 3, period: "matin",
    title: "Ça m'énerve",
    artist: "Helmut Fritz",
    spotify: "https://open.spotify.com/intl-fr/track/1P37gwlsx2ghfr8tGzJsRE?si=e566eedf289f4b3a",
    tease: "Tu es à mi-parcours. Fais le show et sème de bons indices ! 🔥"
  },
  {
    id: 7, day: 3, period: "soir",
    title: "Marly-Gomont",
    artist: "Kamini",
    spotify: "https://open.spotify.com/intl-fr/track/42SUjSOr2tsUmOIlYBX04Z?si=c6cad8f51f2c4dae",
    tease: "Chante, danse, playback… tout est permis pour leur faire deviner ! 😁"
  },
  {
    id: 8, day: 4, period: "matin",
    title: "Chef, un p'tit verre on a soif",
    artist: "Le Grand Jojo",
    spotify: "https://open.spotify.com/intl-fr/track/40adj1F9P9opErWBkLauPJ?si=51d0b98fd289457f",
    tease: "Deux minutes, une brosse à dents, un gobelet et ton imagination ! 🇧🇪😂"
  },
  {
    id: 9, day: 4, period: "soir",
    title: "Cotton Eye Joe",
    artist: "Rednex",
    spotify: "https://open.spotify.com/intl-fr/track/06hsdMbBxWGqBO0TV0Zrkf?si=0758ea54904443eb",
    tease: "Dernier soir à l'internat : fais un show digne de ce nom. 🤠"
  },
  {
    id: 10, day: 5, period: "matin",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    spotify: "https://open.spotify.com/intl-fr/track/4PTG3Z6ehGkBFwjybzWkR8?si=13c31fd0438f447c",
    tease: "Dernier challenge de la semaine : Do not give up ! 🏁"
  }
];

function currentPeriod(hour) {
  return (hour >= 4 && hour < 14) ? "matin" : "soir";
}

const days = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
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
  d.setHours(0, 0, 0, 0);

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
// CRENEAUX
// -----------------------------------------------------

function getCurrentChallenge(date = new Date()) {
  const period = currentPeriod(date.getHours());

  return challenges.find(
    c => c.day === date.getDay() && c.period === period
  );
}

function getNextChallenge() {
  const now = new Date();

  for (let i = 1; i <= 8 * 48; i++) {
    const d = new Date(now.getTime() + i * 30 * 60 * 1000);
    const c = getCurrentChallenge(d);

    if (
      c &&
      (!getCurrentChallenge(now) || c.id !== getCurrentChallenge(now).id)
    ) {
      return { c, d };
    }
  }

  return null;
}

function formatMoment(date, period) {
  return `${days[date.getDay()]} ${period}`;
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
    `${days[now.getDay()]} ${dateText} • ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const c = getCurrentChallenge(now);

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
// VIDEO
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

    const minutes = Math.floor(Math.max(remaining, 0) / 60);
    const seconds = Math.max(remaining, 0) % 60;

    $("#timer").textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/webm"
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
      "Envoie la vidéo pour faire deviner le morceau !";
  } else {
    $("#shareHint").textContent =
      "Si le partage direct n'est pas disponible, enregistre la vidéo et partage-la via la galerie.";
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
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onstop = () => {
    const type =
      recorder.mimeType ||
      mimeType ||
      "video/webm";

    const blob = new Blob(chunks, { type });

    const extension = type.includes("mp4")
      ? "mp4"
      : "webm";

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

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [recordedFile] })
    ) {
      await navigator.share({
        title: "Logan's Brush Challenge",
        text: "Devine le morceau 😎🦷🎵",
        files: [recordedFile]
      });

      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    console.error("Erreur de partage :", error);
  }

  // Secours : enregistrer la vidéo localement.
  const videoUrl = URL.createObjectURL(recordedFile);

  const downloadLink = document.createElement("a");
  downloadLink.href = videoUrl;
  downloadLink.download = recordedFile.name;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  setTimeout(() => {
    URL.revokeObjectURL(videoUrl);
  }, 1500);

  // Puis ouvrir WhatsApp.
  const message = "Devine le morceau 😎🦷🎵";

  setTimeout(() => {
    window.location.href =
      "https://wa.me/?text=" +
      encodeURIComponent(message);
  }, 800);
}

// -----------------------------------------------------
// EVENEMENTS
// -----------------------------------------------------

$("#spotifyBtn").addEventListener("click", () => {
  const challenge = getCurrentChallenge();

  if (!challenge || !challenge.spotify) {
    return;
  }

  window.location.href = challenge.spotify;
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

  if (file) {
    showRecordedFile(file);
  }
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

render();
setInterval(render, 60 * 1000);
