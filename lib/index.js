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
Mehdown.urlRegExp = /((?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+|(?:[A-Za-z0-9\.\-]+\.(?:com|org|net|gov|edu|co\.uk|io)))(?:(?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)(?:#?[\b\w\/!]+)(?:[\-\.\!\/\w]*))?)/g;

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
        var domain = arguments[1];
        var href = (domain.indexOf('http') < 0) ? 'http://' + domain : domain;
        var preceding = text.substring(0, arguments[2]);
        var insideTagAttrRegex = /<(?!\/)[^>]+(?!>)$/g;
        var insideAnchorTagRegex = /<a[^>]*>(?!<\/a>)$/g;

        // use the correct protocol if domain is baseUrl domain
        if (href !== Mehdown.baseUrl && href.split('/')[2] === Mehdown.baseUrl.split('/')[2]) {
            href = Mehdown.baseUrl.split('://')[0] + '://' + domain;
        }

        // inside tag attr or anchor tag, abort
        if (preceding.match(insideTagAttrRegex) || preceding.match(insideAnchorTagRegex)) {
            return domain;
        }

        // don't use http protocol on email adresses
        if (domain.indexOf('@') >= 0) {
            var parts = domain.split('@');
            if (parts[1].match(Mehdown.urlRegExp)) {
                href = 'mailto:' + domain;
            } else {
                // this is a wierd something@something-no-tld that the regex thinks is a url, abort
                return domain;
            }
        }

        return '<a href="' + href + '">' + domain + '</a>';
    });

    // Spoilers
    text = text.replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, Mehdown.spoiler('$1'));

    // Usernames
    text = text.replace(Mehdown.usernameRegExp, '$1' + Mehdown.username('$2'));

    // SoundCloud
    text = text.replace(/<a href="(https?:\/\/(?:soundcloud.com|snd.sc)\/.*)">https?:\/\/(?:soundcloud.com|snd.sc)\/.*<\/a>/gi, Mehdown.soundcloud);

    // Twitter Status: http://stackoverflow.com/questions/4138483/twitter-status-url-regex
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)">https?:\/\/(?:www\.)?(?:twitter\.com\/)(?:#!\/)?(\w+)\/status(es)?\/(\d+)<\/a>/gi, Mehdown.twitter('$1', '$3'));

    // Vimeo
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:vimeo\.com\/)?(\d+)">https?:\/\/(?:www\.)?(?:vimeo\.com\/)?(\d+)<\/a>/g, Mehdown.vimeo('$1'));

    // Vine
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:vine\.co\/v\/)?(\w+)">https?:\/\/(?:www\.)?(?:vine\.co\/v\/)?(\w+)<\/a>/g, Mehdown.vine('$1'));

    // YouTube URLs: http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))((?:\w|-){11})(?:\S*?)?(?:t=([0-9ms]+))?">https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&(?:amp;)?v=))(?:(?:\w|-){11})(?:\S*?)?(?:t=(?:[0-9ms]+))?<\/a>/g, youtubeParse);

    //Kickstarter
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*">https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*<\/a>/g, Mehdown.kickstarter('$1', '$2'));

    // Images
    var imgRegExp = /<a href="(https?:\/\/[-\w%\/\.]+\.(?:jpg|jpeg|gif|png)(?:\?[-\+=&;%@\.\w]+)?)">\1<\/a>/gi;
    text = text.replace(imgRegExp, Mehdown.img('$1'));

    // Anchors
    var anchorRegExp = new RegExp('<a[^>]*>([^<]+)</a>', 'gi');
    text = text.replace(anchorRegExp, Mehdown.anchor);

    var headerRegExp = new RegExp('<h\\d[^>]*>([^<]+)</h\\d>', 'gi');
    text = text.replace(headerRegExp, Mehdown.header(opts.suffix));

    return text;
};

Mehdown.anchor = function(anchor) {
    var attributes = anchor.match(/([\w\-.:]+)\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+)/gi);
    var href = '';
    var isLocal = false;
    var localDomain = Mehdown.baseUrl.substring(Mehdown.baseUrl.indexOf('//') + 2);

    // Find href attribute
    for(var i = 0; i < attributes.length; i++) {
        if(attributes[i].indexOf('href=') === 0) {
            href = attributes[i];
            break;
        }
    }

    href = href.substring(href.indexOf('//') > 0 ? href.indexOf('//') + 2 : 0);

    if(href.indexOf('href="/') === 0 || href.indexOf(localDomain) === 0) {
        isLocal = true;
    }

    // Remove rel attributes
    anchor = anchor.replace(/rel[\s]*=[^\s]*\s*/gi, '');

    // Remove target attributes
    anchor = anchor.replace(/target[\s]*=[^\s]*\s*/gi, '');

    if(!isLocal) {
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
        var text = header.replace(/<h\d[^>]*>([^<]+)<\/h\d>/, '$1');
        text = toSlug(text);
        
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

Mehdown.spoiler = function(spoiler) {
    return '<span class="spoiler">' + spoiler + '</span>';
};

Mehdown.soundcloud = function(match, url) {
    return '<iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '"></iframe>';
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

Mehdown.vine = function(videoId) {
    return '<iframe allowfullscreen class="vine" frameborder="0" src="//vine.co/v/' + videoId + '/embed/simple"></iframe>';
};

Mehdown.youtube = function(videoId, time) {
    if (time === '' || time <= 0) {
        return '<iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/' + videoId + '?autohide=1&color=white&showinfo=0&theme=light"></iframe>';
    }
    else {
        return '<iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/' + videoId + '?start=' + time + '&autohide=1&color=white&showinfo=0&theme=light"></iframe>';
    }
    
};

function youtubeParse(match, p1, p2, offset, string) {
    if (p2 && p2 !== '') {
        var times = p2.split(/m/);
        var time;
        if (times[1] && times[1] !== '') {
            time = parseInt(times[0]) * 60 + parseInt(times[1]);
        }
        else if (times[0].indexOf('s') !== -1) {
            var secs = times[0].split(/s/);
            time = secs[0];
        }
        else {
            time = times[0] * 60;
        }
        return Mehdown.youtube(p1, time);
    }
    else {
        return Mehdown.youtube(p1, '');
    }
}

