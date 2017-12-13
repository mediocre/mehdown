const querystring = require('querystring');
const url = require('url');

const async = require('async');
const cheerio = require('cheerio');
const mehdown = require('../index');
const request = require('request');

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
                        const myURL = url.parse(href);

                        if (myURL.host && myURL.host.endsWith('.woot.com') && myURL.pathname.toLowerCase() === '/forums/viewpost.aspx') {
                            const query = querystring.parse(myURL.query.toLowerCase());

                            if (query.postid) {
                                textToken.content = '';
                                tokens[idx + 2].hidden = true;

                                return `<a class="woot-embed" href="${href}">${href}</a>`;
                            }
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
        aElements = aElements.filter((value, index, array) => array.indexOf(value) === index);

        async.each(aElements, function(aElement, callback){
            var _class = mehdown.html.getAttributeValue(aElement, 'class');
            var href = mehdown.html.getAttributeValue(aElement, 'href');

            if (!_class || !href || _class !== 'woot-embed') {
                return callback();
            }

            request.get(href, function(err, res, body) {
                if (err) {
                    return callback(err);
                }

                const myURL = url.parse(href);
                const query = querystring.parse(myURL.query.toLowerCase());

                var postId = query.postid;

                if (myURL.hash && myURL.hash.startsWith('#post')) {
                    postId = myURL.hash.replace('#post', '');
                }

                const $html = cheerio.load(body);
                const navElement = $html('#breadcrumbs');
                const postElement = $html(`#post${postId}`);

                var embedHtml = $html.html(navElement);
                embedHtml += $html.html(postElement);

                // Open links in new window
                embedHtml = embedHtml.replace(/href=/g, 'target="_blank" href=');

                // Replace relative URLs with absolute URLs
                embedHtml = embedHtml.replace(/href="\//g, `href="https://${myURL.host}/`);
                embedHtml = embedHtml.replace(/href="(?!http)/g, `href="https://${myURL.host}/`);

                // Replace IDs with classes
                embedHtml = embedHtml.replace(/id=/g, 'class=');

                // Replace title tags
                embedHtml = embedHtml.replace(/title=/g, 'data-title=');

                html = html.split(`<a class="woot-embed" href="${href}">${href}</a>`).join(`<div class="woot-embed">${embedHtml}</div>`);
                callback();
            });
        }, function() {
            callback(null, html);
        });
    }
};
