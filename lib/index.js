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

Mehdown.parse = function(text) {
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
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?">https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?<\/a>/g, Mehdown.youtube('$1'));

    //Kickstarter
    text = text.replace(/<a href="https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*">https?:\/\/(?:www\.)?(?:kickstarter\.com\/projects\/)?([\w-]+)\/([\w-]+).*<\/a>/g, Mehdown.kickstarter('$1', '$2'));

    // Anchors
    var anchorRegExp = new RegExp('<a[^>]*>([^<]+)</a>', 'gi');
    text = text.replace(anchorRegExp, Mehdown.anchor);

    return text;
};

Mehdown.anchor = function(anchor) {
    var attributes = anchor.match(/([\w\-.:]+)\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+)/gi);
    var href = '';
    var isLocal = false;

    // Find href attribute
    for(var i = 0; i < attributes.length; i++) {
        if(attributes[i].indexOf('href=') === 0) {
            href = attributes[i];
            break;
        }
    }

    href = href.substring(href.indexOf('//') > 0 ? href.indexOf('//') + 2 : 0);
    
    if(href.indexOf('href="/') === 0 || href.indexOf('mediocre.com') === 0 || href.indexOf('localhost') === 0 || href.indexOf('127.0.0.1') === 0) {
        isLocal = true;
    };

    // Remove rel attributes
    anchor = anchor.replace(/rel[\s]*=[^\s]*\s*/gi, '');

    // Remove target attributes
    anchor = anchor.replace(/target[\s]*=[^\s]*\s*/gi, '');

    if(!isLocal) {
        anchor = '<a rel="nofollow" target="_blank"' + anchor.substr(2);
    }

    return anchor;
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

Mehdown.youtube = function(videoId) {
    return '<iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/' + videoId + '"></iframe>';
};
