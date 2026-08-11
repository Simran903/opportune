import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type UpdatePasswordModalProps = {
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
};

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialShowPasswords = {
  current: false,
  new: false,
  confirm: false,
};

export const UpdatePasswordModal = ({
  onClose,
  onSubmit,
}: UpdatePasswordModalProps) => {
  const { getThemeClasses } = useTheme();
  const [passwordForm, setPasswordForm] = useState(initialForm);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(initialShowPasswords);

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const resetForm = () => {
    setPasswordForm(initialForm);
    setPasswordError("");
    setShowPasswords(initialShowPasswords);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await onSubmit(passwordForm.currentPassword, passwordForm.newPassword);
      onClose();
      resetForm();
    } catch (error: any) {
      setPasswordError(error?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const passwordFields = [
    {
      key: "current" as const,
      label: "Current Password",
    },
    {
      key: "new" as const,
      label: "New Password",
    },
    {
      key: "confirm" as const,
      label: "Confirm New Password",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-popover text-popover-foreground rounded-lg p-6 w-full max-w-md border border-border-accent shadow-elevated">
        <h3
          className={`text-lg font-semibold ${getThemeClasses.text.primary} mb-4`}
        >
          Update Password
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {passwordFields.map(({ key, label }) => (
            <div key={key}>
              <label
                className={`block text-sm font-medium ${getThemeClasses.text.secondary} mb-1`}
              >
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[key] ? "text" : "password"}
                  value={passwordForm[`${key}Password`]}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      [`${key}Password`]: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 pr-10 rounded-lg ${getThemeClasses.input} ${getThemeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(key)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 ${getThemeClasses.button.ghost} hover:bg-surface-muted`}
                  aria-label={showPasswords[key] ? "Hide password" : "Show password"}
                >
                  {showPasswords[key] ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className={`flex-1 px-4 py-2 rounded-lg ${getThemeClasses.button.ghost} transition-colors duration-200`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};