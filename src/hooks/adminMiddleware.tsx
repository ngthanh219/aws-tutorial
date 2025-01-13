import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminAuth } from './auth';

const adminMiddleware = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const auth = getAdminAuth();

            if (!auth.isLogged) {
                router.push('/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        }, [router]);

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default adminMiddleware;
