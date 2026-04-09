/**
 * Ebisu station departure melody (chiptune arrangement)
 * Original: "The Third Man Theme" by Anton Karas
 * Note: The source melody is itself a copyrighted composition.
 * Reference: https://www.youtube.com/watch?v=2oEsWi88Qv0
 *
 * This is a transformative 8-bit cover, not a reproduction.
 */
import * as Tone from "tone";

export async function play(): Promise<void> {
  await Tone.start();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.3 },
    volume: -10,
  }).toDestination();

  const now = Tone.now();
  const notes: [string, number, string][] = [
    ["G4", 0, "8n"],
    ["B4", 0.25, "8n"],
    ["D5", 0.5, "4n"],
    ["D5", 0.9, "8n"],
    ["C5", 1.15, "8n"],
    ["B4", 1.4, "4n"],
    ["G4", 1.8, "8n"],
    ["B4", 2.05, "8n"],
    ["D5", 2.3, "4n"],
    ["D5", 2.7, "8n"],
    ["E5", 2.95, "8n"],
    ["D5", 3.2, "4n"],
    ["B4", 3.6, "4n."],
  ];

  for (const [note, offset, dur] of notes) {
    synth.triggerAttackRelease(note, dur, now + offset);
  }

  setTimeout(() => synth.dispose(), 6000);
}
