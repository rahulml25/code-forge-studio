import React, { useState, useRef, useCallback } from "react";
import { useDrag } from "react-dnd";
import { Trash2, Copy } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Component } from "../../types";
import { getComponentById } from "../ComponentLibrary/index";

interface CanvasComponentProps {
  component: Component;
  isSelected: boolean;
  zoom: number;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  zoom,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const {
    selectComponent,
    removeComponent,
    moveComponent,
    resizeComponent,
    addExistingComponent,
  } = useAppStore();

  const [{ isDragging }, drag] = useDrag({
    type: "existing-component",
    item: { type: "existing-component", item: component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const componentDef = getComponentById(component.type);
  if (!componentDef) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Create a duplicate component
    const duplicateComponent: Component = {
      ...component,
      id: Date.now().toString(),
      position: {
        x: (component.position?.x || 0) + 20,
        y: (component.position?.y || 0) + 20,
      },
    };

    // Add duplicate component
    addExistingComponent(duplicateComponent);
    selectComponent(duplicateComponent.id);
  };

  // Resize handle event handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.stopPropagation();
      setDragStart({ x: e.clientX, y: e.clientY });

      const handleResizeMove = (e: MouseEvent) => {
        if (!component.size) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newSize = { ...component.size };

        if (direction.includes("right")) {
          newSize.width = Math.max(50, component.size.width + deltaX / zoom);
        }
        if (direction.includes("left")) {
          newSize.width = Math.max(50, component.size.width - deltaX / zoom);
          if (component.position) {
            moveComponent(component.id, {
              x: component.position.x + deltaX / zoom,
              y: component.position.y,
            });
          }
        }
        if (direction.includes("bottom")) {
          newSize.height = Math.max(30, component.size.height + deltaY / zoom);
        }
        if (direction.includes("top")) {
          newSize.height = Math.max(30, component.size.height - deltaY / zoom);
          if (component.position) {
            moveComponent(component.id, {
              x: component.position.x,
              y: component.position.y + deltaY / zoom,
            });
          }
        }

        resizeComponent(component.id, newSize);
        setDragStart({ x: e.clientX, y: e.clientY });
      };

      const handleResizeEnd = () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };

      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [
      component.size,
      component.position,
      component.id,
      resizeComponent,
      moveComponent,
      zoom,
      dragStart,
    ]
  );

  const PreviewComponent = componentDef.previewComponent;

  const combinedStyles: React.CSSProperties = {
    width: component.size?.width
      ? `${component.size.width}px`
      : component.styles?.width || "auto",
    height: component.size?.height
      ? `${component.size.height}px`
      : component.styles?.height || "auto",
    padding: component.styles?.padding,
    margin: component.styles?.margin,
    backgroundColor: component.styles?.backgroundColor,
    color: component.styles?.color,
    fontSize: component.styles?.fontSize,
    fontWeight: component.styles?.fontWeight,
    border: component.styles?.border,
    borderRadius: component.styles?.borderRadius,
    boxShadow: component.styles?.boxShadow,
    display: component.styles?.display,
    justifyContent: component.styles?.justifyContent,
    alignItems: component.styles?.alignItems,
    textAlign: component.styles?.textAlign as any,
  };

  return (
    <div
      ref={(node) => {
        if (componentRef.current !== node) {
          (
            componentRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }
        drag(node);
      }}
      className={`absolute cursor-move transition-all duration-200 ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2"
          : isHovered
          ? "ring-2 ring-blue-300 ring-offset-1"
          : ""
      }`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
        zIndex: isSelected ? 1000 : 1,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-component-id={component.id}
    >
      {/* Component Content */}
      <div
        className="component-content relative overflow-hidden"
        style={combinedStyles}
      >
        <PreviewComponent {...component.props} />

        {/* Selection Overlay */}
        {(isSelected || isHovered) && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Component Label */}
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              {component.name || component.type}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-8 -right-8 flex space-x-1 z-20">
          <button
            onClick={handleDuplicate}
            className="p-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
          />

          {/* Edge handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "top")}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "left")}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize z-30"
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />
        </>
      )}
    </div>
  );
};
