const assert = require('assert');

const mehdown = require('../lib');

describe('bbcode', function() {
    it('[b]', function(done) {
        mehdown.render('I would like to [b]emphasize[/b] this', function(err, html) {
            assert.equal(html, '<p>I would like to <strong>emphasize</strong> this</p>');
            done();
        });
    });

    it('[code]', function(done) {
        mehdown.render('[code]\n\t01  01  andndnd.\n\t\t05  andnd pic x.\n\t\t05  andne pic x.\n[/code]', function(err, html) {
            assert.equal(html, '<pre><code>\n\t01  01  andndnd.\n\t\t05  andnd pic x.\n\t\t05  andne pic x.\n\n</code></pre>');
            done();
        });
    });

    it('[i]', function(done) {
        mehdown.render('Making text [i]italic[/i] italic is kind of easy', function(err, html) {
            assert.equal(html, '<p>Making text <em>italic</em> italic is kind of easy</p>');
            done();
        });
    });

    it('[img]', function(done) {
        mehdown.render('[img]http://www.bbcode.org/images/lubeck_small.jpg[/img]', function(err, html) {
            assert.equal(html, '<p><img src="http://www.bbcode.org/images/lubeck_small.jpg" alt="" /></p>');
            done();
        });
    });

    it('[quote]', function(done) {
        mehdown.render('[quote]\'Tis be a bad day[/quote]', function(err, html) {
            assert.equal(html, '<blockquote>\n<p>\'Tis be a bad day</p>\n</blockquote>');
            done();
        });
    });

    it('[quote=Bjarne]', function(done) {
        mehdown.render('[quote=Bjarne]This be the day of days![/quote]', function(err, html) {
            assert.equal(html, '<blockquote>\n<p><a href="/@Bjarne">@Bjarne</a> wrote: This be the day of days!</p>\n</blockquote>');
            done();
        });
    });

    it('[quote=@Bjarne]', function(done) {
        mehdown.render('[quote=@Bjarne]This be the day of days![/quote]', function(err, html) {
            assert.equal(html, '<blockquote>\n<p><a href="/@Bjarne">@Bjarne</a> wrote: This be the day of days!</p>\n</blockquote>');
            done();
        });
    });

    it('[s]', function(done) {
        mehdown.render('I [s]had been[/s] was born in Denmark', function(err, html) {
            assert.equal(html, '<p>I <s>had been</s> was born in Denmark</p>');
            done();
        });
    });

    it('[url]', function(done) {
        mehdown.render('[url]http://www.bbcode.org/[/url]', function(err, html) {
            assert.equal(html, '<p><a href="http://www.bbcode.org/">http://www.bbcode.org/</a></p>');
            done();
        });
    });

    it('[url]', function(done) {
        mehdown.render('[url=http://www.bbcode.org/]This be bbcode.org![/url]', function(err, html) {
            assert.equal(html, '<p><a href="http://www.bbcode.org/">This be bbcode.org!</a></p>');
            done();
        });
    });

    it('[youtube]', function(done) {
        mehdown.render('[youtube]kU9MuM4lP18[/youtube]', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
            done();
        });
    });
});

describe('commands', function() {
    describe('/giphy', function() {
        this.timeout(10000);

        it('/giphy meh', function(done) {
            mehdown.render('/giphy meh', function(err, html) {
                assert.notEqual(html, '<p>/giphy meh</p>');
                assert.notEqual(html.indexOf('http'), -1);
                done();
            });
        });

        it('lorem ipsum\n/giphy first\nfoo bar\n/giphy second third\n@username /giphy fourth\nhey @username /giphy fifth\nthis is not a command `/giphy sixth`', function(done) {
            mehdown.render('lorem ipsum\n/giphy first\nfoo bar\n/giphy second third\n@username /giphy fourth\nhey @username /giphy fifth\nthis is not a command `/giphy sixth`', function(err, html) {
                assert.notEqual(html.indexOf('lorem ipsum'), -1);
                assert.notEqual(html.indexOf('foo bar'), -1);
                assert.equal(html.match(/<img/g).length, 2);
                done();
            });
        });
    });

    describe('/shrug', function() {
        it('/shrug', function(done) {
            mehdown.render('/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\\_(ツ)_/¯</p>');
                done();
            });
        });

        it('/shrug\n/shrug', function(done) {
            mehdown.render('/shrug\n/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\\_(ツ)_/¯<br />\n¯\\\_(ツ)_/¯</p>');
                done();
            });
        });

        it('/shrug\n/shrug\n/shrug', function(done) {
            mehdown.render('/shrug\n/shrug\n/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\\_(ツ)_/¯<br />\n¯\\\_(ツ)_/¯<br />\n¯\\\_(ツ)_/¯</p>');
                done();
            });
        });
    });
});

describe('detect image sizes', function() {
    it('images', function(done) {
        mehdown.render('https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png https://i.imgur.com/8peBgQn.png https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /> <img height="250" src="https://i.imgur.com/8peBgQn.png" width="300" /> <img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /></p>');
            done();
        });
    });

    it('broken image', function(done) {
        this.timeout(10000);

        mehdown.render('http://example.com/404.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img src="http://example.com/404.png" /></p>');
            done();
        });
    });

    it('broken image html', function(done) {
        mehdown.render('http://example.com/404.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img src="http://example.com/404.png" /></p>');
            done();
        });
    });

    it('scheme relative broken image html', function(done) {
        mehdown.render('//example.com/404.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img src="//example.com/404.png" /></p>');
            done();
        });
    });

    it('image from editor', function(done) {
        mehdown.render('![enter image description here][1]\r\n\r\n  [1]: https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png "optional title"', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" alt="enter image description here" title="optional title" /></p>');
            done();
        });
    });

    it('image html', function(done) {
        mehdown.render('https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /></p>');
            done();
        });
    });

    it('scheme relative image html', function(done) {
        mehdown.render('//res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img height="528" src="//res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /></p>');
            done();
        });
    });

    // https://github.com/mediocre/forum-service/issues/64
    it('BUG: Cannot read property "height" of undefined', function(done) {
        mehdown.render('jealous-dusty-magic http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png @katylava says makes her think of fantasia', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p>jealous-dusty-magic <img src="http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png" /> <a href="/@katylava">@katylava</a> says makes her think of fantasia</p>');
            done();
        });
    });
});

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

describe('html', function() {
    describe('convertToLazyLoadedImages', function() {
        it('images', function(done) {
            var html = '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /> <img height="250" src="https://i.imgur.com/8peBgQn.png" width="300" /> <img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /></p>';
            html = mehdown.html.convertToLazyLoadedImages(html);

            assert.equal(html, '<p><img data-height="528" src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" data-width="528" /> <img data-height="250" src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="https://i.imgur.com/8peBgQn.png" data-width="300" /> <img data-height="528" src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" data-width="528" /></p>');
            done();
        });

        it('broken image', function(done) {
            var html = '<p><img src="http://example.com/404.png" /></p>';
            html = mehdown.html.convertToLazyLoadedImages(html);

            assert.equal(html, '<p><img src="http://example.com/404.png" /></p>');
            done();
        });

        it('image from editor', function(done) {
            var html = '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" alt="enter image description here" title="optional title" /></p>';
            html = mehdown.html.convertToLazyLoadedImages(html);

            assert.equal(html, '<p><img data-height="528" src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" data-width="528" alt="enter image description here" title="optional title" /></p>');
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

    it('<blockquote>', function(done) {
        mehdown.render('> \'cause i broke my flippin\' hand yesterday playing racquetball, that\'s\n> why, and if any of you capitalization thought police give me any\n> flames about it, or if i get one lousy letter telling me how YOU were\n> able to hit the shift key with your nose, i\'m gonna get you, YOU\n> TURKEYS!!!\n> I\'M GONNA WRITE YOUR MOTHERS!!!\n> I\'M GONNA PUNCH OUT YOUR SISTERS!!!!\n> I\'M GONNA GET YOU IF IT TAKES ME FOREVER!!!', function(err, html) {
            assert.equal(html, '<blockquote>\n<p>‘cause i broke my flippin’ hand yesterday playing racquetball, that’s<br />\nwhy, and if any of you capitalization thought police give me any<br />\nflames about it, or if i get one lousy letter telling me how YOU were<br />\nable to hit the shift key with your nose, i’m gonna get you, YOU<br />\nTURKEYS!!!<br />\nI’M GONNA WRITE YOUR MOTHERS!!!<br />\nI’M GONNA PUNCH OUT YOUR SISTERS!!!<br />\nI’M GONNA GET YOU IF IT TAKES ME FOREVER!!!</p>\n</blockquote>');
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

describe('mehdown.youTubeEmbedHtml', function() {
    it('http://www.youtube.com/watch?v=kU9MuM4lP18', function() {
        var html = mehdown.youTubeEmbedHtml('http://www.youtube.com/watch?v=kU9MuM4lP18');
        assert.equal(html, '<iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe>');
    });

    it('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk', function() {
        var html = mehdown.youTubeEmbedHtml('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk');
        assert.equal(html, '<iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe>');
    });

    it('`&amp;` instead of `&` in URL', function() {
        var html = mehdown.youTubeEmbedHtml('http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk');
        assert.equal(html, '<iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10', function() {
        var html = mehdown.youTubeEmbedHtml('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10');
        assert.equal(html, '<iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&start=10"></iframe>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20', function() {
        var html = mehdown.youTubeEmbedHtml('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20');
        assert.equal(html, '<iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&end=20&start=10"></iframe>');
    });
});

describe('security', function() {
    it('<script>alert("hello world")</script>', function(done) {
        mehdown.render('<script>alert("hello world");</script>', function(err, html) {
            assert.equal(html, '<p>&lt;script&gt;alert(“hello world”);&lt;/script&gt;</p>');
            done();
        });
    });
});
