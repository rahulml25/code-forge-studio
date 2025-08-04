import React from "react";

export const PreviewPanel: React.FC = () => {
  return (
    <div className="h-full bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👁️</div>
        <h3 className="text-xl font-medium mb-2">Preview Mode</h3>
        <p className="text-gray-600">Your design preview will appear here</p>
      </div>
    </div>
  );
};
