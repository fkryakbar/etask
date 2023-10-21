import Head from "next/head";
import { ReactNode, useEffect } from "react";
import Gradient from "../Gradient";
import CreateTaskModal from "../CreateTaskModal";
import { useTheme } from "next-themes";

export default function Layout({ children, title }: { children: ReactNode, title: string }) {
    const { theme } = useTheme()
    function setHtmlData() {
        if (theme == 'light') {
            document.documentElement.setAttribute('data-theme', 'light')
        }
        if (theme == 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
        }
    }
    useEffect(() => {
        setHtmlData()
    })
    return <>
        <Head>
            <title>{title}</title>
        </Head>
        <Gradient />
        {children}
    </>
}