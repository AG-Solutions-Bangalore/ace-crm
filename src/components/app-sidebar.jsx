import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ContextPanel } from "@/lib/ContextPanel";
import { NavMainUpdate } from "./nav-main-update";
import { NavMainReport } from "./nav-main-report";

export function AppSidebar({ ...props }) {
  // const {emailL,nameL,userType} = React.useContext(ContextPanel)
  const nameL = localStorage.getItem("name");
  const emailL = localStorage.getItem("email");
  const userType = localStorage.getItem("userType");
  const pageControl = JSON.parse(localStorage.getItem("pageControl")) || [];

  const data = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "ADITYA SPICE ",
        logo: GalleryVerticalEnd,
        plan: "AgSolution",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Payment Mediation",
        url: "/amount",
        icon: Settings2,
      },
      {
        title: "Business Expansion",
        url: "/business-opp",
        icon: BookOpen,
      },
      {
        title: "Job Offered",
        url: "/job-offered",
        icon: SquareTerminal,
      },
      {
        title: "Job Require",
        url: "/job-require",
        icon: SquareTerminal,
      },
    ],
    navMain1: [
      {
        title: "Directory",
        url: "/directory",
        icon: Bot,
      },

      {
        title: "Latest News",
        url: "/latest-news",
        icon: SquareTerminal,
      },
    ],
    navReport: [
      {
        title: "Participant Summary",
        url: "/participant-summary",
        icon: Bot,
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Bot,
      },
    ],
    projects: [
      {
        name: "Dashboard",
        url: "/home",
        icon: Frame,
      },
      {
        name: "Customers",
        url: "/customers",
        icon: Map,
      },
      {
        name: "Products",
        url: "/products",
        icon: PieChart,
      },
      {
        name: "Enquiries",
        url: "/enquiries",
        icon: Map,
      },
    ],
  };
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
