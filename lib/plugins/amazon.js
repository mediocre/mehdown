const regExp = /https?:\/\/(?:[a-z0-9-]+\.)?amazon\.com(?:\/[^\s]*)?(?=\s|$)/i;

module.exports = function(md) {
    const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        const openToken = tokens[idx];
        const hrefIndex = openToken.attrIndex('href');

        // Ensure we have an "href" attribute
        if (hrefIndex !== -1) {
            const href = openToken.attrs[hrefIndex][1];

            // Ensure we have an "href" attribute value that matches the Amazon URL pattern
            if (href && regExp.test(href)) {
                const url = new URL(href);

                if (!url.searchParams.has('tag')) {
                    url.searchParams.set('tag', 'mehdown-20');
                    openToken.attrs[hrefIndex][1] = url.toString();
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};