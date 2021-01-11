import * as React from 'react';

function flatten(node, arr){
    if (node.template === 'News Article') {
        arr.push(node);
    }

    node.children.map(x => flatten(x, arr));

    return arr;
};

export function LatestNews(props) {
    let news = flatten(props.renderingContext.item, []);
    news.sort(x => x.fields.newsdate);
    news.reverse();
    news = news.map(node => {
            const date = new Date(node.fields.newsdate);
            const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });
            const MMMM = formatter.format(date);            
            const dd = date.getDate();
            const yyyy = date.getFullYear();
            
            const url = node.fields._url;
            const newstitle = node.fields.newstitle;
            const newsdate = `${MMMM} ${dd}, ${yyyy}`;

            return {url, newstitle, newsdate};
        });

    return (
        <div className="well @RenderingContext.Current.Rendering.GetBackgroundClass()">
            <h5 className="text-uppercase">News</h5>
            <ul className="media-list">                
                { news.map(article => 
                <li className="media">
                    <div className="media-body">
                    <date>
                        {article.newsdate}
                    </date>
                    <h4 className="media-heading">
                        <a href={article.url}>{article.newstitle}</a>
                    </h4>
                    </div>
                </li>
                )}
            </ul>
            <a href={props.renderingContext.item.fields._url} className="btn btn-default">
                Read more
            </a>
        </div>
    );
}
