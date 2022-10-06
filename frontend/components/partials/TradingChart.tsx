/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useRecoilValue } from 'recoil';
import { userAddressState } from '~/store/web3';
import ConnectButton from '../features/ConnectButton';

const TradingChart = () => {
    const userAddress = useRecoilValue(userAddressState);
    const [symbol, setSymbol] = useState('NULL');

    const selectToken = () => {
        setSymbol('ETH');
    };
    console.log('userAddress', userAddress);
    return (
        <div className="bg-[#121318] px-[15px] pb-[15px] lg:pt-[15px] relative lg:mb-5 rounded-md overflow-hidden min-h-[600px]">
            <AdvancedRealTimeChart
                theme="dark"
                height={590}
                width={'100%'}
                hide_side_toolbar={true}
                toolbar_bg={'#121318'}
                enable_publishing={false}
                // withdateranges={false}
                save_image={false}
                symbol={symbol}
                disabled_features={[
                    'header_compare',
                    'header_indicators',
                    'header_chart_type',
                ]}
                copyrightStyles={{
                    parent: {
                        display: 'none',
                    },
                }}
            ></AdvancedRealTimeChart>
            {!userAddress ? (
                <div className="flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-[#131722]">
                    <img
                        src="/images/connect-necessary.svg"
                        className="mb-6"
                        alt="icon"
                        width={149}
                        height={149}
                    />
                    <div className="font-bold text-sm text-white mb-5">
                        Oooops! Please,{' '}
                        <span className="text-yellow underline">
                            Connect Wallet
                        </span>{' '}
                        first...
                    </div>
                    <ConnectButton />
                </div>
            ) : symbol === 'NULL' ? (
                <div className="flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-[#131722]">
                    <img
                        src="/images/token-search.svg"
                        alt="icon"
                        width={149}
                        height={149}
                    />
                    <div className="font-bold text-sm text-white">
                        Please select &nbsp;
                        <button
                            className="text-yellow underline"
                            onClick={selectToken}
                        >
                            Token
                        </button>
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default TradingChart;
