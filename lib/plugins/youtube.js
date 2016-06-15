const mehdown = require('../index');

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
                if (textToken && textToken.content && mehdown.youTubeEmbedHtml(textToken.content)) {
                    var embedHtml = mehdown.youTubeEmbedHtml(href);

                    if (embedHtml) {
                        textToken.content = '';
                        tokens[idx + 2].hidden = true;

                        return embedHtml;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
