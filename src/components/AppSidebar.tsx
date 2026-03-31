import { Home, Backpack, Beaker, ShoppingCart, Wallet, Settings, LogOut, Truck } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import fertilizerBag from "@/assets/fertilizer-bag.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Garden", url: "/", icon: Home, emoji: "🌱" },
  { title: "Missions", url: "/missions", icon: Home, emoji: "🎯" },
  { title: "Inventory", url: "/inventory", icon: Backpack, emoji: "🎒" },
  { title: "Fertilizer Shop", url: "/fertilizer", icon: Beaker, emoji: "🧪", customImg: true },
  { title: "Supermarket", url: "/marketplace", icon: ShoppingCart, emoji: "🛒" },
  { title: "Collection Point", url: "/delivery", icon: Truck, emoji: "📍" },
  { title: "Wallet", url: "/wallet", icon: Wallet, emoji: "💰" },
  { title: "Settings", url: "/settings", icon: Settings, emoji: "⚙️" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ username: string; full_name: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username, full_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const displayName = profile?.full_name || profile?.username || user?.email || "Farmer";
  const initials = displayName.slice(0, 2).toUpperCase();

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
                      {item.customImg ? (
                        <img src={fertilizerBag} alt="" className="w-5 h-5 object-contain" />
                      ) : (
                        <span className="text-lg">{item.emoji}</span>
                      )}
                      {!collapsed && <span className="text-sm font-semibold">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* User profile */}
        <div className={`px-3 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 w-full text-left rounded-lg hover:bg-sidebar-accent/50 transition-colors p-1"
          >
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-primary flex-shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-sidebar-foreground truncate">{displayName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
              </div>
            )}
          </button>
        </div>

        {/* Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <span className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-semibold">Log out</span>}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
