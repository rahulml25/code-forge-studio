import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Eye,
  ChevronDown,
  ChevronRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  Group,
  Ungroup,
  MoreVertical,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Component } from "../../types";

interface LayerItemProps {
  component: Component;
  level: number;
  isSelected: boolean;
  children: { component: Component; children: any[] }[];
  selectedComponentId: string | null;
  multiSelectedIds?: string[];
  onToggleMultiSelect?: (componentId: string, ctrlKey: boolean) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  component,
  level,
  isSelected,
  children,
  selectedComponentId,
  multiSelectedIds = [],
  onToggleMultiSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [editName, setEditName] = useState(
    component.name || `${component.type} Component`
  );

  const {
    selectComponent,
    removeComponent,
    updateComponent,
    moveComponentInLayer,
    groupComponents,
    ungroupComponent,
    setParentChild,
    components,
  } = useAppStore();

  const isMultiSelected = multiSelectedIds.includes(component.id);

  // Get potential parent components (exclude self and its children)
  const getPotentialParents = useCallback(() => {
    const buildChildrenMap = (comps: Component[]) => {
      const childrenMap = new Map<string, string[]>();
      comps.forEach((comp) => {
        if (comp.parentId) {
          if (!childrenMap.has(comp.parentId)) {
            childrenMap.set(comp.parentId, []);
          }
          childrenMap.get(comp.parentId)!.push(comp.id);
        }
      });
      return childrenMap;
    };

    const getAllDescendants = (
      componentId: string,
      childrenMap: Map<string, string[]>
    ): string[] => {
      const descendants: string[] = [];
      const children = childrenMap.get(componentId) || [];
      for (const childId of children) {
        descendants.push(childId);
        descendants.push(...getAllDescendants(childId, childrenMap));
      }
      return descendants;
    };

    const childrenMap = buildChildrenMap(components);
    const descendants = getAllDescendants(component.id, childrenMap);

    return components.filter(
      (comp) =>
        comp.id !== component.id && // Not self
        !descendants.includes(comp.id) && // Not a descendant
        comp.id !== component.parentId // Not current parent
    );
  }, [components, component.id, component.parentId]);

  // Drag and Drop functionality
  const [{ isDragging }, dragRef] = useDrag({
    type: "LAYER_COMPONENT",
    item: { componentId: component.id, type: "LAYER_COMPONENT" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isDropOver, canDrop }, dropRef] = useDrop({
    accept: "LAYER_COMPONENT",
    drop: (item: { componentId: string }, monitor) => {
      if (
        item.componentId !== component.id &&
        monitor.isOver({ shallow: true })
      ) {
        // Allow drop on most component types, but be more permissive
        // Exclude only certain components that definitely can't have children
        const nonContainerTypes = ["text", "image", "button", "input"];
        if (!nonContainerTypes.includes(component.type)) {
          setParentChild(item.componentId, component.id);
        }
      }
    },
    collect: (monitor) => ({
      isDropOver: monitor.isOver({ shallow: true }),
      canDrop:
        monitor.canDrop() &&
        !["text", "image", "button", "input"].includes(component.type),
    }),
  });

  // Combine drag and drop refs
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef(node);
      dropRef(node);
    },
    [dragRef, dropRef]
  );

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showContextMenu]);

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

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleMultiSelect && (e.ctrlKey || e.metaKey)) {
        onToggleMultiSelect(component.id, true);
      } else {
        selectComponent(component.id);
        if (onToggleMultiSelect) {
          onToggleMultiSelect(component.id, false);
        }
      }
    },
    [component.id, selectComponent, onToggleMultiSelect]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate position that keeps menu within viewport
    const calculateMenuPosition = (clientX: number, clientY: number) => {
      const menuWidth = 160; // min-w-[160px] from the menu
      const menuHeight = 200; // approximate height based on menu items
      const padding = 8; // padding from screen edges

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = clientX;
      let y = clientY;

      // Adjust horizontal position if menu would go off-screen
      if (x + menuWidth > viewportWidth - padding) {
        x = viewportWidth - menuWidth - padding;
      }

      // Adjust vertical position if menu would go off-screen
      if (y + menuHeight > viewportHeight - padding) {
        y = viewportHeight - menuHeight - padding;
      }

      // Ensure menu doesn't go above the top of the screen
      if (y < padding) {
        y = padding;
      }

      // Ensure menu doesn't go left of the screen
      if (x < padding) {
        x = padding;
      }

      return { x, y };
    };

    const position = calculateMenuPosition(e.clientX, e.clientY);
    setContextMenuPosition(position);
    setShowContextMenu(true);
  }, []);

  const handleGroupSelected = useCallback(() => {
    const idsToGroup =
      multiSelectedIds.length > 1 ? multiSelectedIds : [component.id];
    groupComponents(idsToGroup, "New Group");
    setShowContextMenu(false);
  }, [multiSelectedIds, component.id, groupComponents]);

  const handleUngroup = useCallback(() => {
    ungroupComponent(component.id);
    setShowContextMenu(false);
  }, [component.id, ungroupComponent]);

  const handleMakeChild = useCallback(
    (parentId: string) => {
      setParentChild(component.id, parentId);
      setShowContextMenu(false);
    },
    [component.id, setParentChild]
  );

  const handleMoveToRoot = useCallback(() => {
    setParentChild(component.id, null);
    setShowContextMenu(false);
  }, [component.id, setParentChild]);

  return (
    <div className="relative">
      <div
        ref={combinedRef}
        className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer group transition-colors ${
          isSelected ? "bg-blue-100 border-l-2 border-blue-500" : ""
        } ${isMultiSelected ? "bg-blue-50 border-l-2 border-blue-300" : ""} ${
          isDragging ? "opacity-50" : ""
        } ${
          isDropOver && canDrop
            ? "bg-green-100 border-l-2 border-green-500"
            : ""
        } ${
          canDrop && !isDragging
            ? "border-r-2 border-dashed border-gray-300"
            : ""
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
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

              // Calculate position that keeps menu within viewport
              const calculateMenuPosition = (buttonRect: DOMRect) => {
                const menuWidth = 160; // min-w-[160px] from the menu
                const menuHeight = 200; // approximate height based on menu items
                const padding = 8; // padding from screen edges

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                let x = buttonRect.right; // Default: show to the right of button
                let y = buttonRect.top; // Default: align with button top

                // Adjust horizontal position if menu would go off-screen
                if (x + menuWidth > viewportWidth - padding) {
                  x = buttonRect.left - menuWidth; // Show to the left instead
                }

                // Adjust vertical position if menu would go off-screen
                if (y + menuHeight > viewportHeight - padding) {
                  y = viewportHeight - menuHeight - padding;
                }

                // Ensure menu doesn't go above the top of the screen
                if (y < padding) {
                  y = padding;
                }

                // Final fallback: if showing to the left would go off-screen,
                // show to the right but within bounds
                if (x < padding) {
                  x = Math.min(
                    buttonRect.right,
                    viewportWidth - menuWidth - padding
                  );
                }

                return { x, y };
              };

              const buttonRect = e.currentTarget.getBoundingClientRect();
              const position = calculateMenuPosition(buttonRect);

              setShowContextMenu(true);
              setContextMenuPosition(position);
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
            title="More options"
          >
            <MoreVertical className="w-3 h-3" />
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

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
        >
          <button
            onClick={handleGroupSelected}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Group className="w-4 h-4" />
            Group Selected
          </button>
          {children.length > 0 && (
            <button
              onClick={handleUngroup}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Ungroup className="w-4 h-4" />
              Ungroup
            </button>
          )}
          <hr className="my-1" />
          <button
            onClick={handleMoveToRoot}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
          >
            Move to Root
          </button>

          {/* Make Child Of submenu */}
          {getPotentialParents().length > 0 && (
            <>
              <hr className="my-1" />
              <div className="px-3 py-1 text-xs text-gray-500 font-medium">
                Make Child Of:
              </div>
              {getPotentialParents()
                .slice(0, 5)
                .map((potentialParent) => (
                  <button
                    key={potentialParent.id}
                    onClick={() => handleMakeChild(potentialParent.id)}
                    className="w-full px-6 py-2 text-left text-sm hover:bg-gray-100 truncate"
                    title={
                      potentialParent.name ||
                      `${potentialParent.type} Component`
                    }
                  >
                    {potentialParent.name ||
                      `${potentialParent.type} Component`}
                  </button>
                ))}
              {getPotentialParents().length > 5 && (
                <div className="px-6 py-1 text-xs text-gray-400">
                  ...and {getPotentialParents().length - 5} more
                </div>
              )}
            </>
          )}

          <hr className="my-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
              setShowContextMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      {/* Render children */}
      {isExpanded &&
        children.map((childNode) => (
          <LayerItem
            key={childNode.component.id}
            component={childNode.component}
            level={level + 1}
            isSelected={selectedComponentId === childNode.component.id}
            children={childNode.children}
            selectedComponentId={selectedComponentId}
            multiSelectedIds={multiSelectedIds}
            onToggleMultiSelect={onToggleMultiSelect}
          />
        ))}
    </div>
  );
};

export const LayerPanel: React.FC = () => {
  const { components, selectedComponentId } = useAppStore();
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);

  // Handle multi-selection
  const handleToggleMultiSelect = useCallback(
    (componentId: string, ctrlKey: boolean) => {
      if (ctrlKey) {
        setMultiSelectedIds((prev) => {
          if (prev.includes(componentId)) {
            return prev.filter((id) => id !== componentId);
          } else {
            return [...prev, componentId];
          }
        });
      } else {
        setMultiSelectedIds([componentId]);
      }
    },
    []
  );

  // Clear multi-selection when selectedComponentId changes externally
  useEffect(() => {
    if (
      selectedComponentId &&
      !multiSelectedIds.includes(selectedComponentId)
    ) {
      setMultiSelectedIds([selectedComponentId]);
    }
  }, [selectedComponentId, multiSelectedIds]);

  // Build component tree - show components in reverse order for Figma-like stacking
  // The last component in the array appears on top
  const buildComponentTree = useCallback(() => {
    const componentMap = new Map<string, Component>();
    const childrenMap = new Map<string, Component[]>();

    // Initialize maps
    components.forEach((comp) => {
      componentMap.set(comp.id, comp);
      childrenMap.set(comp.id, []);
    });

    // Build parent-child relationships
    const rootComponents: Component[] = [];
    components.forEach((comp) => {
      if (comp.parentId && componentMap.has(comp.parentId)) {
        childrenMap.get(comp.parentId)!.push(comp);
      } else {
        rootComponents.push(comp);
      }
    });

    // Recursive function to build tree with all nested children
    const buildTree = (
      component: Component
    ): { component: Component; children: any[] } => {
      const directChildren = childrenMap.get(component.id) || [];
      return {
        component,
        children: directChildren.map((child) => buildTree(child)),
      };
    };

    // Reverse the order for Figma-like stacking (last component on top)
    return rootComponents.reverse().map((comp) => buildTree(comp));
  }, [components]);

  const componentTree = buildComponentTree();

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Layers</h3>
          {multiSelectedIds.length > 1 && (
            <button
              onClick={() => {
                const { groupComponents } = useAppStore.getState();
                groupComponents(multiSelectedIds, "New Group");
                setMultiSelectedIds([]);
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              title="Group selected components"
            >
              <Group className="w-3 h-3" />
              Group
            </button>
          )}
        </div>
        {multiSelectedIds.length > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            {multiSelectedIds.length} components selected
          </p>
        )}
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
                selectedComponentId={selectedComponentId}
                multiSelectedIds={multiSelectedIds}
                onToggleMultiSelect={handleToggleMultiSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
