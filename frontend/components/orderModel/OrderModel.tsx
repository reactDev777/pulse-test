import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { orderDataState } from '~/store/other';
import apiClient from '~/client';
import { orderAddedState } from '~/store/web3';
import fromExponential from 'from-exponential';
import { toast, ToastContainer } from 'react-toastify';
const OrderModel = ({
    showModal,
    setShowModal,
}: {
    showModal?: any;
    setShowModal?: any;
}) => {
    const orderData: any = useRecoilValue(orderDataState);

    console.log('orderData', orderData);

    const [excuteOrderedAdded, setExecuteOrderedAdded] =
        useRecoilState(orderAddedState);

    const orderHandle = async () => {
        if (orderData) {
            const response = await apiClient.post(
                `${process.env.NEXT_PUBLIC_BASEROOT}/save-order`,
                {
                    userAdddress: orderData?.userAddress,
                    tokenAddress: orderData?.tokenAddress,
                    decimals: orderData?.decimal,
                    status: orderData?.status,
                    tokenAmount: orderData?.tokenAmount,
                    ethAmount: orderData?.ethAmount,
                    price: orderData?.price,
                    network: orderData?.network,
                    type: orderData?.type,
                }
            );

            if (response.status === 200) {
                setShowModal(false);
                setExecuteOrderedAdded(true);
                toast.success('Order Added Successfully');
            }
        }
    };

    const platformFee = orderData?.platformFee;

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <ToastContainer />
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Order
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className="my-4 w-[35rem]	">
                                        <div className="flex justify-between">
                                            <p className="font-semibold	  ">
                                                Type
                                            </p>
                                            <p className="font-semibold	 ">
                                                {orderData?.type}
                                            </p>
                                        </div>
                                        {orderData?.type == 'Buy' ? (
                                            <>
                                                <div className="flex justify-between font-semibold my-2">
                                                    <p className="   ">
                                                        WETH Amount
                                                    </p>
                                                    <p>
                                                        {fromExponential(
                                                            Number(
                                                                orderData?.ethAmount
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between font-semibold my-2">
                                                    <p className="   ">
                                                        {orderData?.symbol}{' '}
                                                        Amount
                                                    </p>
                                                    <p>
                                                        {Number(
                                                            orderData?.tokenAmount
                                                        )}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between font-semibold my-2">
                                                    <p className="   ">
                                                        {orderData?.symbol}{' '}
                                                        Amount
                                                    </p>
                                                    <p>
                                                        {Number(
                                                            orderData?.tokenAmount
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between font-semibold my-2">
                                                    <p className="   ">
                                                        Eth Amount
                                                    </p>
                                                    <p>
                                                        {fromExponential(
                                                            Number(
                                                                orderData?.ethAmount
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-between font-semibold  my-2">
                                            <p className="">Order Price</p>
                                            {orderData?.type == 'Buy' ? (
                                                <p>
                                                    1 {orderData?.wethSymbol} ={' '}
                                                    {orderData?.price}{' '}
                                                    {orderData?.symbol}
                                                </p>
                                            ) : (
                                                <p>
                                                    1 {orderData?.symbol} ={' '}
                                                    {fromExponential(
                                                        Number(
                                                            orderData?.price
                                                        ) /
                                                            10 ** 18
                                                    )}{' '}
                                                    {orderData?.wethSymbol}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-between font-semibold  my-2">
                                            <p className="">
                                                Platform Fee ({platformFee}%)
                                            </p>
                                            {orderData?.type == 'Buy' ? (
                                                <p>
                                                    {fromExponential(
                                                        (Number(
                                                            orderData.ethAmount
                                                        ) /
                                                            100) *
                                                            Number(platformFee)
                                                    )}{' '}
                                                    {orderData.wethSymbol}
                                                </p>
                                            ) : (
                                                <p>
                                                    {fromExponential(
                                                        (Number(
                                                            orderData.tokenAmount
                                                        ) /
                                                            100) *
                                                            Number(platformFee)
                                                    )}{' '}
                                                    {orderData.symbol}{' '}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-[#5F3595] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={orderHandle}
                                    >
                                        Save Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    );
};

export default OrderModel;
