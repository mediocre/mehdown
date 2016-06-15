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
                var matches = uri.href.match(/https?:\/\/(?:www\.)?(?:vimeo\.com\/)(\d+)/);

                if (matches && matches[1]) {
                    var id = matches[1];

                    textToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe allowfullscreen class="vimeo" frameborder="0" src="https://player.vimeo.com/video/${id}"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
