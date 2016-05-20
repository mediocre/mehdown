const emojione = require('emojione');

module.exports = function(md, opts) {
    opts = opts || {};

    var defaultRender = md.renderer.rules.text || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.text = function(tokens, idx, options) {
        var token = tokens[idx];
        var previousToken = tokens[idx - 1];

        // Ensure previous token isn't a link with the same href as the text
        if (previousToken) {
            var hrefIndex = previousToken.attrIndex('href');

            if (hrefIndex !== -1 && previousToken.attrs[hrefIndex][1] === token.content) {
                return defaultRender(tokens, idx, options);
            }
        }

        emojione.ascii = true;
        emojione.imagePathPNG = opts.imagePathPNG || 'https://cdn.jsdelivr.net/emojione/assets/png/';
        emojione.unicodeAlt = false;

        return emojione.toImage(token.content).replace(/class="emojione" alt="/g, 'class="emojione" title="');
    };
};
