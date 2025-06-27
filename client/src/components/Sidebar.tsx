import React, { useState } from "react";
import {
  Home,
  Briefcase,
  PlusSquare,
  Menu,
  X,
  User2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggleButton } from "./ThemeToggleButton";

const OpportuneSidebar = () => {
  const { isDark, getThemeClasses, getAnimatedBg } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  const menuItems = [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Post a Job", icon: PlusSquare, url: "/post-job" },
    { title: "Manage Jobs", icon: Briefcase, url: "/jobs" },
  ];

  const animatedBgClasses = getAnimatedBg();

  return (
    <div
      className={`min-h-screen ${getThemeClasses.background} relative overflow-hidden`}
    >
      <div className={animatedBgClasses[0]} />
      <div className={animatedBgClasses[1]} />
      <div className={animatedBgClasses[2]} />

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

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMobile}
        />
      )}

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
        <div>
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

          <nav
            className={`flex-1 py-2 space-y-1 ${isCollapsed ? "px-2" : "px-4"}`}
          >
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.url}
                  className={`
                    flex items-center rounded-lg
                    ${isCollapsed
                      ? "justify-center p-3"
                      : "space-x-3 px-3 py-2.5"
                    }
                    ${getThemeClasses.button.ghost
                    } hover:bg-slate-100 dark:hover:bg-slate-700
                    relative overflow-hidden
                    transition-all duration-200
                  `}
                >
                  <div className="relative">
                    <item.icon
                      className={`w-5 h-5 ${getThemeClasses.accent.emerald} transition-colors duration-200`}
                    />
                  </div>

                  {!isCollapsed && (
                    <span
                      className={`${getThemeClasses.text.secondary
                        } group-hover:${getThemeClasses.text.primary.replace(
                          "text-",
                          "text-"
                        )} transition-colors duration-200 flex-1`}
                    >
                      {item.title}
                    </span>
                  )}
                </a>
              </div>
            ))}
          </nav>
        </div>

        <div
          className={`border-t border-slate-700/50 ${isCollapsed ? "p-2" : "p-4"
            }`}
        >
          <div className="relative group">
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

          <div className="relative group">
            <div
              className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 ${isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5"
                } ${getThemeClasses.button.ghost}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                <User2 className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${getThemeClasses.text.primary} truncate`}
                  >
                    John Doe
                  </div>
                  <div
                    className={`text-xs ${getThemeClasses.text.muted} truncate`}
                  >
                    john@example.com
                  </div>
                </div>
              )}
            </div>

            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-gray-300">john@example.com</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportuneSidebar;
