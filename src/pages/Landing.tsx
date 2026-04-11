import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Station } from "../data/stations";
import YamanoteMap from "../components/YamanoteMap";
import StationSign from "../components/StationSign";
import { playJingle, stopJingle } from "../audio/jingles";

export default function Landing() {
  const [selected, setSelected] = useState<Station | null>(null);
  const [playing, setPlaying] = useState(false);

  const handleSelect = useCallback(
    async (station: Station) => {
      stopJingle();
      setSelected(station);
      setPlaying(true);
      try {
        await playJingle(station.id);
      } finally {
        setPlaying(false);
      }
    },
    []
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
        <Link to="/ride" className="ride-launch-btn">
          Ride the Yamanote
        </Link>
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
                {playing ? (
                  <span className="jingle-playing">♪ Playing...</span>
                ) : (
                  <span className="jingle-ready">♪ Click again to replay</span>
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
                Every station has a departure melody!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
