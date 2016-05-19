const imageFileExtensions = ['gif', 'jpeg', 'jpg', 'png'];

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var href = token.attrs[hrefIndex][1];
            var filename = href.split('/').pop().replace(/\#(.*?)$/, '').replace(/\?(.*?)$/, '');

            if (imageFileExtensions.indexOf(filename.split('.')[1]) !== -1) {
                tokens[idx + 1].content = '';
                tokens[idx + 2].hidden = true;
                return `<img src="${href}" />`;
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
