import React, { useState, useMemo } from "react";
import { Copy, Download } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { generateCode } from "../../utils/codeGenerator";

export const CodePanel: React.FC = () => {
  const { components, codeOptions, setCodeOptions } = useAppStore();
  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    return generateCode(components, codeOptions);
  }, [components, codeOptions]);

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
