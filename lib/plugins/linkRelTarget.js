module.exports = function(md, args) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var baseUrl = (args && args.baseUrl) || (options && options.baseUrl);

        if (baseUrl) {
            var token = tokens[idx];
            var hrefIndex = token.attrIndex('href');

            if (hrefIndex !== -1) {
                var domain = baseUrl.substring(baseUrl.indexOf('//') + 2);

                var href = token.attrs[hrefIndex][1];
                href = href.substring(href.indexOf('//') > 0 ? href.indexOf('//') + 2 : 0);

                var isLocal = href.indexOf('href="/') === 0 || href.indexOf(domain) === 0;

                if (!isLocal) {
                    var relIndex = token.attrIndex('rel');

                    if (relIndex === -1) {
                        token.attrPush(['rel', 'nofollow']);
                    } else {
                        token.attrs[relIndex][1] = 'nofollow';
                    }

                    var targetIndex = token.attrIndex('target');

                    if (targetIndex === -1) {
                        token.attrPush(['target', '_blank']);
                    } else {
                        token.attrs[targetIndex][1] = '_blank';
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
