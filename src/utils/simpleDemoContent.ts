import { ComponentLibraryItem } from "../types";

export const createSimpleDemoContent = (): ComponentLibraryItem[] => {
  return [
    {
      id: "button",
      name: "Demo Button",
      category: "interactive",
      icon: "mouse-pointer",
      defaultProps: {
        children: "Click Me!",
      },
      defaultStyles: {
        backgroundColor: "#3b82f6",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
      },
      previewComponent: () => null,
      description: "Interactive button element",
    },
    {
      id: "text",
      name: "Demo Text",
      category: "text",
      icon: "type",
      defaultProps: {
        children: "Welcome to UI Forge Studio!",
      },
      defaultStyles: {
        color: "#374151",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
      },
      previewComponent: () => null,
      description: "Welcome text",
    },
    {
      id: "card",
      name: "Demo Card",
      category: "content",
      icon: "credit-card",
      defaultProps: {
        children: null,
      },
      defaultStyles: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        width: "300px",
        minHeight: "200px",
      },
      previewComponent: () => null,
      description: "Demo card container",
    },
  ];
};
