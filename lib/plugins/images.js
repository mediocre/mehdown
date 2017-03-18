const url = require('url');

const imageFileExtensions = ['gif', 'jpeg', 'jpg', 'png'];

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var nextToken = tokens[idx + 1];

            if (nextToken && nextToken.content) {
                var content = nextToken.content;

                var uri = url.parse(token.attrs[hrefIndex][1]);
                var imageUri = url.parse(content);

                if (imageUri && imageUri.pathname) {
                    var filename = imageUri.pathname.split('/').pop();
                    var extension = filename.toLowerCase().split('.').pop();

                    if (extension && imageFileExtensions.indexOf(extension) !== -1) {
                        tokens[idx + 1].content = '';
                        tokens[idx + 2].hidden = true;

                        // user wants the image to render as a link to something other than the image's source
                        if (uri.href !== imageUri.href) {
                          return `<a href="${uri.href}" target="_blank"><img src="${imageUri.href}" /></a>`;
                        } else {
                          // will render the image as a link to the image's source
                          return `<a href="${imageUri.href}" target="_blank"><img src="${imageUri.href}" /></a>`;
                        }
                    }
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
