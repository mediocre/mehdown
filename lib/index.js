const url = require('url');

const async = require('async');
const bbcodeToMarkdown = require('nodebb-plugin-bbcode-to-markdown');
const httpImageSize = require('http-image-size');
const MarkdownIt = require('markdown-it');
const request = require('request');

const commandRegExp = /^\/(\w+)\s?/;
const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const commands = {
    giphy: function(markdown, args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback(null, markdown);
        }

        request.get(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(args)}&api_key=${process.env.GIPHY_APIKEY || 'dc6zaTOxFJmzC'}`, { json: true }, function(err, res, body) {
            if (err) {
                return callback();
            }

            if (!body || !body.data.length) {
                return callback();
            }

            // Grab a random image
            var gif = body.data[Math.floor(Math.random() * body.data.length)];

            callback(null, `${markdown}\n${gif.images.original.url}`);
        });
    },
    shrug: function(markdown, args, callback) {
        callback(null, `${markdown}\n\`¯\\_(ツ)_/¯\``);
    }
};

exports.bbcode = {
    toMarkdown: function(bbcode) {
        var markdown = bbcode;

        // [b]
        markdown = markdown.replace(/\[b\]((?:.|\n)+?)\[\/b\]/gmi, '**$1**');

        // [i]
        markdown = markdown.replace(/\[i\]((?:.|\n)+?)\[\/i\]/gmi, '*$1*');

        // [img]
        markdown = markdown.replace(/\[img\]((?:.|\n)+?)\[\/img\]/gmi,'![]($1)');

        // [quote]
        markdown = markdown.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gmi, '> $1');

        // [s]
        markdown = markdown.replace(/\[s\]((?:.|\n)+?)\[\/s\]/gmi, '~~$1~~');

        // [url]
        markdown = markdown.replace(/\[url=(.+?)\]((?:.|\n)+?)\[\/url\]/gmi,'[$2]($1)');

        return markdown;
    }
};

exports.html = {
    convertToLazyLoadedImages: function(html) {
        var imgElements = exports.html.getElementsByTagName(html, 'img');

        if (!imgElements || !imgElements.length) {
            return html;
        }

        // De-duplicate
        imgElements = imgElements.filter(function(value, index, array) { return array.indexOf(value) === index; });

        imgElements.forEach(function(imgElement) {
            var height = exports.html.getAttributeValue(imgElement, 'height');
            var src = exports.html.getAttributeValue(imgElement, 'src');
            var width = exports.html.getAttributeValue(imgElement, 'width');

            // Only convert src to lazy loaded images if the img tag has height, src, and width attributes
            if (!height || !src || !width) {
                return;
            }

            var lazyLoadImgElement = imgElement.replace('height="', 'data-height="').replace('width="', 'data-width="');
            lazyLoadImgElement = lazyLoadImgElement.replace('src="', 'src="' + emptyImage + '" data-src="');

            // Global string replace: http://stackoverflow.com/questions/4371565/can-you-create-javascript-regexes-on-the-fly-using-string-variables
            html = html.split(imgElement).join(lazyLoadImgElement);
        });

        return html;
    },
    getAttributeValue: function(html, attribute) {
        var matches = html.match(new RegExp(attribute + '="([^"]+)'));

        if (!matches) {
            return;
        }

        return matches[1];
    },
    getElementsByTagName: function(html, tag) {
        return html.match(new RegExp('<' + tag + '[^>]*>', 'gi'));
    }
};

exports.render = function(markdown, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {
            commands: true,
            detectImageSizes: false
        };
    }

    var html = markdown;

    async.series([
        function _commands(callback) {
            if (!markdown) {
                return callback();
            }

            if (!options.commands) {
                return callback();
            }

            // Check for a /command.
            var matches = markdown.match(commandRegExp);

            // If there isn't a /command, return.
            if (!matches) {
                return callback();
            }

            // The command's name is captured in the first match.
            var command = matches[1];

            // If the /command isn't supported, return.
            if (!commands[command]) {
                return callback();
            }

            // Get the command's arguments.
            var args = markdown.replace(commandRegExp, '').trim();

            // Execute the /command
            commands[command](markdown, args, (err, _markdown) => {
                if (err) {
                    return callback(err);
                }

                if (_markdown) {
                    markdown = _markdown;
                }

                callback();
            });
        },
        function _bbcode(callback) {
            markdown = exports.bbcode.toMarkdown(markdown);
            callback();
        },
        function _markdown(callback) {
            var md = new MarkdownIt({
                baseUrl: options.baseUrl,
                breaks: true,
                linkify: true,
                typographer: true,
                xhtmlOut: true
            });

            md.linkify.add('@', require('./plugins/usernames'));
            md.linkify.baseUrl = options.baseUrl;
            md.linkify.tlds('horse', true);

            md.use(require('./plugins/anchors'), { suffix: options.id });
            md.use(require('./plugins/drone-horse'));
            md.use(require('./plugins/emoji'), options.emoji);
            md.use(require('./plugins/images'));
            md.use(require('./plugins/imgur'));
            md.use(require('./plugins/kickstarter'));
            md.use(require('./plugins/linkRelTarget'));
            md.use(require('./plugins/mediocre-com'));
            md.use(require('./plugins/meh-com'));
            md.use(require('./plugins/reddit'));
            md.use(require('./plugins/soundcloud'));
            md.use(require('./plugins/twitter'));
            md.use(require('./plugins/vimeo'));
            md.use(require('./plugins/vine'));
            md.use(require('./plugins/youtube'));

            html = md.render(markdown);
            html = html.trim();
            callback();
        },
        function _imageSizes(callback) {
            if (!options.detectImageSizes) {
                return callback();
            }

            var imgElements = exports.html.getElementsByTagName(html, 'img');

            if (!imgElements || !imgElements.length) {
                return callback();
            }

            // De-duplicate
            imgElements = imgElements.filter(function(value, index, array) { return array.indexOf(value) === index; });

            async.each(imgElements, function(imgElement, callback) {
                var src = exports.html.getAttributeValue(imgElement, 'src');

                if (!src) {
                    return callback();
                }

                var url = src;

                if (url.startsWith('//')) {
                    url = 'https:' + url;
                }

                httpImageSize(url, function(err, dimensions) {
                    if (err || !dimensions) {
                        return callback();
                    }

                    var attributes = 'src="' + src + '"';

                    if (dimensions.height) {
                        attributes = 'height="' + dimensions.height + '" ' + attributes;
                    }

                    if (dimensions.width) {
                        attributes = attributes + ' width="' + dimensions.width + '"';
                    }

                    // Global string replace: http://stackoverflow.com/questions/4371565/can-you-create-javascript-regexes-on-the-fly-using-string-variables
                    html = html.split('src="' + src + '"').join(attributes);

                    callback();
                });
            }, function() {
                callback();
            });
        }
    ], function(err) {
        if (err) {
            return callback(err);
        }

        callback(null, html);
    });
};

exports.usernameRegExp = /(^|[^@\w])@(\w{1,15})\b/g;

exports.youTubeEmbedHtml = function(urlStr) {
    if (!urlStr) {
        return '';
    }

    var uri = url.parse(urlStr, true);

    if (!uri) {
        return '';
    }

    // http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
    var matches = uri.href.match(/https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((\w|-){11})(?:\S+)?/);

    if (!matches || !matches[1]) {
        return '';
    }

    var embedUrl = `https://www.youtube.com/embed/${matches[1]}?autohide=1&color=white&showinfo=0&theme=light`;

    if (uri.query.end) {
        embedUrl += `&end=${uri.query.end}`;
    }

    if (uri.query.start) {
        embedUrl += `&start=${uri.query.start}`;
    }

    return `<iframe allowfullscreen class="youtube" frameborder="0" src="${embedUrl}"></iframe>`;
};
