const regExp = /(?:https?:\/\/(?:.\.)?)?(?:kaltura\.com\/).*(?:\/partner_id\/)(\w+).*(?:\/uiconf_id\/)(\w+).*(?:\/entry_id\/)(\w+)(?:.*#t=(.*))?/i;

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

                    if (matches && matches[1]) {
                        var partner_id = matches[1];
                        var uiconf_id = matches[2];
                        var entry_id = matches[3];

                        textToken.content = '';
                        tokens[idx + 2].hidden = true;

                        return `<iframe allowfullscreen class="kaltura" frameborder="0" src="https://cdnapisec.kaltura.com/p/${partner_id}/embedIframeJs/uiconf_id/${uiconf_id}?iframeembed=true&entry_id=${entry_id}"></iframe>`;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
