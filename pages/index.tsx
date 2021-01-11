import React, { useEffect, useState } from 'react';

import Router from 'next/router';

// Uniform
import { BasePlaceholder, PageComponent, UniformContext, NextPageProps, getNextPageProps, createConsoleLogger, } from '@uniformdev/next';

import { useSitecoreTracker } from '@uniformdev/tracking-react';
import { SitecorePersonalizationContextProvider } from '@uniformdev/personalize-react';

// Components Index
const componentsIndex: any = {};

import { LatestNews } from "../components";

componentsIndex.LatestNews = LatestNews;

/* uncomment this to enable Spinner to be a default loader for all components with personalization
// Global Loader
//   When any component has personalization enabled, the loader component replaces the actual component 
//   for the first few moments on the page while personalization rules are deciding what to show)
import { GLOBAL_LOADER } from '@uniformdev/next';
index[GLOBAL_LOADER] = Spinner;
*/

// PageHeaderMediaCarousel Loader 
//   When the PageHeaderLoader component has personalization enabled, the loader component replaces the actual component 
//   for the first few moments on the page while personalization rules are deciding what to show)
import { COMPONENT_LOADER_SUFFIX } from '@uniformdev/next';
import { PageHeaderLoader } from "../components";
import { UniformWindow } from '@uniformdev/tracking';

componentsIndex["PageHeaderMediaCarousel" + COMPONENT_LOADER_SUFFIX] = PageHeaderLoader;

declare let window: UniformWindow;

class Placeholder extends BasePlaceholder {
  constructor(props) {
    super(props, componentsIndex, createConsoleLogger());
  }
}

componentsIndex.Placeholder = Placeholder;

// Page
const Page = function (props: NextPageProps) {  
    const logger = createConsoleLogger();

    const [currentUrl, setCurrentUrl] = useState();
    
    useEffect(() => {
      Router.events.on('routeChangeStart', url => {
        setCurrentUrl(url);
      })
    }, []);
  
    useSitecoreTracker(props.page, {
      type: 'uniform',
      logger,
    });
  
    //Run the tracker when the layout data changes.
    useEffect(() => {
      // The current url is undefined if the route
      // has not yet changed on the client. In this
      // case, do not run the tracker because it was
      // already run by the tracker hook.
      if (!currentUrl) {
        return;
      }

      const uniform = window.uniform;

      // Run the tracker.
      uniform.tracker.track('sitecore', props.page, {
        visitorId: uniform.visitor.id,
        createVisitor: true,
      })
    }, [props.page])

    return (
        <UniformContext.Provider value={{ logger }}>
          <SitecorePersonalizationContextProvider
            contextData={props.page}
            contextDataSource="uniform">
            <PageComponent {...props} components={componentsIndex}>
                {(renderingContext) => (
                    <Placeholder placeholderKey="/" renderingContext={renderingContext} />
                )}
            </PageComponent>
          </SitecorePersonalizationContextProvider>
        </UniformContext.Provider>
    );
}

Page.getInitialProps = async function (arg: any) {
    return await getNextPageProps(arg);
}

export default Page; 
