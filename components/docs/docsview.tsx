"use client";

import { useState } from "react";
import Sidebar, { SectionId } from "./sidebar";
import Introduction from "./content/Introduction";
import Variables from "./content/Variables";
import DataTypes from "./content/DataTypes";
import Print from "./content/Print";
import IfElse from "./content/IfElse";
import While from "./content/While";
import Operators from "./content/Operators";
import Comments from "./content/Comments";
import Examples from "./content/Examples";

const CONTENT: Record<SectionId, React.ReactNode> = {
    introduction: <Introduction />,
    variables:    <Variables />,
    datatypes:    <DataTypes />,
    print:        <Print />,
    ifelse:       <IfElse />,
    while:        <While />,
    operators:    <Operators />,
    comments:     <Comments />,
    examples:     <Examples />,
};

export default function Docsview() {
    const [section, setSection] = useState<SectionId>("introduction");

    return (
        <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
            <Sidebar current={section} onSelect={setSection} />
            <main style={{
                flex: 1,
                padding: "32px 48px",
                overflowY: "auto",
                backgroundColor: "var(--bg-base)",
                color: "var(--text-secondary)",
                maxWidth: 800,
            }}>
                <style>{`
                    article h1 { font-size: 26px; font-weight: 700; margin: 0 0 12px; color: var(--text-primary); }
                    article h2 { font-size: 18px; font-weight: 600; margin: 28px 0 10px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 4px; }
                    article h3 { font-size: 15px; font-weight: 600; margin: 20px 0 8px; color: var(--text-primary); }
                    article p  { margin: 0 0 12px; line-height: 1.7; color: var(--text-secondary); }
                    article ul, article ol { margin: 0 0 12px 20px; color: var(--text-secondary); line-height: 1.8; }
                    article code { background: var(--bg-surface); padding: 2px 5px; border-radius: 3px; font-size: 13px; color: var(--code-text); font-family: monospace; }
                    article table { border-collapse: collapse; margin: 8px 0 16px; width: 100%; }
                    article th, article td { border: 1px solid var(--border-color); padding: 7px 12px; text-align: left; font-size: 13px; }
                    article th { background: var(--bg-panel); color: var(--text-secondary); }
                    article td { color: var(--text-secondary); }
                    article blockquote { border-left: 3px solid var(--border-color); margin: 8px 0 16px; padding: 8px 16px; background: var(--bg-panel); color: var(--text-muted); font-size: 13px; }
                    article a { color: var(--accent); }
                `}</style>
                {CONTENT[section]}
            </main>
        </div>
    );
}
