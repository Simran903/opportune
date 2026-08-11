import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { jwtDecode } from "jwt-decode";
import axiosClient from "@/lib/axiosClient";
import { TokenManager, SessionManager, SecurityLogger } from "@/lib/security";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SuccessToast } from "./sidebar/SuccessToast";
import { SignOutModal } from "./sidebar/SignOutModal";
import { UpdatePasswordModal } from "./sidebar/UpdatePasswordModal";

type SidebarUser = { name?: string; email?: string };

export const Sidebar = () => {
  const { getThemeClasses } = useTheme();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  useEffect(() => {
    const initializeUser = async () => {
      if (typeof window !== "undefined") {
        try {
          const token = await TokenManager.getToken();
          if (token && TokenManager.isTokenValid(token)) {
            const decoded: any = jwtDecode(token);
            setUser({ name: decoded.name, email: decoded.email });

            // Log user session
            SecurityLogger.logSecurityEvent('USER_SESSION_ACTIVE', {
              userId: decoded.id,
              email: decoded.email,
              timestamp: new Date().toISOString(),
            });
          } else {
            setUser(null);
            // Redirect to login if token is invalid
            if (pathname !== '/auth/signin' && pathname !== '/auth/signup') {
              router.push('/auth/signin');
            }
          }
        } catch (e) {
          setUser(null);
          SecurityLogger.logSecurityEvent('TOKEN_DECODE_ERROR', {
            error: e instanceof Error ? e.message : 'Unknown error',
            pathname,
          });
        }
      }
    };

    initializeUser();
  }, [pathname, router]);

  // Session validation
  useEffect(() => {
    const checkSession = () => {
      if (!SessionManager.isSessionValid()) {
        SecurityLogger.logSecurityEvent('SESSION_EXPIRED', {
          pathname,
          timestamp: new Date().toISOString(),
        });

        // Clear user data and redirect to login
        setUser(null);
        TokenManager.removeToken();
        SessionManager.endSession();
        router.push('/auth/signin');
      }
    };

    // Check session every 5 minutes
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    // Also check on user activity
    const handleUserActivity = () => {
      SessionManager.updateActivity();
    };

    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      clearInterval(sessionCheckInterval);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [router]);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      // Log sign out event
      SecurityLogger.logSecurityEvent('USER_SIGNOUT', {
        userId: user?.email,
        timestamp: new Date().toISOString(),
      });

      // Clear all security data
      await TokenManager.removeToken();
      SessionManager.endSession();
      setUser(null);

      // Close the confirm dialog
      setShowSignOutConfirm(false);

      router.push("/");
    }
  };

  const handlePasswordSubmit = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await axiosClient.post("/user/update-password", {
        currentPassword,
        newPassword,
      });

      setShowSuccessToast(true);

      // Log password update
      SecurityLogger.logSecurityEvent('PASSWORD_UPDATED', {
        userId: user?.email,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      // Log password update failure
      SecurityLogger.logSecurityEvent('PASSWORD_UPDATE_FAILED', {
        userId: user?.email,
        error: error.response?.data?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      });

      if (error?.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update password");
    }
  };

  return (
    <>
      {showSuccessToast && (
        <SuccessToast onClose={() => setShowSuccessToast(false)} />
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

      {/* Sign Out Confirm Dialog */}
      {showSignOutConfirm && (
        <SignOutModal
          onCancel={() => setShowSignOutConfirm(false)}
          onConfirm={handleSignOut}
        />
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <UpdatePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
        />
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
          <SidebarHeader
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
          <SidebarNavigation
            isCollapsed={isCollapsed}
            onNavigate={() => setIsMobileOpen(false)}
          />
        </div>

        <SidebarFooter
          isCollapsed={isCollapsed}
          name={user?.name}
          email={user?.email}
          onUpdatePassword={() => setShowPasswordModal(true)}
          onSignOut={() => setShowSignOutConfirm(true)}
        />
      </div>
    </>
  );
};