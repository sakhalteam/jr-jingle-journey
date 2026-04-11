const BASE = import.meta.env.BASE_URL + "audio/announcements/";

let current: HTMLAudioElement | null = null;
let aborted = false;

export type Direction = "cw" | "ccw";
export type ClipType = "shanai" | "platform";

function clipUrl(stationId: string, direction: Direction, type: ClipType): string {
  return `${BASE}${stationId}_${direction}_${type}.mp3`;
}

/** Play a single clip, returning a promise that resolves when done. */
function playClip(url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (aborted) { reject(new Error("aborted")); return; }
    const audio = new Audio(url);
    current = audio;
    audio.addEventListener("ended", () => { current = null; resolve(); });
    audio.addEventListener("error", () => { current = null; resolve(); });
    audio.play().catch(() => { current = null; resolve(); });
  });
}

/** Pause between clips */
function wait(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (aborted) { reject(new Error("aborted")); return; }
    setTimeout(resolve, ms);
  });
}

/** Stop any playing announcement and cancel the sequence. */
export function stopAnnouncement() {
  aborted = true;
  if (current) {
    current.pause();
    current.currentTime = 0;
    current = null;
  }
}

/**
 * Play the full arrival sequence for a station:
 * 1. In-car announcement (shanai) — "次は〇〇"
 * 2. Brief pause
 * 3. Arrival jingle
 * 4. Platform announcement — "〇〇、ご乗車ありがとうございます"
 *
 * onPhase callback fires with the current phase name for UI updates.
 */
export async function playArrivalSequence(
  stationId: string,
  direction: Direction,
  onPhase?: (phase: "shanai" | "jingle" | "platform" | "done") => void,
): Promise<void> {
  aborted = false;

  try {
    // 1. In-car announcement
    onPhase?.("shanai");
    await playClip(clipUrl(stationId, direction, "shanai"));
    await wait(400);

    // 2. Arrival jingle
    onPhase?.("jingle");
    const jingleBase = import.meta.env.BASE_URL + "audio/jingles/";
    await playClip(`${jingleBase}${stationId}.mp3`);
    await wait(300);

    // 3. Platform announcement
    onPhase?.("platform");
    await playClip(clipUrl(stationId, direction, "platform"));

    onPhase?.("done");
  } catch {
    // Aborted — that's fine
  }
}
