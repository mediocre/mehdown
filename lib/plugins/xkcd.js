const async = require('async');
const mehdown = require('../index');
const request = require('request');

const regExp = /(?:(?:https?:)?\/\/(?:www\.)?)?(?:xkcd\.com\/\d+\/?)$/i;

module.exports = {
    markdown: function(md) {
      var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options);
      };

      md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
          var openToken = tokens[idx];
          var hrefIndex = openToken.attrIndex('href');

          // Ensure we have an "href" attribute
          if (hrefIndex !== -1) {
              var href = openToken.attrs[hrefIndex][1];

              // Ensure we have an "href" attribute value
              if (href) {
                  var textToken = tokens[idx + 1];

                  // Ensure we have a text token and the text matches the URL pattern instead of [text](http://example.com/)
                  if (textToken && textToken.content && regExp.test(textToken.content)) {
                      var matches = href.match(regExp);

                      if (matches) {
                          var xkcd = matches[0];

                          textToken.content = '';
                          tokens[idx + 2].hidden = true;

                          return `<a class="xkcd-embed" href="${xkcd}">${xkcd}</a>`;
                      }
                  }
              }
          }

          return defaultRender(tokens, idx, options, env, self);
      };
    },

    postMarkdown: function(html, callback) {
        var aElements = mehdown.html.getElementsByTagName(html, 'a');

        if (!aElements || !aElements.length) {
            return callback();
        }

        // De-duplicate
        aElements = aElements.filter(function(value, index, array) { return array.indexOf(value) === index; });

        async.each(aElements, function(aElement, callback){
            var _class = mehdown.html.getAttributeValue(aElement, 'class');
            var href = mehdown.html.getAttributeValue(aElement, 'href');

            if (!_class || !href || _class !== 'xkcd-embed') {
                return callback();
            }

            var oEmbedReq = `http://noembed.com/embed?url=${href.replace(/^(?:https:)?\/\//, 'http://')}`;

            request.get(oEmbedReq, { json: true }, function(err, res, body) {
                if (err) {
                    return callback(err);
                }

                var imgTag = body.html;
                var imgSrc = mehdown.html.getAttributeValue(imgTag, 'src').replace('noembed.com/i///', '');
                var imgTitle = mehdown.html.getAttributeValue(imgTag, 'title');

                html = html.split(`<a class="xkcd-embed" href="${href}">${href}</a>`).join(`<a class="xkcd-embed" href="${href}"><img src="${imgSrc}" title="${imgTitle}" /></a>`);
                callback();
            });
        }, function() {
            callback(null, html);
        });
    }
};
