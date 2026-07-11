"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import Editor from './editor';
import Terminal from './terminal';
import Button from '../Common/button';

type Direction = 'horizontal' | 'vertical';

const MIN_RATIO = 0.15;
const MAX_RATIO = 0.85;
// 이 너비보다 좁으면 기본값으로 위아래(세로) 보기를 사용한다.
const NARROW_BREAKPOINT = 700;

export default function IdeLayout() {
    const [direction, setDirection] = useState<Direction>('horizontal');
    const [ratio, setRatio] = useState(0.5);
    const [dividerHovered, setDividerHovered] = useState(false);
    const outerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const userOverride = useRef(false);

    useEffect(() => {
        const el = outerRef.current;
        if (!el) return;

        const applyResponsiveDirection = (width: number) => {
            if (userOverride.current) return;
            setDirection(width < NARROW_BREAKPOINT ? 'vertical' : 'horizontal');
        };

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                applyResponsiveDirection(entry.contentRect.width);
            }
        });
        observer.observe(el);
        applyResponsiveDirection(el.getBoundingClientRect().width);

        return () => observer.disconnect();
    }, []);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragging.current = true;
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newRatio = direction === 'horizontal'
            ? (e.clientX - rect.left) / rect.width
            : (e.clientY - rect.top) / rect.height;
        setRatio(Math.min(Math.max(newRatio, MIN_RATIO), MAX_RATIO));
    }, [direction]);

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const toggleDirection = () => {
        userOverride.current = true;
        setDirection(d => d === 'horizontal' ? 'vertical' : 'horizontal');
        setRatio(0.5);
    };

    const isHorizontal = direction === 'horizontal';

    const dividerStyle: React.CSSProperties = {
        flexShrink: 0,
        backgroundColor: dividerHovered ? 'var(--text-muted)' : 'var(--border-color)',
        transition: 'background-color 0.15s',
        ...(isHorizontal
            ? { width: 4, cursor: 'col-resize', height: '100%' }
            : { height: 4, cursor: 'row-resize', width: '100%' }
        ),
    };

    return (
        <div ref={outerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '3px 8px',
                backgroundColor: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-color)',
                gap: 6,
                flexShrink: 0,
            }}>
                <Button variant="ghost" size="sm" onClick={toggleDirection}>
                    {isHorizontal ? (
                        <>
                            <VerticalSplitIcon />
                            위아래로 보기
                        </>
                    ) : (
                        <>
                            <HorizontalSplitIcon />
                            좌우로 보기
                        </>
                    )}
                </Button>
            </div>

            {/* Split container */}
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    flexDirection: isHorizontal ? 'row' : 'column',
                    flex: 1,
                    overflow: 'hidden',
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* Editor pane */}
                <div style={{
                    ...(isHorizontal
                        ? { width: `${ratio * 100}%`, height: '100%' }
                        : { height: `${ratio * 100}%`, width: '100%' }
                    ),
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    <Editor />
                </div>

                {/* Drag handle */}
                <div
                    style={dividerStyle}
                    onPointerDown={handlePointerDown}
                    onMouseEnter={() => setDividerHovered(true)}
                    onMouseLeave={() => setDividerHovered(false)}
                />

                {/* Terminal pane */}
                <div style={{
                    ...(isHorizontal
                        ? { width: `${(1 - ratio) * 100}%`, height: '100%' }
                        : { height: `${(1 - ratio) * 100}%`, width: '100%' }
                    ),
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    <Terminal />
                </div>
            </div>
        </div>
    );
}

function HorizontalSplitIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="0" y="1" width="6" height="12" rx="1" opacity="0.8" />
            <rect x="8" y="1" width="6" height="12" rx="1" opacity="0.8" />
        </svg>
    );
}

function VerticalSplitIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="0" width="12" height="6" rx="1" opacity="0.8" />
            <rect x="1" y="8" width="12" height="6" rx="1" opacity="0.8" />
        </svg>
    );
}
