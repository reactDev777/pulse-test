import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import ErrorBoundaryFallback from '~/components/features/ErrorBoundaryFallback';
// import { ErrorBoundary } from 'react-error-boundary';

import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.min.css';
import '../styles/globals.css';
import { RecoilRoot } from 'recoil';

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return <RecoilRoot>{getLayout(<Component {...pageProps} />)}</RecoilRoot>;
}

export default MyApp;
