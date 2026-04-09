/**
 * Shinjuku station departure melody (chiptune arrangement)
 * Original: "Twilight" by Takeshi Kobayashi
 * Reference: https://www.youtube.com/watch?v=u9_kMYGugTE
 *
 * This is a transformative 8-bit cover, not a reproduction.
 */
import * as Tone from "tone";

export async function play(): Promise<void> {
  await Tone.start();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.2 },
    volume: -12,
  }).toDestination();

  const now = Tone.now();
  const notes: [string, number, string][] = [
    // [note, time offset, duration]
    ["E5", 0, "8n"],
    ["D5", 0.2, "8n"],
    ["C5", 0.4, "8n"],
    ["D5", 0.6, "8n"],
    ["E5", 0.8, "4n"],
    ["E5", 1.2, "4n"],
    ["E5", 1.6, "2n"],
    ["D5", 2.4, "8n"],
    ["D5", 2.6, "8n"],
    ["D5", 2.8, "4n"],
    ["E5", 3.2, "8n"],
    ["G5", 3.4, "4n"],
    ["G5", 3.8, "2n"],
  ];

  for (const [note, offset, dur] of notes) {
    synth.triggerAttackRelease(note, dur, now + offset);
  }

  // Cleanup after playback
  setTimeout(() => synth.dispose(), 6000);
}
