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
                // http://stackoverflow.com/questions/4138483/twitter-status-url-regex
                var matches = uri.href.match(/https?:\/\/(?:www\.)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)/);

                if (matches && matches[1] && matches[3]) {
                    var username = matches[1];
                    var status = matches[3];

                    textToken.content = '';
                    tokens[idx + 2].hidden = true;

                    return `<blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/${username}/status/${status}"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
