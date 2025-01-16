"use client"

import React from 'react';

const Footer: React.FC = () => {

    return (
        <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </footer>
    );
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f1f1f1',
    borderTop: '1px solid #e7e7e7',
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%',
};

export default Footer;
