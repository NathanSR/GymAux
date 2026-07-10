import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RPE_EMOJIS, RPE_OPTIONS } from './SessionConstants';

interface RpeDialProps {
    value: number;
    onChange: (value: number) => void;
    label: string;
    subLabel: string;
}

export function RpeDial({ value, onChange, label, subLabel }: RpeDialProps) {
    const [startX, setStartX] = useState<number | null>(null);
    const [startValue, setStartValue] = useState<number>(value);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate position for tick marks on a circular arc (270 degrees total, -135 to 135)
    // Center is (0,0) in flex translation coordinates
    const getTickPosition = (index: number, radius: number) => {
        // -135deg is starting point. Arc spans 270deg. 
        // 90deg is subtracted to rotate the arc to match standard SVG orientation (where 0 deg is right/3 o'clock)
        const angleRad = ((index / 10) * 270 - 135 - 90) * (Math.PI / 180);
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        return { x, y };
    };

    // Calculate rotation angle for the knob pointer (dot)
    const angle = (value / 10) * 270 - 135;

    // SVG parameters for the gauge ring (centered at 96, 96 in a 192x192 viewBox)
    const radius = 58;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270 degrees is 75% of a full circle
    const gapLength = circumference - arcLength;
    const activeLength = (value / 10) * arcLength;

    // Handle horizontal drag
    const handleDragStart = (clientX: number) => {
        setStartX(clientX);
        setStartValue(value);
        setIsDragging(true);
    };

    const handleDragMove = (clientX: number) => {
        if (startX === null) return;
        const diffX = clientX - startX;
        // 12 pixels of horizontal movement equals 1 RPE step
        const stepChange = Math.round(diffX / 12);
        const newValue = Math.min(10, Math.max(0, startValue + stepChange));
        if (newValue !== value) {
            onChange(newValue);
        }
    };

    const handleDragEnd = () => {
        setStartX(null);
        setIsDragging(false);
    };

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null) return;
        // Prevent scrolling while adjusting the dial
        if (e.cancelable) {
            e.preventDefault();
        }
        handleDragMove(e.touches[0].clientX);
    };

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        handleDragStart(e.clientX);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            handleDragMove(moveEvent.clientX);
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            handleDragEnd();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // Keyboard accessibility
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            onChange(Math.min(10, value + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            onChange(Math.max(0, value - 1));
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col items-center select-none transition-all duration-300 w-full">
            {/* Header / Info labels */}
            <div className="flex justify-between items-center w-full mb-6">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</label>
                <div className="flex items-center gap-1.5 bg-lime-400/10 px-2.5 py-1 rounded-full border border-lime-400/20">
                    <span className="text-[9px] text-lime-400 font-black uppercase tracking-wider">{subLabel}</span>
                    <span className="text-[11px] font-black text-lime-400 italic">RPE {value}</span>
                </div>
            </div>

            {/* Dial Area */}
            <div 
                className="relative w-48 h-48 flex items-center justify-center focus:outline-none"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* SVG Gauge Track and Active Ring - centered with viewBox */}
                <svg 
                    viewBox="0 0 192 192" 
                    className="w-full h-full absolute top-0 left-0 pointer-events-none -rotate-90"
                >
                    <defs>
                        <linearGradient id="rpeGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a3e635" />
                            <stop offset="100%" stopColor="#84cc16" />
                        </linearGradient>
                    </defs>
                    {/* Background Track */}
                    <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        fill="transparent"
                        stroke="#27272a"
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${arcLength} ${gapLength}`}
                        style={{
                            transform: 'rotate(135deg)',
                            transformOrigin: '96px 96px'
                        }}
                        strokeLinecap="round"
                    />
                    {/* Active Gauge Fill */}
                    <motion.circle
                        cx="96"
                        cy="96"
                        r={radius}
                        fill="transparent"
                        stroke="url(#rpeGaugeGradient)"
                        strokeWidth={strokeWidth + 1}
                        strokeDasharray={`${arcLength} ${gapLength}`}
                        animate={{ strokeDashoffset: arcLength - activeLength }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        style={{
                            transform: 'rotate(135deg)',
                            transformOrigin: '96px 96px'
                        }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Tick Marks and Labels in Arc */}
                {RPE_OPTIONS.map((val) => {
                    const tickPos = getTickPosition(val, 74);
                    const textPos = getTickPosition(val, 86);
                    const isActive = value === val;
                    const isPassed = val <= value;
                    
                    return (
                        <div key={val} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Tiny Tick Circle */}
                            <button
                                type="button"
                                onClick={() => onChange(val)}
                                className={`absolute w-1.5 h-1.5 rounded-full pointer-events-auto cursor-pointer transition-all duration-300 ${
                                    isActive
                                        ? 'bg-lime-400 scale-125 shadow-[0_0_8px_#a3e635]'
                                        : isPassed
                                        ? 'bg-lime-600/60'
                                        : 'bg-zinc-700 hover:bg-zinc-500'
                                }`}
                                style={{
                                    transform: `translate(${tickPos.x}px, ${tickPos.y}px)`
                                }}
                            />
                            {/* Text label */}
                            <button
                                type="button"
                                onClick={() => onChange(val)}
                                className={`absolute text-[10px] font-black pointer-events-auto cursor-pointer transition-all duration-200 ${
                                    isActive 
                                        ? 'text-lime-400 scale-110' 
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                                style={{
                                    transform: `translate(${textPos.x}px, ${textPos.y}px)`
                                }}
                            >
                                {val}
                            </button>
                        </div>
                    );
                })}

                {/* Main Rotatable Center Knob */}
                <motion.div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleDragEnd}
                    className={`relative w-24 h-24 rounded-full bg-zinc-950 border-[3px] transition-colors duration-300 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center shadow-[inset_0_4px_12px_rgba(255,255,255,0.03),0_10px_25px_rgba(0,0,0,0.5)] ${
                        isDragging ? 'border-lime-400/70 shadow-[0_0_15px_rgba(163,230,71,0.1)]' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                >
                    {/* Glowing Inner Needle Indicator - rotates with RPE value */}
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        animate={{ rotate: angle }}
                        transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    >
                        {/* Pointer Dot */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-lime-400 rounded-full shadow-[0_0_8px_#a3e635]" />
                        {/* Fine line indicator */}
                        <div className="absolute top-3.5 bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 bg-lime-400/20" />
                    </motion.div>

                    {/* Static content container (never rotates, so emojis are always upright) */}
                    <div className="z-10 pointer-events-none flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={value}
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.7, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-3xl"
                            >
                                {RPE_EMOJIS[value]?.emoji}
                            </motion.span>
                        </AnimatePresence>
                        <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest mt-1">ARRASQUE</span>
                    </div>
                </motion.div>
            </div>
            
            {/* Quick adjust indicators */}
            <p className="text-[10px] text-zinc-500 font-bold tracking-tight text-center mt-2 max-w-[200px]">
                Gire o botão para os lados ou clique nos números ao redor para ajustar
            </p>
        </div>
    );
}
