const url = require('url');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var uri = url.parse(token.attrs[hrefIndex][1]);

            if (uri) {
                var matches = uri.href.match(/https?:\/\/(?:www\.)reddit\.com\/.*/);

                if (matches) {
                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    return `<div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-live="true"><a href="${uri.href}">${uri.href}</a></div><script async src="https://www.redditstatic.com/comment-embed.js"></script>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
