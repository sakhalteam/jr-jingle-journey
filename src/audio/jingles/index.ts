import { play as playShinjuku } from "./shinjuku";
import { play as playEbisu } from "./ebisu";
import { play as playTakadanobaba } from "./takadanobaba";
import { play as playPlaceholder } from "./placeholder";

const jingleMap: Record<string, () => Promise<void>> = {
  shinjuku: playShinjuku,
  ebisu: playEbisu,
  takadanobaba: playTakadanobaba,
};

export function playJingle(stationId: string): Promise<void> {
  const fn = jingleMap[stationId] ?? playPlaceholder;
  return fn();
}
