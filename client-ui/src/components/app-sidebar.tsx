import {
  LayoutDashboardIcon,
  UserCheck,
  BarChart3,
  Users,
  ShoppingBasket,
  ShieldUser,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<any>(null)

  // This is sample data.
  const data1 = {
    user: {
      name: "GUEST",
      email: "guest@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "DASHBOARD",
        logo: LayoutDashboardIcon,
        plan: "Enterprise ",
      },
    ],
    navMain: [
      {
        title: "Profile",
        url: "#",
        icon: ShieldUser,
        isActive: false,
        items: [
          { title: "Profile", url: "/dashboard/profile" },
          { title: "Vouchers", url: "/dashboard/vouchers" },
          { title: "Profile Settings", url: "/dashboard/settings" },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: ShoppingBasket,
        items: [
          { title: "Orders", url: "/dashboard/orders" },
          { title: "Returns", url: "/dashboard/returns" },
          { title: "Reviews", url: "/dashboard/reviews" },
          { title: "Payments", url: "/dashboard/payments" },
          { title: "Added Items", url: "/dashboard/cartitems" },
          { title: "Liked Items", url: "/dashboard/likeitems" },
        ],
      },
    ]
  }
  const data2 = {
    user: {
      name: "GUEST",
      email: "guest@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "DASHBOARD",
        logo: LayoutDashboardIcon,
        plan: "Enterprise ",
      },
    ],
    navMain: [
      {
        title: "Authentication",
        url: "#",
        icon: UserCheck,
        isActive: true,
        items: [
          { title: "Profile", url: "/dashboard/profile" },
          { title: "Profile Settings", url: "/dashboard/settings" },
          { title: "Roles", url: "/dashboard/roles" },
          { title: "Permissions", url: "/dashboard/permissions" }
        ],
      },
      {
        title: "Analytics",
        url: "#",
        icon: BarChart3, // ✅ better
        items: [
          { title: "KPI", url: "/dashboard/kpis" },
          { title: "Analytics", url: "/dashboard/analytics" },
        ],
      },
      {
        title: "Site Settings",
        url: "#",
        icon: Settings, // ✅ better
        items: [
          { title: "Categories", url: "/dashboard/categoriestable" },
          { title: "Footer", url: "/dashboard/footertable" },
          { title: "Hero", url: "/dashboard/herotable" },
          { title: "Navbar", url: "/dashboard/navbartable" },
          { title: "Products", url: "/dashboard/productstable" },
        ],
      },
      // {
      //   title: "Products",
      //   url: "#",
      //   icon: Package, // ✅ better
      //   items: [
      //     { title: "Products", url: "/dashboard/productstable" },
      //     { title: "Categories", url: "/dashboard/categoriestable" },
      //   ],
      // },
      {
        title: "Users",
        url: "#",
        icon: Users, // ✅ better
        items: [
          { title: "Customers", url: "/dashboard/customerstable" },
          { title: "Users", url: "/dashboard/userstable" },
          { title: "Enquiries", url: "/dashboard/enquiriestable" },
        ],
      },
      {
        title: "Orders",
        url: "#",
        icon: ShoppingBasket,
        items: [
          { title: "All Orders", url: "/dashboard/allorders" },
          { title: "All Review", url: "/dashboard/allreviews" },
          { title: "All Returns", url: "/dashboard/allreturns" },
          { title: "All Payments", url: "/dashboard/allpayments" },
        ],
      },
    ]
  }

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (err) {
      console.error("Invalid user in localStorage")
    }
  }, [])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <TeamSwitcher teams={
          user?.user.contact ? data1.teams : data2.teams
        } />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={
          user?.user.contact ? data1.navMain : data2.navMain
        } />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userinfo={ user?.user || data1.user } />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
