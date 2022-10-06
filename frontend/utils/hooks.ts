import { useEffect, useState } from 'react';
import apiClient from '~/client';

// Lazy loading
export const useLazyLoading = () => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 0);
    }, []);

    return loading;
};

// get ETH price Hook
export const getEthPriceHook = () => {
    const [price, setPrice] = useState<number>(0);

    const getPriceHandle = async () => {
        const data = await apiClient.get(
            `${process.env.NEXT_PUBLIC_BASEROOT}/get-cmc-price`
        );
        let newPrice = Number(data.data).toFixed(2);
        console.log('data', newPrice);
        setPrice(Number(newPrice));
    };

    useEffect(() => {
        getPriceHandle();
    }, []);

    return price;
};
