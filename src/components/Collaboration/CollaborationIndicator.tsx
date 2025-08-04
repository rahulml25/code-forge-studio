import React from "react";
import { Users } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export const CollaborationIndicator: React.FC = () => {
  const { users, currentUser } = useAppStore();

  if (users.length === 0 && !currentUser) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-md p-3 z-40">
      <div className="flex items-center space-x-2">
        <Users size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          {users.length + (currentUser ? 1 : 0)} online
        </span>
      </div>

      {users.length > 0 && (
        <div className="flex items-center space-x-1 mt-2">
          {currentUser && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: currentUser.color }}
              title={`${currentUser.name} (You)`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
