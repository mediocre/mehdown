const async = require('async');
const MarkdownIt = require('markdown-it');

const commandRegExp = /^\/(\w+)\s?/;

const commands = {
    shrug: function(markdown, args, callback) {
        callback(null, `${markdown}\n\`¯\\_(ツ)_/¯\``);
    }
};

exports.render = function(markdown, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {
            commands: true
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
        function markdownIt(callback) {
            var md = new MarkdownIt({
                baseUrl: options.baseUrl,
                breaks: true,
                linkify: true,
                typographer: true,
                xhtmlOut: true
            });

            md.linkify.add('@', require('./plugins/usernames'));
            md.linkify.baseUrl = options.baseUrl;

            md.use(require('./plugins/anchors'), { suffix: options.id });
            md.use(require('./plugins/images'));
            md.use(require('./plugins/imgur'));
            md.use(require('./plugins/kickstarter'));
            md.use(require('./plugins/linkRelTarget'));
            md.use(require('./plugins/reddit'));
            md.use(require('./plugins/soundcloud'));
            md.use(require('./plugins/twitter'));
            md.use(require('./plugins/vimeo'));
            md.use(require('./plugins/vine'));
            md.use(require('./plugins/youtube'));

            html = md.render(markdown);
            html = html.trim();
            callback();
        }
    ], function(err) {
        if (err) {
            return callback(err);
        }

        callback(null, html);
    });
};

// Examples of what this will match: http://jsbin.com/eqocuh/552/edit
exports.urlRegExp = /((?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+|(?:[A-Za-z0-9\.\-]+\.(?:com|org|net|gov|edu|co\.uk|io|horse|rodeo)))(?:(?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)(?:#?[\b\w\/!]+)(?:[\-\.\!\/\w]*))?)/g;

exports.usernameRegExp = /(^|[^@\w])@(\w{1,15})\b/g;
