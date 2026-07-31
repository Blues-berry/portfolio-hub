type IconProps = { className?: string };

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 5h8v8M15 5l-9.5 9.5" />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.63-.2.63-.45v-1.8c-2.57.56-3.11-1.09-3.11-1.09-.42-1.07-1.03-1.35-1.03-1.35-.84-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.83 1.42 2.17 1.01 2.7.77.08-.6.32-1.01.59-1.24-2.05-.23-4.2-1.02-4.2-4.57 0-1.01.36-1.84.95-2.48-.1-.23-.41-1.17.09-2.45 0 0 .78-.25 2.54.95A8.8 8.8 0 0 1 12 7.16c.79 0 1.56.1 2.3.31 1.76-1.2 2.54-.95 2.54-.95.5 1.28.19 2.22.1 2.45.59.64.94 1.47.94 2.48 0 3.55-2.16 4.33-4.21 4.56.33.29.62.85.62 1.72v2.6c0 .25.17.54.63.45A9.25 9.25 0 0 0 12 2.75Z" />
    </svg>
  );
}
