import { useTheme } from "@/contexts/ThemeContext";

type SignOutModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export const SignOutModal = ({ onCancel, onConfirm }: SignOutModalProps) => {
  const { getThemeClasses } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-popover text-popover-foreground rounded-lg p-6 w-full max-w-md border border-border-accent shadow-elevated">
        <h3
          className={`text-lg font-semibold ${getThemeClasses.text.primary} mb-2`}
        >
          Confirm Sign Out
        </h3>
        <p className={`text-sm ${getThemeClasses.text.secondary} mb-6`}>
          Are you sure you want to sign out? You will need to log in again to access your account.
        </p>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-lg ${getThemeClasses.button.ghost} transition-colors duration-200`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};