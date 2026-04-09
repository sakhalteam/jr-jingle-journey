import { useState } from "react";
import { yamanoteStations, yamanoteLine } from "../data/stations";
import type { Station } from "../data/stations";

interface Props {
  selectedId: string | null;
  onSelect: (station: Station) => void;
}

/**
 * SVG loop map of the Yamanote Line.
 * 30 stations arranged in an ellipse (schematic, not geographic).
 */
export default function YamanoteMap({ selectedId, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const cx = 300;
  const cy = 280;
  const rx = 220;
  const ry = 250;

  // Position stations around the ellipse
  // Start from top (Ikebukuro area) and go clockwise
  const stationPositions = yamanoteStations.map((station, i) => {
    // Offset so Ikebukuro (~index 11) is at top
    const angle = ((i + 19) / yamanoteStations.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    return { station, x, y, angle };
  });

  // Build the loop path
  const pathPoints = stationPositions
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 600 560"
      className="yamanote-map"
      role="img"
      aria-label="Yamanote Line map"
    >
      {/* Loop track */}
      <path
        d={pathPoints + " Z"}
        fill="none"
        stroke={yamanoteLine.color}
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Station dots + labels */}
      {stationPositions.map(({ station, x, y, angle }) => {
        const isSelected = station.id === selectedId;
        const isHovered = station.id === hoveredId;
        const isRight = Math.cos(angle) > 0.1;
        const isLeft = Math.cos(angle) < -0.1;

        // Label anchor
        const labelX = isRight ? x + 16 : isLeft ? x - 16 : x;
        const labelY = Math.sin(angle) > 0.1 ? y + 18 : Math.sin(angle) < -0.1 ? y - 12 : y;
        const anchor = isRight ? "start" : isLeft ? "end" : "middle";

        return (
          <g
            key={station.id}
            className="station-dot-group"
            onClick={() => onSelect(station)}
            onMouseEnter={() => setHoveredId(station.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Glow ring on selected */}
            {isSelected && (
              <circle cx={x} cy={y} r="10" fill="none" stroke={yamanoteLine.color} strokeWidth="2" opacity="0.5">
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Station dot */}
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 7 : isHovered ? 6 : 5}
              fill={isSelected ? yamanoteLine.color : isHovered ? "#fff" : "#1a1a2e"}
              stroke={yamanoteLine.color}
              strokeWidth={isSelected ? 2.5 : 2}
            />

            {/* Jingle indicator */}
            {station.hasJingle && !isSelected && (
              <circle cx={x + 7} cy={y - 7} r="2.5" fill="#e05a3a" />
            )}

            {/* Label */}
            <text
              x={labelX}
              y={labelY}
              textAnchor={anchor}
              className={`station-label ${isSelected ? "station-label--selected" : ""} ${isHovered ? "station-label--hovered" : ""}`}
              fill={isSelected ? yamanoteLine.color : isHovered ? "#e8eaf0" : "#6b7280"}
              fontSize={isSelected ? "11" : "9.5"}
              fontWeight={isSelected ? "600" : "400"}
            >
              {station.kanji}
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill={yamanoteLine.color} fontSize="18" fontWeight="700" letterSpacing="0.05em">
        山手線
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#6b7280" fontSize="10" letterSpacing="0.1em">
        YAMANOTE LINE
      </text>
    </svg>
  );
}
