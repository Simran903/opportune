import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PlusSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Key,
  MoreVertical,
  Check,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";

export const Sidebar = () => {
  const { isDark, getThemeClasses } = useTheme();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUser({ name: decoded.name, email: decoded.email });
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      router.push("/");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
      await axiosClient.post("/user/update-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowSuccessToast(true);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError("Failed to update password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Post Job", icon: PlusSquare, url: "/post-job" },
  ];

  return (
    <>
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[70] animate-in slide-in-from-top-2 duration-300">
          <div className={`${getThemeClasses.nav} border border-emerald-500/30 rounded-lg p-4 shadow-lg backdrop-blur-xl`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className={`text-sm font-medium ${getThemeClasses.text.primary}`}>
                  Password Updated
                </p>
                <p className={`text-xs ${getThemeClasses.text.muted}`}>
                  Your password has been successfully updated.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className={`ml-4 ${getThemeClasses.button.ghost} p-1 rounded`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${getThemeClasses.nav} backdrop-blur-xl ${getThemeClasses.button.ghost} transition-all duration-300`}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className={`${getThemeClasses.nav} rounded-lg p-6 w-full max-w-md border border-slate-700/50`}>
            <h3 className={`text-lg font-semibold ${getThemeClasses.text.primary} mb-4`}>
              Update Password
            </h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses.text.secondary} mb-1`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${getThemeClasses.nav} border border-slate-700/50 ${getThemeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses.text.secondary} mb-1`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${getThemeClasses.nav} border border-slate-700/50 ${getThemeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses.text.secondary} mb-1`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${getThemeClasses.nav} border border-slate-700/50 ${getThemeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordError("");
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
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 
          ${isCollapsed ? "w-16" : "w-64"} 
          ${isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
          transition-all duration-300 ease-in-out
          ${getThemeClasses.nav} backdrop-blur-xl border-r border-slate-700/50
          flex flex-col justify-between
        `}
      >
        <div className="relative z-10">
          {/* Header */}
          <div
            className={`relative flex items-center ${isCollapsed ? "pl-4" : "pl-6"
              } p-4 border-b border-slate-700/50 h-16`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              {!isCollapsed && (
                <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Opportune
                </span>
              )}
            </div>

            {/* Collapse button - only show on desktop */}
            <button
              onClick={toggleCollapse}
              className={`
                hidden md:flex items-center justify-center
                absolute -right-3 top-1/2 transform -translate-y-1/2
                w-6 h-6 rounded-full
                ${getThemeClasses.nav} border border-slate-700/50
                ${getThemeClasses.button.ghost}
                transition-all duration-200 z-10
                shadow-lg
              `}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 py-4 space-y-3 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            {menuItems.map((item, index) => {
              const isActive = pathname === item.url;
              return (
                <div key={index} className="relative group">
                  <Link
                    href={item.url}
                    className={`
                      flex items-center rounded-lg
                      ${isCollapsed
                        ? "justify-center p-3"
                        : "space-x-3 px-3 py-2.5"
                      }
                      ${isActive
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        : getThemeClasses.button.ghost
                      }
                      hover:bg-slate-100 dark:hover:bg-slate-700
                      relative overflow-hidden
                      transition-all duration-200
                    `}
                    onClick={() => {
                      // Close mobile menu on navigation
                      setIsMobileOpen(false);
                    }}
                  >
                    <div className="relative">
                      <item.icon
                        className={`w-5 h-5 ${isActive
                          ? "text-emerald-400"
                          : getThemeClasses.accent.emerald
                          } transition-colors duration-200`}
                      />
                    </div>

                    {!isCollapsed && (
                      <span
                        className={`${isActive
                          ? "text-emerald-400 font-medium"
                          : getThemeClasses.text.secondary
                          } group-hover:${getThemeClasses.text.primary.replace(
                            "text-",
                            "text-"
                          )} transition-colors duration-200 flex-1`}
                      >
                        {item.title}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div
          className={`border-t border-slate-700/50 ${isCollapsed ? "p-2" : "p-4"
            } relative z-10`}
        >
          {/* Theme toggle */}
          <div className="relative group mb-2">
            <div
              className={`w-full flex items-center ${isCollapsed ? "pl-0" : "pl-2"
                }`}
            >
              <ThemeToggleButton className="border-none shadow-none" />
              {!isCollapsed && (
                <span className={`ml-3 ${getThemeClasses.text.secondary}`}>
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </div>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isDark ? "Light Mode" : "Dark Mode"}
              </div>
            )}
          </div>

          {/* User profile with dropdown */}
          <div className="relative group">
            <div
              className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 ${isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5"
                } ${getThemeClasses.button.ghost}`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {(user?.name && user.name.charAt(0).toUpperCase()) || "G"}
                </span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${getThemeClasses.text.primary} truncate`}
                    >
                      {user?.name || "Guest"}
                    </div>
                    <div
                      className={`text-xs ${getThemeClasses.text.muted} truncate`}
                    >
                      {user?.email || "Not signed in"}
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </>
              )}
            </div>

            {/* User menu dropdown */}
            {showUserMenu && !isCollapsed && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 ${getThemeClasses.nav} border border-slate-700/50 rounded-lg shadow-lg overflow-hidden`}>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${getThemeClasses.button.ghost} transition-colors duration-200`}
                >
                  <Key className="w-4 h-4" />
                  <span className={`text-sm ${getThemeClasses.text.secondary}`}>
                    Update Password
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${getThemeClasses.button.ghost} hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}

            {/* Collapsed state tooltip */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">{user?.name || "Guest"}</div>
                <div className="text-xs text-gray-300">{user?.email || "Not signed in"}</div>
              </div>
            )}

            {/* Collapsed state user menu */}
            {isCollapsed && showUserMenu && (
              <div className={`absolute left-full top-0 ml-2 ${getThemeClasses.nav} border border-slate-700/50 rounded-lg shadow-lg overflow-hidden whitespace-nowrap`}>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${getThemeClasses.button.ghost} transition-colors duration-200`}
                >
                  <Key className="w-4 h-4" />
                  <span className={`text-sm ${getThemeClasses.text.secondary}`}>
                    Update Password
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${getThemeClasses.button.ghost} hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};