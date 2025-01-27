import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom";


const itemVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
};

export function NavMain({
  items
}) {
  const location = useLocation();
  if (!items || items.length === 0) {
    return null;
  }
  const hasActiveItems = items.length > 0;
  if (!hasActiveItems) {
    return null;
  }
  return (
    (<SidebarGroup>
      <SidebarGroupLabel>Home</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = item.items?.some(
            (subItem) => subItem.url === location.pathname
          );
          return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
              <motion.div
                  variants={buttonVariants}
                  whileHover="hover" 
                >
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span
                        className={`transition-colors duration-200 ${
                          isParentActive ? "text-blue-500" : "hover:text-blue-500"
                        }`}
                      >
                        {item.title}
                      </span>
                  <ChevronRight
                    className="ml-auto  transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
                </motion.div>
              </CollapsibleTrigger>
              <CollapsibleContent 
               as={motion.div} 
               variants={itemVariants}
               initial="closed"
               animate={item.isActive ? "open" : "closed"}
              >
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
const isSubItemActive = location.pathname === subItem.url;
                    return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          {/* <span className="transition-colors duration-200 hover:text-blue-500">{subItem.title}</span> */}
                          <motion.span
                             className={`transition-colors duration-200 ${
                              isSubItemActive
                                ? "text-blue-500"
                                : "hover:text-blue-500"
                            }`}
                            whileHover={{ scale: 1.05 }} 
                          >
                            {subItem.title}
                          </motion.span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )})}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )})}
      </SidebarMenu>
    </SidebarGroup>)
  );
}


// sajid 