import { generateCode } from "../utils/codeGenerator";
import { Component } from "../types";

describe("Code Generator", () => {
  describe("generateCode", () => {
    it("generates React code for a simple flex container with children", () => {
      const components: Component[] = [
        {
          id: "container-1",
          type: "div",
          name: "Container",
          category: "layout",
          position: { x: 100, y: 100 },
          size: { width: 400, height: 300 },
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "20px",
            position: "absolute",
            left: "100px",
            top: "100px",
            width: "400px",
            height: "300px",
          },
          props: {},
          children: [],
        },
        {
          id: "text-1",
          type: "text",
          name: "Heading",
          category: "text",
          position: { x: 0, y: 0 },
          size: { width: 200, height: 30 },
          styles: {
            fontSize: "24px",
            fontWeight: "bold",
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "200px",
            height: "30px",
          },
          props: {
            children: "Welcome",
          },
          children: [],
          parentId: "container-1",
        },
        {
          id: "button-1",
          type: "button",
          name: "Action Button",
          category: "interactive",
          position: { x: 0, y: 50 },
          size: { width: 120, height: 40 },
          styles: {
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
            border: "none",
            position: "absolute",
            left: "0px",
            top: "50px",
            width: "120px",
            height: "40px",
          },
          props: {
            children: "Click Me",
          },
          children: [],
          parentId: "container-1",
        },
      ];

      const result = generateCode(components, {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      // Check that the result contains expected React component structure
      expect(result).toContain("import React from 'react'");
      expect(result).toContain("const MyComponent = () => {");
      expect(result).toContain("return (");
      expect(result).toContain("export default MyComponent");

      // Check that the container has flex layout
      expect(result).toContain("display: 'flex'");
      expect(result).toContain("flexDirection: 'column'");
      expect(result).toContain("gap: '16px'");

      // Check that children are rendered
      expect(result).toContain("Welcome");
      expect(result).toContain("Click Me");

      // Check that proper HTML elements are used
      expect(result).toContain("<div");
      expect(result).toContain("<span");
      expect(result).toContain("<button");
    });

    it("handles empty component array", () => {
      const result = generateCode([], {
        framework: "react",
        includeStyles: true,
        format: true,
      });

      expect(result).toContain("import React from 'react'");
      expect(result).toContain("const MyComponent = () => {");
      expect(result).toContain("return (");
      expect(result).toContain("export default MyComponent");
    });

    it("generates HTML code when framework is html", () => {
      const components: Component[] = [
        {
          id: "text-1",
          type: "text",
          name: "Simple Text",
          category: "text",
          position: { x: 0, y: 0 },
          size: { width: 100, height: 20 },
          styles: {
            fontSize: "16px",
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100px",
            height: "20px",
          },
          props: {
            children: "Hello World",
          },
          children: [],
        },
      ];

      const result = generateCode(components, {
        framework: "html",
        includeStyles: true,
        format: true,
      });

      expect(result).toContain("<!DOCTYPE html>");
      expect(result).toContain('<html lang="en">');
      expect(result).toContain("Hello World");
    });
  });
});
