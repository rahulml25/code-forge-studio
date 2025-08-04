import React, { useState } from "react";
import { Bot, Send, Wand2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export const AIPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { isGeneratingAI, generateUIFromPrompt } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    await generateUIFromPrompt(prompt);
    setPrompt("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        title="AI Assistant"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="text-purple-600" size={20} />
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe what you want to create:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a login form with email and password fields..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              disabled={isGeneratingAI}
            />
          </div>

          <button
            type="submit"
            disabled={isGeneratingAI || !prompt.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {isGeneratingAI ? (
              <>
                <Wand2 className="animate-spin" size={16} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Generate UI</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-3 text-xs text-gray-500">
          <p>💡 Try: "Create a hero section with title and CTA button"</p>
        </div>
      </div>
    </div>
  );
};
