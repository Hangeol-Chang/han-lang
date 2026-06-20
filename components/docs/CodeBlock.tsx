"use client";

type Props = {
    children: React.ReactNode;
    variant?: "code" | "output";
};

export default function CodeBlock({ children, variant = "code" }: Props) {
    const isOutput = variant === "output";
    return (
        <pre style={{
            backgroundColor: isOutput ? "var(--bg-base)" : "var(--bg-surface)",
            color: isOutput ? "var(--output-text)" : "var(--text-primary)",
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 1.6,
            padding: "12px 16px",
            borderRadius: 0,
            margin: "8px 0 16px",
            overflowX: "auto",
            borderLeft: isOutput ? "3px solid var(--accent)" : "3px solid var(--border-color)",
            whiteSpace: "pre",
        }}>
            {isOutput && (
                <span style={{ color: "var(--text-muted)", fontSize: 11, display: "block", marginBottom: 4 }}>출력 결과</span>
            )}
            {children}
        </pre>
    );
}
