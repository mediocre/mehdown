var Mehdown;

if (typeof exports === 'object' && typeof require === 'function') {
    Mehdown = exports;
    Mehdown.baseUrl = process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:8000' : 'https://mediocre.com';
}
else {
    Mehdown = {};
    Mehdown.baseUrl = window.location.protocol + '//' + window.location.host;
}

Mehdown.usernameRegExp = /(^|[^@\w])@(\w{1,15})\b/g;

// Examples of what this will match: http://jsbin.com/eqocuh/552/edit
Mehdown.urlRegExp = /((?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+|(?:[A-Za-z0-9\.\-]+\.(?:com|org|net|gov|edu|co\.uk|io|horse|rodeo)))(?:(?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)(?:#?[\b\w\/!]+)(?:[\-\.\!\/\w]*))?)/g;

Mehdown.parse = function(text, opts) {
    // Make sure opts is defined
    opts = opts || {};

    text = text.trim();

    // Replace single newlines with <br /> tags: http://stackoverflow.com/questions/18011260/regex-to-match-single-new-line-regex-to-match-double-new-line
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/(^|[^\n])\n(?!\n)/g, '$1<br />');

    // Cleanup line breaks inside <blockquote> elements
    text = text.replace(/<blockquote><br \/>/gi, '<blockquote>');
    text = text.replace(/<br \/><\/blockquote>/gi, '</blockquote>');
    text = text.replace(/<blockquote>([^)]+)<\/blockquote>/gi, function(t) {
        return t.replace(/<br \/>/gi, ' ');
    });

    // Cleanup line breaks around <li> elements
    text = text.replace(/<br \/><li>/g, '<li>');
    text = text.replace(/<\/li><br \/>/g, '</li>');

    // Strikethrough
    text = text.replace(/~~(.*)~~/g, '<s>$1</s>');

    // Any URLs that are not already anchored
    text = text.replace(Mehdown.urlRegExp, function() {
        var url = arguments[1];
        var href = (url.indexOf('http') < 0) ? 'http://' + url : url;
        var preceding = text.substring(0, arguments[2]);
        var insideTagAttrRegex = /<[^\/][^>]+$/g;
        var insideAnchorTagRegex = /<a[^>]*>(?:(?!<\/a>).)*$/g;

        // use the correct protocol if href contains baseUrl domain
        if (href.split('/')[2] === Mehdown.baseUrl.split('/')[2] && href.split(':')[0] !== Mehdown.baseUrl.split(':')[0]) {
            href = Mehdown.baseUrl.split('://')[0] + '://' + href.replace(/^https?:\/\//, '');
        }

        // inside tag attr or anchor tag, abort
        if (insideTagAttrRegex.test(preceding) || insideAnchorTagRegex.test(preceding)) {
            return url;
        }

        // don't use http protocol on email adresses
        if (url.indexOf('@') >= 0 && !url.split('@')[0].match(Mehdown.urlRegExp)) {
            if (url.split('@')[1].match(Mehdown.urlRegExp)) {
                href = 'mailto:' + url;
            } else {
                // this is a weird something@something-no-tld that the regex thinks is a url, abort
                return url;
            }
        }

        return '<a href="' + href + '">' + url + '</a>';
    });

    // Usernames
    text = text.replace(Mehdown.usernameRegExp, function() {
        var precedingNonWord = arguments[1];
        var username = arguments[2];
        var preceding = text.substring(0, arguments[3]) + precedingNonWord;
        var insideTagAttrRegex = /<[^\/][^>]+$/g;
        var insideAnchorTagRegex = /<a[^>]*>(?:(?!<\/a>).)*$/g;

        // inside tag attr or anchor tag, abort
        if (insideTagAttrRegex.test(preceding) || insideAnchorTagRegex.test(preceding)) {
            return precedingNonWord + '@' + username;
        }

        return precedingNonWord + Mehdown.username(username);
    });

    // Imgur GIFV: http://imgur.com/blog/2014/10/09/introducing-gifv/
    text = text.replace(/<a href="https?:\/\/(?:i\.)?(?:imgur\.com\/)(\w+)\.gifv">https?:\/\/(?:i\.)?(?:imgur\.com\/)(\w+)\.gifv<\/a>/gi, Mehdown.imgurGifv('$1'));

    // SoundCloud
    text = text.replace(/<a href="(https?:\/\/(?:soundcloud.com|snd.sc)\/.*)">https?:\/\/(?:soundcloud.com|snd.sc)\/.*<\/a>/gi, Mehdown.soundcloud);

    // Twitter Status: http://stackoverflow.com/questions/4138483/twitter-status-url-regex
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)">https?:\/\/(?:www\.)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)<\/a>/gi, Mehdown.twitter('$1', '$3'));

    // Vimeo
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:vimeo\.com\/)?(\d+)">https?:\/\/(?:www\.)?(?:vimeo\.com\/)?(\d+)<\/a>/g, Mehdown.vimeo('$1'));

    // Vine
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:vine\.co\/v\/)?(\w+)">https?:\/\/(?:www\.)?(?:vine\.co\/v\/)?(\w+)<\/a>/g, Mehdown.vine('$1'));

    // YouTube URLs: http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((\w|-){11})(?:\S+)?">https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((\w|-){11})(?:\S+)?<\/a>/g, function(match, p1) {
        return Mehdown.youtube(p1, match);
    });

    // Kickstarter
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*">https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*<\/a>/g, Mehdown.kickstarter('$1', '$2'));

    // Reddit
    text = text.replace(/<a href="(https?:\/\/(?:www\.)reddit\.com\/.*)">https?:\/\/(?:www\.)reddit\.com\/.*<\/a>/gi, Mehdown.reddit);

    // Images
    var imgRegExp = /<a href="(https?:\/\/[-\w%\/\.]+\.(?:jpg|jpeg|gif|png)(?:\?[-\+=&;%@\.\w]+)?)">\1<\/a>/gi;
    text = text.replace(imgRegExp, Mehdown.img('$1'));

    // Anchors
    var anchorRegExp = new RegExp('<a[^>]*>([^<]+)</a>', 'gi');
    text = text.replace(anchorRegExp, Mehdown.anchor);

    var headerRegExp = new RegExp('<h\\d[^>]*>(.+)</h\\d>', 'gi');
    text = text.replace(headerRegExp, Mehdown.header(opts.suffix));

    return text;
};

Mehdown.anchor = function(anchor) {
    var attributes = anchor.match(/([\w\-.:]+)\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+)/gi);
    var href = '';
    var isLocal = false;
    var localDomain = Mehdown.baseUrl.substring(Mehdown.baseUrl.indexOf('//') + 2);

    // Find href attribute
    for (var i = 0; i < attributes.length; i++) {
        if(attributes[i].indexOf('href=') === 0) {
            href = attributes[i];
            break;
        }
    }

    href = href.substring(href.indexOf('//') > 0 ? href.indexOf('//') + 2 : 0);

    if (href.indexOf('href="/') === 0 || href.indexOf(localDomain) === 0) {
        isLocal = true;
    }

    // Remove rel attributes
    anchor = anchor.replace(/rel[\s]*=[^\s]*\s*/gi, '');

    // Remove target attributes
    anchor = anchor.replace(/target[\s]*=[^\s]*\s*/gi, '');

    if (!isLocal) {
        anchor = '<a rel="nofollow" target="_blank"' + anchor.substr(2);
    }

    return anchor;
};

Mehdown.header = function(suffix) {
    function toSlug(value) {
        return value
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            .replace(/^-*/, '')
            .replace(/-*$/, '');
    }

    return function(header) {
        var text = header.replace(/<h\d[^>]*>(.+)<\/h\d>/, '$1');
        text = toSlug(text.replace(/<.*?>/g, ''));

        if (suffix) {
            suffix = toSlug(suffix);
            text = text + '-' + suffix;
        }

        return header.replace(/<h\d/, '$& id="' + text + '"');
    };
};

Mehdown.img = function(url) {
    return '<img src="' + url + '" />';
};

Mehdown.imgurGifv = function(id) {
    var html = '<div class="imgur-gifv"><video autoplay loop muted>';
    html += '<source type="video/webm" src="https://i.imgur.com/' + id + '.webm" />';
    html += '<source type="video/mp4" src="https://i.imgur.com/' + id + '.mp4" />';
    html += '</video></div>';

    return html;
};

Mehdown.soundcloud = function(match, url) {
    return '<iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=' + encodeURIComponent(url) + '"></iframe>';
};

Mehdown.twitter = function(username, statusId) {
    var html = '<blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/' + username + '/status/' + statusId + '"></a></blockquote>';
    html += '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';

    return html;
};

Mehdown.username = function(username) {
    return '<a href="' + Mehdown.baseUrl + '/@' + username + '">@' + username + '</a>';
};

Mehdown.vimeo = function(videoId) {
    return '<iframe allowfullscreen class="vimeo" frameborder="0" src="//player.vimeo.com/video/' + videoId + '"></iframe>';
};

Mehdown.kickstarter = function(kickstarterId, slug) {
    return '<iframe class="kickstarter" frameborder="0" scrolling="no" src="//www.kickstarter.com/projects/' + kickstarterId + '/' + slug + '/widget/card.html"></iframe>';
};

Mehdown.reddit = function(match, url) {
    var html = '<div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-live="true"><a href="' + url + '">' + url + '</a></div>';
    html += '<script async src="https://www.redditstatic.com/comment-embed.js"></script>';

    return html;
};

Mehdown.vine = function(videoId) {
    return '<iframe allowfullscreen class="vine" frameborder="0" src="//vine.co/v/' + videoId + '/embed/simple"></iframe>';
};

Mehdown.youtube = function(videoId, markdown) {
    var url = markdown.match(Mehdown.urlRegExp)[0];

    function getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var start = getParameterByName('start', url);
    var embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autohide=1&color=white&showinfo=0&theme=light';

    if (start) {
        embedUrl += '&start=' + start;
    }

    return '<iframe allowfullscreen class="youtube" frameborder="0" src="' + embedUrl + '"></iframe>';
};
