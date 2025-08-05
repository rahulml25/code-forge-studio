import React, { useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Component } from "../../types";

interface LayerItemProps {
  component: Component;
  level: number;
  isSelected: boolean;
  children: Component[];
}

const LayerItem: React.FC<LayerItemProps> = ({
  component,
  level,
  isSelected,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(
    component.name || `${component.type} Component`
  );

  const {
    selectComponent,
    removeComponent,
    updateComponent,
    moveComponentInLayer,
  } = useAppStore();

  const handleNameEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleNameSave = useCallback(() => {
    updateComponent(component.id, { name: editName });
    setIsEditing(false);
  }, [component.id, editName, updateComponent]);

  const handleNameCancel = useCallback(() => {
    setEditName(component.name || `${component.type} Component`);
    setIsEditing(false);
  }, [component.name, component.type]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNameSave();
      } else if (e.key === "Escape") {
        handleNameCancel();
      }
    },
    [handleNameSave, handleNameCancel]
  );

  const handleMoveUp = useCallback(() => {
    moveComponentInLayer(component.id, "up");
  }, [component.id, moveComponentInLayer]);

  const handleMoveDown = useCallback(() => {
    moveComponentInLayer(component.id, "down");
  }, [component.id, moveComponentInLayer]);

  const handleDelete = useCallback(() => {
    removeComponent(component.id);
  }, [component.id, removeComponent]);

  const handleSelect = useCallback(() => {
    selectComponent(component.id);
  }, [component.id, selectComponent]);

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer group ${
          isSelected ? "bg-blue-100 border-l-2 border-blue-500" : ""
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse button */}
        {children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-4 h-4 flex items-center justify-center"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {children.length === 0 && <div className="w-4" />}

        {/* Component type icon or dot */}
        <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />

        {/* Component name - editable */}
        <div className="flex-1 truncate min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="w-full px-1 py-0 text-sm border border-blue-500 rounded focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-sm truncate cursor-pointer hover:text-blue-600"
              onDoubleClick={handleNameEdit}
              title={component.name || `${component.type} Component`}
            >
              {component.name || `${component.type} Component`}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMoveUp();
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
            title="Move up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMoveDown();
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
            title="Move down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Toggle visibility
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
            title="Toggle visibility"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded text-red-500"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Render children */}
      {isExpanded &&
        children.map((child) => (
          <LayerItem
            key={child.id}
            component={child}
            level={level + 1}
            isSelected={false}
            children={[]}
          />
        ))}
    </div>
  );
};

export const LayerPanel: React.FC = () => {
  const { components, selectedComponentId } = useAppStore();

  // Build component tree - show components in reverse order for Figma-like stacking
  // The last component in the array appears on top
  const buildComponentTree = useCallback(() => {
    const componentMap = new Map<string, Component>();
    const children = new Map<string, Component[]>();

    // Initialize maps
    components.forEach((comp) => {
      componentMap.set(comp.id, comp);
      children.set(comp.id, []);
    });

    // Build parent-child relationships
    const rootComponents: Component[] = [];
    components.forEach((comp) => {
      if (comp.parentId && componentMap.has(comp.parentId)) {
        children.get(comp.parentId)!.push(comp);
      } else {
        rootComponents.push(comp);
      }
    });

    // Reverse the order for Figma-like stacking (last component on top)
    return rootComponents.reverse().map((comp) => ({
      component: comp,
      children: children.get(comp.id) || [],
    }));
  }, [components]);

  const componentTree = buildComponentTree();

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Layers</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {componentTree.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No components yet. Add components from the library to get started.
          </div>
        ) : (
          <div className="group">
            {componentTree.map(({ component, children }) => (
              <LayerItem
                key={component.id}
                component={component}
                level={0}
                isSelected={selectedComponentId === component.id}
                children={children}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
