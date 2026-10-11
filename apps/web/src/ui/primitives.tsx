import type { ReactNode } from 'react';
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10H3Z" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M9 16V9m5 7V5m5 11v-5" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15M3 4c4-1 7-1 9 1 2-2 5-2 9-1v15c-4-1-7-1-9 1-2-2-5-2-9-1Z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
      </>
    ),
    reset: (
      <>
        <path d="M4 8a8 8 0 1 1-1 7M4 3v5h5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths['book']}
    </svg>
  );
}
export function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>
        {value}
        <small>{suffix}</small>
      </strong>
    </div>
  );
}
export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  unit = '',
  step = 1,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange(n: number): void;
  unit?: string;
  step?: number;
}) {
  return (
    <div className="stepper">
      <div>
        <label>{label}</label>
        {unit && <small>{unit}</small>}
      </div>
      <div className="stepper-controls">
        <button
          aria-label={`Giảm ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          −
        </button>
        <output aria-label={label}>{value}</output>
        <button
          aria-label={`Tăng ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          +
        </button>
      </div>
    </div>
  );
}
export function Diagram({
  labels,
  values = [],
  active = -1,
}: {
  labels: string[];
  values?: (string | number)[];
  active?: number;
}) {
  return (
    <div className="diagram" role="group" aria-label="Các thành phần của mô hình">
      <ol>
        {labels.map((label, i) => (
          <li key={label} className={active === i ? 'active' : ''}>
            <span className="node-symbol">{i + 1}</span>
            <span>
              {label}
              {values[i] !== undefined && <strong>{values[i]}</strong>}
            </span>
            {i < labels.length - 1 && (
              <span className="node-arrow" aria-hidden="true">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
