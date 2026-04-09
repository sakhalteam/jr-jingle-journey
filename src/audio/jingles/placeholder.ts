/**
 * Placeholder beep for stations without a jingle yet.
 */
import * as Tone from "tone";

export async function play(): Promise<void> {
  await Tone.start();

  const synth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
    volume: -18,
  }).toDestination();

  synth.triggerAttackRelease("A5", "8n");
  setTimeout(() => synth.dispose(), 1000);
}
