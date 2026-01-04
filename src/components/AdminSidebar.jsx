import { Settings, Zap, TriangleAlert } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import voltarisLogo from "@/assets/Voltaris-Solar-White-logo.png";
import { UserButton, useUser } from "@clerk/clerk-react";
import { SidebarFooter } from "@/components/ui/sidebar";

const UserText = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex flex-col items-start text-sm">
      <span className="font-semibold text-foreground">{user.fullName}</span>
      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
        {user.primaryEmailAddress?.emailAddress}
      </span>
    </div>
  );
};

// Menu items for admin navigation.
const items = [
  {
    title: "Solar Units",
    url: "/admin/solar-units",
    icon: <Zap className="w-8 h-8" size={32} />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings className="w-8 h-8" size={32} />,
  },
  {
    title: "Anomalies",
    url: "/admin/anomalies",
    icon: <TriangleAlert className="w-8 h-8" size={32} />,
  },
];

const AdminSideBarTab = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={item.url}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 text-3xl font-bold text-foreground">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={voltarisLogo}
                alt="Voltaris"
                className="h-16 w-16 object-contain"
              />
              <div className="mt-3 flex flex-col">
                <span className="text-lg text-white font-semibold">
                  Admin Panel
                </span>
                <span className="text-xs text-muted-foreground">
                  Monitoring the next generation of solar
                </span>
              </div>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8">
              {items.map((item) => (
                <AdminSideBarTab key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-3 p-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="flex flex-col min-w-0">
            <UserText />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
