import { Home, TrendingUp, Users, Library, History, Clock, ThumbsUp, Download, Gamepad2, Trophy, Music, Film, Podcast, User, Settings, HelpCircle, Flag } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Shorts", url: "/shorts", icon: TrendingUp },
  { title: "Subscriptions", url: "/subscriptions", icon: Users },
];

const libraryItems = [
  { title: "Library", url: "/library", icon: Library },
  { title: "History", url: "/history", icon: History },
  { title: "Watch later", url: "/watch-later", icon: Clock },
  { title: "Liked videos", url: "/liked", icon: ThumbsUp },
  { title: "Downloads", url: "/downloads", icon: Download },
];

const exploreItems = [
  { title: "Trending", url: "/trending", icon: TrendingUp },
  { title: "Music", url: "/music", icon: Music },
  { title: "Movies", url: "/movies", icon: Film },
  { title: "Gaming", url: "/gaming", icon: Gamepad2 },
  { title: "Sports", url: "/sports", icon: Trophy },
  { title: "Podcasts", url: "/podcasts", icon: Podcast },
];

const moreItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Report history", url: "/report", icon: Flag },
  { title: "Help", url: "/help", icon: HelpCircle },
];

export function YouTubeSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-gray-100 text-black font-medium" : "hover:bg-gray-100";

  if (state === "collapsed") {
    return (
      <Sidebar className="w-16" collapsible="icon">
        <SidebarContent className="bg-white border-r border-gray-200">
          <div className="flex flex-col items-center py-4 space-y-4">
            {mainItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  isActive(item.url) ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-6 h-6 text-gray-700" />
                <span className="text-xs text-gray-700 mt-1">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="w-60" collapsible="icon">
      <SidebarContent className="bg-white border-r border-gray-200">
        <div className="p-3">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="mr-3 h-5 w-5 text-gray-700" />
                        <span className="text-gray-900">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <hr className="my-3 border-gray-200" />

          {/* Library */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {libraryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="mr-3 h-5 w-5 text-gray-700" />
                        <span className="text-gray-900">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <hr className="my-3 border-gray-200" />

          {/* Explore */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-900 font-medium">Explore</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {exploreItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="mr-3 h-5 w-5 text-gray-700" />
                        <span className="text-gray-900">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <hr className="my-3 border-gray-200" />

          {/* More */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {moreItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="mr-3 h-5 w-5 text-gray-700" />
                        <span className="text-gray-900">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}