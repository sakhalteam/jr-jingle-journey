const BASE = import.meta.env.BASE_URL + "audio/jingles/";

let currentAudio: HTMLAudioElement | null = null;

export function playJingle(stationId: string): Promise<void> {
  // Stop any currently playing jingle
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  const audio = new Audio(`${BASE}${stationId}.mp3`);
  currentAudio = audio;

  return new Promise<void>((resolve) => {
    audio.addEventListener("ended", () => {
      currentAudio = null;
      resolve();
    });
    audio.addEventListener("error", () => {
      currentAudio = null;
      resolve();
    });
    audio.play().catch(() => {
      currentAudio = null;
      resolve();
    });
  });
}

export function stopJingle() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
