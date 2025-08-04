import React from "react";

export interface Component {
  id: string;
  type: string;
  name: string;
  category: string;
  props: Record<string, any>;
  children?: Component[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  styles?: ComponentStyles;
}

export interface ComponentStyles {
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  textAlign?: string;
  [key: string]: any;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultProps: Record<string, any>;
  defaultStyles: ComponentStyles;
  previewComponent: React.ComponentType<any>;
  description: string;
}

export interface CanvasState {
  components: Component[];
  selectedComponentId: string | null;
  draggedComponent: ComponentLibraryItem | null;
  canvasMode: "design" | "preview";
  zoom: number;
  viewport: "desktop" | "tablet" | "mobile";
}

export interface CodeGenerationOptions {
  framework: "html" | "tailwind" | "react";
  includeStyles: boolean;
  format: boolean;
}

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  selectedComponentId?: string;
}

export interface ProjectSettings {
  name: string;
  description: string;
  framework: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
}

export type DragItem =
  | {
      type: "component";
      item: ComponentLibraryItem;
    }
  | {
      type: "existing-component";
      item: Component;
    };

export interface DropResult {
  dropEffect: string;
  position?: { x: number; y: number };
  parentId?: string;
}
