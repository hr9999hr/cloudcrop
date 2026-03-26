import { Home, Backpack, Beaker, ShoppingCart, Wallet, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Garden", url: "/", icon: Home, emoji: "🌱" },
  { title: "Inventory", url: "/inventory", icon: Backpack, emoji: "🎒" },
  { title: "Fertilizer Shop", url: "/fertilizer", icon: Beaker, emoji: "💊" },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingCart, emoji: "🛒" },
  { title: "Wallet", url: "/wallet", icon: Wallet, emoji: "💰" },
  { title: "Settings", url: "/settings", icon: Settings, emoji: "⚙️" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-3 ${collapsed ? 'px-2 flex justify-center' : 'px-4'}`}>
          <div className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="CloudCrop"
              className="h-9 w-9 rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
            />
            {!collapsed && (
              <h1 className="text-lg font-extrabold tracking-tight text-sidebar-foreground">
                CloudCrop
              </h1>
            )}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-bold"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      {!collapsed && <span className="text-sm font-semibold">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
