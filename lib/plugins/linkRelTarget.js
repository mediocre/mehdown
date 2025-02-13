module.exports = function(md, args) {
    const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        const baseUrl = args?.baseUrl || options?.baseUrl;

        if (baseUrl) {
            const token = tokens[idx];
            const hrefIndex = token.attrIndex('href');

            if (hrefIndex !== -1) {
                const domain = baseUrl.substring(baseUrl.indexOf('//') + 2);

                let href = token.attrs[hrefIndex][1];
                href = href.substring(href.indexOf('//') > 0 ? href.indexOf('//') + 2 : 0);

                const isLocal = (href.indexOf('/') === 0 && href.indexOf('//') === -1) || href.indexOf(domain) === 0;

                if (!isLocal) {
                    const relIndex = token.attrIndex('rel');

                    if (relIndex === -1) {
                        token.attrPush(['rel', 'nofollow']);
                    } else {
                        token.attrs[relIndex][1] = 'nofollow';
                    }

                    const targetIndex = token.attrIndex('target');

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