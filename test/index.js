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

describe('strikethrough', function() {
    it('~~', function(done) {
        mehdown.render('~~strikethrough~~', function(err, html) {
            assert.equal(html, '<p><s>strikethrough</s></p>');
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
