import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head/>
                <body className="header-static">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
