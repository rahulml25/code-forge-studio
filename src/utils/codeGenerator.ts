import { Component, CodeGenerationOptions } from "../types";

export function generateCode(
  components: Component[],
  options: CodeGenerationOptions
): string {
  switch (options.framework) {
    case "react":
      return generateReactCode(components, options);
    case "html":
      return generateHTMLCode(components, options);
    case "tailwind":
      return generateTailwindCode(components, options);
    default:
      return generateReactCode(components, options);
  }
}

function generateReactCode(
  components: Component[],
  options: CodeGenerationOptions
): string {
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

  const imports = new Set<string>();
  const componentCode = components
    .map((comp) => generateReactComponent(comp, 0, imports))
    .join("\n\n");

  const importStatements = Array.from(imports)
    .map((imp) => `import ${imp};`)
    .join("\n");

  return `import React from 'react';
${importStatements ? importStatements + "\n" : ""}
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

function generateReactComponent(
  component: Component,
  depth = 0,
  imports: Set<string>
): string {
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
      .map((child) => generateReactComponent(child, depth + 1, imports))
      .join("\n");
    return `${opening}${childrenCode}\n${indent}</${tag}>`;
  } else if (component.props.children) {
    return `${opening}>${component.props.children}</${tag}>`;
  } else {
    return `${opening} />`;
  }
}

function generateHTMLCode(
  components: Component[],
  options: CodeGenerationOptions
): string {
  if (components.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    </style>
</head>
<body>
    <!-- Add components to see generated code -->
</body>
</html>`;
  }

  const componentCode = components
    .map((comp) => generateHTMLComponent(comp, 0))
    .join("\n");
  const styles = generateCSSFromComponents(components);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
${styles}
    </style>
</head>
<body>
${componentCode}
</body>
</html>`;
}

function generateHTMLComponent(component: Component, depth = 0): string {
  const indent = "    ".repeat(depth + 1);
  const tag = getHTMLTag(component.type);
  const attrs = generateHTMLAttributes(component);
  const className = `component-${component.id}`;

  let opening = `${indent}<${tag}`;
  if (attrs) opening += ` ${attrs}`;
  opening += ` class="${className}"`;

  if (component.children && component.children.length > 0) {
    opening += ">\n";
    const childrenCode = component.children
      .map((child) => generateHTMLComponent(child, depth + 1))
      .join("\n");
    return `${opening}${childrenCode}\n${indent}</${tag}>`;
  } else if (component.props.children) {
    return `${opening}>${component.props.children}</${tag}>`;
  } else {
    return `${opening}></${tag}>`;
  }
}

function generateTailwindCode(
  components: Component[],
  options: CodeGenerationOptions
): string {
  const componentCode = components
    .map((comp) => generateTailwindComponent(comp, 0))
    .join("\n");

  return `<!-- Generated with Tailwind CSS -->
<div class="min-h-screen bg-gray-100 p-8">
${componentCode}
</div>`;
}

function generateTailwindComponent(component: Component, depth = 0): string {
  const indent = "    ".repeat(depth + 1);
  const tag = getHTMLTag(component.type);
  const tailwindClasses = generateTailwindClasses(component);
  const attrs = generateHTMLAttributes(component);

  let opening = `${indent}<${tag}`;
  if (attrs) opening += ` ${attrs}`;
  if (tailwindClasses) opening += ` class="${tailwindClasses}"`;

  if (component.children && component.children.length > 0) {
    opening += ">\n";
    const childrenCode = component.children
      .map((child) => generateTailwindComponent(child, depth + 1))
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
  return getReactTag(type);
}

function generateReactProps(component: Component): string {
  const props = Object.entries(component.props || {})
    .filter(
      ([key, value]) =>
        key !== "children" && value !== null && value !== undefined
    )
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}="${value}"`;
      } else {
        return `${key}={${JSON.stringify(value)}}`;
      }
    })
    .join(" ");
  return props;
}

function generateHTMLAttributes(component: Component): string {
  const attrs = Object.entries(component.props || {})
    .filter(
      ([key, value]) =>
        key !== "children" && value !== null && value !== undefined
    )
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return attrs;
}

function generateInlineStyles(styles: any): string {
  if (!styles) return "";

  const styleEntries = Object.entries(styles)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");

  return `{ ${styleEntries} }`;
}

function generateCSSFromComponents(components: Component[]): string {
  const styles: string[] = [];

  function processComponent(comp: Component) {
    if (comp.styles && Object.keys(comp.styles).length > 0) {
      const cssRules = Object.entries(comp.styles)
        .map(([key, value]) => `    ${kebabCase(key)}: ${value};`)
        .join("\n");

      styles.push(`.component-${comp.id} {\n${cssRules}\n}`);
    }

    if (comp.children) {
      comp.children.forEach(processComponent);
    }
  }

  components.forEach(processComponent);
  return styles.join("\n\n");
}

function generateTailwindClasses(component: Component): string {
  // Basic mapping from component types to Tailwind classes
  const baseClasses: Record<string, string> = {
    button:
      "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",
    text: "text-gray-800",
    heading: "text-2xl font-bold text-gray-900 mb-4",
    input:
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    container: "p-4",
    "flex-container": "flex gap-4",
    "grid-container": "grid grid-cols-2 gap-4",
    card: "bg-white p-6 rounded-lg shadow-md",
    image: "rounded",
    list: "list-disc pl-5 space-y-1",
  };

  let classes = baseClasses[component.type] || "";

  // Add style-based Tailwind classes
  if (component.styles) {
    const additionalClasses: string[] = [];

    // Background color
    if (component.styles.backgroundColor) {
      // This would need a more sophisticated color mapping
      if (component.styles.backgroundColor === "#ffffff") {
        additionalClasses.push("bg-white");
      } else if (component.styles.backgroundColor === "#f3f4f6") {
        additionalClasses.push("bg-gray-100");
      }
    }

    // Text alignment
    if (component.styles.textAlign) {
      additionalClasses.push(`text-${component.styles.textAlign}`);
    }

    // Font weight
    if (component.styles.fontWeight) {
      if (
        component.styles.fontWeight === "bold" ||
        component.styles.fontWeight === "700"
      ) {
        additionalClasses.push("font-bold");
      } else if (component.styles.fontWeight === "600") {
        additionalClasses.push("font-semibold");
      } else if (component.styles.fontWeight === "500") {
        additionalClasses.push("font-medium");
      }
    }

    if (additionalClasses.length > 0) {
      classes += " " + additionalClasses.join(" ");
    }
  }

  return classes.trim();
}

function kebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}
