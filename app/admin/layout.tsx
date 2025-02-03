'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "@/src/styles/globals.css";
import Header from "@/src/components/admin/layout/header";
// import Footer from "@/src/components/admin/layout/footer";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {!isLoginPage ? <Header /> : null}
                {children}
                {/* {!isLoginPage ? <Footer /> : null} */}
            </body>
        </html>
    );
}

export default AdminLayout;
