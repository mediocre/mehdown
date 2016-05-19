const url = require('url');

module.exports = function(md) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        var token = tokens[idx];
        var hrefIndex = token.attrIndex('href');

        if (hrefIndex !== -1) {
            var uri = url.parse(token.attrs[hrefIndex][1]);

            if (uri && uri.pathname) {
                var filename = uri.pathname.split('/').pop();
                var extension = filename.toLowerCase().split('.')[1];

                if (extension === 'gifv') {
                    tokens[idx + 1].content = '';
                    tokens[idx + 2].hidden = true;

                    var matches = uri.href.match(/https?:\/\/(?:i\.)?(?:imgur\.com\/)(\w+)\.gifv/);
                    var id = matches[1];

                    return `<div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/${id}.webm" /><source type="video/mp4" src="https://i.imgur.com/${id}.mp4" /></video></div>`;
                }
            }
        }

        return defaultRender(tokens, idx, options, env, self);
    };
};
