import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <base href="/" />
                    <link rel="icon" href="favicon.png" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap"
                        media="all"
                    />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
