const slug = require('slug');

module.exports = function(md, opts) {
    md.core.ruler.push('anchor', function(state) {
        state.tokens.filter(t => t.type === 'heading_open').forEach(token => {
            var text = state.tokens[state.tokens.indexOf(token) + 1].children.filter(t => t.type === 'text').reduce((acc, t) => acc + t.content, '');

            if (opts && opts.suffix) {
                text += ` ${opts.suffix}`;
            }

            token.attrPush(['id', slug(text, { lower: true })]);
        });
    });
};
