const url = require('url');

const regExp = /(?:i\.imgur\.com\/)([a-zA-Z0-9]+)/i;

function imgurEmbed(id) {
    return `<div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="${id}"><a href="//imgur.com/${id}">imgur.com/${id}</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div>`;
}

module.exports = function(md) {
    var defaultImageRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    var defaultLinkOpenRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.image = function(tokens, idx, options, env, self) {
        var openToken = tokens[idx];
        var srcIndex = openToken.attrIndex('src');

        // Ensure we have a "src" attribute
        if (srcIndex !== -1) {
            var src = openToken.attrs[srcIndex][1];

            // Ensure we have a "src" attribute value
            if (src) {
                var uri = url.parse(src);

                if (uri && uri.pathname) {
                    var matches = src.match(regExp);

                    if (matches && matches[1]) {
                        var id = matches[1];

                        return imgurEmbed(id);
                    }
                }
            }
        }

        return defaultImageRender(tokens, idx, options, env, self);
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

                            return imgurEmbed(id);
                        }
                    }
                }
            }
        }

        return defaultLinkOpenRender(tokens, idx, options, env, self);
    };
};