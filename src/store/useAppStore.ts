import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Component,
  ComponentLibraryItem,
  CanvasState,
  CodeGenerationOptions,
  CollaborationUser,
  ProjectSettings,
} from "../types";

interface AppStore extends CanvasState {
  // Canvas actions
  addComponent: (
    component: ComponentLibraryItem,
    position?: { x: number; y: number },
    parentId?: string
  ) => void;
  addExistingComponent: (component: Component) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, position: { x: number; y: number }) => void;
  moveComponentInLayer: (id: string, direction: "up" | "down") => void;
  resizeComponent: (
    id: string,
    size: { width: number; height: number }
  ) => void;

  // Canvas controls
  setCanvasMode: (mode: "design" | "preview") => void;
  setZoom: (zoom: number) => void;
  setViewport: (viewport: "desktop" | "tablet" | "mobile") => void;

  // Code generation
  codeOptions: CodeGenerationOptions;
  setCodeOptions: (options: Partial<CodeGenerationOptions>) => void;
  generateCode: () => string;

  // Collaboration
  users: CollaborationUser[];
  currentUser: CollaborationUser | null;
  addUser: (user: CollaborationUser) => void;
  removeUser: (userId: string) => void;
  updateUserCursor: (userId: string, cursor: { x: number; y: number }) => void;

  // Project settings
  projectSettings: ProjectSettings;
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;

  // Undo/Redo
  history: Component[][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // AI Integration
  isGeneratingAI: boolean;
  generateUIFromPrompt: (prompt: string) => Promise<void>;

  // Demo Content
  loadDemoContent: () => void;
}

const defaultProjectSettings: ProjectSettings = {
  name: "Untitled Project",
  description: "",
  framework: "react",
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    fontFamily: "Inter",
  },
  responsive: {
    breakpoints: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
    },
  },
};

const defaultCodeOptions: CodeGenerationOptions = {
  framework: "react",
  includeStyles: true,
  format: true,
};

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    components: [],
    selectedComponentId: null,
    draggedComponent: null,
    canvasMode: "design",
    zoom: 1,
    viewport: "desktop",
    codeOptions: defaultCodeOptions,
    users: [],
    currentUser: null,
    projectSettings: defaultProjectSettings,
    history: [[]],
    historyIndex: 0,
    isGeneratingAI: false,

    // Canvas actions
    addComponent: (componentItem, position, parentId) => {
      const newComponent: Component = {
        id: uuidv4(),
        type: componentItem.id,
        name: componentItem.name,
        category: componentItem.category,
        props: { ...componentItem.defaultProps },
        position: position || { x: 100, y: 100 },
        size: { width: 200, height: 100 },
        styles: { ...componentItem.defaultStyles },
        children: [],
      };

      set((state) => {
        const newComponents = [...state.components];

        if (parentId) {
          const findAndAddToParent = (components: Component[]): Component[] => {
            return components.map((comp) => {
              if (comp.id === parentId) {
                return {
                  ...comp,
                  children: [...(comp.children || []), newComponent],
                };
              }
              if (comp.children) {
                return {
                  ...comp,
                  children: findAndAddToParent(comp.children),
                };
              }
              return comp;
            });
          };
          return { components: findAndAddToParent(newComponents) };
        } else {
          newComponents.push(newComponent);
          return { components: newComponents };
        }
      });

      get().saveToHistory();
    },

    addExistingComponent: (component) => {
      set((state) => ({
        components: [...state.components, component],
      }));
      get().saveToHistory();
    },

    removeComponent: (id) => {
      set((state) => {
        const removeFromComponents = (components: Component[]): Component[] => {
          return components.filter((comp) => {
            if (comp.id === id) return false;
            if (comp.children) {
              comp.children = removeFromComponents(comp.children);
            }
            return true;
          });
        };

        return {
          components: removeFromComponents(state.components),
          selectedComponentId:
            state.selectedComponentId === id ? null : state.selectedComponentId,
        };
      });

      get().saveToHistory();
    },

    updateComponent: (id, updates) => {
      set((state) => {
        const updateInComponents = (components: Component[]): Component[] => {
          return components.map((comp) => {
            if (comp.id === id) {
              return { ...comp, ...updates };
            }
            if (comp.children) {
              return {
                ...comp,
                children: updateInComponents(comp.children),
              };
            }
            return comp;
          });
        };

        return { components: updateInComponents(state.components) };
      });
    },

    selectComponent: (id) => {
      set({ selectedComponentId: id });
    },

    moveComponent: (id, position) => {
      get().updateComponent(id, { position });
    },

    moveComponentInLayer: (id, direction) => {
      set((state) => {
        const components = [...state.components];
        const currentIndex = components.findIndex((c) => c.id === id);

        if (currentIndex === -1) return state;

        let newIndex: number;
        if (direction === "up") {
          // Move up = towards front (lower index in reverse-rendered array)
          newIndex = Math.max(0, currentIndex - 1);
        } else {
          // Move down = towards back (higher index in reverse-rendered array)
          newIndex = Math.min(components.length - 1, currentIndex + 1);
        }

        if (newIndex === currentIndex) return state;

        // Swap components to change their order
        const [movedComponent] = components.splice(currentIndex, 1);
        components.splice(newIndex, 0, movedComponent);

        return { components };
      });
    },

    resizeComponent: (id, size) => {
      get().updateComponent(id, { size });
    },

    // Canvas controls
    setCanvasMode: (mode) => set({ canvasMode: mode }),
    setZoom: (zoom) => set({ zoom }),
    setViewport: (viewport) => set({ viewport }),

    // Code generation
    setCodeOptions: (options) => {
      set((state) => ({
        codeOptions: { ...state.codeOptions, ...options },
      }));
    },

    generateCode: () => {
      const { components, codeOptions } = get();
      // Simple fallback code generation
      if (components.length === 0) {
        return codeOptions.framework === "react"
          ? `import React from 'react';\n\nconst MyComponent = () => {\n  return <div>No components yet</div>;\n};\n\nexport default MyComponent;`
          : "<div>No components yet</div>";
      }

      const componentList = components
        .map(
          (c) =>
            `<div style="position: absolute; left: ${
              c.position?.x || 0
            }px; top: ${c.position?.y || 0}px;">${
              c.props?.children || c.name
            }</div>`
        )
        .join("\n");

      return codeOptions.framework === "react"
        ? `import React from 'react';\n\nconst MyComponent = () => {\n  return (\n    <div>\n      ${componentList}\n    </div>\n  );\n};\n\nexport default MyComponent;`
        : `<div>\n${componentList}\n</div>`;
    },

    // Collaboration
    addUser: (user) => {
      set((state) => ({
        users: [...state.users.filter((u) => u.id !== user.id), user],
      }));
    },

    removeUser: (userId) => {
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      }));
    },

    updateUserCursor: (userId, cursor) => {
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, cursor } : u)),
      }));
    },

    // Project settings
    updateProjectSettings: (settings) => {
      set((state) => ({
        projectSettings: { ...state.projectSettings, ...settings },
      }));
    },

    // Undo/Redo
    saveToHistory: () => {
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push([...state.components]);
        return {
          history: newHistory.slice(-50), // Keep last 50 states
          historyIndex: Math.min(newHistory.length - 1, 49),
        };
      });
    },

    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          return {
            components: [...state.history[newIndex]],
            historyIndex: newIndex,
            selectedComponentId: null,
          };
        }
        return state;
      });
    },

    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          return {
            components: [...state.history[newIndex]],
            historyIndex: newIndex,
            selectedComponentId: null,
          };
        }
        return state;
      });
    },

    // AI Integration
    generateUIFromPrompt: async (_prompt: string) => {
      set({ isGeneratingAI: true });
      try {
        // This would integrate with an AI service
        // For now, we'll simulate the response
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock AI response - in reality this would call an AI service
        const mockComponent = {
          id: "button",
          name: "Button",
          category: "interactive",
          icon: "mouse-pointer",
          defaultProps: { children: "Submit" },
          defaultStyles: {
            backgroundColor: "#ef4444",
            color: "white",
            padding: "12px 24px",
            borderRadius: "6px",
          },
          previewComponent: () => null,
          description: "Interactive button element",
        };

        get().addComponent(mockComponent, { x: 200, y: 200 });
      } finally {
        set({ isGeneratingAI: false });
      }
    },

    // Demo Content
    loadDemoContent: () => {
      // Clear existing components
      set({ components: [] });

      // Add welcome text
      const welcomeText: ComponentLibraryItem = {
        id: "text",
        name: "Welcome Text",
        category: "text",
        icon: "type",
        defaultProps: {
          children: "Welcome to CodeForge Studio! 🎨",
        },
        defaultStyles: {
          color: "#1f2937",
          fontSize: "28px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "20px",
        },
        previewComponent: () => null,
        description: "Welcome text",
      };

      get().addComponent(welcomeText, { x: 150, y: 100 });

      // Add get started button
      const getStartedButton: ComponentLibraryItem = {
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
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
        },
        previewComponent: () => null,
        description: "Get started button",
      };

      get().addComponent(getStartedButton, { x: 250, y: 200 });

      // Add feature card
      const featureCard: ComponentLibraryItem = {
        id: "card",
        name: "Feature Card",
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
          height: "200px",
        },
        previewComponent: () => null,
        description: "Feature card container",
      };

      get().addComponent(featureCard, { x: 100, y: 300 });
    },
  }))
);
