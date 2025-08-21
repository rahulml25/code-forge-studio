import { generateCode } from "../utils/codeGenerator";
import { Component } from "../types";

describe("Code Generator Tree Hierarchy", () => {
  describe("React tree building", () => {
    it("handles the exact example from prompt: root with two children", () => {
      const components: Component[] = [
        {
          id: "root-1",
          parentId: undefined,
          type: "div",
          name: "Root",
          category: "layout",
          props: {},
          styles: { display: "flex" },
        },
        {
          id: "child-1",
          parentId: "root-1",
          type: "text",
          name: "Child1",
          category: "text",
          props: { children: "A" },
          styles: {},
        },
        {
          id: "child-2",
          parentId: "root-1",
          type: "button",
          name: "Child2",
          category: "interactive",
          props: { children: "Click" },
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      // Should have proper nesting: children inside parent
      expect(result).toContain("display: 'flex'");
      expect(result).toContain(">A</span>");
      expect(result).toContain(">Click</button>");

      // Children should appear after parent opening tag and before parent closing tag
      const divStart = result.indexOf("<div style={{ display: 'flex' }}>");
      const divEnd = result.lastIndexOf("</div>");
      const spanPos = result.indexOf(">A</span>");
      const buttonPos = result.indexOf(">Click</button>");

      expect(divStart).toBeLessThan(spanPos);
      expect(divStart).toBeLessThan(buttonPos);
      expect(spanPos).toBeLessThan(divEnd);
      expect(buttonPos).toBeLessThan(divEnd);
    });

    it("handles nested containers (3 levels)", () => {
      const components: Component[] = [
        {
          id: "root",
          parentId: undefined,
          type: "div",
          name: "Root",
          category: "layout",
          props: {},
          styles: { display: "flex" },
        },
        {
          id: "middle",
          parentId: "root",
          type: "div",
          name: "Middle",
          category: "layout",
          props: {},
          styles: { padding: "10px" },
        },
        {
          id: "leaf",
          parentId: "middle",
          type: "text",
          name: "Leaf",
          category: "text",
          props: { children: "Deep" },
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      // Should have 3 levels of nesting
      expect(result).toMatch(
        /<div[^>]*>\s*<div[^>]*>\s*<span[^>]*>Deep<\/span>\s*<\/div>\s*<\/div>/
      );
    });

    it("handles multiple root nodes", () => {
      const components: Component[] = [
        {
          id: "root1",
          parentId: undefined,
          type: "div",
          name: "Root1",
          category: "layout",
          props: {},
          styles: {},
        },
        {
          id: "root2",
          parentId: undefined,
          type: "div",
          name: "Root2",
          category: "layout",
          props: {},
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      // Multiple roots should be wrapped in React fragment
      expect(result).toContain("<>");
      expect(result).toContain("</>");
    });

    it("handles orphaned nodes (missing parent)", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const components: Component[] = [
        {
          id: "orphan",
          parentId: "missing-parent",
          type: "text",
          name: "Orphan",
          category: "text",
          props: { children: "Lost" },
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Parent missing-parent not found for component orphan, attaching to root"
      );
      expect(result).toContain(">Lost</span>");

      consoleSpy.mockRestore();
    });

    it("detects and breaks cycles", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const components: Component[] = [
        {
          id: "a",
          parentId: "b",
          type: "div",
          name: "A",
          category: "layout",
          props: {},
          styles: {},
        },
        {
          id: "b",
          parentId: "a",
          type: "div",
          name: "B",
          category: "layout",
          props: {},
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Cycle detected")
      );
      expect(result).toContain("<div"); // Should still render components

      consoleSpy.mockRestore();
    });
  });

  describe("HTML tree building", () => {
    it("builds proper HTML tree hierarchy", () => {
      const components: Component[] = [
        {
          id: "root-1",
          parentId: undefined,
          type: "div",
          name: "Root",
          category: "layout",
          props: {},
          styles: { display: "flex" },
        },
        {
          id: "child-1",
          parentId: "root-1",
          type: "text",
          name: "Child1",
          category: "text",
          props: { children: "A" },
          styles: {},
        },
      ];

      const result = generateCode(components, {
        framework: "html",
        includeStyles: true,
        format: true,
      });

      // HTML should have nested structure
      expect(result).toMatch(/<div[^>]*>\s*<span[^>]*>A<\/span>\s*<\/div>/);

      // Child should not appear as sibling in body
      const bodyContent = result.substring(
        result.indexOf("<body>"),
        result.indexOf("</body>")
      );
      const spanMatches = (bodyContent.match(/<span/g) || []).length;
      expect(spanMatches).toBe(1); // Only one span, nested inside div
    });
  });
});
