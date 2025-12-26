"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabPaneProps {
  tab: string;
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  activeKey: string;
  setActiveKey: (key: string) => void;
}>({
  activeKey: "",
  setActiveKey: () => {},
});

// Symbol to identify TabPane components
const TAB_PANE_SYMBOL = Symbol("TabPane");

export function Tabs({ defaultActiveKey, activeKey: controlledActiveKey, onChange, children, className }: TabsProps) {
  // Extract tabs and panes from children
  const tabs: Array<{ key: string; label: string }> = [];
  const panes: React.ReactElement[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      // Check if it has tab and tabKey props (indicating it's a TabPane)
      const props = child.props as any;
      if (props.tab && props.tabKey) {
        tabs.push({ key: props.tabKey, label: props.tab });
        panes.push(child);
      }
    }
  });

  // Determine initial active key
  const initialKey = controlledActiveKey || defaultActiveKey || (tabs.length > 0 ? tabs[0].key : "");
  const [internalActiveKey, setInternalActiveKey] = React.useState(initialKey);
  const isControlled = controlledActiveKey !== undefined;
  const currentActiveKey = isControlled ? (controlledActiveKey || initialKey) : internalActiveKey;

  const setActiveKey = React.useCallback(
    (key: string) => {
      if (!isControlled) {
        setInternalActiveKey(key);
      }
      onChange?.(key);
    },
    [isControlled, onChange]
  );

  // If no tabs found, render children as-is
  if (tabs.length === 0) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  return (
    <TabsContext.Provider value={{ activeKey: currentActiveKey, setActiveKey }}>
      <div className={cn("w-full", className)}>
        <div className="border-b border-border-primary mb-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveKey(tab.key)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-all duration-200 relative",
                  "border-b-2 border-transparent",
                  currentActiveKey === tab.key
                    ? "text-accent-primary border-accent-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                {tab.label}
                {currentActiveKey === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div>
          {panes.map((pane) => {
            const paneKey = (pane.props as any).tabKey;
            if (paneKey === currentActiveKey) {
              return <div key={paneKey}>{pane}</div>;
            }
            return null;
          })}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

export function TabPane({ children, className }: TabPaneProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}
