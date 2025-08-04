import React, { useState, useMemo } from "react";
import { Copy, Download, Eye } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export const CodePanel: React.FC = () => {
  const { components, codeOptions, setCodeOptions } = useAppStore();
  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    if (codeOptions.framework === "react") {
      return generateReactCode(components);
    } else if (codeOptions.framework === "tailwind") {
      return generateTailwindCode(components);
    } else {
      return generateHTMLCode(components);
    }
  }, [components, codeOptions.framework]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleDownload = () => {
    const fileExtension = codeOptions.framework === "react" ? "jsx" : "html";
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `component.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Generated Code
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-md transition-colors ${
                copied
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              title="Copy code"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
              title="Download code"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Framework Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Output Format
          </label>
          <select
            value={codeOptions.framework}
            onChange={(e) =>
              setCodeOptions({ framework: e.target.value as any })
            }
            className="property-input"
          >
            <option value="react">React JSX</option>
            <option value="html">HTML/CSS</option>
            <option value="tailwind">Tailwind CSS</option>
          </select>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 text-sm font-mono bg-gray-900 text-gray-100">
          <code>{generatedCode}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p>💡 Code updates automatically as you design</p>
        </div>
      </div>
    </div>
  );
};

// Code generation functions
function generateReactCode(components: any[]): string {
  if (components.length === 0) {
    return `import React from 'react';

const MyComponent = () => {
  return (
    <div>
      {/* Add components to see generated code */}
    </div>
  );
};

export default MyComponent;`;
  }

  const componentCode = components.map(generateReactComponent).join("\n\n");

  return `import React from 'react';

const MyComponent = () => {
  return (
    <div>
${componentCode
  .split("\n")
  .map((line) => "      " + line)
  .join("\n")}
    </div>
  );
};

export default MyComponent;`;
}

function generateReactComponent(component: any, depth = 0): string {
  const indent = "  ".repeat(depth);
  const tag = getReactTag(component.type);
  const props = generateReactProps(component);
  const styles = generateInlineStyles(component.styles);

  let opening = `${indent}<${tag}`;
  if (props) opening += ` ${props}`;
  if (styles) opening += ` style={${styles}}`;

  if (component.children && component.children.length > 0) {
    opening += ">\n";
    const childrenCode = component.children
      .map((child: any) => generateReactComponent(child, depth + 1))
      .join("\n");
    return `${opening}${childrenCode}\n${indent}</${tag}>`;
  } else if (component.props.children) {
    return `${opening}>${component.props.children}</${tag}>`;
  } else {
    return `${opening} />`;
  }
}

function generateHTMLCode(components: any[]): string {
  if (components.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
</head>
<body>
    <!-- Add components to see generated code -->
</body>
</html>`;
  }

  const componentCode = components.map(generateHTMLComponent).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
    <style>
        /* Add your custom styles here */
    </style>
</head>
<body>
${componentCode}
</body>
</html>`;
}

function generateHTMLComponent(component: any, depth = 0): string {
  const indent = "    ".repeat(depth + 1);
  const tag = getHTMLTag(component.type);
  const attrs = generateHTMLAttributes(component);
  const styles = generateCSSStyles(component.styles);

  let opening = `${indent}<${tag}`;
  if (attrs) opening += ` ${attrs}`;
  if (styles) opening += ` style="${styles}"`;

  if (component.children && component.children.length > 0) {
    opening += ">\n";
    const childrenCode = component.children
      .map((child: any) => generateHTMLComponent(child, depth + 1))
      .join("\n");
    return `${opening}${childrenCode}\n${indent}</${tag}>`;
  } else if (component.props.children) {
    return `${opening}>${component.props.children}</${tag}>`;
  } else {
    return `${opening}></${tag}>`;
  }
}

function generateTailwindCode(components: any[]): string {
  // Similar to HTML but with Tailwind classes
  const componentCode = components.map(generateTailwindComponent).join("\n");

  return `<!-- Generated with Tailwind CSS -->
<div class="min-h-screen bg-gray-100">
${componentCode}
</div>`;
}

function generateTailwindComponent(component: any, depth = 0): string {
  const indent = "    ".repeat(depth + 1);
  const tag = getHTMLTag(component.type);
  const tailwindClasses = generateTailwindClasses(component);

  let opening = `${indent}<${tag}`;
  if (tailwindClasses) opening += ` class="${tailwindClasses}"`;

  if (component.children && component.children.length > 0) {
    opening += ">\n";
    const childrenCode = component.children
      .map((child: any) => generateTailwindComponent(child, depth + 1))
      .join("\n");
    return `${opening}${childrenCode}\n${indent}</${tag}>`;
  } else if (component.props.children) {
    return `${opening}>${component.props.children}</${tag}>`;
  } else {
    return `${opening}></${tag}>`;
  }
}

// Helper functions
function getReactTag(type: string): string {
  const mapping: Record<string, string> = {
    text: "span",
    heading: "h1",
    button: "button",
    input: "input",
    image: "img",
    container: "div",
    "flex-container": "div",
    "grid-container": "div",
    card: "div",
    list: "ul",
  };
  return mapping[type] || "div";
}

function getHTMLTag(type: string): string {
  return getReactTag(type); // Same mapping
}

function generateReactProps(component: any): string {
  const props = Object.entries(component.props || {})
    .filter(
      ([key, value]) =>
        key !== "children" && value !== null && value !== undefined
    )
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return props;
}

function generateHTMLAttributes(component: any): string {
  return generateReactProps(component);
}

function generateInlineStyles(styles: any): string {
  if (!styles) return "";

  const styleEntries = Object.entries(styles)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");

  return `{ ${styleEntries} }`;
}

function generateCSSStyles(styles: any): string {
  if (!styles) return "";

  return Object.entries(styles)
    .map(([key, value]) => `${kebabCase(key)}: ${value}`)
    .join("; ");
}

function generateTailwindClasses(component: any): string {
  // This would need a more sophisticated mapping from CSS to Tailwind classes
  // For now, return basic classes based on component type
  const baseClasses: Record<string, string> = {
    button: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
    text: "text-gray-800",
    heading: "text-2xl font-bold text-gray-900",
    input:
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    container: "p-4",
    "flex-container": "flex gap-4",
    "grid-container": "grid grid-cols-2 gap-4",
    card: "bg-white p-6 rounded-lg shadow-md",
  };

  return baseClasses[component.type] || "";
}

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}
