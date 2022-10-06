import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    userAddressState,
    tokenAddressState,
    orderAddedState,
} from '~/store/web3';
import Loader from '~/components/loader/Loader';
import apiClient from '~/client';
import { ERC20Service } from '~/services';
import { ToastContainer, toast } from 'react-toastify';
import { getEthPriceHook } from '~/utils/hooks';
import Moment from 'moment';

const OrderTable = () => {
    const price = getEthPriceHook();

    const userAddress = useRecoilValue(userAddressState);
    const tokenAddress = useRecoilValue(tokenAddressState);
    const orderAdded = useRecoilValue(orderAddedState);

    const [excuteOrderedAdded, setExecuteOrderedAdded] =
        useRecoilState(orderAddedState);

    const [orderData, setOrderData] = useState([]);
    const [tokenFee, setTokenFee] = useState(0.05);
    const [decimals, setDecimals] = useState<any | null>(0);

    const [loaders, setLoaders] = useState(false);

    const getOrderData = async () => {
        setLoaders(true);
        try {
            const data = await apiClient.put(
                `${process.env.NEXT_PUBLIC_BASEROOT}/get-user-orders/${userAddress}`
            );
            if (!data || !data.data) throw 'Error';
            setOrderData(data.data);
            setLoaders(false);
        } catch (error) {
            setLoaders(false);
            console.log('error', error);
        }
    };

    useEffect(() => {
        userAddress && getOrderData();
    }, [userAddress]);

    useEffect(() => {
        if (orderAdded && userAddress) {
            getOrderData();
        }
    }, [orderAdded, userAddress]);

    const cancelOrderHandle = async (id: string) => {
        try {
            const data = await apiClient.put(
                `${process.env.NEXT_PUBLIC_BASEROOT}/cancel-order/${id}`
            );
            await getOrderData();
            toast.success('Cancelled successfully  ');

            setExecuteOrderedAdded(true);
        } catch (error) {
            toast('Cancelled Failed  ');
            console.log('error', error);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Same as */}
            <ToastContainer />
            <div className="rounded-md bg-[#121318] text-xs leading-[16px] font-bold text-white">
                <div className="px-[15px] py-3 flex items-center justify-between">
                    <h3 className="text-white">Open Orders</h3>
                    <h4 className="gap-3 flex items-center">
                        <button>Cancel All</button>
                        <svg
                            width="11"
                            height="12"
                            viewBox="0 0 11 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.61515 5.95961L10.7514 1.82331L9.98081 1.05267L5.84451 5.18897L1.54041 0.884872L0.769775 1.65551L5.07387 5.95961L0.937575 10.0959L1.70821 10.8665L5.84451 6.73024L10.2294 11.1151L11 10.3445L6.61515 5.95961Z"
                                fill="white"
                            />
                        </svg>
                    </h4>
                </div>
                <div className="bg-[#1E1F27] h-px"></div>
                <div className="overflow-x-auto px-[15px]">
                    {loaders ? (
                        <div className="grid   place-items-center ">
                            <Loader />
                        </div>
                    ) : (
                        <table className="w-full text-left border-spacing-y-7 border-separate">
                            <thead>
                                <tr className="text-secondary">
                                    <th style={{ minWidth: '70px' }}>Time</th>
                                    <th style={{ minWidth: '100px' }}>Side</th>
                                    <th style={{ minWidth: '100px' }}>Size</th>
                                    <th style={{ minWidth: '80px' }}>Filled</th>
                                    <th style={{ minWidth: '80px' }}>
                                        Price(USD)
                                    </th>
                                    <th style={{ minWidth: '80px' }}>
                                        Fee(WETH)
                                    </th>
                                    <th style={{ minWidth: '80px' }}>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="font-normal">
                                {orderData &&
                                    orderData.map((item: any, index) => (
                                        <tr key={index}>
                                            <td>
                                                {Moment(
                                                    new Date(item?.createdAt)
                                                ).format('YYYY-MM-DD hh:mm:ss')}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5 text-red">
                                                    <svg
                                                        width="21"
                                                        height="20"
                                                        viewBox="0 0 21 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <rect
                                                            x="0.824219"
                                                            y="0.5"
                                                            width="19"
                                                            height="19"
                                                            rx="9.5"
                                                            stroke={
                                                                item?.type ==
                                                                'Sell'
                                                                    ? '#880808'
                                                                    : '#008000	'
                                                            }
                                                        />
                                                        <path
                                                            d="M13.8626 13.4985C14.1379 13.4773 14.3439 13.237 14.3227 12.9617L13.9776 8.47491C13.9564 8.19958 13.7161 7.99355 13.4407 8.01473C13.1654 8.03591 12.9594 8.27627 12.9806 8.5516L13.2873 12.5398L9.29912 12.8466C9.0238 12.8678 8.81777 13.1082 8.83895 13.3835C8.86012 13.6588 9.10049 13.8648 9.37582 13.8437L13.8626 13.4985ZM6.49882 7.37963L13.4988 13.3796L14.1496 12.6204L7.14961 6.62037L6.49882 7.37963Z"
                                                            fill={
                                                                item?.type ==
                                                                'Sell'
                                                                    ? '#880808'
                                                                    : '#008000'
                                                            }
                                                        />
                                                    </svg>
                                                    <span
                                                        style={{
                                                            color:
                                                                item?.type ==
                                                                'Sell'
                                                                    ? '#880808'
                                                                    : '#008000',
                                                        }}
                                                    >
                                                        {item?.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {Number(
                                                    item?.tokenAmount
                                                ).toFixed(2)}
                                            </td>
                                            <td>0</td>
                                            <td>
                                                {(
                                                    Number(item?.ethAmount) *
                                                    Number(price)
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                {(
                                                    Number(item?.tokenAmount) *
                                                    Number(tokenFee)
                                                ).toFixed(4)}
                                            </td>
                                            <td>
                                                {item?.status == 'Created'
                                                    ? 'Open'
                                                    : item?.status}
                                            </td>

                                            <td className="text-right">
                                                <button
                                                    onClick={() =>
                                                        cancelOrderHandle(
                                                            item?._id
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="ml-auto"
                                                        width="11"
                                                        height="12"
                                                        viewBox="0 0 11 12"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        {' '}
                                                        <path
                                                            d="M6.6149 5.95959L10.7512 1.82329L9.98056 1.05266L5.84427 5.18896L1.54017 0.884857L0.769531 1.65549L5.07363 5.95959L0.937331 10.0959L1.70797 10.8665L5.84427 6.73023L10.2292 11.1151L10.9998 10.3445L6.6149 5.95959Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderTable;
