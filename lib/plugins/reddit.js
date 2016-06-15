const url = require('url');

const regExp = /(?:https?:\/\/(?:www\.)?)?reddit\.com\/.*/i;

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

                    if (matches) {
                        var uri = url.parse(href);

                        uri.host = 'reddit.com';
                        uri.protocol = 'https:';

                        textToken.content = '';
                        tokens[idx + 2].hidden = true;

                        return `<div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-live="true"><a href="${url.format(uri)}">${url.format(uri)}</a></div><script async src="https://www.redditstatic.com/comment-embed.js"></script>`;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
