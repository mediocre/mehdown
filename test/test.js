var assert = require('assert');
var mehdown = require('../lib');

var defaultBaseUrl = 'https://mediocre.com';

before(function() {
    mehdown.baseUrl = defaultBaseUrl;
});

describe('newlines', function() {
    it('\\n', function() {
        var text = mehdown.parse('a\nb\nc\n');
        assert.equal(text, 'a<br />b<br />c');
    });

    it('\\r\\n', function() {
        var text = mehdown.parse('a\r\nb\r\nc\r\n');
        assert.equal(text, 'a<br />b<br />c');
    });

    it('<li>', function() {
        var text = mehdown.parse('<ul>\r\n<li>a</li>\r\n<li>b</li>\r\n<li>c</li>\r\n</ul>');
        assert.equal(text, '<ul><li>a</li><li>b</li><li>c</li></ul>');
    });

    it('<blockquote>', function() {
        var text = mehdown.parse('<blockquote>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum</p>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum dolor sit amet, consectetur adipisicing elit</p>\n</blockquote>');
        assert.equal(text, '<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum</p>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></blockquote>');
    });
});

describe('anchors', function() {
    it('rel attributes', function() {
        var text = mehdown.parse('<p><a rel="abc" href="http://www.google.com">Google</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://www.google.com">Google</a></p>');
    });

    it('target attributes', function() {
        var text = mehdown.parse('<p><a target="abc" href="http://www.google.com">Google</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://www.google.com">Google</a></p>');
    });

    it('local href', function() {
        var text = mehdown.parse('<p><a href="/path">path</a></p>');
        assert.equal(text, '<p><a href="/path">path</a></p>');
    });

    it('127.0.0.1 href', function() {
        mehdown.baseUrl = 'http://127.0.0.1:8000';
        var text = mehdown.parse('<p><a href="http://127.0.0.1:8000/path">path</a></p>');
        assert.equal(text, '<p><a href="http://127.0.0.1:8000/path">path</a></p>');
        mehdown.baseUrl = defaultBaseUrl;
    });

    it('mediocre href', function() {
        var text = mehdown.parse('<p><a href="https://mediocre.com/path">path</a></p>');
        assert.equal(text, '<p><a href="https://mediocre.com/path">path</a></p>');
    });
});

describe('headers', function() {
    it('adds ids for anchors', function() {
        var text = mehdown.parse('<h1>What is meh</h1>');
        assert.equal(text, '<h1 id="what-is-meh">What is meh</h1>');
    });
    
    it('appends suffix to id', function() {
        var text = mehdown.parse('<h1>What is meh</h1>', { suffix: '012fed' });
        assert.equal(text, '<h1 id="what-is-meh-012fed">What is meh</h1>');
    });

    it('handle header text with non alpha-numeric characters', function() {
        var text = mehdown.parse('<h1>What.is!meh?</h1>', { suffix: '0.1!2?f..e!!d??' });
        assert.equal(text, '<h1 id="whatismeh-012fed">What.is!meh?</h1>');
    });
    
    it('handle header text with multiple spaces', function() {
        var text = mehdown.parse('<h1>What. is ! meh     ?</h1>', { suffix: '0. 1! 2?f. . e! !d? ?' });
        assert.equal(text, '<h1 id="what-is-meh-0-1-2f-e-d">What. is ! meh     ?</h1>');
    });
    
    it('handle suffix with non alpha-numeric characters', function() {
        var text = mehdown.parse('<h1>a- -b?c</h1>', { suffix: '!@#$%^&*()=+`~,./;\'<>?:"[]{}|' });
        assert.equal(text, '<h1 id="a-bc-">a- -b?c</h1>');
    });

    it('collapse multiple hyphens', function() {
        var text = mehdown.parse('<h1>-- - What - - is --- -   - meh - - -</h1>', { suffix: '!@#$%^&*()=+`~,./;\'<>?:"[]{}|' });
        assert.equal(text, '<h1 id="what-is-meh-">-- - What - - is --- -   - meh - - -</h1>');
    });

    it('handle header with other tags inside', function() {
        var text = mehdown.parse('<h1><strong>bold</strong></h1>');
        assert.equal(text, '<h1 id="bold"><strong>bold</strong></h1>');
    });
});

describe('scheme-less domains', function() {
    it('simple domain', function() {
        var text = mehdown.parse('<p>stuff google.com more stuff</p>');
        assert.equal(text, '<p>stuff <a rel="nofollow" target="_blank" href="http://google.com">google.com</a> more stuff</p>');
    });

    it('domain with path', function() {
        var text = mehdown.parse('<p>mediocre.com/forum/topics/american-parties</p>');
        assert.equal(text, '<p><a href="https://mediocre.com/forum/topics/american-parties">mediocre.com/forum/topics/american-parties</a></p>');
    });

    it('domain with query string', function() {
        var text = mehdown.parse('<p>google.com/search?q=domain</p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://google.com/search?q=domain">google.com/search?q=domain</a></p>');
    });

    it('already linked domain', function() {
        var text = mehdown.parse('<p><a href="http://example.com">http://example.com</a> and example.com</p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://example.com">http://example.com</a> and <a rel="nofollow" target="_blank" href="http://example.com">example.com</a></p>');
    });

    it('already linked domain with additional anchor text', function() {
        var text = mehdown.parse('<p><a href="http://example.com">example.com is the coolest site</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://example.com">example.com is the coolest site</a></p>');
    });

    it('domain is in tag attribute', function() {
        var text = mehdown.parse('<p><a href="http://example.com" title="Go To Example.com">example.com</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://example.com" title="Go To Example.com">example.com</a></p>');
    });

    it('email address', function() {
        var text = mehdown.parse('<p>email me at whatever@somewhere.com if you are not a meanie.</p>');
        assert.equal(text, '<p>email me at <a rel="nofollow" target="_blank" href="mailto:whatever@somewhere.com">whatever@somewhere.com</a> if you are not a meanie.</p>');
    });
});

describe('images', function() {
    it('.jpg', function() {
        var text = mehdown.parse('<p><a href="http://i.imgur.com/9oiY1aO.jpg">http://i.imgur.com/9oiY1aO.jpg</a></p>');
        assert.equal(text, '<p><img src="http://i.imgur.com/9oiY1aO.jpg" /></p>');
    });

    it('.gif', function() {
        var text = mehdown.parse('<p><a href="http://www.bubblews.com/assets/images/news/225123606_1387763263.gif">http://www.bubblews.com/assets/images/news/225123606_1387763263.gif</a></p>');
        assert.equal(text, '<p><img src="http://www.bubblews.com/assets/images/news/225123606_1387763263.gif" /></p>');
    });

    it('.png', function() {
        var text = mehdown.parse('<p><a href="http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png">http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png</a></p>');
        assert.equal(text, '<p><img src="http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png" /></p>');
    });

    it('.jpg with long url and query string', function() {
        var text = mehdown.parse('<p><a href="http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na">http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na</a></p>');
        assert.equal(text, '<p><img src="http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na" /></p>');
    });

    it('.png with %20 (space) in url', function() {
        var text = mehdown.parse('<p><a href="http://izaak.jellinek.com/tuxes/images/big%20tux.png">http://izaak.jellinek.com/tuxes/images/big%20tux.png</a></p>');
        assert.equal(text, '<p><img src="http://izaak.jellinek.com/tuxes/images/big%20tux.png" /></p>');
    });
});

describe('strikethrough', function() {
    it('~~', function() {
        var text = mehdown.parse('<p>~~strikethrough~~</p>');
        assert.equal(text, '<p><s>strikethrough</s></p>');
    });
});

describe('usernames', function() {
    it('@username', function() {
        var text = mehdown.parse('@username');
        assert.equal(text, '<a href="https://mediocre.com/@username">@username</a>');
    });

    it('abc @username 123', function() {
        var text = mehdown.parse('abc @username 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/@username">@username</a> 123');
    });

    it('abc @username1 notausername@notausername @username2 123', function() {
        var text = mehdown.parse('abc @username1 notausername@notausername @username2 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/@username1">@username1</a> notausername@notausername <a href="https://mediocre.com/@username2">@username2</a> 123');
    });
});

describe('SoundCloud URLs', function() {
    it('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function() {
        var text = mehdown.parse('<p><a href="https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town">https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town</a></p>');
        assert.equal(text, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
    });
});

describe('Twitter Status URLs', function() {
    it('https://twitter.com/mediocrelabs/status/410516133955907584', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/mediocrelabs/status/410516133955907584">https://twitter.com/mediocrelabs/status/410516133955907584</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/mediocrelabs/status/410516133955907584"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });

    it('https://twitter.com/_/status/416050320272551936', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/_/status/416050320272551936">https://twitter.com/_/status/416050320272551936</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });
});

describe('Vimeo URLs', function() {
    it('http://vimeo.com/78950165', function() {
        var text = mehdown.parse('<p><a href="http://vimeo.com/78950165">http://vimeo.com/78950165</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vimeo" frameborder="0" src="//player.vimeo.com/video/78950165"></iframe></p>');
    });
});

describe('Vine URLs', function() {
    it('https://vine.co/v/hWZ9mbJZaKE', function() {
        var text = mehdown.parse('<p><a href="https://vine.co/v/hWZ9mbJZaKE">https://vine.co/v/hWZ9mbJZaKE</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vine" frameborder="0" src="//vine.co/v/hWZ9mbJZaKE/embed/simple"></iframe></p>');
    });
});

describe('YouTube URLs', function() {
    it('http://www.youtube.com/watch?v=kU9MuM4lP18', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18 http://www.youtube.com/watch?v=eGDBR2L5kzI', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a><br /><a href="http://www.youtube.com/watch?v=eGDBR2L5kzI">http://www.youtube.com/watch?v=eGDBR2L5kzI</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe><br /><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/eGDBR2L5kzI?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk">http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('`&amp;` instead of `&` in URL', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk">http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });
});

describe('Kickstarter URLs', function() {
    it('https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec', function() {
        var body = '<p><a href="https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec">https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec</a></p>';
        var text = mehdown.parse(body);
        assert.equal(text, '<p><iframe class="kickstarter" frameborder="0" scrolling="no" src="//www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary/widget/card.html"></iframe></p>');
    });

    it('https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary?ref=discover_rec', function() {
        var body = '<p><a href="https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary?ref=discover_rec">https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary?ref=discover_rec</a></p>';
        var text = mehdown.parse(body);
        assert.equal(text, '<p><iframe class="kickstarter" frameborder="0" scrolling="no" src="//www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary/widget/card.html"></iframe></p>');
    });
});
