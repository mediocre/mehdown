const url = require('url');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var textToken = tokens[idx + 1];
            var uri = url.parse(token.attrs[hrefIndex][1]);

            if (textToken && uri && textToken.content === uri.href) {
                var matches = uri.href.match(/https?:\/\/vine.co\/v\/.*/);

                if (matches) {
                    // Make sure we just have the /v/:id part, then add embed/simple
                    uri.pathname = uri.pathname.split('/').slice(1, 3).concat(['embed', 'simple']).join('/');

                    textToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe allowfullscreen class="vine" frameborder="0" src="${url.format(uri)}"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
