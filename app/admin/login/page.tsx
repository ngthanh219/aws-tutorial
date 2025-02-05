'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import autheService from '@/src/services/authService';
import SpinningLoading from '@/src/components/ui/loading/spinningLoading';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async (event: any) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await autheService.adminLogin({
                username,
                password
            });

            Cookies.set('admin_token', response.token);
            Cookies.set('admin_expired', response.expired);
            window.location.href = '/admin/question';
        } catch (error: any) {
            setError('Invalid username or password.');
            // error.message || 'Failed to add question. Please try again later.'
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100" >
            {loading && <SpinningLoading />}
            <hr />
            <form onSubmit={login} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
                {error != '' && <p className="text-red-500 text-xs italic mb-6">Invalid username or password.</p>}
                <div className="flex items-center justify">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div >
            </form>
        </div>
    );
}
