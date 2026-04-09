import { useState, useCallback } from "react";
import type { Station } from "../data/stations";
import YamanoteMap from "../components/YamanoteMap";
import StationSign from "../components/StationSign";
import { playJingle } from "../audio/jingles";

export default function Landing() {
  const [selected, setSelected] = useState<Station | null>(null);
  const [playing, setPlaying] = useState(false);

  const handleSelect = useCallback(
    async (station: Station) => {
      setSelected(station);
      if (playing) return;
      setPlaying(true);
      try {
        await playJingle(station.id);
      } finally {
        setTimeout(() => setPlaying(false), 3000);
      }
    },
    [playing]
  );

  return (
    <div className="landing">
      <header className="landing-header">
        <h1 className="landing-title">
          <span className="landing-title-jp">発車メロディ</span>
          <span className="landing-title-en">JR Jingle Journey</span>
        </h1>
        <p className="landing-subtitle">
          Click a station to hear its departure melody
        </p>
      </header>

      <div className="landing-layout">
        {/* Map */}
        <div className="landing-map">
          <YamanoteMap selectedId={selected?.id ?? null} onSelect={handleSelect} />
        </div>

        {/* Station sign panel */}
        <div className="landing-panel">
          {selected ? (
            <>
              <StationSign station={selected} />
              <div className="jingle-status">
                {selected.hasJingle ? (
                  playing ? (
                    <span className="jingle-playing">
                      ♪ Playing...
                    </span>
                  ) : (
                    <span className="jingle-ready">♪ Click again to replay</span>
                  )
                ) : (
                  <span className="jingle-coming-soon">
                    Jingle coming soon
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="panel-empty">
              <p className="panel-empty-icon">🚃</p>
              <p className="panel-empty-text">
                Select a station on the map
              </p>
              <p className="panel-empty-hint">
                Stations with a <span className="dot-indicator" /> have jingles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
