import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useAppStore } from "../../store/useAppStore";
import { CanvasComponent } from "./CanvasComponent.tsx";
import { DropResult } from "../../types";

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    components,
    addComponent,
    selectedComponentId,
    selectComponent,
    zoom,
    viewport,
  } = useAppStore();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["component", "COMPONENT_LIBRARY_ITEM"],
    drop: (item: any, monitor) => {
      if (!canvasRef.current) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (clientOffset.x - canvasRect.left) / zoom,
        y: (clientOffset.y - canvasRect.top) / zoom,
      };

      // Handle different drag item types
      if (item.type === "COMPONENT_LIBRARY_ITEM" && item.component) {
        addComponent(item.component, position);
      } else if (item.type === "component" && item.item) {
        addComponent(item.item, position);
      }

      const result: DropResult = {
        dropEffect: "move",
        position,
      };

      return result;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        selectComponent(null);
      }
    },
    [selectComponent]
  );

  const getViewportStyles = () => {
    const styles = {
      desktop: { width: "100%", maxWidth: "none" },
      tablet: { width: "768px", maxWidth: "768px" },
      mobile: { width: "375px", maxWidth: "375px" },
    };
    return styles[viewport];
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Canvas Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Canvas</span>
            <span>•</span>
            <span>
              {viewport.charAt(0).toUpperCase() + viewport.slice(1)} View
            </span>
            <span>•</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {components.length} component{components.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-center">
          <div
            ref={(node) => {
              if (canvasRef.current !== node) {
                (
                  canvasRef as React.MutableRefObject<HTMLDivElement | null>
                ).current = node;
              }
              drop(node);
            }}
            onClick={handleCanvasClick}
            className={`
              relative bg-white shadow-lg transition-all duration-200
              ${isOver && canDrop ? "ring-4 ring-blue-300 ring-opacity-50" : ""}
              ${canDrop ? "cursor-copy" : ""}
            `}
            style={{
              ...getViewportStyles(),
              minHeight: "600px",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            {/* Canvas Grid Background */}
            <div
              className="absolute inset-0 canvas-grid opacity-20 pointer-events-none"
              style={{
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              }}
            />

            {/* Drop Zone Overlay */}
            {isOver && canDrop && (
              <div className="absolute inset-0 bg-blue-50 border-4 border-dashed border-blue-300 flex items-center justify-center pointer-events-none">
                <div className="text-blue-600 text-lg font-medium">
                  Drop component here
                </div>
              </div>
            )}

            {/* Components */}
            {components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                zoom={zoom}
              />
            ))}

            {/* Empty State */}
            {components.length === 0 && !isOver && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-medium mb-2">Start Creating</h3>
                  <p className="text-sm max-w-xs">
                    Drag components from the sidebar to start building your UI
                  </p>
                </div>
              </div>
            )}

            {/* Selection Info */}
            {selectedComponentId && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg">
                Selected:{" "}
                {components.find((c) => c.id === selectedComponentId)?.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
