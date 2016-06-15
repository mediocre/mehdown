const url = require('url');

const regExp = /(?:imgur\.com\/)(\w+)\.gifv/i;

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
                        var filename = uri.pathname.split('/').pop();
                        var extension = filename.toLowerCase().split('.')[1];

                        if (extension === 'gifv') {
                            var matches = href.match(regExp);

                            if (matches && matches[1]) {
                                var id = matches[1];

                                textToken.content = '';
                                tokens[idx + 2].hidden = true;

                                return `<div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/${id}.webm" /><source type="video/mp4" src="https://i.imgur.com/${id}.mp4" /></video></div>`;
                            }
                        }
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
