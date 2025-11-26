"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Cpu,
  Database,
  Settings,
  Users,
  Home,
  Activity,
  BarChart,
  Wrench,
  Bell,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  Map,
  Server,
  Coins,
  Wallet,
} from "lucide-react";

import WalletConnection from "@/app/dashboard/auth/components/wallet-connection";

// Navigation configuration
const navItems = [
  { title: "Overview", url: "/dashboard", icon: Home },  // ✅ FIXED
  { title: "Training", url: "/dashboard/training", icon: Cpu, badge: "Live" },
  { title: "Model Versions", url: "/dashboard/model", icon: Database },
  { title: "Contributors", url: "/dashboard/contributors", icon: Users },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart },
  { title: "Activity", url: "/dashboard/activity", icon: Activity, badge: "" },
  { title: "Marketing", url: "/dashboard/marketing", icon: Map, badge: "" },
  { title: "Wallet", url: "/dashboard/wallet", icon: Wallet, badge: "" },
];

const secondaryItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Developer Tools", url: "/dashboard/tools", icon: Wrench },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeUrl, setActiveUrl] = React.useState("/dashboard");  // ✅ FIXED
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);
  const [showWalletDropdown, setShowWalletDropdown] = React.useState(false);

  const [quickStats] = React.useState({
    accuracy: 94.2,
    activeNodes: 1247,
    contribution: 12.4,
  });

  // Sync active URL with pathname
  React.useEffect(() => {
    if (pathname) setActiveUrl(pathname);
  }, [pathname]);

  // Initialize dark mode from system preference
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") || 
                   window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Theme toggle
  // const toggleDarkMode = React.useCallback(() => {
  //   setIsDarkMode((prev) => {
  //     const newMode = !prev;
  //     document.documentElement.classList.toggle("dark", newMode);
  //     return newMode;
  //   });
  // }, []);

  // Navigation handler
  const handleNavClick = React.useCallback(
    (url: string) => {
      setActiveUrl(url);
      router.push(url);
    },
    [router]
  );

  // Clear notifications
  const handleNotificationClick = React.useCallback(() => {
    if (notifications > 0) {
      setNotifications(0);
    } else {
      router.push("/notifications");
    }
  }, [notifications, router]);

  // Wallet dropdown toggle
  const handleWalletClick = React.useCallback(() => {
    setShowWalletDropdown((prev) => !prev);
  }, []);

  return (
    <Sidebar className="transition-colors duration-200">
      {/* HEADER */}
      <SidebarHeader className="border-b border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
           <div className="">
                <img 
                  src="/logos/main-logo.svg" 
                  alt="Sui-DAT Logo" 
                  className="h-12 w-12"
                />
              </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                Sui-DAT
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Decentralized AI Training
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-gray-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </button> */}

            {/* Notifications */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </SidebarHeader>

      {/* MAIN CONTENT */}
      <SidebarContent className="bg-gray-50/50 dark:bg-gray-950/50">
        {/* Platform Section */}
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
            Platform
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavClick(item.url)}
                    isActive={activeUrl === item.url}
                    className={`group transition-all duration-200 ${
                      activeUrl === item.url
                        ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon 
                          className={`h-4 w-4 transition-all duration-200 ${
                            activeUrl === item.url 
                              ? "scale-105" 
                              : "group-hover:scale-105"
                          }`}
                          strokeWidth={2}
                        />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md transition-colors ${
                            item.badge === "Live"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2">
            Account
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavClick(item.url)}
                    isActive={activeUrl === item.url}
                    className={`group transition-all duration-200 ${
                      activeUrl === item.url
                        ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={2} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats Card */}
        <div className="mx-3 mt-3 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border border-indigo-100/50 dark:border-indigo-900/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Performance Overview
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Model Accuracy
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {quickStats.accuracy.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Active Nodes
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {quickStats.activeNodes.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-indigo-100 dark:border-indigo-900/30">
                <div className="flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Your Rewards
                  </span>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {quickStats.contribution} SUI
                </span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      {/* FOOTER - Wallet Connection */}
      <SidebarFooter className="cursor-pointer border-t border-gray-200/60 dark:border-gray-800/60 p-3 bg-white dark:bg-gray-950">
        <WalletConnection />
      </SidebarFooter>
    </Sidebar>
  );
}