import { Users, Video, UtensilsCrossed, Calendar, BarChart3, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/TWWLOGO_1763965276890.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { queryClient } from "@/lib/queryClient";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/trainer/dashboard" },
  { title: "My Clients", icon: Users, url: "/trainer/clients" },
  { title: "Live Sessions", icon: Calendar, url: "/trainer/sessions" },
  { title: "Diet, Meals & Workout", icon: UtensilsCrossed, url: "/trainer/diet" },
  { title: "Video Library", icon: Video, url: "/trainer/videos" },
  { title: "My Analytics", icon: BarChart3, url: "/trainer/analytics" },
];

export function TrainerSidebar() {
  const [location, setLocation] = useLocation();
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.user;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        queryClient.clear();
        setLocation('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <img src={logoImage} alt="FitPro" className="h-8 w-8 object-contain" />
            <SidebarGroupLabel className="font-display text-lg m-0">
              FitPro Trainer
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {currentUser && (
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-2 py-2 text-sm" data-testid="profile-info">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(currentUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">{currentUser.name || 'Trainer'}</span>
                  <span className="text-xs text-muted-foreground truncate">{currentUser.email}</span>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} data-testid="button-logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
