import React, { useState } from "react";
import {
  Settings,
  Palette,
  Layout,
  Type,
  Move,
  Layers,
  Grid,
  LayoutGrid,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useAppStore } from "../../store/useAppStore";
import { Component } from "../../types";

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
      {isExpanded && <div className="p-3 bg-gray-50 space-y-3">{children}</div>}
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
          className="w-8 h-8 rounded border border-gray-300"
          style={{ backgroundColor: value || "#ffffff" }}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
          placeholder="Color value"
        />
      </div>
      {showPicker && (
        <div className="absolute top-full left-0 z-50 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg">
          <HexColorPicker color={value || "#ffffff"} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const NumberInput: React.FC<{
  label: string;
  value: number | string | undefined;
  onChange: (value: string) => void;
  unit?: string;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, unit = "", min, max }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-1">
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value + unit)}
          min={min}
          max={max}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
        />
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};

const SelectInput: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="">Default</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextInput: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />
    </div>
  );
};

export const EnhancedPropertiesPanel: React.FC = () => {
  const { selectedComponentId, components, updateComponent } = useAppStore();

  const selectedComponent = components.find(
    (comp: Component) => comp.id === selectedComponentId
  );

  if (!selectedComponent) {
    return (
      <div className="bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a component to edit properties
        </div>
      </div>
    );
  }

  const updateStyle = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        [key]: value,
      },
    });
  };

  const styles = selectedComponent.styles || {};

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        <p className="text-sm text-gray-600 mt-1">
          {selectedComponent.name || selectedComponent.type}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Layout & Positioning */}
        <StyleGroup title="Layout & Position" icon={<Move size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="Position"
              value={styles.position}
              onChange={(value) => updateStyle("position", value)}
              options={[
                { value: "static", label: "Static" },
                { value: "relative", label: "Relative" },
                { value: "absolute", label: "Absolute" },
                { value: "fixed", label: "Fixed" },
                { value: "sticky", label: "Sticky" },
              ]}
            />
            <NumberInput
              label="Z-Index"
              value={styles.zIndex}
              onChange={(value) => updateStyle("zIndex", parseInt(value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Top"
              value={styles.top}
              onChange={(value) => updateStyle("top", value)}
              placeholder="0px"
            />
            <TextInput
              label="Right"
              value={styles.right}
              onChange={(value) => updateStyle("right", value)}
              placeholder="0px"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Bottom"
              value={styles.bottom}
              onChange={(value) => updateStyle("bottom", value)}
              placeholder="0px"
            />
            <TextInput
              label="Left"
              value={styles.left}
              onChange={(value) => updateStyle("left", value)}
              placeholder="0px"
            />
          </div>
        </StyleGroup>

        {/* Dimensions */}
        <StyleGroup title="Dimensions" icon={<Layout size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Width"
              value={styles.width}
              onChange={(value) => updateStyle("width", value)}
              placeholder="auto"
            />
            <TextInput
              label="Height"
              value={styles.height}
              onChange={(value) => updateStyle("height", value)}
              placeholder="auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Min Width"
              value={styles.minWidth}
              onChange={(value) => updateStyle("minWidth", value)}
              placeholder="0"
            />
            <TextInput
              label="Max Width"
              value={styles.maxWidth}
              onChange={(value) => updateStyle("maxWidth", value)}
              placeholder="none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Min Height"
              value={styles.minHeight}
              onChange={(value) => updateStyle("minHeight", value)}
              placeholder="0"
            />
            <TextInput
              label="Max Height"
              value={styles.maxHeight}
              onChange={(value) => updateStyle("maxHeight", value)}
              placeholder="none"
            />
          </div>
        </StyleGroup>

        {/* Flexbox */}
        <StyleGroup title="Flexbox" icon={<LayoutGrid size={16} />}>
          <SelectInput
            label="Display"
            value={styles.display}
            onChange={(value) => updateStyle("display", value)}
            options={[
              { value: "block", label: "Block" },
              { value: "inline", label: "Inline" },
              { value: "inline-block", label: "Inline Block" },
              { value: "flex", label: "Flex" },
              { value: "inline-flex", label: "Inline Flex" },
              { value: "grid", label: "Grid" },
              { value: "inline-grid", label: "Inline Grid" },
              { value: "none", label: "None" },
            ]}
          />

          {(styles.display === "flex" || styles.display === "inline-flex") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Direction"
                  value={styles.flexDirection}
                  onChange={(value) => updateStyle("flexDirection", value)}
                  options={[
                    { value: "row", label: "Row" },
                    { value: "row-reverse", label: "Row Reverse" },
                    { value: "column", label: "Column" },
                    { value: "column-reverse", label: "Column Reverse" },
                  ]}
                />
                <SelectInput
                  label="Wrap"
                  value={styles.flexWrap}
                  onChange={(value) => updateStyle("flexWrap", value)}
                  options={[
                    { value: "nowrap", label: "No Wrap" },
                    { value: "wrap", label: "Wrap" },
                    { value: "wrap-reverse", label: "Wrap Reverse" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Justify Content"
                  value={styles.justifyContent}
                  onChange={(value) => updateStyle("justifyContent", value)}
                  options={[
                    { value: "flex-start", label: "Start" },
                    { value: "flex-end", label: "End" },
                    { value: "center", label: "Center" },
                    { value: "space-between", label: "Space Between" },
                    { value: "space-around", label: "Space Around" },
                    { value: "space-evenly", label: "Space Evenly" },
                  ]}
                />
                <SelectInput
                  label="Align Items"
                  value={styles.alignItems}
                  onChange={(value) => updateStyle("alignItems", value)}
                  options={[
                    { value: "stretch", label: "Stretch" },
                    { value: "flex-start", label: "Start" },
                    { value: "flex-end", label: "End" },
                    { value: "center", label: "Center" },
                    { value: "baseline", label: "Baseline" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <TextInput
                  label="Gap"
                  value={styles.gap}
                  onChange={(value) => updateStyle("gap", value)}
                  placeholder="0px"
                />
                <TextInput
                  label="Row Gap"
                  value={styles.rowGap}
                  onChange={(value) => updateStyle("rowGap", value)}
                  placeholder="0px"
                />
                <TextInput
                  label="Column Gap"
                  value={styles.columnGap}
                  onChange={(value) => updateStyle("columnGap", value)}
                  placeholder="0px"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <NumberInput
                  label="Grow"
                  value={styles.flexGrow}
                  onChange={(value) =>
                    updateStyle("flexGrow", parseInt(value) || 0)
                  }
                />
                <NumberInput
                  label="Shrink"
                  value={styles.flexShrink}
                  onChange={(value) =>
                    updateStyle("flexShrink", parseInt(value) || 1)
                  }
                />
                <TextInput
                  label="Basis"
                  value={styles.flexBasis}
                  onChange={(value) => updateStyle("flexBasis", value)}
                  placeholder="auto"
                />
              </div>
            </>
          )}
        </StyleGroup>

        {/* Grid */}
        <StyleGroup title="Grid" icon={<Grid size={16} />}>
          {(styles.display === "grid" || styles.display === "inline-grid") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  label="Template Columns"
                  value={styles.gridTemplateColumns}
                  onChange={(value) =>
                    updateStyle("gridTemplateColumns", value)
                  }
                  placeholder="1fr"
                />
                <TextInput
                  label="Template Rows"
                  value={styles.gridTemplateRows}
                  onChange={(value) => updateStyle("gridTemplateRows", value)}
                  placeholder="1fr"
                />
              </div>

              <TextInput
                label="Template Areas"
                value={styles.gridTemplateAreas}
                onChange={(value) => updateStyle("gridTemplateAreas", value)}
                placeholder="'area1 area2'"
              />

              <div className="grid grid-cols-3 gap-3">
                <TextInput
                  label="Grid Gap"
                  value={styles.gridGap}
                  onChange={(value) => updateStyle("gridGap", value)}
                  placeholder="0px"
                />
                <TextInput
                  label="Row Gap"
                  value={styles.gridRowGap}
                  onChange={(value) => updateStyle("gridRowGap", value)}
                  placeholder="0px"
                />
                <TextInput
                  label="Column Gap"
                  value={styles.gridColumnGap}
                  onChange={(value) => updateStyle("gridColumnGap", value)}
                  placeholder="0px"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Auto Flow"
                  value={styles.gridAutoFlow}
                  onChange={(value) => updateStyle("gridAutoFlow", value)}
                  options={[
                    { value: "row", label: "Row" },
                    { value: "column", label: "Column" },
                    { value: "row dense", label: "Row Dense" },
                    { value: "column dense", label: "Column Dense" },
                  ]}
                />
                <TextInput
                  label="Auto Rows"
                  value={styles.gridAutoRows}
                  onChange={(value) => updateStyle("gridAutoRows", value)}
                  placeholder="auto"
                />
              </div>
            </>
          )}
        </StyleGroup>

        {/* Colors & Background */}
        <StyleGroup title="Colors & Background" icon={<Palette size={16} />}>
          <ColorInput
            label="Background Color"
            value={styles.backgroundColor || ""}
            onChange={(value) => updateStyle("backgroundColor", value)}
          />
          <ColorInput
            label="Text Color"
            value={styles.color || ""}
            onChange={(value) => updateStyle("color", value)}
          />
          <NumberInput
            label="Opacity"
            value={styles.opacity}
            onChange={(value) => updateStyle("opacity", parseFloat(value) || 1)}
            min={0}
            max={1}
          />
        </StyleGroup>

        {/* Typography */}
        <StyleGroup title="Typography" icon={<Type size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Font Size"
              value={styles.fontSize}
              onChange={(value) => updateStyle("fontSize", value)}
              placeholder="16px"
            />
            <SelectInput
              label="Font Weight"
              value={styles.fontWeight}
              onChange={(value) => updateStyle("fontWeight", value)}
              options={[
                { value: "100", label: "Thin" },
                { value: "200", label: "Extra Light" },
                { value: "300", label: "Light" },
                { value: "400", label: "Normal" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semi Bold" },
                { value: "700", label: "Bold" },
                { value: "800", label: "Extra Bold" },
                { value: "900", label: "Black" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Font Family"
              value={styles.fontFamily}
              onChange={(value) => updateStyle("fontFamily", value)}
              placeholder="inherit"
            />
            <TextInput
              label="Line Height"
              value={styles.lineHeight}
              onChange={(value) => updateStyle("lineHeight", value)}
              placeholder="normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="Text Align"
              value={styles.textAlign}
              onChange={(value) => updateStyle("textAlign", value)}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
                { value: "justify", label: "Justify" },
              ]}
            />
            <SelectInput
              label="Text Transform"
              value={styles.textTransform}
              onChange={(value) => updateStyle("textTransform", value)}
              options={[
                { value: "none", label: "None" },
                { value: "uppercase", label: "Uppercase" },
                { value: "lowercase", label: "Lowercase" },
                { value: "capitalize", label: "Capitalize" },
              ]}
            />
          </div>

          <TextInput
            label="Letter Spacing"
            value={styles.letterSpacing}
            onChange={(value) => updateStyle("letterSpacing", value)}
            placeholder="normal"
          />
        </StyleGroup>

        {/* Spacing */}
        <StyleGroup title="Spacing" icon={<Layout size={16} />}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="All"
                  value={styles.margin}
                  onChange={(value) => updateStyle("margin", value)}
                  placeholder="0px"
                />
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <TextInput
                    label="T"
                    value={styles.marginTop}
                    onChange={(value) => updateStyle("marginTop", value)}
                  />
                  <TextInput
                    label="R"
                    value={styles.marginRight}
                    onChange={(value) => updateStyle("marginRight", value)}
                  />
                  <TextInput
                    label="B"
                    value={styles.marginBottom}
                    onChange={(value) => updateStyle("marginBottom", value)}
                  />
                  <TextInput
                    label="L"
                    value={styles.marginLeft}
                    onChange={(value) => updateStyle("marginLeft", value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding
              </label>
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="All"
                  value={styles.padding}
                  onChange={(value) => updateStyle("padding", value)}
                  placeholder="0px"
                />
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <TextInput
                    label="T"
                    value={styles.paddingTop}
                    onChange={(value) => updateStyle("paddingTop", value)}
                  />
                  <TextInput
                    label="R"
                    value={styles.paddingRight}
                    onChange={(value) => updateStyle("paddingRight", value)}
                  />
                  <TextInput
                    label="B"
                    value={styles.paddingBottom}
                    onChange={(value) => updateStyle("paddingBottom", value)}
                  />
                  <TextInput
                    label="L"
                    value={styles.paddingLeft}
                    onChange={(value) => updateStyle("paddingLeft", value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </StyleGroup>

        {/* Borders & Effects */}
        <StyleGroup title="Borders & Effects" icon={<Settings size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Border"
              value={styles.border}
              onChange={(value) => updateStyle("border", value)}
              placeholder="1px solid #000"
            />
            <TextInput
              label="Border Radius"
              value={styles.borderRadius}
              onChange={(value) => updateStyle("borderRadius", value)}
              placeholder="0px"
            />
          </div>

          <TextInput
            label="Box Shadow"
            value={styles.boxShadow}
            onChange={(value) => updateStyle("boxShadow", value)}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
          />

          <TextInput
            label="Transform"
            value={styles.transform}
            onChange={(value) => updateStyle("transform", value)}
            placeholder="scale(1) rotate(0deg)"
          />

          <TextInput
            label="Transition"
            value={styles.transition}
            onChange={(value) => updateStyle("transition", value)}
            placeholder="all 0.3s ease"
          />
        </StyleGroup>

        {/* Visibility & Overflow */}
        <StyleGroup title="Visibility & Overflow" icon={<Layers size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="Visibility"
              value={styles.visibility}
              onChange={(value) => updateStyle("visibility", value)}
              options={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
                { value: "collapse", label: "Collapse" },
              ]}
            />
            <SelectInput
              label="Overflow"
              value={styles.overflow}
              onChange={(value) => updateStyle("overflow", value)}
              options={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
                { value: "scroll", label: "Scroll" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectInput
              label="Overflow X"
              value={styles.overflowX}
              onChange={(value) => updateStyle("overflowX", value)}
              options={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
                { value: "scroll", label: "Scroll" },
                { value: "auto", label: "Auto" },
              ]}
            />
            <SelectInput
              label="Overflow Y"
              value={styles.overflowY}
              onChange={(value) => updateStyle("overflowY", value)}
              options={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
                { value: "scroll", label: "Scroll" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </div>
        </StyleGroup>
      </div>
    </div>
  );
};
