/** Original SVG artwork: a shared 4-unit sprite grid; labels stay real HTML text. */
export function PixelBuilding({ district = 0 }: { district?: number }) {
  const color = ['#2447d8', '#38846b', '#9b6834', '#5964a4', '#367d99', '#80577f'][district % 6];
  return (
    <svg viewBox="0 0 96 80" width="96" height="80" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#9fb5cb" d="M4 60h76v8H4zM16 68h76v8H16z" />
      <path fill="#14203b" d="M20 12h48v8h12v48H12V20h8z" />
      <path fill={color} d="M20 24h52v36H20z" />
      <path fill="#f4f7ff" d="M28 32h12v8H28zm24 0h12v8H52zM28 48h12v8H28zm24 0h12v8H52z" />
      <path fill="#ffcf56" d="M24 8h40v12H24z" />
      {district % 3 === 1 && <path fill="#14203b" d="M8 24h76v8H8zm24 20h24v8H32z" />}
      {district % 3 === 2 && <path fill="#14203b" d="M32 0h8v12h-8zm16 0h8v12h-8zM8 48h80v8H8z" />}
    </svg>
  );
}

export function PixelCity({ step }: { step: number }) {
  const stops = [
    [76, 174],
    [224, 112],
    [388, 174],
    [224, 246],
  ];
  const [x, y] = stops[step] ?? stops[0]!;
  return (
    <svg
      className="pixel-city"
      viewBox="0 0 480 320"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path fill="#8fc4d8" d="M16 192 224 88l240 120v24L256 320 16 212z" />
      <path fill="#b6d8b3" d="M16 176 224 72l240 120-208 104z" />
      <path fill="#edf1e4" d="m52 174 172-86 204 102-172 86z" />
      <path fill="none" stroke="#8194a5" strokeWidth="24" d="m88 184 148-74 164 82-148 74z" />
      <path
        fill="none"
        stroke="#f4f7ff"
        strokeWidth="2"
        strokeDasharray="8 8"
        d="m88 184 148-74 164 82-148 74z"
      />
      <g transform="translate(44 92)">
        <PixelBuilding district={0} />
      </g>
      <g transform="translate(192 28)">
        <PixelBuilding district={2} />
      </g>
      <g transform="translate(356 92)">
        <PixelBuilding district={1} />
      </g>
      <g transform="translate(192 164)">
        <PixelBuilding district={3} />
      </g>
      <path
        fill="#38846b"
        d="M36 216h8v-16h8v-12h8v12h8v16h8v8H36zm364 16h8v-16h8v-12h8v12h8v16h8v8h-40z"
      />
      <g className="city-parcel" style={{ transform: `translate(${x}px, ${y}px)` }}>
        <path fill="#14203b" d="M-4-4h32v28H-4z" />
        <path fill="#ffcf56" d="M0 0h24v20H0z" />
        <path fill="#a16f2f" d="M8 0h8v8H8zM0 16h24v4H0z" />
      </g>
    </svg>
  );
}
