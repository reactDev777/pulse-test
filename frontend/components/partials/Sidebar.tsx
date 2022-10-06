/* eslint-disable @next/next/no-img-element */
import { Switch, Tab } from '@headlessui/react';
import { FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import ConnectButton from '../features/ConnectButton';

import apiClient from '~/client';
import { AutoComplete, Input } from 'antd';

import { ERC1155Service, ERC20Service } from '~/services';
import Web3 from 'web3';
import {
    userAddressState,
    tokenAddressState,
    orderAddedState,
    chainIDState,
} from '~/store/web3';

import { buySellState, orderDataState } from '~/store/other';

import { ethers, providers } from 'ethers';
import { factoryAbi, routerAbi, ercAbi } from '../../common/abis';
import { router, factory, providerRpc } from '../../common/addresses';
import { tokens } from '../../common/tokensList/tokenList';

import { ToastContainer, toast } from 'react-toastify';
import { ERC721Service } from '~/services/erc721';
import fromExponential from 'from-exponential';

import Loader from '../loader/Loader';
import { CommonUtility } from '~/utils/common';

const Sidebar = ({
    showModal,
    setShowModal,
}: {
    showModal?: any;
    setShowModal?: any;
}) => {
    const BigNumber = require('big-number');
    // recoil
    const userAddress = useRecoilValue(userAddressState);

    const [userTokenAddress, setUserTokenAddress] =
        useRecoilState(tokenAddressState);
    const [excuteOrderedAdded, setExecuteOrderedAdded] =
        useRecoilState(orderAddedState);
    const chainId = useRecoilValue(chainIDState);

    const [executeOrderData, setExecuteOrderData] =
        useRecoilState(orderDataState);

    const [buySellTabState, setBuySellTabState] = useRecoilState(buySellState);
    // console.log('buyTab', buySellTabState, userTokenAddress);

    // recoil

    const [uniswapContractAddress, setUniswapContractAddress] =
        useState<any>('');
    const [platformConfigFee, setPlatformConfigFee] = useState<any>('');

    console.log('platformFee', uniswapContractAddress, platformConfigFee);

    useEffect(() => {
        const getConfig = async () => {
            try {
                const data = await apiClient.get(
                    `${process.env.NEXT_PUBLIC_BASEROOT}/get-config`
                );
                if (!data || !data.data) throw 'Error';
                console.log('routerData', data.data);

                setUniswapContractAddress(data?.data.uniswapContractAddress);
                setPlatformConfigFee(data?.data.plateformFee);
                // setLoaders(false);
            } catch (error) {
                // setLoaders(false);
                console.log('error', error);
            }
        };
        getConfig();
    }, [userAddress]);

    // envs
    const orderPerNft = process.env.NEXT_PUBLIC_ORDER_PER_NFT;
    const cronAdd = uniswapContractAddress;
    const wethAddress = process.env.NEXT_PUBLIC_WETH_ADDRESS;
    const platformFee = platformConfigFee;
    const nftId = process.env.NEXT_PUBLIC_NFT_ID;

    console.log('plat', uniswapContractAddress, platformFee);

    console.log('weth', wethAddress);

    const [loader, setLoader] = useState(false);
    const [tokenLoader, setTokenLoader] = useState(false);
    const [swapFunctionLoader, setSwapFunctionLoader] = useState(false);

    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [ethAmount, setEthAmount] = useState<number>(0);

    // const [orderPerNft, setorderPerNft] = useState<number>(3);

    const [disableOrderBtn, setDisableOrderBtn] = useState<boolean>(false);

    // Tabs State
    const [priceEnabled, setPriceEnabled] = useState<boolean>(true);
    const [upEnabled, setUpEnabled] = useState<boolean>(false);
    const [downEnabled, setDownEnabled] = useState<boolean>(false);

    const [price, setPrice] = useState<number>(0);
    console.log('price', price);
    const [upPrice, setUpPrice] = useState<number>(0);
    const [mainPrice, setMainPrice] = useState<number>(0);

    const [downPrice, setDownPrice] = useState<number>(0);

    const [name, setName] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');

    const [decimal, setDecimal] = useState<any | null>('');

    const [symbol, setSymbol] = useState('');
    const [wethSymbol, setWethSymbol] = useState('');

    const [isTokenValid, setIsTokenValid] = useState(false);

    const [buySellTab, setBuySellTab] = useState<number>(0);

    const [executeBtnStatus, setExecuteBtnStatus] = useState('');
    const [balance, setBalance] = useState<number>();

    const [invalidToken, setInvalidToken] = useState(false);
    const [isToastMessage, setIsToastMessage] = useState<number>(0);
    console.log('isToast', isToastMessage);

    const [typeCase, setTypecase] = useState<any | null>('');

    // load allowance
    const [allowanceData, setAllowanceData] = useState<number>(0);
    const [allowanceEth, setAllowanceEth] = useState<number>(0);

    const ETHAddress = '0x0000000000000000000000000000000000000000';
    const getSwapAmount = async (type: any, amount: any) => {
        let provider = new ethers.providers.JsonRpcProvider(
            providerRpc[chainId]
        );

        let routerInstance = new ethers.Contract(
            router[chainId],
            routerAbi,
            provider
        );
        let WETH =
            Number(chainId) !== 43114
                ? await routerInstance.WETH()
                : await routerInstance.WAVAX();

        let inDecimals: any = tokens[chainId].find(
            (el: any) => el.address === ETHAddress
        ).decimals;
        let outDecimals = decimal.toString();

        let path;

        switch (type) {
            case 'first':
                if (amount > 0) {
                    console.log('amt', amount, inDecimals);
                    path = [WETH, tokenAddress];
                    console.log('pathpath first', path);

                    let amountsOut = await routerInstance.getAmountsOut(
                        ethers.utils.parseUnits(amount, inDecimals),
                        path
                    );
                    console.log(
                        'amountsOut',
                        amountsOut,
                        ethers.utils.parseUnits(amount, inDecimals)
                    );
                    return ethers.utils.formatUnits(
                        amountsOut.at(-1),
                        inDecimals
                    );
                }
                break;
            case 'second':
                if (amount > 0) {
                    path = [WETH, tokenAddress];
                    console.log('pathpath second', path);
                    let amountsIn = await routerInstance.getAmountsIn(
                        ethers.utils.parseUnits(amount, outDecimals),
                        path
                    );
                    console.log(
                        'amountsOut',
                        ethers.utils.formatUnits(amountsIn[0], inDecimals),
                        outDecimals
                    );

                    return ethers.utils.formatUnits(amountsIn[0], inDecimals);
                }
                break;

            default:
                break;
        }
    };

    const handleInputChange = async (e: any, type: any) => {
        let amount = e;

        switch (type) {
            case 'first':
                setTypecase('first');
                setEthAmount(amount);

                setTimeout(async () => {
                    setLoader(true);
                    // setTokenAmount(amount);
                    const rate = await getSwapAmount(type, amount.toString());
                    console.log('rate', rate);
                    setTokenAmount(Number(rate));
                    // setEthAmount(amount);

                    if (buySellTab === 0) {
                        if (
                            !rate
                                ? Number(amount) > allowanceEth
                                : Number(rate) > allowanceEth
                        ) {
                            setExecuteBtnStatus('approval');
                        } else {
                            setExecuteBtnStatus('order');
                        }
                    } else {
                        // if tabs is Sell

                        if (
                            !rate
                                ? Number(amount) > allowanceData
                                : Number(rate) > allowanceData
                        ) {
                            setExecuteBtnStatus('approval');
                        } else {
                            setExecuteBtnStatus('order');
                        }
                    }

                    setLoader(false);
                }, 3000);

                break;
            case 'second':
                setTypecase('second');
                setTokenAmount(amount);
                setTimeout(async () => {
                    setLoader(true);
                    // setTokenAmount(amount);
                    const rate1 = await getSwapAmount(type, amount.toString());

                    console.log('rate1', rate1);

                    if (buySellTab === 1) {
                        if (
                            !rate1
                                ? Number(amount) > allowanceData
                                : Number(rate1) > allowanceData
                        ) {
                            setExecuteBtnStatus('approval');
                        } else {
                            setExecuteBtnStatus('order');
                        }
                    } else {
                        if (
                            !rate1
                                ? Number(amount) > allowanceEth
                                : Number(rate1) > allowanceEth
                        ) {
                            setExecuteBtnStatus('approval');
                        } else {
                            setExecuteBtnStatus('order');
                        }
                    }
                    setEthAmount(Number(rate1));
                    setLoader(false);
                }, 3000);

                break;

            default:
                break;
        }
    };

    const searchTokenContract = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const [value, setValue] = useState('');
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const mockVal = (str: string) => ({
        value: str,
    });

    // mintendNftBalance
    const [mintedNftBalance, setMintedNftBalance] = useState(0);

    const orderAdded = useRecoilValue(orderAddedState);

    const onSearch = async (address: string) => {
        const tokenAddress: any = CommonUtility.validateAddress(address, 'ETH');

        setTokenLoader(true);
        if (tokenAddress) {
            try {
                setInvalidToken(false);
                setTokenAddress(address);
                setIsTokenValid(true);
                const name = await ERC20Service.name(address);
                const decimals: any = await ERC20Service.decimals(address);
                let symbol = await ERC20Service.symbol(address);
                let wethSymbol = await ERC20Service.symbol(wethAddress);

                setDecimal(decimals);

                const balance = await ERC1155Service.balance(
                    userAddress,
                    nftId
                );

                // const balance = await ERC20Service.balance(

                //     address,
                //     userAddress
                // );

                // setBalance(balance);

                const allowance = await ERC20Service.allowance(
                    address,
                    userAddress,
                    cronAdd
                );

                setAllowanceData(allowance);

                const allowanceWeth = await ERC20Service.allowance(
                    wethAddress,
                    userAddress,
                    cronAdd
                );

                setAllowanceEth(allowanceWeth);

                if (
                    (name.message ||
                        decimals.message ||
                        symbol.message ||
                        allowanceWeth.message,
                    allowance.message || wethSymbol.message)
                )
                    throw 'Invalid Address';

                // if (balance > allowance) {
                //     setExecuteBtnStatus('approval');
                // } else {
                //     setExecuteBtnStatus('order');
                // }

                setUserTokenAddress(address);

                if (symbol && name && decimals && wethSymbol) {
                    setName(name);
                    setDecimal(decimals);
                    setSymbol(symbol);
                    setWethSymbol(wethSymbol);
                    setMintedNftBalance(balance);

                    console.log('balance', balance);
                    if (Number(balance) === 0) {
                        toast.warning('You dont have NFTs for Order Execution');
                    }
                }

                setOptions(!address ? [] : [mockVal(address)]);
                setTokenLoader(false);
            } catch (error: any) {
                setInvalidToken(true);
                console.log('error', error);
                toast.error(error);
                setTokenLoader(false);
            }
        } else {
            setIsTokenValid(false);
            setInvalidToken(true);
            let notFound = ' Address Not Found';
            setOptions(!address ? [] : [mockVal(notFound)]);
            setTokenLoader(false);
        }
    };

    const onSelect = (data: string) => {
        setValue(data);
    };

    const onChange = (data: string) => {
        setValue(data);
    };

    const [orderData, setOrderData] = useState([]);

    const getOrderData = async () => {
        try {
            const data = await apiClient.put(
                `${process.env.NEXT_PUBLIC_BASEROOT}/get-user-orders/${userAddress}`
            );
            if (!data || !data.data) throw 'Error';
            setOrderData(data.data);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        userAddress && getOrderData();
    }, [userAddress]);

    useEffect(() => {
        if (orderAdded && userAddress) {
            getOrderData();
            setTokenAmount(0);
            setEthAmount(0);
            setMainPrice(0);
            setDownPrice(0);
            setUpPrice(0);
            setPrice(0);
        }
    }, [userAddress, orderAdded]);

    const getBalanceHandle = async () => {
        if (userAddress) {
            // const erc721Address = '0x04bf6D2b5dc027899ce39616D1A73CE5e86F9af4';
            const balance = await ERC1155Service.balance(userAddress, nftId);

            // if (Number(balance == 0)) {
            //     setIsToastMessage(isToastMessage + 1);
            // }
            // let balance = 3;
            setMintedNftBalance(balance);
        }
    };

    let data: number = 0;
    console.log('data', data);

    useEffect(() => {
        getBalanceHandle();
    }, [userAddress]);

    // enabled Button when user cancelled order
    useEffect(() => {
        if (orderData.length != 0) {
            const orderLength = orderData?.length;
            const order = mintedNftBalance * Number(orderPerNft);
            const orderLimit = order - orderLength;

            if (orderLimit != 0) {
                setDisableOrderBtn(false);
            }
        }
    }, [orderData]);

    const executeOrder = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const orderPerNft = process.env.NEXT_PUBLIC_ORDER_PER_NFT;

        const orderLength = orderData?.length;

        const order = Number(mintedNftBalance) * Number(orderPerNft);

        const orderLimit = order - orderLength;

        console.log('orderLimit', orderLimit, order, mintedNftBalance);

        if (orderLimit <= 0) {
            setDisableOrderBtn(true);
            toast.warning('Your Maximum Limit has Reached');
        } else {
            if (tokenAmount !== 0 && ethAmount !== 0 && mainPrice !== 0) {
                let balance;
                if (buySellTab === 1) {
                    balance = await ERC20Service.balance(
                        tokenAddress,
                        userAddress
                    );

                    if (
                        Number(balance) <
                        Number(tokenAmount) * 10 ** 18 +
                            Number((tokenAmount / 100) * Number(platformFee))
                    ) {
                        toast.warning('Invalid Token Amount');
                    } else {
                        setShowModal(true);
                        setExecuteOrderData({
                            ethAmount,
                            type: 'Sell',
                            symbol,
                            wethSymbol,
                            price: mainPrice.toFixed(0),
                            userAddress,
                            tokenAddress,
                            decimal,
                            status: 'Created',
                            network: chainId,
                            tokenAmount: tokenAmount,
                            platformFee,
                        });
                    }
                } else {
                    balance = await ERC20Service.balance(
                        wethAddress,
                        userAddress
                    );

                    if (
                        Number(balance) <
                        Number(ethAmount) * 10 ** 18 +
                            Number((ethAmount / 100) * Number(platformFee))
                    ) {
                        toast.warning('Invalid Token Amount');
                    } else {
                        setShowModal(true);
                        setExecuteOrderData({
                            ethAmount,
                            type: 'Buy',
                            symbol,
                            wethSymbol,
                            price: mainPrice.toFixed(0),
                            userAddress,
                            tokenAddress,
                            decimal,
                            status: 'Created',
                            network: chainId,
                            tokenAmount: tokenAmount,
                            platformFee,
                        });
                    }
                }
            } else {
                toast.warning('Please Complete Order Data');
            }
        }
    };

    const approvalHandle = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let amount = await BigNumber(Number(100000000000)).multiply(
                1 * 10 ** 18
            );
            let balance;
            if (buySellTab === 0) {
                balance = await ERC20Service.balance(wethAddress, userAddress);

                console.log('bal', balance, ethAmount);

                if (Number(ethAmount) <= Number(balance)) {
                    const approval = await ERC20Service.approval(
                        wethAddress,
                        cronAdd,
                        amount,
                        userAddress
                    );

                    if (approval && approval.message) throw 'Approval Rejected';
                    toast.success('Approved');
                    setExecuteBtnStatus('order');
                } else {
                    toast.error('Balance is less than Entered Amount');
                }
            } else {
                balance = await ERC20Service.balance(tokenAddress, userAddress);

                if (Number(ethAmount) <= Number(balance)) {
                    const approval = await ERC20Service.approval(
                        tokenAddress,
                        cronAdd,
                        amount,
                        userAddress
                    );

                    if (approval && approval.message) throw 'Approval Rejected';
                    toast.success('Approved');
                    setExecuteBtnStatus('order');
                } else {
                    toast.error('Entered amount is less than balance');
                }
            }
        } catch (error) {
            toast.error('Approval Rejected');
        }
    };

    // when order added table will refresh and then state will set false so table refresh when
    // order added

    useEffect(() => {
        if (excuteOrderedAdded) {
            setTimeout(() => {
                setExecuteOrderedAdded(false);
            }, 2000);
        }
    }, [excuteOrderedAdded]);

    const setPriceHandle = (e: any) => {
        if (priceEnabled) {
            if (Number(e.target.value < 0)) {
                return 0;
            } else {
                setMainPrice(Number(e.target.value) * 10 ** decimal);
                setPrice(Number(e.target.value));
            }
        }
    };

    const setUpPriceHandle = async (e: any) => {
        if (upEnabled) {
            if (Number(e.target.value < 0) || Number(e.target.value > 100)) {
                return 0;
            } else {
                setUpPrice(Number(e.target.value));
                if (buySellTab == 1) {
                    let pricePerToken = Number(ethAmount) / Number(tokenAmount);
                    let newPrice = pricePerToken * 10 ** decimal;
                    console.log('price', newPrice);
                    setMainPrice(
                        // eth amount / token amount = 1 token price
                        newPrice + (newPrice * Number(e.target.value)) / 100
                    );
                } else {
                    setSwapFunctionLoader(true);
                    let rate = await getSwapAmount('first', '1');
                    // let newRate = (Number(rate) * 10 ** decimal).toFixed(0);
                    let newRate = Number(rate).toFixed(0);

                    setMainPrice(
                        // eth amount / token amount = 1 token price
                        Number(newRate) +
                            (Number(newRate) * Number(e.target.value)) / 100
                    );
                    setSwapFunctionLoader(false);
                }
            }
        }
    };

    const downPriceHandle = async (e: any) => {
        if (downEnabled) {
            if (Number(e.target.value < 0) || Number(e.target.value > 100)) {
                return 0;
            } else {
                setDownPrice(Number(e.target.value));

                if (buySellTab === 1) {
                    let pricePerToken = Number(ethAmount) / Number(tokenAmount);
                    let newPrice = pricePerToken * 10 ** decimal;
                    console.log('price', newPrice);
                    setMainPrice(
                        // eth amount / token amount = 1 token price
                        newPrice - (newPrice * Number(e.target.value)) / 100
                    );
                } else {
                    setSwapFunctionLoader(true);
                    let rate = await getSwapAmount('first', '1');

                    let newRate = Number(rate).toFixed(0);
                    setMainPrice(
                        // eth amount / token amount = 1 token price
                        Number(newRate) -
                            (Number(newRate) * Number(e.target.value)) / 100
                    );

                    setSwapFunctionLoader(false);
                }
            }
        }
    };

    console.log('mainPrice', mainPrice);

    const ethAmountValueHandle: any = (ethAmount?: any) => {
        let ethAmt;
        ethAmt = fromExponential(Number(ethAmount));
        if (ethAmount) {
            ethAmt = fromExponential(Number(ethAmount));
            return ethAmt;
        }

        return ethAmount;
    };

    const tokenAmountValueHandle: any = (tokenAmounts?: any) => {
        let tokenAmt;
        tokenAmt = fromExponential(Number(tokenAmounts));
        if (tokenAmount) {
            tokenAmt = fromExponential(Number(tokenAmount));
            return tokenAmt;
        }

        return tokenAmounts;
    };

    return (
        <div className="min-h-screen bg-[#121318] lg:px-5 px-[15px] pt-6 mb-5 lg:mb-0">
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
            <div className="lg:flex hidden items-center justify-between mb-12">
                <img
                    src="/images/logo.svg"
                    alt="logo"
                    width={141}
                    height={21}
                />
                <ConnectButton />
            </div>
            <form className="relative mb-5" onSubmit={searchTokenContract}>
                {/* <input
                    type="text"
                    ref={tokenContractAddressRef}
                    className="rounded-md py-3 pl-3 pr-8 text-xs w-full placeholder-secondary text-white bg-black"
                    placeholder="Token Contract Search..."
                /> 

<button type="submit" className="absolute top-3 right-3">
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2.77344 8.08594C3.5026 8.8151 4.38802 9.17969 5.42969 9.17969C6.47135 9.17969 7.35677 8.8151 8.08594 8.08594C8.8151 7.35677 9.17969 6.47135 9.17969 5.42969C9.17969 4.38802 8.8151 3.5026 8.08594 2.77344C7.35677 2.04427 6.47135 1.67969 5.42969 1.67969C4.38802 1.67969 3.5026 2.04427 2.77344 2.77344C2.04427 3.5026 1.67969 4.38802 1.67969 5.42969C1.67969 6.47135 2.04427 7.35677 2.77344 8.08594ZM10.4297 9.17969L14.5703 13.3203L13.3203 14.5703L9.17969 10.4297V9.76562L8.94531 9.53125C7.95573 10.3906 6.78385 10.8203 5.42969 10.8203C3.91927 10.8203 2.63021 10.2995 1.5625 9.25781C0.520833 8.21615 0 6.9401 0 5.42969C0 3.91927 0.520833 2.64323 1.5625 1.60156C2.63021 0.533854 3.91927 0 5.42969 0C6.9401 0 8.21615 0.533854 9.25781 1.60156C10.2995 2.64323 10.8203 3.91927 10.8203 5.42969C10.8203 5.97656 10.6901 6.60156 10.4297 7.30469C10.1693 7.98177 9.86979 8.52865 9.53125 8.94531L9.76562 9.17969H10.4297Z"
                            fill="#535661"
                        />
                    </svg>
                </button>
                */}
                {tokenLoader && (
                    <div className="grid   place-items-center ">
                        <Loader content="Loading......." />
                    </div>
                )}
                <AutoComplete
                    options={options}
                    style={{
                        width: '100%',
                        // background: 'black',
                        // color: 'white',
                    }}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    placeholder="Please Enter Token Address"
                    disabled={!userAddress}
                ></AutoComplete>
            </form>

            <div className="mb-3">
                {loader && (
                    <div className="grid   place-items-center ">
                        <Loader content="Price Loading" />
                    </div>
                )}
                <label className="text-xs leading-[18px] font-semibold mb-2 text-white block">
                    Token Amount{' '}
                    {isTokenValid && symbol ? <span>({symbol})</span> : ''}
                </label>
                <input
                    type="number"
                    // step={0.01}
                    className="rounded-md py-3 pl-3 pr-8 text-xs w-full placeholder-secondary text-white bg-black"
                    // value={Number(tokenAmount)}
                    value={tokenAmountValueHandle(tokenAmount)}
                    onChange={(e: any) =>
                        handleInputChange(Number(e.target.value), 'second')
                    }
                    onWheel={(event) => event.currentTarget.blur()}
                    placeholder="0.00"
                    disabled={!userAddress || invalidToken || !tokenAddress}
                />
            </div>
            <div className="mb-5">
                <label className="text-xs leading-[18px] font-semibold mb-2 text-white block">
                    WETH Amount
                </label>
                <input
                    type="number"
                    className="rounded-md py-3 pl-3 pr-8 text-xs w-full placeholder-secondary text-white bg-black"
                    value={ethAmountValueHandle(ethAmount)}
                    onChange={(e: any) =>
                        handleInputChange(Number(e.target.value), 'first')
                    }
                    onWheel={(event) => event.currentTarget.blur()}
                    placeholder="0.00"
                    disabled={!userAddress || invalidToken || !tokenAddress}
                />
            </div>
            <Tab.Group
                onChange={(index) => {
                    setBuySellTab(index);
                }}
            >
                <Tab.List className="w-full mb-5">
                    <Tab
                        className={({ selected }) =>
                            `font-bold leading-[26px] w-1/2 pb-3 border-b-2 ${
                                selected
                                    ? 'text-green border-green'
                                    : 'text-secondary border-secondary'
                            }`
                        }
                    >
                        BUY IF
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            `font-bold leading-[26px] w-1/2 pb-3 border-b-2 ${
                                selected
                                    ? 'text-green border-green'
                                    : 'text-secondary border-secondary'
                            }`
                        }
                    >
                        SELL IF
                    </Tab>
                </Tab.List>
                {/* <Tab.Panels>
                    <Tab.Panel></Tab.Panel>
                    <Tab.Panel></Tab.Panel>
                </Tab.Panels> */}
            </Tab.Group>

            <form
                action="#"
                onSubmit={
                    executeBtnStatus === 'approval'
                        ? approvalHandle
                        : executeOrder
                }
            >
                {swapFunctionLoader && (
                    <div className="grid   place-items-center ">
                        <Loader content="Loading......." />
                    </div>
                )}
                <div className="flex items-center gap-2 text-whte text-xs leading-[18px] mb-2">
                    <Switch
                        checked={priceEnabled}
                        onChange={(val: boolean) => {
                            setDownEnabled(false);
                            setPriceEnabled(val);
                            setUpEnabled(false);
                        }}
                        className={`${
                            priceEnabled ? 'bg-yellow' : 'bg-secondary'
                        }
            relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                priceEnabled ? 'translate-x-3' : 'translate-x-0'
                            }
                mt-px pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                    <span
                        className={`font-semibold ${
                            priceEnabled ? 'text-white' : 'text-secondary'
                        }`}
                    >
                        Price
                    </span>
                </div>
                <div className="relative mb-4">
                    <span className="absolute text-white text-xs top-3 left-4"></span>
                    <input
                        type="number"
                        // step={0.01}
                        className={`border border-transparent rounded-md py-3 pl-8 pr-4 text-xs w-full placeholder-secondary text-white ${
                            priceEnabled
                                ? 'bg-black'
                                : 'bg-transparent border-[#1E1F27] '
                        }`}
                        value={price}
                        onChange={(e) => setPriceHandle(e)}
                        placeholder="0.00"
                        disabled={!userAddress || !tokenAddress}
                        onWheel={(event) => event.currentTarget.blur()}
                    />
                </div>
                <div className="flex items-center gap-2 text-whte text-xs leading-[18px] mb-2">
                    <Switch
                        checked={upEnabled}
                        onChange={(val: boolean) => {
                            setDownEnabled(false);
                            setPriceEnabled(false);
                            setUpEnabled(val);
                        }}
                        className={`${upEnabled ? 'bg-yellow' : 'bg-secondary'}
            relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                upEnabled ? 'translate-x-3' : 'translate-x-0'
                            }
                mt-px pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                    <span
                        className={`font-semibold ${
                            upEnabled ? 'text-white' : 'text-secondary'
                        }`}
                    >
                        % Up
                    </span>
                </div>
                <div className="relative mb-4">
                    <span className="absolute text-white text-xs top-3 left-4">
                        %
                    </span>
                    <input
                        type="number"
                        // step={0.01}
                        className={`border border-transparent rounded-md py-3 pl-8 pr-4 text-xs w-full placeholder-secondary text-white ${
                            upEnabled
                                ? 'bg-black'
                                : 'bg-transparent border-[#1E1F27] '
                        }`}
                        value={upPrice}
                        onWheel={(event) => event.currentTarget.blur()}
                        onChange={(e) => setUpPriceHandle(e)}
                        placeholder="0.00"
                        disabled={!userAddress || !tokenAddress}
                    />
                </div>
                <div className="flex items-center gap-2 text-whte text-xs leading-[18px] mb-2">
                    <Switch
                        checked={downEnabled}
                        onChange={(val: boolean) => {
                            setDownEnabled(val);
                            setPriceEnabled(false);
                            setUpEnabled(false);
                        }}
                        className={`${
                            downEnabled ? 'bg-yellow' : 'bg-secondary'
                        }
            relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                downEnabled ? 'translate-x-3' : 'translate-x-0'
                            }
                mt-px pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                    <span
                        className={`font-semibold ${
                            downEnabled ? 'text-white' : 'text-secondary'
                        }`}
                    >
                        % Down
                    </span>
                </div>
                <div className="relative mb-8">
                    <span className="absolute text-white text-xs top-3 left-4">
                        %
                    </span>
                    <input
                        type="number"
                        // step={0.01}
                        // min={0}
                        // max={100}
                        disabled={!userAddress || !tokenAddress}
                        className={`border border-transparent rounded-md py-3 pl-8 pr-4 text-xs w-full placeholder-secondary text-white ${
                            downEnabled
                                ? 'bg-black'
                                : 'bg-transparent border-[#1E1F27] '
                        }`}
                        value={downPrice}
                        onChange={(e) => downPriceHandle(e)}
                        placeholder="0.00"
                        onWheel={(event) => event.currentTarget.blur()}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full text-xs font-bold leading-[24px] mb-5 text-white py-1.5 px-7 uppercase bg-[#5F3595] rounded-lg custom-shadow  "
                    disabled={
                        disableOrderBtn ||
                        Number(mintedNftBalance) === 0 ||
                        !userAddress ||
                        swapFunctionLoader
                    }
                >
                    {executeBtnStatus === 'approval'
                        ? 'approval'
                        : 'EXECUTE ORDER'}
                </button>
            </form>
        </div>
    );
};

export default Sidebar;
