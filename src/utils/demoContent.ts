import { ComponentLibraryItem } from "../types";
import { useAppStore } from "../store/useAppStore";

// Demo data for showcasing the app
export const createDemoLayout = () => {
  const addComponent = useAppStore.getState().addComponent;

  // Create a hero section demo
  const heroContainer: ComponentLibraryItem = {
    id: "flex-container",
    name: "Hero Section",
    category: "layout",
    icon: "layout-dashboard",
    defaultProps: {
      direction: "column",
    },
    defaultStyles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      backgroundColor: "#f8fafc",
      minHeight: "400px",
      textAlign: "center",
    },
    previewComponent: () => null,
    description: "Hero section layout",
  };

  const heroHeading: ComponentLibraryItem = {
    id: "heading",
    name: "Hero Title",
    category: "text",
    icon: "heading",
    defaultProps: {
      children: "Welcome to CodeForge Studio",
      level: 1,
    },
    defaultStyles: {
      fontSize: "48px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "16px",
      textAlign: "center",
    },
    previewComponent: () => null,
    description: "Hero section title",
  };

  const heroSubtext: ComponentLibraryItem = {
    id: "text",
    name: "Hero Subtitle",
    category: "text",
    icon: "type",
    defaultProps: {
      children:
        "Create beautiful UIs with drag-and-drop and get instant code generation",
    },
    defaultStyles: {
      fontSize: "20px",
      color: "#6b7280",
      marginBottom: "32px",
      maxWidth: "600px",
      lineHeight: "1.6",
      textAlign: "center",
    },
    previewComponent: () => null,
    description: "Hero section subtitle",
  };

  const ctaButton: ComponentLibraryItem = {
    id: "button",
    name: "Get Started Button",
    category: "interactive",
    icon: "mouse-pointer",
    defaultProps: {
      children: "Get Started",
    },
    defaultStyles: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "16px 32px",
      fontSize: "18px",
      fontWeight: "600",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    previewComponent: () => null,
    description: "Call-to-action button",
  };

  // Add components with positions
  addComponent(heroContainer, { x: 50, y: 50 });

  // Note: In a real implementation, you'd need to handle parent-child relationships
  // For now, we'll add them as separate components with relative positioning
  setTimeout(() => {
    addComponent(heroHeading, { x: 200, y: 120 });
  }, 100);

  setTimeout(() => {
    addComponent(heroSubtext, { x: 150, y: 200 });
  }, 200);

  setTimeout(() => {
    addComponent(ctaButton, { x: 300, y: 300 });
  }, 300);
};

export const createFeatureCards = () => {
  const addComponent = useAppStore.getState().addComponent;

  const cardsContainer: ComponentLibraryItem = {
    id: "grid-container",
    name: "Features Grid",
    category: "layout",
    icon: "grid-3x3",
    defaultProps: {
      columns: 3,
    },
    defaultStyles: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "24px",
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    previewComponent: () => null,
    description: "Feature cards grid",
  };

  const featureCard1: ComponentLibraryItem = {
    id: "card",
    name: "Drag & Drop Card",
    category: "content",
    icon: "credit-card",
    defaultProps: {},
    defaultStyles: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      border: "1px solid #e5e7eb",
    },
    previewComponent: () => null,
    description: "Feature card 1",
  };

  addComponent(cardsContainer, { x: 50, y: 450 });

  setTimeout(() => {
    addComponent(featureCard1, { x: 100, y: 520 });
  }, 100);
};

export const loadDemoContent = () => {
  createDemoLayout();

  setTimeout(() => {
    createFeatureCards();
  }, 1000);
};
