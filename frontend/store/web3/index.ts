import { atom } from 'recoil';

export const isConnectWalletState = atom({
    key: 'connectWallet',
    default: false,
});

export const userAddressState = atom<string | null>({
    key: 'userAddress',
    default: null,
});

export const orderAddedState = atom<string | null | any>({
    key: 'orderAdded',
    default: null,
});

export const tokenAddressState = atom<string | null | any>({
    key: 'tokenAddress',
    default: null,
});

export const chainIDState = atom<string | null | any>({
    key: 'networkChainID',
    default: null,
});
