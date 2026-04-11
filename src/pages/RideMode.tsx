import { useState, useCallback, useRef } from "react";
import { yamanoteStations } from "../data/stations";
import type { Station } from "../data/stations";
import type { Direction } from "../audio/announcements";
import { playArrivalSequence, stopAnnouncement } from "../audio/announcements";
import StationSign from "../components/StationSign";
import YamanoteMap from "../components/YamanoteMap";
import { Link } from "react-router-dom";

// Stations without announcement audio (opened after audio was recorded)
const SKIP_STATIONS = new Set(["takanawa_gateway"]);

type Phase = "idle" | "shanai" | "jingle" | "platform" | "done";

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Ready to depart",
  shanai: "In-car announcement...",
  jingle: "Arrival jingle...",
  platform: "Platform announcement...",
  done: "Arrived!",
};

export default function RideMode() {
  const [stationIdx, setStationIdx] = useState(0);
  const [direction, setDirection] = useState<Direction>("cw");
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  const station: Station = yamanoteStations[stationIdx];
  const len = yamanoteStations.length;

  const nextIdx = (direction === "cw")
    ? (stationIdx + 1) % len
    : (stationIdx - 1 + len) % len;
  const nextStation = yamanoteStations[nextIdx];

  const moveTo = useCallback(async (targetIdx: number) => {
    if (playingRef.current) return;
    const target = yamanoteStations[targetIdx];

    // Skip Takanawa Gateway (no audio)
    if (SKIP_STATIONS.has(target.id)) {
      const skipDirection = targetIdx > stationIdx || (stationIdx === len - 1 && targetIdx === 0)
        ? 1 : -1;
      const skipped = (targetIdx + skipDirection + len) % len;
      setStationIdx(skipped);
      return;
    }

    playingRef.current = true;
    setPlaying(true);

    await playArrivalSequence(target.id, direction, (p) => setPhase(p));

    setStationIdx(targetIdx);
    playingRef.current = false;
    setPlaying(false);
    setPhase("idle");
  }, [stationIdx, direction, len]);

  const goForward = useCallback(() => moveTo(nextIdx), [moveTo, nextIdx]);

  const prevIdx = (direction === "cw")
    ? (stationIdx - 1 + len) % len
    : (stationIdx + 1) % len;

  const goBack = useCallback(() => moveTo(prevIdx), [moveTo, prevIdx]);

  const toggleDirection = useCallback(() => {
    if (playing) return;
    setDirection(d => d === "cw" ? "ccw" : "cw");
  }, [playing]);

  const handleStop = useCallback(() => {
    stopAnnouncement();
    playingRef.current = false;
    setPlaying(false);
    setPhase("idle");
  }, []);

  const handleMapSelect = useCallback((s: Station) => {
    if (playing) return;
    const idx = yamanoteStations.findIndex(st => st.id === s.id);
    if (idx !== -1) setStationIdx(idx);
  }, [playing]);

  return (
    <div className="ride">
      <header className="ride-header">
        <Link to="/" className="ride-back-link">Map View</Link>
        <h1 className="ride-title">
          <span className="ride-title-jp">山手線に乗る</span>
          <span className="ride-title-en">Ride the Yamanote</span>
        </h1>
        <button
          className={`ride-direction-btn ${playing ? "ride-direction-btn--disabled" : ""}`}
          onClick={toggleDirection}
          disabled={playing}
          title={direction === "cw" ? "Clockwise (外回り)" : "Counter-clockwise (内回り)"}
        >
          {direction === "cw" ? "外回り CW" : "内回り CCW"}
          <span className="ride-direction-arrow">{direction === "cw" ? "↻" : "↺"}</span>
        </button>
      </header>

      <div className="ride-layout">
        {/* Map */}
        <div className="ride-map">
          <YamanoteMap selectedId={station.id} onSelect={handleMapSelect} />
        </div>

        {/* Conductor panel */}
        <div className="ride-panel">
          <StationSign station={station} />

          {/* Phase indicator */}
          <div className="ride-phase">
            <div className={`ride-phase-dot ${playing ? "ride-phase-dot--active" : ""}`} />
            <span className="ride-phase-text">{PHASE_LABELS[phase]}</span>
          </div>

          {/* Controls */}
          <div className="ride-controls">
            <button
              className="ride-btn ride-btn--back"
              onClick={goBack}
              disabled={playing}
              title="Previous stop"
            >
              <span className="ride-btn-arrow">&#9664;</span>
              <span className="ride-btn-label">Prev</span>
            </button>

            {playing ? (
              <button
                className="ride-btn ride-btn--stop"
                onClick={handleStop}
                title="Stop"
              >
                <span className="ride-btn-icon">&#9632;</span>
                <span className="ride-btn-label">Stop</span>
              </button>
            ) : (
              <button
                className="ride-btn ride-btn--next"
                onClick={goForward}
                title={`Next: ${nextStation.kanji}`}
              >
                <span className="ride-btn-label">Next</span>
                <span className="ride-btn-arrow">&#9654;</span>
              </button>
            )}
          </div>

          {/* Next station preview */}
          {!playing && (
            <div className="ride-next-preview">
              Next: <strong>{nextStation.kanji}</strong> ({nextStation.romaji})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
