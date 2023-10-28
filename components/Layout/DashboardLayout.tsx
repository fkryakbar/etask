import Head from "next/head";
import { ReactNode, useState } from "react";
import ThemeToggler from "../ThemeToggler";
import { signOutUser } from "@/utils/Authentication";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as NextLink, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import SidebarMenu from "../SidebarMenu";
import { useAuth } from "@/utils/UserContext";
const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
];
export default function Layout({ children, title }: { children: ReactNode, title: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter()
    const { userData } = useAuth()
    return <>
        <Head>
            <title>{title}</title>
        </Head>
        <Navbar className="lg:hidden" onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#00ff87] to-[#60efff]">
                        eTask
                    </h1>
                </NavbarBrand>
            </NavbarContent>

            <NavbarMenu>
                <SidebarMenu userData={userData} />
            </NavbarMenu>
        </Navbar>
        <div className="lg:flex gap-5 lg:w-[70%] w-[100%] lg:mx-auto lg:mt-20 p-5">
            <div className="lg:basis-[20%] lg:block hidden">
                <SidebarMenu userData={userData} />
            </div>
            <div className="lg:basis-[80%] basis-[100%] flex flex-col">
                {children}
            </div>
        </div>

    </>
}