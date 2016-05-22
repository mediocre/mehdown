const emojione = require('emojione');

const mehdown = require('../index');

const emojioneRegExp = /(<img class="emojione".*?>)/g;

module.exports = function(md, opts) {
    opts = opts || {};

    md.core.ruler.push('emoji', function(state) {
        state.tokens.filter(t => t.type === 'inline').forEach(token => {
            for (var i = token.children.length - 1; i >= 0; i--) {
                var childToken = token.children[i];
                var previousToken = token.children[i - 1];

                // Ensure parent token isn't a link with the same href as the text
                if (previousToken && previousToken.tag === 'a') {
                    var hrefIndex = previousToken.attrIndex('href');

                    if (hrefIndex !== -1 && previousToken.attrs[hrefIndex][1] === childToken.content) {
                        continue;
                    }
                }

                if (childToken.type === 'text') {
                    emojione.ascii = true;
                    emojione.imagePathPNG = opts.imagePathPNG || 'https://cdn.jsdelivr.net/emojione/assets/png/';
                    emojione.unicodeAlt = false;

                    var emojiHtml = emojione.toImage(childToken.content);

                    if (childToken.content === emojiHtml) {
                        continue;
                    }

                    var _tokens = emojiHtml.split(emojioneRegExp);

                    _tokens = _tokens.map(t => {
                        if (t.match(emojioneRegExp)) {
                            var _token = new state.Token('image', 'img', 0);
                            _token.children = [];

                            _token.attrs = [
                                ['alt', mehdown.html.getAttributeValue(t, 'alt')],
                                ['class', 'emojione'],
                                ['src', mehdown.html.getAttributeValue(t, 'src')],
                                ['title', mehdown.html.getAttributeValue(t, 'alt')]
                            ];

                            return _token;
                        }

                        _token = new state.Token('text', '', 0);
                        _token.content = t;
                        return _token;
                    });

                    token.children = md.utils.arrayReplaceAt(token.children, i, _tokens);
                }
            }
        });
    });
};
