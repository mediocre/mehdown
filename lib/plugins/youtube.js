const url = require('url');

const mehdown = require('../index');

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
                var embedHtml = mehdown.youTubeEmbedHtml(uri.href);

                if (embedHtml) {
                    textToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return embedHtml;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
