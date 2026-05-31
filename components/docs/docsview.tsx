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
                backgroundColor: "#121212",
                color: "#ddd",
                maxWidth: 800,
            }}>
                <style>{`
                    article h1 { font-size: 26px; font-weight: 700; margin: 0 0 12px; color: #fff; }
                    article h2 { font-size: 18px; font-weight: 600; margin: 28px 0 10px; color: #e0e0e0; border-bottom: 1px solid #333; padding-bottom: 4px; }
                    article h3 { font-size: 15px; font-weight: 600; margin: 20px 0 8px; color: #ccc; }
                    article p  { margin: 0 0 12px; line-height: 1.7; color: #bbb; }
                    article ul, article ol { margin: 0 0 12px 20px; color: #bbb; line-height: 1.8; }
                    article code { background: #2b2b2b; padding: 2px 5px; border-radius: 3px; font-size: 13px; color: #e8c07d; font-family: monospace; }
                    article table { border-collapse: collapse; margin: 8px 0 16px; width: 100%; }
                    article th, article td { border: 1px solid #333; padding: 7px 12px; text-align: left; font-size: 13px; }
                    article th { background: #1e1e1e; color: #aaa; }
                    article td { color: #ccc; }
                    article blockquote { border-left: 3px solid #555; margin: 8px 0 16px; padding: 8px 16px; background: #1a1a1a; color: #888; font-size: 13px; }
                    article a { color: #4caf50; }
                `}</style>
                {CONTENT[section]}
            </main>
        </div>
    );
}
