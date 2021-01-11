import { tryParseGuid } from '@uniformdev/common';
import { noopLogger } from '.';
import { RenderingType } from '..';
export function buildLayout(props, initial) {
    if (initial === void 0) { initial = false; }
    var page = props.item, home = props.home, datasources = props.datasources, html = props.html, uniformContext = props.uniformContext;
    if (!page)
        throw new Error('no page');
    if (!datasources)
        throw new Error('no datasources');
    if (!html)
        throw new Error('no html');
    // if (!components) throw new Error('no components');
    // it's okay because of magic button if (Object.getOwnPropertyNames(components).length <= 0) throw new Error('components are empty');
    var logger = !uniformContext || !uniformContext.logger ? noopLogger : uniformContext.logger;
    logger.debug('Rendering dynamic layout of ' + page.id);
    var placeholders = {};
    var renderings = page.renderings;
    if (!renderings)
        throw new Error('no renderings');
    for (var i = 0; i < renderings.length; ++i) {
        var r = renderings[i];
        if (!r || !r.id) {
            logger.error('Rendering #' + i + ' has no id: ', JSON.stringify(r ? r.id : "undefined rendering"));
            continue;
        }
        var placeholder = (r.placeholder || '').trim().toLowerCase() || 'main';
        var rawDatasource = r.settings.DataSource ? r.settings.DataSource.toLowerCase() : '';
        var datasource = tryParseGuid(rawDatasource);
        var tagName = r.componentName;
        var dataSourceItem = (datasource && datasources[datasource]) || undefined;
        if (datasource && !dataSourceItem && r.renderingType !== RenderingType.mvc) {
            logger.warn("The '" + (tagName || r.id) + "' component's datasource '" + datasource + "' ('" + rawDatasource + "') cannot be resolved.");
            continue;
        }
        var item = dataSourceItem || page;
        var rendering = {
            id: tryParseGuid(r.id),
            renderingId: tryParseGuid(r.renderingId),
            renderingType: r.renderingType,
            componentName: tagName,
            settings: r.settings,
            datasource: datasource || '',
            hidden: false,
            renderingContext: {
                item: item,
                page: page,
                home: home || page,
                placeholders: placeholders,
                datasources: datasources,
                html: html,
            },
        };
        if (initial) {
            if (r.settings.Rules) {
                var rules = r.settings.Rules.Rules;
                if (rules && rules.length > 0) {
                    for (var i_1 = 0; i_1 < rules.length; ++i_1) {
                        var rule = rules[i_1];
                        if (rule.UniqueId === '00000000-0000-0000-0000-000000000000') {
                            var actions = rule.Actions;
                            if (actions && actions.length > 0) {
                                for (var j = 0; j < actions.length; ++j) {
                                    var action = actions[j];
                                    if (action.type === 'Sitecore.Rules.ConditionalRenderings.HideRenderingAction') {
                                        rendering.hidden = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!placeholders.hasOwnProperty(placeholder)) {
            placeholders[placeholder] = [];
        }
        placeholders[placeholder].push(rendering);
        logger.debug('Registering ' + rendering.renderingId + ' to ' + placeholder);
    }
    return placeholders;
}
//# sourceMappingURL=buildLayout.js.map