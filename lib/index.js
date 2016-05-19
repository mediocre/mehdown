const MarkdownIt = require('markdown-it');

exports.render = function(markdown, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    var md = new MarkdownIt({
        baseUrl: options.baseUrl,
        breaks: true,
        linkify: true,
        typographer: true,
        xhtmlOut: true
    });

    md.use(require('./plugins/linkRelTarget'));
    md.use(require('./plugins/images'));

    var html = md.render(markdown);
    html = html.trim();

    callback(null, html);
};

// Examples of what this will match: http://jsbin.com/eqocuh/552/edit
exports.urlRegExp = /((?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+|(?:[A-Za-z0-9\.\-]+\.(?:com|org|net|gov|edu|co\.uk|io|horse|rodeo)))(?:(?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)(?:#?[\b\w\/!]+)(?:[\-\.\!\/\w]*))?)/g;

exports.usernameRegExp = /(^|[^@\w])@(\w{1,15})\b/g;
