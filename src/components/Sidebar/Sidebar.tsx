import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { useDrag } from "react-dnd";
import {
  componentLibrary,
  componentCategories,
  getComponentsByCategory,
} from "../ComponentLibrary/index";
import { useAppStore } from "../../store/useAppStore";

interface DraggableComponentProps {
  component: any;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { type: "component", item: component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Preview = component.previewComponent;

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{component.name}</h4>
      </div>

      <div className="mb-2 p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
        <div className="scale-75 origin-top-left transform">
          <Preview {...component.defaultProps} />
        </div>
      </div>

      <p className="text-xs text-gray-500">{component.description}</p>
    </div>
  );
};

interface CategorySectionProps {
  category: any;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  isExpanded,
  onToggle,
  searchTerm,
}) => {
  const components = getComponentsByCategory(category.id);
  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (searchTerm && filteredComponents.length === 0) {
    return null;
  }

  return (
    <div className="sidebar-section">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {category.name}
          </span>
          <span className="text-xs text-gray-500">
            ({filteredComponents.length})
          </span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {filteredComponents.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    layout: true,
    text: true,
    interactive: true,
    media: false,
    content: false,
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = Object.values(expandedCategories).every(Boolean);
    const newState = componentCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category.id]: !allExpanded,
      }),
      {}
    );
    setExpandedCategories(newState);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <button
            onClick={handleExpandAll}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            {Object.values(expandedCategories).every(Boolean)
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto">
        {componentCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isExpanded={expandedCategories[category.id] || false}
            onToggle={() => toggleCategory(category.id)}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      {/* Footer with Tips */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="mb-1">
            💡 <strong>Tip:</strong> Drag components to the canvas
          </p>
          <p>
            ⌨️ Press <kbd className="px-1 bg-gray-200 rounded">Esc</kbd> to
            deselect
          </p>
        </div>
      </div>
    </div>
  );
};
