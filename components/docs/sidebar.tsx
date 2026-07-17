"use client";

import Button from "../Common/button";

export type SectionId =
    | "introduction"
    | "variables"
    | "datatypes-basic"
    | "datatypes-arrays"
    | "datatypes-strings"
    | "datatypes-dict"
    | "print"
    | "input"
    | "ifelse"
    | "while"
    | "functions"
    | "operators"
    | "comments"
    | "examples";

type Leaf = { id: SectionId; label: string };
type NavItem = Leaf | { label: string; children: Leaf[] };

const SECTIONS: NavItem[] = [
    { id: "introduction", label: "소개" },
    { id: "variables",    label: "변수" },
    { label: "자료형", children: [
        { id: "datatypes-basic",   label: "기본" },
        { id: "datatypes-arrays",  label: "배열" },
        { id: "datatypes-strings", label: "문자열" },
        { id: "datatypes-dict",    label: "사전 (Dictionary)" },
    ]},
    { id: "print",        label: "출력" },
    { id: "input",        label: "입력" },
    { id: "ifelse",       label: "조건문 (if/else)" },
    { id: "while",        label: "반복문 (while / for / break)" },
    { id: "functions",    label: "함수" },
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
            backgroundColor: "var(--bg-panel)",
            borderRight: "1px solid var(--border-color)",
            padding: "24px 0",
            flexShrink: 0,
        }}>
            <div style={{
                color: "var(--text-muted)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "0 16px 12px",
            }}>
                한랭 문서
            </div>

            {SECTIONS.map((item) => {
                if ("children" in item) {
                    return (
                        <div key={item.label}>
                            <div style={{
                                color: "var(--text-muted)",
                                fontSize: 13,
                                padding: "7px 16px",
                            }}>
                                {item.label}
                            </div>
                            {item.children.map(({ id, label }) => {
                                const active = id === current;
                                return (
                                    <Button
                                        key={id}
                                        variant="ghost"
                                        size="md"
                                        onClick={() => onSelect(id)}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            textAlign: "left",
                                            borderRadius: 0,
                                            borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                                            borderTop: "none",
                                            borderRight: "none",
                                            borderBottom: "none",
                                            backgroundColor: active ? "var(--bg-surface)" : "transparent",
                                            color: active ? "var(--text-primary)" : "var(--text-muted)",
                                            padding: "7px 16px 7px 32px",
                                            fontSize: 13,
                                        }}
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    );
                }

                const { id, label } = item;
                const active = id === current;
                return (
                    <Button
                        key={id}
                        variant="ghost"
                        size="md"
                        onClick={() => onSelect(id)}
                        style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            borderRadius: 0,
                            borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                            borderTop: "none",
                            borderRight: "none",
                            borderBottom: "none",
                            backgroundColor: active ? "var(--bg-surface)" : "transparent",
                            color: active ? "var(--text-primary)" : "var(--text-muted)",
                            padding: "7px 16px",
                            fontSize: 13,
                        }}
                    >
                        {label}
                    </Button>
                );
            })}
        </nav>
    );
}
