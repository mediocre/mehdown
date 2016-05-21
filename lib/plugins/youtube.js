const mehdown = require('../index');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var embedHtml = mehdown.youTubeEmbedHtml(token.attrs[hrefIndex][1]);

            if (embedHtml) {
                tokens[idx + 1].content = '';
                tokens[idx + 2].hidden = true;

                return embedHtml;
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
