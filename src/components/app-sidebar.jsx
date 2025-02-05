import * as React from "react";
import {
  AudioWaveform,
  BadgeIndianRupee,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  IndianRupee,
  Map,
  PieChart,
  Settings,
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
        isActive: true,
        icon: Settings2,
        items: [
          {
            title: "Branch",
            url: "/master/branch",
          },
          {
            title: "State",
            url: "/master/state",
          },
          {
            title: "Bank",
            url: "/master/bank",
          },
          {
            title: "Scheme",
            url: "/master/scheme",
          },
          {
            title: "Country",
            url: "/master/country",
          },
          {
            title: "Container Size",
            url: "/master/containersize",
          },
          {
            title: "Payment TermsC",
            url: "/master/paymentTermC",
          },
          {
            title: "Description of Goods",
            url: "/master/descriptionGoods",
          },
          {
            title: "Bag Type",
            url: "/master/bagType",
          },
          {
            title: "Custom Description",
            url: "/master/customdescription",
          },
          {
            title: "Type",
            url: "/master/type",
          },
          {
            title: "Quality",
            url: "/master/quality",
          },
          {
            title: "Item",
            url: "/master/item",
          },
          {
            title: "Marking",
            url: "/master/marking",
          },
          {
            title: "Port of Loading",
            url: "/master/portofloading",
          },
          {
            title: "GR Code",
            url: "/master/grcode",
          },
          {
            title: "Product",
            url: "/master/product",
          },
          {
            title: "Product Description",
            url: "/master/productdescription",
          },
          {
            title: "Shipper",
            url: "/master/shipper",
          },
          {
            title: "Vessel",
            url: "/master/vessel",
          },
          {
            title: "Pre Recepits",
            url: "/master/prerecepits",
          },
        ],
      },
      {
        title: "Reports",
        url: "#",
        icon: Settings2,
        isActive: true,
        items: [
          {
            title: "BuyerR",
            url: "/report/buyer-report",
          },
          {
            title: "ContractR",
            url: "/report/contract-form",
          },
          {
            title: "Sales Accounts",
            url: "/report/sales-account-form",
          },
          {
            title: "Sales Data",
            url: "/report/sales-data-form",
          },
        ],
      },
      {
        title: "Payment",
        url: "#",
        icon: Settings2,
        isActive: true,
        items: [
          {
            title: "PaymentList",
            url: "/payment-payment-list",
          },
          {
            title: "PaymentPending",
            url: "/payment-payment-pending",
          },
          {
            title: "PaymentClose",
            url: "/payment-payment-close",
          },
        ],
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
      {
        name: "UserPage",
        url: "/userManagement",
        icon: Frame,
      },
      {
        name: "UserType",
        url: "/user-type",
        icon: Settings,
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
