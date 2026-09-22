const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true }
export const Arrow = (p) => <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
export const Download = (p) => <svg {...base} {...p}><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
export const Copy = (p) => <svg {...base} {...p}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
export const Check = (p) => <svg {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>
export const Send = (p) => <svg {...base} {...p}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" /></svg>
export const Drag = (p) => <svg {...base} {...p}><path d="M5 9l-3 3 3 3M19 9l3 3-3 3M9 5l3-3 3 3M9 19l3 3 3-3M2 12h20M12 2v20" /></svg>
