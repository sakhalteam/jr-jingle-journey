/**
 * Takadanobaba station departure melody (chiptune arrangement)
 * Original: "Astro Boy" (鉄腕アトム) theme
 * Note: The source melody is itself a copyrighted composition.
 * Reference: https://www.youtube.com/watch?v=BUvJc7vmhuU
 *
 * This is a transformative 8-bit cover, not a reproduction.
 */
import * as Tone from "tone";

export async function play(): Promise<void> {
  await Tone.start();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.2 },
    volume: -12,
  }).toDestination();

  const now = Tone.now();
  const notes: [string, number, string][] = [
    ["C5", 0, "8n"],
    ["E5", 0.2, "8n"],
    ["G5", 0.4, "4n"],
    ["E5", 0.8, "8n"],
    ["C5", 1.0, "4n"],
    ["D5", 1.4, "8n"],
    ["F5", 1.6, "8n"],
    ["A5", 1.8, "4n"],
    ["F5", 2.2, "8n"],
    ["D5", 2.4, "4n"],
    ["E5", 2.8, "8n"],
    ["G5", 3.0, "4n"],
    ["C6", 3.4, "2n"],
  ];

  for (const [note, offset, dur] of notes) {
    synth.triggerAttackRelease(note, dur, now + offset);
  }

  setTimeout(() => synth.dispose(), 6000);
}
