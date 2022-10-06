import { ReactElement, Suspense, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

import Fallback from '~/components/features/Fallback';
import { useLazyLoading } from '~/utils/hooks';
import Sidebar from '~/components/partials/Sidebar';
import LayoutDefault from '~/components/layouts/LayoutDefault';
import TradingChart from '~/components/partials/TradingChart';
import OrderTable from '~/components/partials/OrderTable';
import ConnectButton from '~/components/features/ConnectButton';
import OrderModel from '~/components/orderModel/OrderModel';

import apiClient from '~/client';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '0267a87b8abb49379bf3a5b7c8e2f4d7', // required
        },
    },
};

const HomePage = () => {
    const loading = useLazyLoading();

    if (loading) return <Fallback />;

    return (
        <Suspense fallback={<Fallback />}>
            <HomeSection />
        </Suspense>
    );
};

const HomeSection = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <OrderModel setShowModal={setShowModal} showModal={showModal} />
            <div className="lg:flex bg-black">
                <div className="lg:w-[420px] lg:sticky top-0 lg:self-start hidden lg:block">
                    <Sidebar
                        setShowModal={setShowModal}
                        showModal={showModal}
                    />
                </div>
                <div className="flex-1 lg:pt-5 lg:px-5">
                    <div className="flex lg:hidden items-center justify-between px-[15px] py-2 bg-[#121318]">
                        <img
                            src="/images/logo-mobile.svg"
                            alt="logo"
                            width={141}
                            height={21}
                        />
                        <ConnectButton />
                    </div>
                    <TradingChart />
                    <div className="lg:hidden">
                        <Sidebar />
                    </div>
                    <OrderTable />
                </div>
            </div>
        </>
    );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutDefault>{page}</LayoutDefault>;
};

export default HomePage;
