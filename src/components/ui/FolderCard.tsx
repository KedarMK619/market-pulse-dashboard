import type { ReactNode } from "react";

export type FolderTone = "mint" | "yellow" | "pink" | "cyan";

interface FolderCardProps {
  tone: FolderTone;
  label: string;
  value: string;
  trend?: string;
  metaLabel?: string;
  metaValue?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

const TONE_COLORS: Record<
  FolderTone,
  { bg: string; waveA: string; waveB: string }
> = {
  mint: {
    bg: "#1BF2B3",
    waveA: "#2563EB",
    waveB: "#EF4444",
  },
  yellow: {
    bg: "#FFE055",
    waveA: "#3B28CC",
    waveB: "#E11D48",
  },
  pink: {
    bg: "#FF7597",
    waveA: "#1D4ED8",
    waveB: "#141416",
  },
  cyan: {
    bg: "#38BDF8",
    waveA: "#1E1B4B",
    waveB: "#EC4899",
  },
};

/**
 * Notched folder-tab hero card matching the matte bento fintech design.
 */
export const FolderCard = ({
  tone,
  label,
  value,
  trend,
  metaLabel,
  metaValue,
  ctaLabel = "Details",
  onCtaClick,
  icon,
  className = "",
}: FolderCardProps) => {
  const palette = TONE_COLORS[tone];

  return (
    <div className={`relative select-none transition-transform duration-200 hover:-translate-y-0.5 ${className}`}>
      {/* Top folder tab + curved concave shoulder */}
      <div className="flex items-end">
        <div
          className="inline-flex items-center gap-2 px-4 pt-3 pb-1.5 rounded-t-[18px] min-w-[46%]"
          style={{ backgroundColor: palette.bg }}
        >
          {icon && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#141416] text-white">
              {icon}
            </span>
          )}
          <span className="text-xs font-semibold text-[#141416] truncate">{label}</span>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          className="-ml-[1px] shrink-0"
          aria-hidden="true"
        >
          <path d="M0 0 C0 10 8 18 18 18 L0 18 Z" fill={palette.bg} />
        </svg>
      </div>

      {/* Main folder body */}
      <div
        className="rounded-b-[22px] rounded-tr-[22px] px-5 pt-2 pb-4 text-[#141416] shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
        style={{ backgroundColor: palette.bg }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: metric + dual smooth wave sparkline */}
          <div className="min-w-0 flex-1">
            <p className="text-2xl sm:text-[26px] font-extrabold tracking-tight leading-tight text-[#141416] truncate">
              {value}
            </p>
            <svg
              viewBox="0 0 160 34"
              className="mt-2.5 h-8 w-full max-w-[165px]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 24 C 22 24, 28 8, 46 14 C 64 20, 74 4, 96 10 C 114 15, 132 22, 156 12"
                stroke={palette.waveA}
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              <path
                d="M2 29 C 24 27, 36 18, 56 23 C 76 28, 92 15, 114 19 C 132 22, 142 18, 156 22"
                stroke={palette.waveB}
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Right: trend, meta & dark pill CTA */}
          <div className="flex flex-col items-end text-right shrink-0 gap-1">
            {trend && (
              <span className="text-[11px] font-bold text-[#141416]/85">
                {trend}
              </span>
            )}
            {(metaLabel || metaValue) && (
              <div className="leading-tight">
                {metaLabel && (
                  <p className="text-[10px] font-medium text-[#141416]/70">
                    {metaLabel}
                  </p>
                )}
                {metaValue && (
                  <p className="text-xs font-bold text-[#141416]">{metaValue}</p>
                )}
              </div>
            )}
            {onCtaClick && (
              <button
                type="button"
                onClick={onCtaClick}
                className="mt-1 rounded-full bg-[#16161A] px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-black transition-colors cursor-pointer"
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
