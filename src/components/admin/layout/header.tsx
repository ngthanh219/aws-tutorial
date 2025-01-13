"use client"

import React from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const logout = (event :any) => {
        event.preventDefault();
        Cookies.remove('admin_token');
        Cookies.remove('admin_info');
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return null;
    }

    return (
        <header style={headerStyle}>
            <h1>Thanhnt6</h1>
            <nav>
                <ul style={navListStyle}>
                    <li style={navItemStyle}><a href="/admin/question">Question</a></li>
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
