import React from 'react';
import Document from 'next/document';
// When Sitecore solution does not have personalization rules and when it does not require SPA-navigation
// it makes sense to disable all nextjs scripts to minimize javascript bundle and fit performance budget.
/**
 * CustomDocument replaces stock Nextjs Document component
 * so that we can use custom and basic html, head and body
 */
export default class CustomDocument extends Document {
    render() {
        const { head, html } = this.props;
        return (
            <html lang="en">
                <head>{head}</head>
                <body className="header-static" dangerouslySetInnerHTML={{ __html: html }} />
            </html>
        );
    }
}
