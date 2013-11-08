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

    // Hashtags
    //text = text.replace(/(^|[^#\w])#([a-z0-9_-]+)\b/gi, '$1' + Mehdown.hashtag('$2'));

    // Usernames
    text = text.replace(Mehdown.usernameRegExp, '$1' + Mehdown.username('$2'));

    return text;
};

Mehdown.hashtag = function(hashtag) {
    return '<a href="https://mediocre.com/tags/' + hashtag + '">#' + hashtag + '</a>';
}

Mehdown.username = function(username) {
    //return '<span class="vcard"><a href="https://mediocre.com/forums/users/' + username + '">@<span class="fn nickname">' + username + '</span></a>';
    return '<a href="/brenner/users/' + username + '">@' + username + '</a>';
}