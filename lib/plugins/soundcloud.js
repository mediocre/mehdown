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
                var matches = uri.href.match(/https?:\/\/(?:soundcloud.com|snd.sc)\/.*/);

                if (matches) {
                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=${encodeURIComponent(uri.href)}"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
