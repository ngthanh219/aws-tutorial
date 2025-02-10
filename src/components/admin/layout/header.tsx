"use client"

import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import autheService from '@/src/services/authService';
import Link from 'next/link';

const Header: React.FC = () => {
    const router = useRouter();

    const logout = async (event :any) => {
        event.preventDefault();

        try {
            await autheService.adminLogout({});
        } catch (error: any) {
            console.error(error);
        } finally {
            Cookies.remove('admin_token');
            Cookies.remove('admin_expired');
            router.push('/admin/login');
        }
    };

    return (
        <header style={headerStyle}>
            <h1>AWS SAA-C03</h1>
            <nav>
                <ul style={navListStyle}>
                    <Link href="/admin/question" style={navItemStyle}>Question</Link>
                    <Link href="/admin/exam" style={navItemStyle}>Exam</Link>
                    <li style={navItemStyle}><a onClick={logout} href="/admin/logout">Logout</a></li>
                </ul>
            </nav>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff'
};

const navListStyle: React.CSSProperties = {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0
};

const navItemStyle: React.CSSProperties = {
    marginLeft: '20px'
};

export default Header;
