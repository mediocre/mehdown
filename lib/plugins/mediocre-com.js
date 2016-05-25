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
                var matches = uri.href.match(/https?:\/\/(?:www\.)?mediocre\.com\/(deals|polls)\/([-\w]+)/);

                if (matches && matches[1] && matches[2]) {
                    var embedUrl = 'https://mediocre.com/' + matches.slice(1).join('/') + '/embed';

                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    return '<iframe class="' + matches[1] + '" frameborder="0" scrolling="no" src="' + embedUrl + '"></iframe>';
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
