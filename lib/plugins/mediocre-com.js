const productionSites = '(?:https?:\\/\\/(?:www\\.)?)?(?<site>(?:casemates|mediocre|mediocritee|meh|morningsave|pastadrop|sidedeal|stellacarmina)\\.com)?';
const debugSites = '(?:https?:\\/\\/)?(?<siteLocal>(?:127\\.0\\.0\\.1|localhost):\\d{4})?';
const path = '\\/(?<path>(?<type>deals|polls)\\/(?:[-\\w]+))';
let regExp = new RegExp(`${productionSites}${path}`);
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
    // Allow iframes for any localhost deal/poll links on debug, but also make sure tests pass...
    regExp = new RegExp(`(?:(?:${productionSites})|(?:${debugSites}))${path}`);
}

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var openToken = tokens[idx];
        var hrefIndex = openToken.attrIndex('href');

        // Ensure we have an "href" attribute
        if (hrefIndex !== -1) {
            var href = openToken.attrs[hrefIndex][1];

            // Ensure we have an "href" attribute value
            if (href) {
                var textToken = tokens[idx + 1];

                // Ensure we have a text token and the text matches the URL pattern instead of [text](http://example.com/)
                if (textToken && textToken.content && regExp.test(textToken.content)) {
                    var matches = href.match(regExp);

                    var embedUrl = `/${matches.groups.path}/embed`;

                    var site = matches.groups.site || matches.groups.siteLocal;
                    if (site) {
                        embedUrl = `https://${site}${embedUrl}`;
                    }

                    textToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe class="${matches.groups.type}" frameborder="0" scrolling="no" src="${embedUrl}"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};