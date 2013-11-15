var Mehdown;

if (typeof exports === 'object' && typeof require === 'function') {
    Mehdown = exports;
}
else {
    Mehdown = {};
}

Mehdown.usernameRegExp = /(^|[^@\w])@(\w{1,15})\b/g;

Mehdown.parse = function(text) {
    text = text.trim();

    // Replace single newlines with <br /> tags: http://stackoverflow.com/questions/18011260/regex-to-match-single-new-line-regex-to-match-double-new-line
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/(^|[^\n])\n(?!\n)/g, '$1<br />');

    // Cleanup line breaks around <li> elements
    text = text.replace(/<br \/><li>/g, '<li>');
    text = text.replace(/<\/li><br \/>/g, '</li>');

    // Spoilers
    text = text.replace(/\[spoiler\](.*?)\[\/spoiler\]/gi, Mehdown.spoiler('$1'));

    // Usernames
    text = text.replace(Mehdown.usernameRegExp, '$1' + Mehdown.username('$2'));

    // Vimeo
    text = text.replace(/<a href="(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)?(\d+)">(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)?(\d+)<\/a>/g, Mehdown.vimeo('$1'));

    // YouTube URLs: http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex/10315969#10315969
    text = text.replace(/<a href="(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?">(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?<\/a>/g, Mehdown.youtube('$1'));

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
    
    if(href.indexOf('href="/') === 0 || href.indexOf('mediocre.com') === 0 || href.indexOf('localhost') === 0) {
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
}

Mehdown.username = function(username) {
    return '<a href="/forum/users/' + username + '">@' + username + '</a>';
};

Mehdown.vimeo = function(videoId) {
    return '<iframe allowfullscreen class="vimeo" frameborder="0" src="//player.vimeo.com/video/' + videoId + '"></iframe>';
};

Mehdown.youtube = function(videoId) {
    return '<iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/' + videoId + '"></iframe>';
};