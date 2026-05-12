import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { TabItem } from "../types";

interface TabBarProps {
  tabs: readonly TabItem[];
  activeTabId: string;
  onChange: (tab: TabItem) => void;
}

export const TabBar = ({ tabs, activeTabId, onChange }: TabBarProps) => {
  const [fontsReady, setFontsReady] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightPos, setHighlightPos] = useState({ left: 0, width: 0 });

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsReady(true);
    });
  }, []);

  useLayoutEffect(() => {
    // Hold off on measuring the width of the highlight until the font has fully loaded
    if (!fontsReady) return;
    const index = tabs.findIndex(tab => tab.id === activeTabId);
    const el = tabsRef.current[index];
    if (!el) return;

    setHighlightPos({
      left: el.offsetLeft,
      width: el.offsetWidth
    });
  }, [activeTabId, fontsReady, tabs]);

  return (
    <div className="tabs-btn-container" style={{ position: "relative" }}>
      <span
        className="tab-background"
        style={{
          left: highlightPos.left,
          width: highlightPos.width
        }}
      />
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={el => (tabsRef.current[index] = el)}
          className={`btn-tab${activeTabId === tab.id ? " selected" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
