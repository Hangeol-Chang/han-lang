"use client";

type Props = {
    children: React.ReactNode;
    variant?: "code" | "output";
};

export default function CodeBlock({ children, variant = "code" }: Props) {
    const isOutput = variant === "output";
    return (
        <pre style={{
            backgroundColor: isOutput ? "#1a1a1a" : "#2b2b2b",
            color: isOutput ? "#a8e6a3" : "#e8e8e8",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 1.6,
            padding: "12px 16px",
            borderRadius: 6,
            margin: "8px 0 16px",
            overflowX: "auto",
            borderLeft: isOutput ? "3px solid #4caf50" : "3px solid #555",
            whiteSpace: "pre",
        }}>
            {isOutput && (
                <span style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4 }}>출력 결과</span>
            )}
            {children}
        </pre>
    );
}
