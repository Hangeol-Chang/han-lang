"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeState } from "../../states/themeState";

const STORAGE_KEY = "han-lang-theme";

export default function ThemeToggle() {
    const [theme, setTheme] = useRecoilState(themeState);
    const isLight = theme === "light";

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        }
    }, [setTheme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            role="switch"
            aria-checked={isLight}
            aria-label="라이트/다크 모드 전환"
            style={{
                position: "relative",
                width: 42,
                height: 22,
                borderRadius: 11,
                border: "1px solid var(--border-color)",
                backgroundColor: isLight ? "#d1d5db" : "#3a3a3a",
                cursor: "pointer",
                padding: 2,
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                transition: "background-color 0.15s",
            }}
        >
            <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: isLight ? "#fbbf24" : "#1f2937",
                transform: isLight ? "translateX(18px)" : "translateX(0)",
                transition: "transform 0.15s",
            }}>
                {isLight ? <SunIcon /> : <MoonIcon />}
            </span>
        </button>
    );
}

function SunIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#92400e" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <g stroke="#92400e" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
    );
}
