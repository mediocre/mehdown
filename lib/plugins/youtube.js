const mehdown = require('../index');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var href = token.attrs[hrefIndex][1];
            var nextToken = tokens[idx + 1];

            if (href === nextToken.content) {
                var embedHtml = mehdown.youTubeEmbedHtml(href);

                if (embedHtml) {
                    nextToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return embedHtml;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
