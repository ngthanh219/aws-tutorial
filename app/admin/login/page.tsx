'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { getAdminAuth } from '@/src/hooks/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [isLoadPage, setIsLoadPage] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        function checkAuth() {
            const auth = getAdminAuth();

            if (auth.isLogged) {
                router.push('/admin/question');
            } else {
                setIsLoadPage(true);
            }
        }

        checkAuth();
    }, [router]);

    const login = (event: any) => {
        event.preventDefault();

        if (username === 'admin' && password === 'admin') {
            setError('');
            Cookies.set('admin_token', 'admin');
            Cookies.set('admin_info', JSON.stringify({ username: 'admin' }));
            redirect(`/admin/question`);
        } else {
            setError('Invalid username or password.');
        }
    };

    return isLoadPage ? (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100" >
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
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
                </div >
            </form>
        </div>
    ) : null;
}
