import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { isLoadingState } from '~/store/other';
import Fallback from '../features/Fallback';

// import Footer from '../features/Footer';
// import Header from '../features/header/Header';

interface LayoutDefaultProps {
    children: React.ReactNode;
}

const LayoutDefault: React.FC<LayoutDefaultProps> = ({ children }) => {
    const isLoading = useRecoilValue(isLoadingState);
    return (
        <div className="page-wrapper min-h-screen">
            {/* <Header /> */}
            <div className="min-h-screen">{children}</div>
            {/* <Footer /> */}
            <ToastContainer
            // hideProgressBar
            // position="bottom-right"
            // autoClose={2000}
            />
            {isLoading && <Fallback />}
        </div>
    );
};

export default LayoutDefault;
