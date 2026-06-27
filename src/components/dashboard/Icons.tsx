type IconProps = { size?: number; color?: string };

const base = (size = 16, color = "currentColor") => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHouse = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M10 21v-6h4v6" />
  </svg>
);

export const IconChat = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-9a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />
  </svg>
);

export const IconLightbulb = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7c1 .7 1.5 2 1.5 3.3h5c0-1.3.5-2.6 1.5-3.3A7 7 0 0 0 12 2Z" />
  </svg>
);

export const IconBook = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  </svg>
);

export const IconBranch = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
    <path d="M6 8.5v7" />
    <path d="M6 12h6a4 4 0 0 0 4-4V8.5" />
  </svg>
);

export const IconClipboard = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <rect x="8" y="3" width="8" height="4" rx="0" />
    <path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
);

export const IconSettings = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
  </svg>
);

export const IconPlug = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M9 2v6" />
    <path d="M15 2v6" />
    <path d="M7 8h10v5a5 5 0 0 1-10 0V8Z" />
    <path d="M12 17v5" />
  </svg>
);

export const IconSearch = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconFilter = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M3 5h18" />
    <path d="M6 12h12" />
    <path d="M10 19h4" />
  </svg>
);

export const IconPlus = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const IconX = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const IconCheck = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const IconChevronDown = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconChevronRight = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IconArrowUp = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const IconArrowDown = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export const IconPhone = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 13 13 0 0 0 .7 2.8 2 2 0 0 1-.4 2L8 9.6a16 16 0 0 0 6 6l1.1-1.4a2 2 0 0 1 2-.4 13 13 0 0 0 2.9.7 2 2 0 0 1 1.7 2Z" />
  </svg>
);

export const IconUpload = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m17 8-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

export const IconFile = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </svg>
);

export const IconGlobe = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
  </svg>
);

export const IconUser = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const IconClock = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconStar = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="m12 2 3 6.5 7 1-5 5 1.2 7L12 18l-6.3 3.5L7 14.5l-5-5 7-1Z" />
  </svg>
);

export const IconMenuDots = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
);

export const IconEdit = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M14 4 20 10 8 22H2v-6Z" />
    <path d="m13 5 6 6" />
  </svg>
);

export const IconTrash = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

export const IconCopy = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <rect x="9" y="9" width="13" height="13" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconDownload = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

export const IconAlert = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export const IconInfo = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
);

export const IconRefresh = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const IconEye = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = ({ size, color }: IconProps) => (
  <svg {...base(size, color)}>
    <path d="M9.9 4.2A10 10 0 0 1 12 4c6 0 10 8 10 8a18 18 0 0 1-2.6 3.6" />
    <path d="M6.6 6.6A18 18 0 0 0 2 12s4 8 10 8a10 10 0 0 0 4.5-1.1" />
    <path d="m1 1 22 22" />
    <path d="M14 14a3 3 0 1 1-4.2-4.2" />
  </svg>
);
