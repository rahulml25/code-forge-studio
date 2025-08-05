import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useAppStore } from "./store/useAppStore";
import { Header } from "./components/Header/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { EnhancedPropertiesPanel } from "./components/PropertiesPanel/EnhancedPropertiesPanel";
import { LayerPanel } from "./components/LayerPanel/LayerPanel";
import { CodePanel } from "./components/CodePanel/CodePanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { AIPanel } from "./components/AIPanel/AIPanel";
import { CollaborationIndicator } from "./components/Collaboration/CollaborationIndicator";

function App() {
  const {
    canvasMode,
    undo,
    redo,
    saveToHistory,
    setCanvasMode,
    selectedComponentId,
  } = useAppStore();

  // Keyboard shortcuts
  useHotkeys("ctrl+z", undo);
  useHotkeys("ctrl+y", redo);
  useHotkeys("ctrl+s", saveToHistory);
  useHotkeys("escape", () => useAppStore.getState().selectComponent(null));
  useHotkeys("p", () =>
    setCanvasMode(canvasMode === "design" ? "preview" : "design")
  );

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveToHistory, 30000);
    return () => clearInterval(interval);
  }, [saveToHistory]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Sidebar - Component Library */}
          <Panel defaultSize={20} minSize={15} maxSize={25}>
            <Sidebar />
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

          {/* Main Canvas Area */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              {canvasMode === "design" ? <Canvas /> : <PreviewPanel />}
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

          {/* Right Panel - Layers, Properties & Code */}
          <Panel defaultSize={30} minSize={25} maxSize={40}>
            <PanelGroup direction="vertical">
              {/* Layer Panel */}
              <Panel defaultSize={25} minSize={15}>
                <LayerPanel />
              </Panel>

              <PanelResizeHandle className="h-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

              {/* Properties Panel */}
              <Panel defaultSize={40} minSize={25}>
                <EnhancedPropertiesPanel />
              </Panel>

              <PanelResizeHandle className="h-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

              {/* Code Panel */}
              <Panel defaultSize={35} minSize={20}>
                <CodePanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      {/* AI Panel - Floating */}
      <AIPanel />

      {/* Collaboration Indicator */}
      <CollaborationIndicator />

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>CodeForge Studio</span>
          {selectedComponentId && (
            <span className="text-blue-600">
              Selected: {selectedComponentId}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>Mode: {canvasMode}</span>
          <span>Saved automatically</span>
        </div>
      </div>
    </div>
  );
}

export default App;
