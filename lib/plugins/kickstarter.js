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
                // http://stackoverflow.com/questions/4138483/twitter-status-url-regex
                var matches = uri.href.match(/https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*/);

                if (matches && matches[1] && matches[2]) {
                    var id = matches[1];
                    var slug = matches[2];

                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe class="kickstarter" frameborder="0" scrolling="no" src="https://www.kickstarter.com/projects/${id}/${slug}/widget/card.html"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
