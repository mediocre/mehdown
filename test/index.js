const assert = require('assert');

const mehdown = require('../lib');

describe('email', function() {
    it('email address', function(done) {
        mehdown.render('email me at whatever@somewhere.com if you are not a meanie.', function(err, html) {
            assert.equal(html, '<p>email me at <a href="mailto:whatever@somewhere.com">whatever@somewhere.com</a> if you are not a meanie.</p>');
            done();
        });
    });

    // https://github.com/mediocre/mehdown/issues/35
    it('email addresses with periods should be linked correctly', function(done) {
        mehdown.render('firstname.lastname@example.com', function(err, html) {
            assert.equal(html, '<p><a href="mailto:firstname.lastname@example.com">firstname.lastname@example.com</a></p>');
            done();
        });
    });
});

describe('links', function() {
    it('http://example.com', function(done) {
        mehdown.render('http://example.com', function(err, html) {
            assert.equal(html, '<p><a href="http://example.com">http://example.com</a></p>');
            done();
        });
    });

    it('[example.com](http://example.com)', function(done) {
        mehdown.render('[example.com](http://example.com)', function(err, html) {
            assert.equal(html, '<p><a href="http://example.com">example.com</a></p>');
            done();
        });
    });

    it('[see example.com here](http://example.com)', function(done) {
        mehdown.render('[see example.com here](http://example.com)', function(err, html) {
            assert.equal(html, '<p><a href="http://example.com">see example.com here</a></p>');
            done();
        });
    });

    it('[see http://example.com here](http://example.com)', function(done) {
        mehdown.render('[see http://example.com here](http://example.com)', function(err, html) {
            assert.equal(html, '<p><a href="http://example.com">see http://example.com here</a></p>');
            done();
        });
    });

    it('[leavemealone.com](http://leavemealone.com) but linkme.com', function(done) {
        mehdown.render('[leavemealone.com](http://leavemealone.com) but linkme.com', function(err, html) {
            assert.equal(html, '<p><a href="http://leavemealone.com">leavemealone.com</a> but <a href="http://linkme.com">linkme.com</a></p>');
            done();
        });
    });

    it('[example.com](http://example.com "go to example.com")', function(done) {
        mehdown.render('[example.com](http://example.com "go to example.com")', function(err, html) {
            assert.equal(html, '<p><a href="http://example.com" title="go to example.com">example.com</a></p>');
            done();
        });
    });

    it('simple domain', function(done) {
        mehdown.render('stuff google.com more stuff', function(err, html) {
            assert.equal(html, '<p>stuff <a href="http://google.com">google.com</a> more stuff</p>');
            done();
        });
    });

    it('domain with path', function(done) {
        mehdown.render('mediocre.com/forum/topics/american-parties', function(err, html) {
            assert.equal(html, '<p><a href="http://mediocre.com/forum/topics/american-parties">mediocre.com/forum/topics/american-parties</a></p>');
            done();
        });
    });

    it('domain with query string', function(done) {
        mehdown.render('google.com/search?q=domain', function(err, html) {
            assert.equal(html, '<p><a href="http://google.com/search?q=domain">google.com/search?q=domain</a></p>');
            done();
        });
    });

    it('.horse is a TLD', function(done) {
        mehdown.render('https://drone.horse', function(err, html) {
            assert.equal(html, '<p><a href="https://drone.horse">https://drone.horse</a></p>');
            done();
        });
    });

    // https://github.com/mediocre/mehdown/issues/6
    it('URLs with underscores should not lose the underscores', function(done) {
        mehdown.render('https://example.com/_/status/416050320272551936', function(err, html) {
            assert.equal(html, '<p><a href="https://example.com/_/status/416050320272551936">https://example.com/_/status/416050320272551936</a></p>');
            done();
        });
    });

    // https://github.com/mediocre/mehdown/issues/29
    it('should not link two, four, or five consecutive periods', function(done) {
        mehdown.render('Awww....I always wanted my own baby elephant.', function(err, html) {
            assert.equal(html, '<p>Awww…I always wanted my own baby elephant.</p>');
            done();
        });
    });

    // https://github.com/mediocre/mehdown/issues/30
    it('should link URLs with @ characters', function(done) {
        mehdown.render('https://meh.com/@mediocrebot', function(err, html) {
            assert.equal(html, '<p><a href="https://meh.com/@mediocrebot">https://meh.com/@mediocrebot</a></p>');
            done();
        });
    });

    // https://github.com/mediocre/mehdown/issues/39
    it('URLs that happen to have Emoji shortnames should be linked correctly', function(done) {
        mehdown.render('http://www.ebay.com/itm/GOgroove-BlueSYNC-OR3-Portable-Wireless-Bluetooth-Speaker-Splatter-Edition-/351328294837?var=&hash=item51cccc57b5:m:mLzVeDaMfRlxsCqFiutY-aw', function(err, html) {
            assert.equal(html, '<p><a href="http://www.ebay.com/itm/GOgroove-BlueSYNC-OR3-Portable-Wireless-Bluetooth-Speaker-Splatter-Edition-/351328294837?var=&amp;hash=item51cccc57b5:m:mLzVeDaMfRlxsCqFiutY-aw">http://www.ebay.com/itm/GOgroove-BlueSYNC-OR3-Portable-Wireless-Bluetooth-Speaker-Splatter-Edition-/351328294837?var=&amp;hash=item51cccc57b5:m:mLzVeDaMfRlxsCqFiutY-aw</a></p>');
            done();
        });
    });
});

describe('newlines', function() {
    it('\\n', function(done) {
        mehdown.render('a\nb\nc\n', function(err, html) {
            assert.equal(html, '<p>a<br />\nb<br />\nc</p>');
            done();
        });
    });

    it('\\r\\n', function(done) {
        mehdown.render('a\r\nb\r\nc\r\n', function(err, html) {
            assert.equal(html, '<p>a<br />\nb<br />\nc</p>');
            done();
        });
    });

    it('<li>', function(done) {
        mehdown.render('- a\n- b\n- c', function(err, html) {
            assert.equal(html, '<ul>\n<li>a</li>\n<li>b</li>\n<li>c</li>\n</ul>');
            done();
        });
    });

    it('<blockquote>', function(done) {
        mehdown.render('> Alone.\n>\n> Yes, that\'s the key word, the most awful word in the English tonque. Murder doesn\'t hold a candle to it, and hell is only a poor synonym.\n> - Stephen King', function(err, html) {
            assert.equal(html, '<blockquote>\n<p>Alone.</p>\n<p>Yes, that’s the key word, the most awful word in the English tonque. Murder doesn’t hold a candle to it, and hell is only a poor synonym.</p>\n<ul>\n<li>Stephen King</li>\n</ul>\n</blockquote>');
            done();
        });
    });
});

describe.skip('headers', function() {
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

describe.skip('images', function() {
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

describe.skip('strikethrough', function() {
    it('~~', function() {
        var text = mehdown.parse('<p>~~strikethrough~~</p>');
        assert.equal(text, '<p><s>strikethrough</s></p>');
    });
});

describe.skip('usernames', function() {
    it('@username', function() {
        var text = mehdown.parse('@username');
        assert.equal(text, '<a href="https://mediocre.com/@username">@username</a>');
    });

    it('<p>@username @othername</p>', function() {
        var text = mehdown.parse('<p>@username @othername</p>');
        assert.equal(text, '<p><a href="https://mediocre.com/@username">@username</a> <a href="https://mediocre.com/@othername">@othername</a></p>');
    });

    it('abc @username 123', function() {
        var text = mehdown.parse('abc @username 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/@username">@username</a> 123');
    });

    it('abc @username1 notausername@notausername @username2 123', function() {
        var text = mehdown.parse('abc @username1 notausername@notausername @username2 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/@username1">@username1</a> notausername@notausername <a href="https://mediocre.com/@username2">@username2</a> 123');
    });

    it('mediocre.com/@username', function() {
        var text = mehdown.parse('mediocre.com/@username');
        assert.equal(text, '<a href="https://mediocre.com/@username">mediocre.com/@username</a>');
    });

    it('http://mediocre.com/@username', function() {
        var text = mehdown.parse('http://mediocre.com/@username');
        assert.equal(text, '<a href="https://mediocre.com/@username">http://mediocre.com/@username</a>');
    });

    it('https://mediocre.com/@username', function() {
        var text = mehdown.parse('https://mediocre.com/@username');
        assert.equal(text, '<a href="https://mediocre.com/@username">https://mediocre.com/@username</a>');
    });

    it('<a href="https://mediocre.com/@username">@username</a>', function() {
        var text = mehdown.parse('<a href="https://mediocre.com/@username">@username</a>');
        assert.equal(text, '<a href="https://mediocre.com/@username">@username</a>');
    });
});

describe.skip('Imgur GIFV', function() {
    it('http://i.imgur.com/zvATqgs.gifv', function() {
        var text = mehdown.parse('<p><a href="http://i.imgur.com/zvATqgs.gifv">http://i.imgur.com/zvATqgs.gifv</a></p>');
        assert.equal(text, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
    });
});

describe.skip('SoundCloud URLs', function() {
    it('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function() {
        var text = mehdown.parse('<p><a href="https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town">https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town</a></p>');
        assert.equal(text, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
    });
});

describe.skip('Reddit URLs', function() {
    it('https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym', function() {
        var text = mehdown.parse('<p><a href="https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym">https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym</a></p>');
        assert.equal(text, '<p><div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-live="true"><a rel="nofollow" target="_blank" href="https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym">https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym</a></div><script async src="https://www.redditstatic.com/comment-embed.js"></script></p>');
    });
});

describe.skip('Twitter Status URLs', function() {
    it('https://twitter.com/mediocrelabs/status/410516133955907584', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/mediocrelabs/status/410516133955907584">https://twitter.com/mediocrelabs/status/410516133955907584</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/mediocrelabs/status/410516133955907584"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });

    it('https://twitter.com/_/status/416050320272551936', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/_/status/416050320272551936">https://twitter.com/_/status/416050320272551936</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });
});

describe.skip('Vimeo URLs', function() {
    it('http://vimeo.com/78950165', function() {
        var text = mehdown.parse('<p><a href="http://vimeo.com/78950165">http://vimeo.com/78950165</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vimeo" frameborder="0" src="//player.vimeo.com/video/78950165"></iframe></p>');
    });
});

describe.skip('Vine URLs', function() {
    it('https://vine.co/v/hWZ9mbJZaKE', function() {
        var text = mehdown.parse('<p><a href="https://vine.co/v/hWZ9mbJZaKE">https://vine.co/v/hWZ9mbJZaKE</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vine" frameborder="0" src="//vine.co/v/hWZ9mbJZaKE/embed/simple"></iframe></p>');
    });
});

describe.skip('YouTube URLs', function() {
    it('http://www.youtube.com/watch?v=kU9MuM4lP18', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18 http://www.youtube.com/watch?v=eGDBR2L5kzI', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a><br /><a href="http://www.youtube.com/watch?v=eGDBR2L5kzI">http://www.youtube.com/watch?v=eGDBR2L5kzI</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe><br /><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/eGDBR2L5kzI?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk">http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('`&amp;` instead of `&` in URL', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk">http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18&start=10">http://www.youtube.com/watch?v=kU9MuM4lP18&start=10</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&start=10"></iframe></p>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10">http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&start=10"></iframe></p>');
    });
});

describe.skip('Kickstarter URLs', function() {
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
