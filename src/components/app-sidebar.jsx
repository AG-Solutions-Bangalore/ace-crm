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
        title: "Master",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Branch",
            url: "/branch",
          },
          {
            title: "State",
            url: "/state",
          },
          {
            title: "Bank",
            url: "/bank",
          },
          {
            title: "Scheme",
            url: "/scheme",
          },
          {
            title: "Country",
            url: "/country",
          },
          {
            title: "Container Size",
            url: "/containersize",
          },
          {
            title: "Payment TermsC",
            url: "/paymentTermC",
          },
          {
<<<<<<< HEAD
            title: "Description of Goods",
            url: "/descriptionGoods",
          },
          {
            title: "Bag Type",
            url: "/bagType",
          },
          {
            title: "Custom Description",
            url: "/customdescription",
=======
            title: "Item",
            url: "/item",
          },
          {
            title: "Marking",
            url: "/marking",
>>>>>>> 5d751f4849e4300b507da3d68391822338cc92ac
          },
        ],
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
        name: "Contract",
        url: "/contract",
        icon: Map,
      },
      {
        name: "Invoice",
        url: "/invoice",
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
