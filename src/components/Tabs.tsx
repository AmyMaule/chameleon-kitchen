import { useState } from "react";
import TinConversion from "./tin-conversion/TinConversion";
import UnitConversion from "./unit-conversion/UnitConversion";
import { TabBar } from "./TabBar";
import { TabItem } from "../types";

const tabData = [
  { id: "unit", label: "Unit converter" },
  { id: "tin", label: "Cake tin converter" }
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState<TabItem>(tabData[0]);

  return (
    <div className="recipe-section">
      <div className="tabs-container">
        <TabBar tabs={tabData} activeTabId={activeTab.id} onChange={setActiveTab} />
        <div className="tab-content">
          <h3 className="active-tab-title">
            <span className="intro-title-underline">{activeTab.label}</span>
          </h3>
          {activeTab.id === "unit" ? <UnitConversion /> : <TinConversion />}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
