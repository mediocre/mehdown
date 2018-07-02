const util = require('util');

const async = require('async');
const mehdown = require('../index');
const metascraper = require('metascraper');
const request = require('request');

const _metascraper = util.callbackify(metascraper);

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
                    if (textToken && textToken.content && textToken.content === href) {
                        var unfurlAttributeIndex = openToken.attrIndex('unfurl');

                        if (unfurlAttributeIndex === -1) {
                            openToken.attrPush(['unfurl', 'true']);
                        } else {
                            openToken.attrs[unfurlAttributeIndex][1] = 'true';
                        }
                    }
                }
            }

            return defaultRender(tokens, idx, options, env, self);
        };
    },
    postMarkdown: function(html, callback) {
        let aElements = mehdown.html.getElementsByTagName(html, 'a');

        if (!aElements || !aElements.length) {
            return callback();
        }

        // De-duplicate
        aElements = aElements.filter((value, index, array) => array.indexOf(value) === index);

        async.each(aElements, function(aElement, callback){
            let unfurl = mehdown.html.getAttributeValue(aElement, 'unfurl');

            if (!unfurl || unfurl !== 'true') {
                return callback();
            }

            let href = mehdown.html.getAttributeValue(aElement, 'href');

            async.retry(function(callback) {
                request.get(href, function(err, res, body) {
                    if (err) {
                        return callback(err);
                    }

                    if (res.statusCode !== 200) {
                        return callback(new Error(`${res.statusCode} ${res.request.method} ${res.request.href}`));
                    }

                    if (!res.headers['content-type'] || !res.headers['content-type'].toLowerCase().includes('text/html')) {
                        return callback();
                    }

                    callback(null, body);
                });
            }, function(err, body) {
                // Remove the unfurl attribute
                html = html.split(`${aElement}${href}</a>`).join(`${aElement.replace(' unfurl="true"', '')}${href}</a>`);

                // Silently fail
                if (err) {
                    return callback();
                }

                _metascraper({ html: body, url: href }, function(err) {
                    // Silently fail
                    if (err) {
                        return callback();
                    }

                    var unfurlHtml = `<div class="unfurl"><a href="${href}"></a></div>`;

                    html += unfurlHtml;
                    callback();
                });
            });
        }, function() {
            callback(null, html);
        });
    }
};
