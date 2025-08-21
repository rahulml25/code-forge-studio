import {
  clientToCanvas,
  canvasToClient,
  clampToCanvas,
  clampSize,
} from "../utils/coords";

describe("Coordinate utilities", () => {
  const mockCanvasRect: DOMRect = {
    left: 100,
    top: 50,
    width: 800,
    height: 600,
    right: 900,
    bottom: 650,
    x: 100,
    y: 50,
    toJSON: () => ({}),
  };

  describe("clientToCanvas", () => {
    it("converts client coordinates to canvas logical coordinates at zoom 1", () => {
      const result = clientToCanvas(200, 150, mockCanvasRect, 1);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it("converts client coordinates to canvas logical coordinates at zoom 2", () => {
      const result = clientToCanvas(300, 250, mockCanvasRect, 2);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it("converts client coordinates to canvas logical coordinates at zoom 0.5", () => {
      const result = clientToCanvas(200, 150, mockCanvasRect, 0.5);
      expect(result).toEqual({ x: 200, y: 200 });
    });

    it("handles scroll offset", () => {
      const result = clientToCanvas(200, 150, mockCanvasRect, 1, {
        x: 10,
        y: 20,
      });
      expect(result).toEqual({ x: 110, y: 120 });
    });
  });

  describe("canvasToClient", () => {
    it("converts canvas logical coordinates to client coordinates at zoom 1", () => {
      const result = canvasToClient(100, 100, mockCanvasRect, 1);
      expect(result).toEqual({ x: 200, y: 150 });
    });

    it("converts canvas logical coordinates to client coordinates at zoom 2", () => {
      const result = canvasToClient(100, 100, mockCanvasRect, 2);
      expect(result).toEqual({ x: 300, y: 250 });
    });

    it("converts canvas logical coordinates to client coordinates at zoom 0.5", () => {
      const result = canvasToClient(200, 200, mockCanvasRect, 0.5);
      expect(result).toEqual({ x: 200, y: 150 });
    });
  });

  describe("clampToCanvas", () => {
    it("clamps point within canvas bounds", () => {
      const result = clampToCanvas(
        { x: -10, y: 1000 },
        { width: 800, height: 600 }
      );
      expect(result).toEqual({ x: 0, y: 600 });
    });

    it("leaves valid point unchanged", () => {
      const result = clampToCanvas(
        { x: 100, y: 200 },
        { width: 800, height: 600 }
      );
      expect(result).toEqual({ x: 100, y: 200 });
    });
  });

  describe("clampSize", () => {
    it("clamps size to minimum values", () => {
      const result = clampSize({ width: 5, height: 5 });
      expect(result).toEqual({ width: 20, height: 20 });
    });

    it("leaves valid size unchanged", () => {
      const result = clampSize({ width: 100, height: 150 });
      expect(result).toEqual({ width: 100, height: 150 });
    });

    it("uses custom minimum size", () => {
      const result = clampSize(
        { width: 40, height: 40 },
        { width: 50, height: 60 }
      );
      expect(result).toEqual({ width: 50, height: 60 });
    });
  });
});
