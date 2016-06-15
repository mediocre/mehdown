const regExp = /(?:https?:\/\/(?:www\.)?)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i;

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

                    if (matches && matches[1] && matches[3]) {
                        var username = matches[1];
                        var status = matches[3];

                        textToken.content = '';
                        tokens[idx + 2].hidden = true;

                        return `<blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/${username}/status/${status}"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
