const url = require('url');

const async = require('async');
const captionbot = require('mediocre-captionbot');
const cowsay = require('mehdown-cowsay');
const flip = require('flip');
const httpImageSize = require('http-image-size');
const lolspeak = require('lolspeak');
const MarkdownIt = require('markdown-it');
const natural = require('natural');
const parseArgs = require('minimist');
const request = require('request');
const roll = require('roll');
const shellQuote = require('shell-quote');
const textify = require('textify');
const youtubeSearch = require('youtube-search');

const emoji = require('../data/emoji.json');
const emojiMappings = require('../data/emojiMappings.json');
const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

for (var key in emoji) {
    var _emoji = emoji[key];
    _emoji.stemmedAliases = _emoji.aliases.map(a => natural.PorterStemmer.stem(a.replace(/:/g, '').toLowerCase()));
    _emoji.stemmedKeywords = _emoji.keywords.map(k => natural.PorterStemmer.stem(k.toLowerCase()));
}

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

function _eightball(command, args, callback) {
    const responses = [
        'It is certain',
        'It is decidedly so',
        'Without a doubt',
        'Yes definitely',
        'You may rely on it',
        'As I see it, yes',
        'Most likely',
        'Outlook good',
        'Yes',
        'Signs point to yes',
        'Reply hazy try again',
        'Ask again later',
        'Better not tell you now',
        'Cannot predict now',
        'Concentrate and ask again',
        'Don\'t count on it',
        'My reply is no',
        'My sources say no',
        'Outlook not so good',
        'Very doubtful'
    ];

    callback(null, `/${command} ${args}\n:8ball: ${responses[Math.floor(responses.length * Math.random())]}`);
}

function _leet(args, callback) {
    // This command requires arguments.
    if (!args) {
        return callback();
    }

    callback(null, textify.toLeet(args));
}

const commands = {
    '1337': _leet,
    '8ball': function(args, callback) {
        _eightball('8ball', args, callback);
    },
    captionbot: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        captionbot(args, (err, result) => {
            if (err) {
                return callback();
            }

            callback(null, `/captionbot\n${args}\n:robot: ${result}`);
        });
    },
    coinflip: function(args, callback) {
        const responses = [
            'HEADS it is!',
            'You landed on HEADS!',
            'Flipping..... Flippping..... Flippping...... HEADS!',
            'Your coin bounced off of your shoe and landed on HEADS!',
            'No whammy... No whammy.... HEADS!',
            'After video review, it looks like it is .... HEADS!',
            'TAILS it is!',
            'You landed on TAILS!',
            'Flipping..... Flippping..... Flippping...... TAILS!',
            'Your coin bounced off of your shoe and landed on TAILS!',
            'No whammy... No whammy.... TAILS!',
            'After video review, it looks like it is .... TAILS!',
            'An eagle grabbed your coin out of the air!',
            'Your coin got lost in the grass!'
        ];

        var answer = responses[Math.floor(responses.length * Math.random())];

        if (args) {
            if (args.toLowerCase() === 'heads' || args.toLowerCase() === 'tails') {
                if (answer.toLowerCase().includes('heads') || answer.toLowerCase().includes('tails')) {
                    if (answer.toLowerCase().includes(args.toLowerCase())) {
                        answer += ' YOU WON :thumbsup:';
                    } else {
                        answer += ' YOU LOST :cry:';
                    }
                } else {
                    answer += ' Better luck next time.';
                }
            } else {
                return callback(null, `/coinflip ${args}\n\`heads\` or \`tails\` are your only options here.`);
            }
        }

        callback(null, `/coinflip ${args}\n ${answer}`);
    },
    cowsay: function(args, callback) {
        _cowsay('cowsay', args, callback);
    },
    cowthink: function(args, callback) {
        _cowsay('cowthink', args, callback);
    },
    eightball: function(args, callback) {
        _eightball('eightball', args, callback);
    },
    emojify: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        var tokens = new natural.WordTokenizer().tokenize(args);

        tokens.forEach(t => {
            // Check the static Emoji mappings blacklist
            if (emojiMappings.blacklist.indexOf(t.toLowerCase()) !== -1) {
                return;
            }

            // Check the static Emoji mappings whitelist
            var whitelist = emojiMappings.whitelist[t.toLowerCase()];

            if (whitelist) {
                args = args.replace(new RegExp(`\\b${t}\\b(?!:)`, 'g'), whitelist);
                return;
            }

            var stem = natural.PorterStemmer.stem(t.toLowerCase());

            // Check to see if the word directly matches an Emoji shortname
            for (var key in emoji) {
                var stemmedShortname = natural.PorterStemmer.stem(key.toLowerCase());

                if (stemmedShortname === stem) {
                    args = args.replace(new RegExp(`\\b${t}\\b(?!:)`, 'g'), emoji[key].shortname);
                    return;
                }
            }

            // Check to see if the word matches an Emoji alias
            for (key in emoji) {
                var _emoji = emoji[key];

                if (_emoji.category === 'flags') {
                    continue;
                }

                if (_emoji.stemmedAliases.indexOf(stem) !== -1) {
                    args = args.replace(new RegExp(`\\b${t}\\b(?!:)`, 'g'), emoji[key].shortname);
                    return;
                }
            }

            // Check to see if the word matches an Emoji keyword
            for (key in emoji) {
                _emoji = emoji[key];

                if (_emoji.stemmedKeywords.indexOf(stem) !== -1) {
                    key.split('_').forEach(shortNameToken => {
                        shortNameToken = natural.PorterStemmer.stem(shortNameToken.toLowerCase());

                        if (shortNameToken === stem) {
                            args = args.replace(new RegExp(`\\b${t}\\b(?!:)`, 'g'), emoji[key].shortname);
                            return;
                        }
                    });
                }
            }
        });

        callback(null, args);
    },
    flip: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, flip(args));
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
    google: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        if (!process.env.GOOGLE_API_KEY) {
            console.warn('GOOGLE_API_KEY environment variable is not set');
            return callback();
        }

        request.get(`https://www.googleapis.com/customsearch/v1?cx=001016559301879871327:usuoorwmjkw&key=${process.env.GOOGLE_API_KEY}&q=${encodeURIComponent(args)}&safe=high`, { json: true }, function(err, res, body) {
            if (err) {
                return callback();
            }

            if (!body || !body.items || !body.items.length || !body.items[0] || !body.items[0].link) {
                return callback();
            }

            var item = body.items[0];

            callback(null, `/google ${args}\n${item.title}\n${item.link}`);
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

            callback(null, `/image ${args}\n![$args](${body.items[0].link})`);
        });
    },
    jumble: function(args, callback){
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, textify.texturize(args));
    },
    l33t: _leet,
    leet: _leet,
    lolspeak: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, lolspeak(args));
    },
    piglatin: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, textify.toPigLatin(args));
    },
    reverse: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, textify.reverse(args));
    },
    roll: function(args, callback) {
        const dice = new roll();
        const _args = args;

        var show = args.includes('--show');
        args = args.replace('--show', '');

        if (!args) {
            args = 'd6';
        } else if (args === '--chance' || args === '-c') {
            args = 'd100';
        } else if (args === '--boardgame' || args === '-bg') {
            args = '2d6';
        } else if (args === '--yahtzee' || args === '-y') {
            args = '5d6';
            show = true;
        }

        if (args === '--help' || args === '-h') {
            var help = 'Usage: /roll XdY\n\n';
            help += 'Roll X Y-sided dice\n\n';
            help += 'Examples:\n';
            help += '  `/roll` rolls 1 6-sided die.\n';
            help += '  `/roll d20` rolls 1 20-sided die.\n';
            help += '  `/roll 2d20` rolls 2 20-sided dice.\n';
            help += '  `/roll 2d20+5` rolls 2 20-sided dice and adds 5 to the total.\n';
            help += '  `/roll 6d20b2` only counts the best 2 values of 6 20-sided dice.\n';
            help += '  `/roll 6d20w1` only counts the worst value of 6 20-side dice.\n';
            help += '  `/roll 2d20+5d10` combines rolls of 2 20-sided dice and 5 10-sided dice.\n';
            help += '  `/roll 6d20 --show` rolls 6 20-sided dices and shows the value of each dice.\n';
            help += '  `/roll -bg` Boardgame mode. Rolls 2 6-sided dice.\n';
            help += '  `/roll -c` Chance mode. Rolls 1 100-sided die.\n';
            help += '  `/roll -y` Yahtzee mode. Rolls 5 6-sided dice.\n';

            return callback(null, `/roll ${_args}\n${help}`);
        }

        // Allow use of both H and b for Highest
        args = args.replace('H', 'b');

        // Allow use of both L and w for Lowest
        args = args.replace('L', 'w');

        args = args.trim();

        if (!dice.validate(args)) {
            return callback(null, `/roll ${_args}\nInvalid options. Use \`/roll --help\` for usage examples.`);
        }

        const value = dice.roll(args);

        var message = `/roll ${_args}\n:game_die: You rolled a total of ${value.result}`;

        if (show && value.rolled.length > 1) {
            message += ` using the following ${value.rolled.length} dice: [${value.rolled.join(', ')}]`;
        }

        callback(null, message);
    },
    rot13: function(args, callback) {
        // This command requires arguments.
        if (!args) {
            return callback();
        }

        callback(null, textify.rot13(args));
    },
    shrug: function(args, callback) {
        callback(null, '¯\\\\\\_(ツ)\\_/¯');
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

exports.commandRegExp = /^\/(\w+)[ ]*(.*)/gim;

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

exports.kalturaEmbedHtml = function(urlStr) {
    if (!urlStr) {
        return '';
    }

    var uri = url.parse(urlStr, true);

    if (!uri) {
        return '';
    }

    var matches = uri.href.match(/(?:https?:\/\/(?:.\.)?)?(?:kaltura\.com\/).*(?:\/partner_id\/)(\w+).*(?:\/uiconf_id\/)(\w+).*(?:\/entry_id\/)(\w+)(?:.*#t=(.*))?/i);

    if (!matches || !matches[1] || !matches[2] || !matches[3]) {
        return '';
    }

    var partner_id = matches[1];
    var uiconf_id = matches[2];
    var entry_id = matches[3];

    var embedUrl = `https://cdnapisec.kaltura.com/p/${partner_id}/embedIframeJs/uiconf_id/${uiconf_id}?iframeembed=true&entry_id=${entry_id}`;

    return `<iframe allowfullscreen class="kaltura" frameborder="0" src="${embedUrl}"></iframe>`;
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
            var commandMatches = markdown.match(exports.commandRegExp);

            // If there aren't any /commands, return.
            if (!commandMatches || !commandMatches.length) {
                return callback();
            }

            var commandIndex = 0;

            var lines = markdown.split(/\n/gmi).map(l => {
                var isCommand = new RegExp(exports.commandRegExp.source, 'gim').test(l);

                return {
                    commandIndex: isCommand ? commandIndex++ : -1,
                    markdown: l
                };
            });

            async.forEachOf(commandMatches, function(commandMatch, index, callback) {
                var tokens = new RegExp(exports.commandRegExp.source, 'gim').exec(commandMatch);

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
            md.linkify.tlds('deals', true);

            md.use(require('./plugins/anchors'), { suffix: options.id });
            md.use(require('./plugins/appleMusic'));
            md.use(require('./plugins/emoji'), options.emoji);
            md.use(require('./plugins/facebook-videos'));
            md.use(require('./plugins/images'));
            md.use(require('./plugins/imgur'));
            md.use(require('./plugins/instagram'));
            md.use(require('./plugins/kaltura'));
            md.use(require('./plugins/kickstarter'));
            md.use(require('./plugins/linkRelTarget'));
            md.use(require('./plugins/mediocre-com'));
            md.use(require('./plugins/mediocritee-com'));
            md.use(require('./plugins/meh-com'));
            md.use(require('./plugins/reddit'));
            md.use(require('./plugins/responsiveTables'));
            md.use(require('./plugins/soundcloud'));
            md.use(require('./plugins/twitch'));
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
    var matches = uri.href.match(/(?:https?:\/\/(?:www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((\w|-){11})(?:\S+)?/i);

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
