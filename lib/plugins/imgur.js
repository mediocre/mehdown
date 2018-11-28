const url = require('url');

const regExp = /(?:i\.imgur\.com\/)([a-zA-Z0-9]+)/i;

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

                    if (uri && uri.pathname) {
                        var matches = href.match(regExp);

                        if (matches && matches[1]) {
                            var id = matches[1];

                            textToken.content = '';
                            tokens[idx + 2].hidden = true;

                            return `<div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="${id}"><a href="//imgur.com/${id}">imgur.com/${id}</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>`;
                        }
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};