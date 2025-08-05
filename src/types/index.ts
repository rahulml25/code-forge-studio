import React from "react";

export interface Component {
  id: string;
  type: string;
  name: string;
  category: string;
  props: Record<string, any>;
  children?: Component[];
  parentId?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  styles?: ComponentStyles;
}

export interface ComponentStyles {
  // Layout & Positioning
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;

  // Dimensions
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;

  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Colors & Background
  backgroundColor?: string;
  color?: string;
  opacity?: number;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;

  // Borders
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;

  // Shadows & Effects
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  transform?: string;
  transition?: string;

  // Display & Layout
  display?: string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  visibility?: string;

  // Flexbox
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "stretch";
  flex?: string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: string;
  rowGap?: string;
  columnGap?: string;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  gridGap?: string;
  gridRowGap?: string;
  gridColumnGap?: string;
  gridAutoFlow?: "row" | "column" | "row dense" | "column dense";
  gridAutoRows?: string;
  gridAutoColumns?: string;
  placeItems?: string;
  placeContent?: string;
  placeSelf?: string;

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
