const url = require('url');

const videoFileExtensions = ['mp4', 'webm'];

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var nextToken = tokens[idx + 1];
            var uri = url.parse(token.attrs[hrefIndex][1]);

            if (nextToken && nextToken.content === decodeURI(uri.href)) {
                if (uri && uri.pathname) {
                    var filename = uri.pathname.split('/').pop();
                    var extension = filename.toLowerCase().split('.').pop();

                    if (extension && videoFileExtensions.indexOf(extension) !== -1) {
                        tokens[idx + 1].content = '';
                        tokens[idx + 2].hidden = true;

                        return `<video controls src="${uri.href}"></video>`;
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
