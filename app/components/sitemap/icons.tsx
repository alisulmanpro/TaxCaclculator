// Small icons for the sitemap page. They use currentColor, so the button text colour decides their colour.
type P = { size?: number };
const base = (size: number) => ({
  "aria-hidden": true as const,
  width: size,
  height: size,
  viewBox: "0 0 18 18",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const LinkIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M7.5 10.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.8.8M10.5 7.5a3 3 0 0 0-4.2 0L3.7 10.1a3 3 0 0 0 4.2 4.2l.8-.8" />
  </svg>
);
export const CheckIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="M3.5 9.5l3.5 3.5 7.5-8" />
  </svg>
);
export const QrIcon = ({ size = 18 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <rect x="2.5" y="2.5" width="5" height="5" rx="1" />
    <rect x="10.5" y="2.5" width="5" height="5" rx="1" />
    <rect x="2.5" y="10.5" width="5" height="5" rx="1" />
    <path d="M10.5 10.5h2v2M15.5 10.5v.01M10.5 15.5h.01M13.5 15.5h2v-2" />
  </svg>
);
export const SearchIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <circle cx="8" cy="8" r="5" />
    <path d="M12 12l3.5 3.5" />
  </svg>
);
export const OpenIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M6.5 3.5h-2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2M10 3.5h4.5V8M14.5 3.5L8 10" />
  </svg>
);
export const DownloadIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M9 2.5v8.5M5.5 7.5L9 11l3.5-3.5M3 14.5h12" />
  </svg>
);
export const CloseIcon = ({ size = 16 }: P) => (
  <svg {...base(size)} strokeWidth={2}>
    <path d="M4 4l10 10M14 4L4 14" />
  </svg>
);
export const PageIcon = ({ size = 22 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M4.5 2.5h6l3.5 3.5v9a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1v-11.5a1 1 0 0 1 1-1z" />
    <path d="M10.5 2.5V6H14M6 9.5h6M6 12.5h4" />
  </svg>
);
export const PostIcon = ({ size = 22 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3 4h12M3 7.5h12M3 11h7" />
    <path d="M12 15.5l3-3 1 1-3 3h-1z" />
  </svg>
);
