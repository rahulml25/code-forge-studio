import React, { useState } from "react";
import {
  Save,
  Undo,
  Redo,
  Play,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  Settings,
  Users,
  Share,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export const Header: React.FC = () => {
  const {
    canvasMode,
    setCanvasMode,
    viewport,
    setViewport,
    zoom,
    setZoom,
    undo,
    redo,
    saveToHistory,
    projectSettings,
    updateProjectSettings,
    loadDemoContent,
  } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);

  const handleExport = () => {
    // Export functionality
    const code = useAppStore.getState().generateCode();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectSettings.name || "project"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo & Project Name */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UF</span>
            </div>
            <span className="font-semibold text-gray-900">UI Forge Studio</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={projectSettings.name}
              onChange={(e) => updateProjectSettings({ name: e.target.value })}
              className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              placeholder="Project Name"
            />
          </div>
        </div>

        {/* Center Section - Main Controls */}
        <div className="flex items-center space-x-2">
          {/* History Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={undo}
              className="toolbar-button p-2 border-r border-gray-300"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={redo}
              className="toolbar-button p-2"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={16} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setCanvasMode("design")}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                canvasMode === "design"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setCanvasMode("preview")}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors flex items-center space-x-1 ${
                canvasMode === "preview"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Play size={14} />
              <span>Preview</span>
            </button>
          </div>

          {/* Viewport Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            {Object.entries(viewportIcons).map(([view, Icon]) => (
              <button
                key={view}
                onClick={() =>
                  setViewport(view as "desktop" | "tablet" | "mobile")
                }
                className={`p-2 transition-colors ${
                  viewport === view
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } ${
                  view === "desktop"
                    ? "rounded-l-lg"
                    : view === "mobile"
                    ? "rounded-r-lg"
                    : ""
                }`}
                title={`${view.charAt(0).toUpperCase() + view.slice(1)} view`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="toolbar-button p-2 border-r border-gray-300"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(4, zoom + 0.25))}
              className="toolbar-button p-2 border-l border-gray-300"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={loadDemoContent}
            className="toolbar-button text-gray-700 hover:text-purple-600 flex items-center space-x-1"
            title="Load Demo Content"
          >
            <Sparkles size={16} />
            <span className="text-sm">Demo</span>
          </button>

          <button
            onClick={saveToHistory}
            className="toolbar-button text-gray-700 hover:text-blue-600"
            title="Save (Ctrl+S)"
          >
            <Save size={16} />
          </button>

          <button
            className="toolbar-button text-gray-700 hover:text-green-600"
            title="Collaboration"
          >
            <Users size={16} />
          </button>

          <button
            className="toolbar-button text-gray-700 hover:text-purple-600"
            title="Share"
          >
            <Share size={16} />
          </button>

          <button
            onClick={handleExport}
            className="toolbar-button text-gray-700 hover:text-orange-600"
            title="Export"
          >
            <Download size={16} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="toolbar-button text-gray-700 hover:text-gray-900"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full right-4 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Project Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectSettings.name}
                  onChange={(e) =>
                    updateProjectSettings({ name: e.target.value })
                  }
                  className="property-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={projectSettings.description}
                  onChange={(e) =>
                    updateProjectSettings({ description: e.target.value })
                  }
                  className="property-input resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Framework
                </label>
                <select
                  value={projectSettings.framework}
                  onChange={(e) =>
                    updateProjectSettings({ framework: e.target.value })
                  }
                  className="property-input"
                >
                  <option value="react">React</option>
                  <option value="html">HTML/CSS</option>
                  <option value="tailwind">Tailwind CSS</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
