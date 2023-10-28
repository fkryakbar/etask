import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from '@/utils/UserContext';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark" attribute='class' >
      <NextUIProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}
