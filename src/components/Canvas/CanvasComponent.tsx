import React, { useCallback, useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useAppStore } from "../../store/useAppStore";
import { Component } from "../../types";
import { getComponentById } from "../ComponentLibrary/index.tsx";
import { clientToCanvas, clampSize } from "../../utils/coords";

interface CanvasComponentProps {
  component: Component;
  zoom: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  zoom,
  isSelected,
  onSelect,
}) => {
  const { moveComponent, resizeComponent } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPointerOffset, setInitialPointerOffset] = useState({
    x: 0,
    y: 0,
  });
  const componentRef = useRef<HTMLDivElement>(null);

  // Add drop zone for components that can have children
  const canHaveChildren = [
    "div",
    "container",
    "flex-container",
    "grid-container",
  ].includes(component.type);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["component", "COMPONENT_LIBRARY_ITEM"],
    canDrop: () => canHaveChildren,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onSelect(component.id);

      // Get the canvas container to calculate proper offset
      const canvasContainer = e.currentTarget.closest(
        '[data-canvas="true"]'
      ) as HTMLElement;
      if (!canvasContainer) return;

      const canvasRect = canvasContainer.getBoundingClientRect();
      const currentPosition = component.position || { x: 0, y: 0 };

      // Convert mouse position to logical canvas coordinates
      const mouseLogical = clientToCanvas(
        e.clientX,
        e.clientY,
        canvasRect,
        zoom
      );

      // Calculate offset from mouse to component's top-left corner
      const pointerOffset = {
        x: mouseLogical.x - currentPosition.x,
        y: mouseLogical.y - currentPosition.y,
      };

      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPointerOffset(pointerOffset);
    },
    [component.id, component.position, onSelect, zoom]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isResizing) return;

      e.preventDefault();

      // Get the canvas container
      const canvasContainer = document.querySelector(
        '[data-canvas="true"]'
      ) as HTMLElement;
      if (!canvasContainer) return;

      const canvasRect = canvasContainer.getBoundingClientRect();

      // Convert mouse position to logical canvas coordinates
      const mouseLogical = clientToCanvas(
        e.clientX,
        e.clientY,
        canvasRect,
        zoom
      );

      // Calculate new position by subtracting the initial pointer offset
      const newPosition = {
        x: mouseLogical.x - initialPointerOffset.x,
        y: mouseLogical.y - initialPointerOffset.y,
      };

      moveComponent(component.id, newPosition);
    },
    [
      component.id,
      moveComponent,
      zoom,
      isDragging,
      isResizing,
      initialPointerOffset,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection("");
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.stopPropagation();
      e.preventDefault();

      setIsResizing(true);
      setResizeDirection(direction);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeDirection) return;

      e.preventDefault();

      // Calculate delta in logical coordinates
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;

      const currentPosition = component.position || { x: 0, y: 0 };
      const currentSize = component.size || { width: 100, height: 100 };

      let newWidth = currentSize.width;
      let newHeight = currentSize.height;
      let newX = currentPosition.x;
      let newY = currentPosition.y;

      // Handle width changes
      if (resizeDirection.includes("right")) {
        newWidth = currentSize.width + deltaX;
      }
      if (resizeDirection.includes("left")) {
        newWidth = currentSize.width - deltaX;
        newX = currentPosition.x + deltaX;
      }

      // Handle height changes
      if (resizeDirection.includes("bottom")) {
        newHeight = currentSize.height + deltaY;
      }
      if (resizeDirection.includes("top")) {
        newHeight = currentSize.height - deltaY;
        newY = currentPosition.y + deltaY;
      }

      // Apply size constraints using utility
      const clampedSize = clampSize(
        { width: newWidth, height: newHeight },
        { width: 20, height: 20 }
      );

      // Update component
      moveComponent(component.id, { x: newX, y: newY });
      resizeComponent(component.id, clampedSize);

      // Update drag start for next move
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [
      isResizing,
      resizeDirection,
      component.id,
      component.position,
      component.size,
      moveComponent,
      resizeComponent,
      zoom,
      dragStart.x,
      dragStart.y,
    ]
  );

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    handleMouseMove,
    handleResizeMove,
    handleMouseUp,
  ]);

  const componentLibraryItem = getComponentById(component.type);
  if (!componentLibraryItem) return null;

  const ComponentElement = componentLibraryItem.previewComponent;
  if (!ComponentElement) return null;

  const styles = component.styles || {};
  const position = component.position || { x: 0, y: 0 };
  const size = component.size || { width: 100, height: 100 };

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    // Removed transform scale - zoom is handled by canvas container
    cursor: isDragging ? "grabbing" : "grab",
    // Preserve component's original border, but add selection outline if selected
    border: styles.border || "1px solid transparent",
    outline: isSelected ? "2px solid #3b82f6" : "none",
    outlineOffset: isSelected ? "2px" : "0",
    backgroundColor: styles.backgroundColor || "transparent",
    color: styles.color || "inherit",
    fontSize: styles.fontSize || "inherit",
    fontWeight: styles.fontWeight || "inherit",
    textAlign: (styles.textAlign as any) || "left",
    borderRadius: styles.borderRadius || 0,
    opacity: styles.opacity ?? 1,
    zIndex: isSelected ? 1000 : 1,
    // Apply additional styles from the component definition
    display: styles.display || "block",
    padding: styles.padding || "0",
    alignItems: styles.alignItems || "initial",
    justifyContent: styles.justifyContent || "initial",
    gap: styles.gap || "initial",
    gridTemplateColumns: styles.gridTemplateColumns || "initial",
    minHeight: styles.minHeight || "auto",
  };

  return (
    <div
      ref={(node) => {
        (
          componentRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
        if (canHaveChildren) {
          drop(node);
        }
      }}
      data-component-id={component.id}
      style={style}
      onMouseDown={handleMouseDown}
      className={`select-none ${
        isOver && canDrop ? "ring-2 ring-green-400 ring-opacity-50" : ""
      }`}
    >
      <ComponentElement {...component.props} />

      {isSelected && (
        <>
          <div
            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, "top-left")}
          />
          <div
            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, "top-right")}
          />
          <div
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
          />
          <div
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
          />
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, "top")}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, "bottom")}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, "left")}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, "right")}
          />
        </>
      )}
    </div>
  );
};
