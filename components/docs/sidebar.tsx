"use client";

export type SectionId =
    | "introduction"
    | "variables"
    | "datatypes"
    | "print"
    | "ifelse"
    | "while"
    | "operators"
    | "comments"
    | "examples";

const SECTIONS: { id: SectionId; label: string }[] = [
    { id: "introduction", label: "소개" },
    { id: "variables",    label: "변수" },
    { id: "datatypes",    label: "자료형" },
    { id: "print",        label: "출력" },
    { id: "ifelse",       label: "조건문 (if/else)" },
    { id: "while",        label: "반복문 (while)" },
    { id: "operators",    label: "연산자" },
    { id: "comments",     label: "주석" },
    { id: "examples",     label: "예제 모음" },
];

type Props = {
    current: SectionId;
    onSelect: (id: SectionId) => void;
};

export default function Sidebar({ current, onSelect }: Props) {
    return (
        <nav style={{
            width: 220,
            minHeight: "100%",
            backgroundColor: "#1e1e1e",
            borderRight: "1px solid #333",
            padding: "24px 0",
            flexShrink: 0,
        }}>
            <div style={{
                color: "#888",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                padding: "0 20px 12px",
            }}>
                한랭 문서
            </div>
            {SECTIONS.map(({ id, label }) => {
                const active = id === current;
                return (
                    <button
                        key={id}
                        onClick={() => onSelect(id)}
                        style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            background: active ? "#2a2a2a" : "transparent",
                            color: active ? "#fff" : "#aaa",
                            border: "none",
                            borderLeft: active ? "3px solid #4caf50" : "3px solid transparent",
                            padding: "8px 20px",
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "background 0.1s",
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </nav>
    );
}
