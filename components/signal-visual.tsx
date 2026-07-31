export function SignalVisual() {
  const bars = Array.from({ length: 22 });

  return (
    <div className="signal-visual" aria-hidden="true">
      <div className="signal-orbit signal-orbit-one" />
      <div className="signal-orbit signal-orbit-two" />
      <div className="signal-core">
        <span className="core-label">LIVE SIGNAL</span>
        <strong>72</strong>
        <span className="core-unit">BPM</span>
      </div>
      <div className="signal-bars">
        {bars.map((_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <div className="signal-caption">
        <span />
        CONTACTLESS PHYSIOLOGY
      </div>
    </div>
  );
}
