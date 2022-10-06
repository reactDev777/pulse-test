import { atom } from 'recoil';

export const isLoadingState = atom({
    key: 'isLoading',
    default: false,
});

export const updateIDState = atom({
    key: 'updateID',
    default: 1,
});

export const buySellState = atom({
    key: 'buySellNft',
    default: 'Sell',
});

export const orderDataState = atom({
    key: 'orderId',
    default: {},
});
