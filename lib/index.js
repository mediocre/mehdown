const url = require('url');

const async = require('async');
const cowsay = require('cowsay');
const httpImageSize = require('http-image-size');
const MarkdownIt = require('markdown-it');
const parseArgs = require('minimist');
const request = require('request');
const shellQuote = require('shell-quote');
const youtubeSearch = require('youtube-search');

const commandRegExp = /^\/(\w+)[ ]*(.*)/gim;
const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function _cowsay(command, args, callback) {
    // This command requires arguments.
    if (!args) {
        return callback();
    }

    var argv = parseArgs(shellQuote.parse(args), {
        alias: { h: 'help' },
        boolean: ['b', 'd', 'g', 'p', 's', 't', 'w', 'y', 'h', 'l']
    });

    argv._ = argv._.filter(a => typeof a === 'string');

    if (argv.h) {
        var help = `Usage: /${command} [-e eye_string] [-f cowfile] [-h] [-l] [-T tongue_string] [-bdgpstwy] "text"\n\n`;
        help += 'If any arguments are left over after all switches have been processed, they become the cow′s message.\n\n';
        help += 'If the command is invoked as /cowthink then the cow will think its message instead of saying it.\n\n';
        help += 'Options:\n';
        help += '  -b  "Borg", uses == for the cow′s eyes.\n';
        help += '  -d  "Dead", uses XX, plus a descending U to represent an extruded tongue.\n';
        help += '  -g  "Greedy", uses $$ for the cow′s eyes.\n';
        help += '  -p  "Paranoid", uses @@ for the cow′s eyes.\n';
        help += '  -s  "Stoned", uses ** to represent bloodshot eyes, plus a descending U to represent an extruded tongue.\n';
        help += '  -t  "Tired", uses -- for the cow′s eyes.\n';
        help += '  -w  "Wired", uses OO for the cow′s eyes.\n';
        help += '  -y  "Youthful", uses .. to represent smaller eyes.\n';
        help += '  -e  Manually specifies the cow′s eye-type. [default: "oo"]\n';
        help += '  -T  Manually specifies the cow′s tongue shape. [default: "  "]\n';
        help += '  -h  Display this help message.\n';
        help += '  -f  Specifies a cow picture file ("cowfile") to use. [default: "default"]\n';
        help += '  -l  List all cowfiles available.\n';

        return callback(null, `/${command} ${args}\n~~~\n${help}\n~~~`);
    } else if (argv.l) {
        return cowsay.list(function(err, cows) {
            if (err) {
                return callback();
            }

            callback(null, `/${command} ${args}\n~~~\n${cows.join(' ')}\n~~~`);
        });
    }

    // Don't allow disabling word-wrapping
    delete argv.n;

    // A reply on mobile can only fit 32 characters
    argv.W = 32;

    var result;

    try {
        result = command === 'cowthink' ? cowsay.think(argv) : cowsay.say(argv);
        result = `~~~\n${result}\n~~~`;
    } catch(e) {
        // eslint-disable-line
    }

    callback(null, result);
}

const commands = {
    cowsay: function(args, callback) {
        _cowsay('cowsay', args, callback);
    },
    cowthink: function(args, callback) {
        _cowsay('cowthink', args, callback);
    },
    giphy: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        request.get(`http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(args)}&api_key=${process.env.GIPHY_APIKEY || 'dc6zaTOxFJmzC'}`, { json: true }, function(err, res, body) {
            if (err) {
                return callback();
            }

            if (!body || !body.data || !body.data.length) {
                return callback();
            }

            // Grab a random image
            var gif = body.data[Math.floor(Math.random() * body.data.length)];

            callback(null, `/giphy ${args}\n${gif.images.original.url}`);
        });
    },
    image: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        request.get(`https://www.googleapis.com/customsearch/v1?cx=001016559301879871327:usuoorwmjkw&key=${process.env.GOOGLE_API_KEY}&q=${encodeURIComponent(args)}&safe=high&searchType=image`, { json: true }, function(err, res, body) {
            if (err) {
                return callback();
            }

            if (!body || !body.items || !body.items.length || !body.items[0] || !body.items[0].link) {
                return callback();
            }

            callback(null, `/image ${args}\n${body.items[0].link}`);
        });
    },
    shrug: function(args, callback) {
        callback(null, '¯\\\\\\\_(ツ)\\\_/¯');
    },
    youtube: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        if (!process.env.GOOGLE_API_KEY) {
            console.warn('GOOGLE_API_KEY environment variable is not set');
            return callback();
        }

        youtubeSearch(args, { key: process.env.GOOGLE_API_KEY, type: 'video' }, function(err, results) {
            if (err) {
                return callback();
            }

            if (!results || !results.length) {
                return callback();
            }

            callback(null, `/youtube ${args}\n${results[0].link}`);
        });
    }
};

exports.bbcode = {
    toMarkdown: function(bbcode) {
        var markdown = bbcode;

        // [b]
        markdown = markdown.replace(/\[b\]((?:.|\n)+?)\[\/b\]/gmi, '**$1**');

        // [code]
        markdown = markdown.replace(/\[code\]((?:.|\n)+?)\[\/code\]/gmi, '```\n$1\n```');

        // [i]
        markdown = markdown.replace(/\[i\]((?:.|\n)+?)\[\/i\]/gmi, '*$1*');

        // [img]
        markdown = markdown.replace(/\[img\]((?:.|\n)+?)\[\/img\]/gmi,'![]($1)');

        // [quote]
        markdown = markdown.replace(/\[quote=@?(.+?)\]([\s\S]*?)\[\/quote\]/gmi, '> @$1 wrote: $2');
        markdown = markdown.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gmi, '> $1');

        // [s]
        markdown = markdown.replace(/\[s\]((?:.|\n)+?)\[\/s\]/gmi, '~~$1~~');

        // [url]
        markdown = markdown.replace(/\[url=(.+?)\]((?:.|\n)+?)\[\/url\]/gmi,'[$2]($1)');
        markdown = markdown.replace(/\[url\]((?:.|\n)+?)\[\/url\]/gmi,'[$1]($1)');

        // [youtube]
        markdown = markdown.replace(/\[youtube\]((?:.|\n)+?)\[\/youtube\]/gmi, 'http://www.youtube.com/watch?v=$1');

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

            // Check for /commands
            var commandMatches = markdown.match(commandRegExp);

            // If there aren't any /commands, return.
            if (!commandMatches || !commandMatches.length) {
                return callback();
            }

            var commandIndex = 0;

            var lines = markdown.split(/\n/gmi).map(l => {
                var isCommand = new RegExp(commandRegExp.source, 'gim').test(l);

                return {
                    commandIndex: isCommand ? commandIndex++ : -1,
                    markdown: l
                };
            });

            async.forEachOf(commandMatches, function(commandMatch, index, callback) {
                var tokens = new RegExp(commandRegExp.source, 'gim').exec(commandMatch);

                // The command's name is captured in the first match.
                var commandName = tokens[1];
                var command = commands[commandName.toLowerCase()];

                // If the /command isn't supported, return.
                if (!command) {
                    return callback();
                }

                // Get the command's arguments.
                var args = tokens[2];

                // Execute the /command
                command(args, (err, result) => {
                    if (err) {
                        return callback(err);
                    }

                    if (result) {
                        var line = lines.find(l => l.commandIndex === index);
                        var replace = `/${commandName}`;

                        if (args) {
                            replace += ` ${args}`;
                        }

                        line.markdown = line.markdown.replace(replace, result);
                    }

                    callback();
                });
            }, function() {
                markdown = lines.map(l => l.markdown).join('\n');
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
