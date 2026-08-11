import { useEffect } from "react";
import { X, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type SuccessToastProps = {
  onClose: () => void;
};

export const SuccessToast = ({ onClose }: SuccessToastProps) => {
  const { getThemeClasses } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[70] animate-in slide-in-from-top-2 duration-300">
      <div
        className={`${getThemeClasses.nav} border border-emerald-500/30 rounded-lg p-4 shadow-lg backdrop-blur-xl`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p
              className={`text-sm font-medium ${getThemeClasses.text.primary}`}
            >
              Password Updated
            </p>
            <p className={`text-xs ${getThemeClasses.text.muted}`}>
              Your password has been successfully updated.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 ${getThemeClasses.button.ghost} p-1 rounded`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};