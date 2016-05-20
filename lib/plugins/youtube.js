const url = require('url');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var uri = url.parse(token.attrs[hrefIndex][1], true);

            if (uri) {
                // http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
                var matches = uri.href.match(/https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((\w|-){11})(?:\S+)?/);

                if (matches && matches[1]) {
                    var id = matches[1];
                    var embedUrl = `https://www.youtube.com/embed/${id}?autohide=1&color=white&showinfo=0&theme=light`;

                    if (uri.query.end) {
                        embedUrl += `&end=${uri.query.end}`;
                    }

                    if (uri.query.start) {
                        embedUrl += `&start=${uri.query.start}`;
                    }

                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    return `<iframe allowfullscreen class="youtube" frameborder="0" src="${embedUrl}"></iframe>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
