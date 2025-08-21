import React, { useState } from "react";
import { Settings, Palette, Layout, Type } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useAppStore } from "../../store/useAppStore";

const StyleGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <span
          className={`transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isExpanded && <div className="p-3 bg-gray-50">{children}</div>}
    </div>
  );
};

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-8 h-8 rounded border border-gray-300 shadow-sm"
          style={{ backgroundColor: value || "#ffffff" }}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="property-input flex-1"
          placeholder="#ffffff"
        />
      </div>
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <HexColorPicker color={value || "#ffffff"} onChange={onChange} />
          <button
            onClick={() => setShowPicker(false)}
            className="mt-2 w-full px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export const PropertiesPanel: React.FC = () => {
  const { selectedComponentId, components, updateComponent } = useAppStore();

  const selectedComponent = selectedComponentId
    ? components.find((c) => c.id === selectedComponentId)
    : null;

  if (!selectedComponent) {
    return (
      <div className="h-full bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Settings size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProperty = (path: string, value: any) => {
    const keys = path.split(".");
    const updates: any = {};

    if (keys[0] === "styles") {
      updates.styles = {
        ...selectedComponent.styles,
        [keys[1]]: value,
      };
    } else if (keys[0] === "props") {
      updates.props = {
        ...selectedComponent.props,
        [keys[1]]: value,
      };
    } else {
      updates[keys[0]] = value;
    }

    updateComponent(selectedComponent.id, updates);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Properties</h2>
        <div className="text-sm text-gray-600">
          Editing: <span className="font-medium">{selectedComponent.name}</span>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto">
        {/* General Properties */}
        <StyleGroup title="General" icon={<Settings size={16} />}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={selectedComponent.name}
                onChange={(e) => updateProperty("name", e.target.value)}
                className="property-input"
              />
            </div>

            {selectedComponent.type === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Content
                </label>
                <textarea
                  value={selectedComponent.props.children || ""}
                  onChange={(e) =>
                    updateProperty("props.children", e.target.value)
                  }
                  className="property-input resize-none"
                  rows={3}
                />
              </div>
            )}

            {selectedComponent.type === "button" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={selectedComponent.props.children || ""}
                  onChange={(e) =>
                    updateProperty("props.children", e.target.value)
                  }
                  className="property-input"
                />
              </div>
            )}

            {selectedComponent.type === "input" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={selectedComponent.props.placeholder || ""}
                  onChange={(e) =>
                    updateProperty("props.placeholder", e.target.value)
                  }
                  className="property-input"
                />
              </div>
            )}
          </div>
        </StyleGroup>

        {/* Layout Properties */}
        <StyleGroup title="Layout" icon={<Layout size={16} />}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="text"
                  value={selectedComponent.styles?.width || ""}
                  onChange={(e) =>
                    updateProperty("styles.width", e.target.value)
                  }
                  className="property-input"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={selectedComponent.styles?.height || ""}
                  onChange={(e) =>
                    updateProperty("styles.height", e.target.value)
                  }
                  className="property-input"
                  placeholder="auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margin
                </label>
                <input
                  type="text"
                  value={selectedComponent.styles?.margin || ""}
                  onChange={(e) =>
                    updateProperty("styles.margin", e.target.value)
                  }
                  className="property-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Padding
                </label>
                <input
                  type="text"
                  value={selectedComponent.styles?.padding || ""}
                  onChange={(e) =>
                    updateProperty("styles.padding", e.target.value)
                  }
                  className="property-input"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display
              </label>
              <select
                value={selectedComponent.styles?.display || "block"}
                onChange={(e) =>
                  updateProperty("styles.display", e.target.value)
                }
                className="property-input"
              >
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </StyleGroup>

        {/* Typography */}
        <StyleGroup title="Typography" icon={<Type size={16} />}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="text"
                value={selectedComponent.styles?.fontSize || ""}
                onChange={(e) =>
                  updateProperty("styles.fontSize", e.target.value)
                }
                className="property-input"
                placeholder="16px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                value={selectedComponent.styles?.fontWeight || "normal"}
                onChange={(e) =>
                  updateProperty("styles.fontWeight", e.target.value)
                }
                className="property-input"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Align
              </label>
              <select
                value={selectedComponent.styles?.textAlign || "left"}
                onChange={(e) =>
                  updateProperty("styles.textAlign", e.target.value)
                }
                className="property-input"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </StyleGroup>

        {/* Colors & Appearance */}
        <StyleGroup title="Appearance" icon={<Palette size={16} />}>
          <div className="space-y-3">
            <ColorInput
              label="Background Color"
              value={selectedComponent.styles?.backgroundColor || ""}
              onChange={(value) =>
                updateProperty("styles.backgroundColor", value)
              }
            />

            <ColorInput
              label="Text Color"
              value={selectedComponent.styles?.color || ""}
              onChange={(value) => updateProperty("styles.color", value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border
              </label>
              <input
                type="text"
                value={selectedComponent.styles?.border || ""}
                onChange={(e) =>
                  updateProperty("styles.border", e.target.value)
                }
                className="property-input"
                placeholder="1px solid #ccc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius
              </label>
              <input
                type="text"
                value={selectedComponent.styles?.borderRadius || ""}
                onChange={(e) =>
                  updateProperty("styles.borderRadius", e.target.value)
                }
                className="property-input"
                placeholder="0px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Box Shadow
              </label>
              <input
                type="text"
                value={selectedComponent.styles?.boxShadow || ""}
                onChange={(e) =>
                  updateProperty("styles.boxShadow", e.target.value)
                }
                className="property-input"
                placeholder="none"
              />
            </div>
          </div>
        </StyleGroup>
      </div>
    </div>
  );
};
