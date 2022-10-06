import { useEffect } from 'react';

const ErrorBoundaryFallback = () => {
    useEffect(() => {
        localStorage.removeItem('user');
        // window.location.href = '/login';
    }, []);

    return <></>;
};

export default ErrorBoundaryFallback;
