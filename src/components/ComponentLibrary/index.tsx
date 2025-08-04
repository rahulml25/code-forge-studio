import React from "react";
import { ComponentLibraryItem } from "../../types";

// Simple preview components that don't use complex JSX
const ButtonPreview: React.FC<any> = ({ children = "Button" }) =>
  React.createElement(
    "button",
    {
      style: {
        padding: "8px 16px",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
    },
    children
  );

const TextPreview: React.FC<any> = ({ children = "Text content" }) =>
  React.createElement(
    "span",
    {
      style: { color: "#374151" },
    },
    children
  );

const InputPreview: React.FC<any> = ({ placeholder = "Enter text..." }) =>
  React.createElement("input", {
    placeholder,
    style: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
    },
  });

const CardPreview: React.FC<any> = ({ children }) =>
  React.createElement(
    "div",
    {
      style: {
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
      },
    },
    children ||
      React.createElement(
        "div",
        {},
        React.createElement(
          "h3",
          {
            style: {
              margin: "0 0 8px 0",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
          "Card Title"
        ),
        React.createElement(
          "p",
          { style: { margin: 0, color: "#6b7280", fontSize: "14px" } },
          "Card content"
        )
      )
  );

const ContainerPreview: React.FC<any> = ({ children }) =>
  React.createElement(
    "div",
    {
      style: {
        padding: "16px",
        border: "2px dashed #d1d5db",
        borderRadius: "8px",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    children ||
      React.createElement("span", { style: { color: "#9ca3af" } }, "Container")
  );

const ImagePreview: React.FC<any> = ({ src, alt = "Image" }) =>
  React.createElement("img", {
    src: src || "https://via.placeholder.com/120x80",
    alt,
    style: { borderRadius: "4px", maxWidth: "120px", height: "auto" },
  });

const HeadingPreview: React.FC<any> = ({ children = "Heading", level = 1 }) =>
  React.createElement(
    `h${level}`,
    {
      style: {
        margin: "0 0 8px 0",
        fontSize: level === 1 ? "24px" : level === 2 ? "20px" : "18px",
        fontWeight: "bold",
        color: "#111827",
      },
    },
    children
  );

const ListPreview: React.FC<any> = ({
  items = ["Item 1", "Item 2"],
  ordered = false,
}) =>
  React.createElement(
    ordered ? "ol" : "ul",
    {
      style: {
        paddingLeft: "20px",
        margin: 0,
        listStyle: ordered ? "decimal" : "disc",
      },
    },
    ...items.map((item: string, i: number) =>
      React.createElement(
        "li",
        { key: i, style: { color: "#374151", fontSize: "14px" } },
        item
      )
    )
  );

const FlexContainerPreview: React.FC<any> = ({ children, direction = "row" }) =>
  React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: direction,
        gap: "8px",
        padding: "16px",
        border: "2px dashed #3b82f6",
        borderRadius: "8px",
        minHeight: "60px",
      },
    },
    children ||
      React.createElement(
        React.Fragment,
        {},
        React.createElement(
          "div",
          {
            style: {
              flex: 1,
              backgroundColor: "#dbeafe",
              padding: "8px",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "12px",
            },
          },
          "Item 1"
        ),
        React.createElement(
          "div",
          {
            style: {
              flex: 1,
              backgroundColor: "#dbeafe",
              padding: "8px",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "12px",
            },
          },
          "Item 2"
        )
      )
  );

const GridContainerPreview: React.FC<any> = ({ children, columns = 2 }) =>
  React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "8px",
        padding: "16px",
        border: "2px dashed #10b981",
        borderRadius: "8px",
        minHeight: "60px",
      },
    },
    children ||
      Array.from({ length: columns * 2 }, (_, i) =>
        React.createElement(
          "div",
          {
            key: i,
            style: {
              backgroundColor: "#d1fae5",
              padding: "8px",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "12px",
            },
          },
          `Item ${i + 1}`
        )
      )
  );

export const componentLibrary: ComponentLibraryItem[] = [
  // Layout Components
  {
    id: "container",
    name: "Container",
    category: "layout",
    icon: "square",
    defaultProps: {
      children: null,
    },
    defaultStyles: {
      padding: "16px",
      border: "2px dashed #d1d5db",
      borderRadius: "8px",
      minHeight: "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    previewComponent: ContainerPreview,
    description: "Basic container for grouping elements",
  },
  {
    id: "flex-container",
    name: "Flex Container",
    category: "layout",
    icon: "move-horizontal",
    defaultProps: {
      direction: "row",
      children: null,
    },
    defaultStyles: {
      display: "flex",
      gap: "8px",
      padding: "16px",
      border: "2px dashed #3b82f6",
      borderRadius: "8px",
      minHeight: "100px",
    },
    previewComponent: FlexContainerPreview,
    description: "Flexible layout container",
  },
  {
    id: "grid-container",
    name: "Grid Container",
    category: "layout",
    icon: "grid-3x3",
    defaultProps: {
      columns: 2,
      children: null,
    },
    defaultStyles: {
      display: "grid",
      gap: "8px",
      padding: "16px",
      border: "2px dashed #10b981",
      borderRadius: "8px",
      minHeight: "100px",
    },
    previewComponent: GridContainerPreview,
    description: "Grid layout container",
  },

  // Text Components
  {
    id: "text",
    name: "Text",
    category: "text",
    icon: "type",
    defaultProps: {
      children: "Text content",
    },
    defaultStyles: {
      color: "#374151",
      fontSize: "16px",
    },
    previewComponent: TextPreview,
    description: "Basic text element",
  },
  {
    id: "heading",
    name: "Heading",
    category: "text",
    icon: "heading",
    defaultProps: {
      children: "Heading",
      level: 1,
    },
    defaultStyles: {
      color: "#111827",
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    previewComponent: HeadingPreview,
    description: "Heading text with different levels",
  },

  // Interactive Components
  {
    id: "button",
    name: "Button",
    category: "interactive",
    icon: "mouse-pointer",
    defaultProps: {
      children: "Button",
      onClick: null,
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
    previewComponent: ButtonPreview,
    description: "Interactive button element",
  },
  {
    id: "input",
    name: "Input",
    category: "interactive",
    icon: "edit",
    defaultProps: {
      placeholder: "Enter text...",
      type: "text",
    },
    defaultStyles: {
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "16px",
      width: "200px",
    },
    previewComponent: InputPreview,
    description: "Text input field",
  },

  // Media Components
  {
    id: "image",
    name: "Image",
    category: "media",
    icon: "image",
    defaultProps: {
      src: "https://via.placeholder.com/150x100",
      alt: "Image",
    },
    defaultStyles: {
      borderRadius: "8px",
      maxWidth: "100%",
      height: "auto",
    },
    previewComponent: ImagePreview,
    description: "Image element",
  },

  // Content Components
  {
    id: "card",
    name: "Card",
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
    },
    previewComponent: CardPreview,
    description: "Card container with shadow",
  },
  {
    id: "list",
    name: "List",
    category: "content",
    icon: "list",
    defaultProps: {
      items: ["Item 1", "Item 2", "Item 3"],
      ordered: false,
    },
    defaultStyles: {
      paddingLeft: "20px",
    },
    previewComponent: ListPreview,
    description: "Ordered or unordered list",
  },
];

export const componentCategories = [
  { id: "layout", name: "Layout", icon: "layout-dashboard" },
  { id: "text", name: "Text", icon: "type" },
  { id: "interactive", name: "Interactive", icon: "mouse-pointer" },
  { id: "media", name: "Media", icon: "image" },
  { id: "content", name: "Content", icon: "file-text" },
];

export const getComponentsByCategory = (category: string) => {
  return componentLibrary.filter(
    (component) => component.category === category
  );
};

export const getComponentById = (id: string) => {
  return componentLibrary.find((component) => component.id === id);
};

const ComponentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: "grid-3x3" },
    ...componentCategories,
  ];

  const filteredComponents = componentLibrary.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (
    e: React.DragEvent,
    component: ComponentLibraryItem
  ) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "COMPONENT_LIBRARY_ITEM",
        component: {
          id: component.id,
          name: component.name,
          category: component.category,
          defaultProps: component.defaultProps,
          defaultStyles: component.defaultStyles,
          description: component.description,
        },
      })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          Component Library
        </h3>

        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            marginBottom: "12px",
            outline: "none",
          }}
        />

        <div style={{ marginBottom: "12px" }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                margin: "0 4px 4px 0",
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor:
                  selectedCategory === category.id ? "#3b82f6" : "white",
                color: selectedCategory === category.id ? "white" : "#374151",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            style={{
              padding: "12px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "grab",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(59, 130, 246, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <h4
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {component.name}
              </h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                {component.description}
              </p>
            </div>

            <div
              style={{
                padding: "8px",
                backgroundColor: "#f9fafb",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50px",
              }}
            >
              <component.previewComponent />
            </div>
          </div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          No components found matching your search.
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
