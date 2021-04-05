import { tryFormatGuid } from '@uniformdev/common';
import * as React from 'react';

const BackgroundColors = {
    '{EFA6AD59-AE21-4524-90F8-A92440B869AF}': 'bg-primary',
    '{22EFB258-62F5-4B49-9D7E-DE07F70C9F37}': 'bg-secondary',
    '{ECCA6054-1534-4C34-AF46-7EB610433229}': 'bg-white',
    '{BD2F308A-E00A-4372-ADBB-BD64712A54FA}': 'bg-dark',
};

function flatten(node, arr) {
    if (node.template === 'News Article') {
        arr.push(node);
    }

    node.children.map((x) => flatten(x, arr));

    return arr;
}

function getBackgroundClass(props) {
    const bgParam = props.renderingContext.parameters?.['Background'];
    const bgGuid = tryFormatGuid(bgParam, 'B');

    return (bgGuid && BackgroundColors[bgGuid.toUpperCase()]) || '';
}

export function LatestNews(props) {
    let news = flatten(props.renderingContext.item, []);
    news.sort((x) => x.fields.newsdate);
    news.reverse();
    news = news.map((node) => {
        const date = new Date(node.fields.newsdate);
        const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });
        const MMMM = formatter.format(date);
        const dd = date.getDate();
        const yyyy = date.getFullYear();

        const url = node.fields._url;
        const newstitle = node.fields.newstitle;
        const newsdate = `${MMMM} ${dd}, ${yyyy}`;

        return { url, newstitle, newsdate };
    });

    const bgClass = getBackgroundClass(props);

    return (
        <div className={`well ${bgClass}`}>
            <h5 className="text-uppercase">News</h5>
            <ul className="media-list">
                {news.map((article, i) => (
                    <li key={i} className="media">
                        <div className="media-body">
                            <date>{article.newsdate}</date>
                            <h4 className="media-heading">
                                <a href={article.url}>{article.newstitle}</a>
                            </h4>
                        </div>
                    </li>
                ))}
            </ul>
            <a href={props.renderingContext.item.fields._url} className="btn btn-default">
                Read more
            </a>
        </div>
    );
}
