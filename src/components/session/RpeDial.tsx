import React from 'react';
import { RPE_EMOJIS } from './SessionConstants';

interface RpeDialProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    subLabel: string;
}

export function RpeDial({ value, onChange, label, subLabel }: RpeDialProps) {
    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        const updateValue = (clientX: number) => {
            const relativeX = clientX - rect.left;
            const scale = rect.width / 300;
            const startX = 25 * scale;
            const endX = 275 * scale;
            const t = Math.min(1, Math.max(0, (relativeX - startX) / (endX - startX)));
            
            // Map t (0 to 1) to value (0 to 10)
            const newValue = Math.round(t * 10);
            onChange(newValue);
        };
        
        updateValue(e.clientX);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            updateValue(moveEvent.clientX);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        const updateValue = (clientX: number) => {
            const relativeX = clientX - rect.left;
            const scale = rect.width / 300;
            const startX = 25 * scale;
            const endX = 275 * scale;
            const t = Math.min(1, Math.max(0, (relativeX - startX) / (endX - startX)));
            
            const newValue = Math.round(t * 10);
            onChange(newValue);
        };
        
        updateValue(e.touches[0].clientX);

        const handleTouchMove = (moveEvent: TouchEvent) => {
            if (moveEvent.cancelable) {
                moveEvent.preventDefault();
            }
            updateValue(moveEvent.touches[0].clientX);
        };

        const handleTouchEnd = () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    };

    // Calculate Bezier coordinates (Gentle arc starting at x=25, ending at x=275)
    const getBezierPoint = (t: number) => {
        const x = (1 - t) * (1 - t) * 25 + 2 * (1 - t) * t * 150 + t * t * 275;
        const y = (1 - t) * (1 - t) * 45 + 2 * (1 - t) * t * 15 + t * t * 45;
        return { x, y };
    };

    // Create 10 segments representing intervals 0-1, 1-2, ..., 9-10
    const segments = [];
    for (let i = 0; i < 10; i++) {
        const tStart = i * 0.1 + 0.008;
        const tEnd = (i + 1) * 0.1 - 0.008;
        const start = getBezierPoint(tStart);
        const end = getBezierPoint(tEnd);
        segments.push({
            id: i + 1,
            d: `M ${start.x},${start.y} L ${end.x},${end.y}`,
            active: (i + 1) <= value
        });
    }

    const thumbT = value / 10;
    const thumbPos = getBezierPoint(thumbT);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col w-full select-none shadow-sm">
            <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1 ml-1">{label}</label>
            
            <div className="relative w-full flex flex-col items-center">
                <svg
                    viewBox="0 0 300 68"
                    className="w-full h-auto cursor-pointer touch-none"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Background & Active Segments */}
                    {segments.map((seg) => (
                        <path
                            key={seg.id}
                            d={seg.d}
                            stroke={seg.active ? '#a3e635' : '#27272a'}
                            strokeWidth={8}
                            strokeLinecap="round"
                            className="transition-colors duration-200"
                        />
                    ))}

                    {/* Wider transparent paths to make tapping segments easy */}
                    {segments.map((seg) => (
                        <path
                            key={`click-${seg.id}`}
                            d={seg.d}
                            stroke="transparent"
                            strokeWidth={20}
                            strokeLinecap="round"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(seg.id);
                            }}
                            className="cursor-pointer"
                        />
                    ))}

                    {/* Labels 1 and 10 at the ends */}
                    <text x="25" y="62" fill="#71717a" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                    <text x="275" y="62" fill="#71717a" fontSize="10" fontWeight="bold" textAnchor="middle">10</text>

                    {/* Slider Thumb (glowing green circle with '>') */}
                    {value > 0 && (
                        <g transform={`translate(${thumbPos.x}, ${thumbPos.y})`}>
                            {/* Glow */}
                            <circle r="14" fill="#a3e635" className="opacity-25 blur-[4px]" />
                            {/* Main Circle */}
                            <circle r="10" fill="#a3e635" stroke="#84cc16" strokeWidth="2" />
                            {/* Arrow icon > */}
                            <path d="M -1.5 -3 L 1.5 0 L -1.5 3" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    )}
                </svg>

                {/* Pill Selection Indicator */}
                {value > 0 ? (
                    <div className="bg-zinc-950 px-4 py-1.5 rounded-full border border-lime-400/20 text-lime-400 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(163,230,71,0.05)] cursor-pointer mt-1">
                        {subLabel} <span className="text-white">RPE {value}</span>
                        <svg className="w-2.5 h-2.5 text-lime-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                ) : (
                    <div className="bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-800 text-zinc-500 font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer mt-1">
                        Sem Esforço <span className="text-zinc-600">RPE 0</span>
                    </div>
                )}
            </div>
        </div>
    );
}
