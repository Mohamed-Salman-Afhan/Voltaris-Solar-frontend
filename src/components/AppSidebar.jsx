import { ChartLine, LayoutDashboard, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
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
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";
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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="w-8 h-8" size={32} />,
  },
  {
    title: "Anomalies",
    url: "/dashboard/anomalies",
    icon: <TriangleAlert className="w-8 h-8" size={32} />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <ChartLine className="w-8 h-8" size={32} />,
  },
];

const SideBarTab = ({ item }) => {
  let location = useLocation();
  let isActive = location.pathname === item.url;

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

export function AppSidebar() {
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
                  Voltaris Solar
                </span>
                <span className="text-xs text-muted-foreground">
                  Monitoring the next generation of solar
                </span>
              </div>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-8 text">
              {items.map((item) => (
                <SideBarTab key={item.url} item={item} />
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
            <span className="text-sm font-medium truncate text-sidebar-foreground">
              {/* We need to fetch user data, but we can't easily do hooks inside this return if we don't have the hook called. 
                       Lets just wrap this content in a component or use UserButton's internal capability if we want just the button.
                       But the screenshot implies text. 
                       Let's rely on Clerk's UserButton to handle the menu, but we might just want to show the button itself. 
                       Actually, usually UserButton is just the avatar. 
                       The screenshot shows "John Doe" text. 
                       Let's use the useUser hook at the top level.
                    */}
              <UserText />
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
