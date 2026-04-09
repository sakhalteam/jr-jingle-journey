import type { Station } from "../data/stations";
import { getAdjacentStations, yamanoteLine } from "../data/stations";

interface Props {
  station: Station;
  lineColor?: string;
}

export default function StationSign({ station, lineColor }: Props) {
  const color = lineColor ?? yamanoteLine.color;
  const adj = getAdjacentStations(station.id);

  return (
    <div className="station-sign" role="region" aria-label={`${station.romaji} station sign`}>
      {/* Line badge */}
      <div className="sign-line-badge" style={{ background: color }}>
        {yamanoteLine.nameJp}
      </div>

      {/* Main content */}
      <div className="sign-body">
        {/* Furigana */}
        <div className="sign-furigana">{station.furigana}</div>
        {/* Kanji */}
        <div className="sign-kanji">{station.kanji}</div>
        {/* Romaji */}
        <div className="sign-romaji">{station.romaji}</div>
      </div>

      {/* Adjacent stations bar */}
      {adj && (
        <div className="sign-adjacent" style={{ background: color }}>
          <div className="sign-adj-station sign-adj-prev">
            <span className="sign-adj-arrow">◀</span>
            <div>
              <span className="sign-adj-jp">{adj.prev.kanji}</span>
              <span className="sign-adj-en">{adj.prev.romaji}</span>
            </div>
          </div>
          <div className="sign-adj-station sign-adj-next">
            <div>
              <span className="sign-adj-jp">{adj.next.kanji}</span>
              <span className="sign-adj-en">{adj.next.romaji}</span>
            </div>
            <span className="sign-adj-arrow">▶</span>
          </div>
        </div>
      )}
    </div>
  );
}
