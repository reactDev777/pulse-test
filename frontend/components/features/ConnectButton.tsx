/* eslint-disable @next/next/no-img-element */
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import {
    isConnectWalletState,
    userAddressState,
    chainIDState,
} from '~/store/web3';
import { accountEllipsis } from '~/utils';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
        },
    },
};
const ConnectButton = () => {
    const [isConnectWallet, setIsConnectWallet] =
        useRecoilState(isConnectWalletState);
    const [userAddress, setUserAddress] = useRecoilState(userAddressState);

    console.log('connectAdd', userAddress);
    const [chainId, setChainID] = useRecoilState(chainIDState);
    console.log('chainId', chainId);
    const [web3Modal, setWeb3Modal] = useState<any>();

    const connectWallet = async () => {
        try {
            setIsConnectWallet(true);
            const instance = await web3Modal.connect();

            const provider: any = new ethers.providers.Web3Provider(instance);

            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();

            const address = await signer.getAddress();

            setChainID(provider?._network?.chainId);

            console.log(signer, address);
            setUserAddress(address);
            setIsConnectWallet(false);
        } catch (error) {
            setIsConnectWallet(false);
            console.log(error);
        }
    };

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            typeof window.ethereum !== 'undefined'
        ) {
            console.log('window');
            let web3 = new Web3Modal({
                cacheProvider: true, // optional
                providerOptions, // required
            });
            setWeb3Modal(web3);
            connectWallet();
        }
    }, [window]);
    return (
        <>
            {!userAddress ? (
                <button
                    className="text-xs font-bold leading-[24px] text-white py-1.5 px-7 uppercase bg-[#5F3595] rounded-lg custom-shadow"
                    onClick={connectWallet}
                    disabled={isConnectWallet}
                >
                    {isConnectWallet ? 'Loading...' : 'Connect Wallet'}
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/images/metamask.svg"
                            alt="metamask"
                            className="w-3"
                        />
                    </div>
                    <span className="text-xs leading-[24px] text-white">
                        {accountEllipsis(userAddress)}
                    </span>
                    <img src="/images/arrow-down.svg" alt="" />
                </div>
            )}
        </>
    );
};

export default ConnectButton;
