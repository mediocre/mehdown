const url = require('url');

const regExp = /(?:https?:\/\/(?:www\.)?)?vine.co\/v\/.*/i;

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
                    var uri = url.parse(href);
                    var matches = href.match(regExp);

                    if (matches) {
                        uri.host = 'vine.co';
                        uri.protocol = 'https:';

                        // Make sure we just have the /v/:id part, then add embed/simple
                        uri.pathname = uri.pathname.split('/').slice(1, 3).concat(['embed', 'simple']).join('/');

                        textToken.content = '';
                        tokens[idx + 2].hidden = true;

                        return `<iframe allowfullscreen class="vine" frameborder="0" src="${url.format(uri)}"></iframe>`;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
