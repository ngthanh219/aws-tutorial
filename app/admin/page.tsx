'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminAuth } from '@/src/hooks/auth';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        function checkAuth() {
            const auth = getAdminAuth();

            if (auth.isLogged) {
                router.push('/admin/question');
            } else {
                router.push('/admin/login');
            }
        }

        checkAuth();
    }, []);

    return null;
}
