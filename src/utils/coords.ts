/**
 * Coordinate conversion utilities for canvas operations
 * Handles conversion between client coordinates and logical canvas coordinates
 */

export interface Point {
  x: number;
  y: number;
}

export interface CanvasRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Convert client (browser) coordinates to logical canvas coordinates
 * @param clientX - Mouse X position relative to viewport
 * @param clientY - Mouse Y position relative to viewport
 * @param canvasRect - Canvas bounding rectangle
 * @param zoom - Current zoom level (1 = 100%)
 * @param scrollOffset - Optional scroll offset within canvas
 * @returns Logical coordinates within the canvas
 */
export function clientToCanvas(
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  zoom: number,
  scrollOffset: Point = { x: 0, y: 0 }
): Point {
  return {
    x: (clientX - canvasRect.left + scrollOffset.x) / zoom,
    y: (clientY - canvasRect.top + scrollOffset.y) / zoom,
  };
}

/**
 * Convert logical canvas coordinates to client (browser) coordinates
 * @param logicalX - X position in canvas logical coordinates
 * @param logicalY - Y position in canvas logical coordinates
 * @param canvasRect - Canvas bounding rectangle
 * @param zoom - Current zoom level (1 = 100%)
 * @param scrollOffset - Optional scroll offset within canvas
 * @returns Client coordinates relative to viewport
 */
export function canvasToClient(
  logicalX: number,
  logicalY: number,
  canvasRect: DOMRect,
  zoom: number,
  scrollOffset: Point = { x: 0, y: 0 }
): Point {
  return {
    x: logicalX * zoom + canvasRect.left - scrollOffset.x,
    y: logicalY * zoom + canvasRect.top - scrollOffset.y,
  };
}

/**
 * Clamp a point within canvas bounds
 * @param point - Point to clamp
 * @param canvasBounds - Canvas logical bounds
 * @returns Clamped point
 */
export function clampToCanvas(
  point: Point,
  canvasBounds: { width: number; height: number }
): Point {
  return {
    x: Math.max(0, Math.min(point.x, canvasBounds.width)),
    y: Math.max(0, Math.min(point.y, canvasBounds.height)),
  };
}

/**
 * Clamp size to minimum values
 * @param size - Size to clamp
 * @param minSize - Minimum allowed size
 * @returns Clamped size
 */
export function clampSize(
  size: { width: number; height: number },
  minSize: { width: number; height: number } = { width: 20, height: 20 }
): { width: number; height: number } {
  return {
    width: Math.max(minSize.width, size.width),
    height: Math.max(minSize.height, size.height),
  };
}
