"use client";

import React from "react";

type Variant = "default" | "success" | "danger" | "ghost";
type Size = "sm" | "md";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

const VARIANTS: Record<Variant, React.CSSProperties> = {
    default: {
        backgroundColor: "#2e2e2e",
        color: "#ccc",
        border: "1px solid #4a4a4a",
    },
    success: {
        backgroundColor: "#1a2e1a",
        color: "#6dbf6d",
        border: "1px solid #3a7a3a",
    },
    danger: {
        backgroundColor: "#2e1a1a",
        color: "#d97070",
        border: "1px solid #7a3a3a",
    },
    ghost: {
        backgroundColor: "transparent",
        color: "#888",
        border: "1px solid transparent",
    },
};

const SIZES: Record<Size, React.CSSProperties> = {
    sm: { fontSize: 12, padding: "3px 8px" },
    md: { fontSize: 13, padding: "5px 12px" },
};

export default function Button({
    children,
    onClick,
    variant = "default",
    size = "sm",
    disabled = false,
    className = "",
    style,
}: ButtonProps) {
    const [hovered, setHovered] = React.useState(false);

    const baseStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        borderRadius: 2,
        fontFamily: "inherit",
        fontWeight: 500,
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        outline: "none",
        transition: "background-color 0.1s, border-color 0.1s, color 0.1s",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...SIZES[size],
        ...VARIANTS[variant],
        ...(hovered && !disabled ? getHoverStyle(variant) : {}),
        ...style,
    };

    return (
        <button
            className={className}
            style={baseStyle}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

function getHoverStyle(variant: Variant): React.CSSProperties {
    switch (variant) {
        case "default":  return { backgroundColor: "#3a3a3a", borderColor: "#666", color: "#eee" };
        case "success":  return { backgroundColor: "#1e3a1e", borderColor: "#4caf50", color: "#80d080" };
        case "danger":   return { backgroundColor: "#3a1e1e", borderColor: "#c0504a", color: "#e88080" };
        case "ghost":    return { backgroundColor: "#2a2a2a", borderColor: "#444", color: "#bbb" };
    }
}
