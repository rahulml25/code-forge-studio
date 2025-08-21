import { describe, it, expect, beforeEach } from "@jest/globals";
import { useAppStore } from "../store/useAppStore";
import { Component } from "../types";

// Mock components for testing
const mockComponent1: Component = {
  id: "comp1",
  type: "div",
  name: "Component 1",
  category: "layout",
  props: {},
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
};

const mockComponent2: Component = {
  id: "comp2",
  type: "text",
  name: "Component 2",
  category: "text",
  props: {},
  position: { x: 100, y: 100 },
  size: { width: 100, height: 100 },
};

const mockComponent3: Component = {
  id: "comp3",
  type: "button",
  name: "Component 3",
  category: "input",
  props: {},
  position: { x: 200, y: 200 },
  size: { width: 100, height: 100 },
};

describe("Grouping and Parent-Child Functionality", () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState({
      components: [],
      selectedComponentId: null,
    });
  });

  it("should create a group from multiple components", () => {
    const store = useAppStore.getState();

    // Add mock components
    store.addExistingComponent(mockComponent1);
    store.addExistingComponent(mockComponent2);
    store.addExistingComponent(mockComponent3);

    // Group components 1 and 2
    const groupId = store.groupComponents(["comp1", "comp2"], "Test Group");

    const state = useAppStore.getState();

    // Check that a group component was created
    const groupComponent = state.components.find((c) => c.id === groupId);
    expect(groupComponent).toBeDefined();
    expect(groupComponent?.name).toBe("Test Group");
    expect(groupComponent?.type).toBe("div");

    // Check that components 1 and 2 are now children of the group
    const comp1 = state.components.find((c) => c.id === "comp1");
    const comp2 = state.components.find((c) => c.id === "comp2");
    const comp3 = state.components.find((c) => c.id === "comp3");

    expect(comp1?.parentId).toBe(groupId);
    expect(comp2?.parentId).toBe(groupId);
    expect(comp3?.parentId).toBeUndefined(); // Should remain ungrouped
  });

  it("should ungroup components properly", () => {
    const store = useAppStore.getState();

    // Add mock components
    store.addExistingComponent(mockComponent1);
    store.addExistingComponent(mockComponent2);

    // Group components
    const groupId = store.groupComponents(["comp1", "comp2"], "Test Group");

    // Verify grouping worked
    let state = useAppStore.getState();
    expect(state.components.find((c) => c.id === "comp1")?.parentId).toBe(
      groupId
    );
    expect(state.components.find((c) => c.id === "comp2")?.parentId).toBe(
      groupId
    );

    // Ungroup
    if (groupId) {
      store.ungroupComponent(groupId);
    }

    state = useAppStore.getState();

    // Check that group component is removed
    expect(state.components.find((c) => c.id === groupId)).toBeUndefined();

    // Check that components are no longer children
    const comp1 = state.components.find((c) => c.id === "comp1");
    const comp2 = state.components.find((c) => c.id === "comp2");

    expect(comp1?.parentId).toBeUndefined();
    expect(comp2?.parentId).toBeUndefined();
  });

  it("should set parent-child relationships", () => {
    const store = useAppStore.getState();

    // Add mock components
    store.addExistingComponent(mockComponent1);
    store.addExistingComponent(mockComponent2);

    // Set comp2 as child of comp1
    store.setParentChild("comp2", "comp1");

    const state = useAppStore.getState();
    const comp2 = state.components.find((c) => c.id === "comp2");

    expect(comp2?.parentId).toBe("comp1");
  });

  it("should move component to root level", () => {
    const store = useAppStore.getState();

    // Add mock components
    store.addExistingComponent(mockComponent1);
    store.addExistingComponent({ ...mockComponent2, parentId: "comp1" });

    // Move comp2 to root level
    store.setParentChild("comp2", null);

    const state = useAppStore.getState();
    const comp2 = state.components.find((c) => c.id === "comp2");

    expect(comp2?.parentId).toBeUndefined();
  });

  it("should move component to a new parent", () => {
    const store = useAppStore.getState();

    // Add mock components
    store.addExistingComponent(mockComponent1);
    store.addExistingComponent(mockComponent2);
    store.addExistingComponent({ ...mockComponent3, parentId: "comp1" });

    // Move comp3 from comp1 to comp2
    store.moveComponentToParent("comp3", "comp2");

    const state = useAppStore.getState();
    const comp3 = state.components.find((c) => c.id === "comp3");

    expect(comp3?.parentId).toBe("comp2");
  });

  it("should allow flexible parent-child relationships", () => {
    const store = useAppStore.getState();

    // Create different component types
    const divComponent: Component = {
      id: "div1",
      type: "div",
      name: "Div Container",
      category: "layout",
      props: {},
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
    };

    const textComponent: Component = {
      id: "text1",
      type: "text",
      name: "Text Element",
      category: "text",
      props: {},
      position: { x: 50, y: 50 },
      size: { width: 100, height: 50 },
    };

    const sectionComponent: Component = {
      id: "section1",
      type: "section",
      name: "Section Container",
      category: "layout",
      props: {},
      position: { x: 0, y: 250 },
      size: { width: 300, height: 150 },
    };

    // Add components
    store.addExistingComponent(divComponent);
    store.addExistingComponent(textComponent);
    store.addExistingComponent(sectionComponent);

    // Make text a child of div (should work)
    store.setParentChild("text1", "div1");

    // Make div a child of section (should work)
    store.setParentChild("div1", "section1");

    const state = useAppStore.getState();
    const text = state.components.find((c) => c.id === "text1");
    const div = state.components.find((c) => c.id === "div1");

    expect(text?.parentId).toBe("div1");
    expect(div?.parentId).toBe("section1");
  });
});
