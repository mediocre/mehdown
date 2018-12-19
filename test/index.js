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
    describe('/coinflip', function() {
        it('/coinflip', function(done) {
            mehdown.render('/coinflip', function(err, html) {
                assert.notEqual(html, '<p>/coinflip</p>');
                assert(!html.includes('<code>heads</code> or <code>tails</code> are your only options here.'));
                done();
            });
        });

        it('/coinflip heads', function(done) {
            mehdown.render('/coinflip heads', function(err, html) {
                assert.notEqual(html, '<p>/coinflip heads</p>');
                assert(!html.includes('<code>heads</code> or <code>tails</code> are your only options here.'));
                done();
            });
        });

        it('/coinflip tails', function(done) {
            mehdown.render('/coinflip tails', function(err, html) {
                assert.notEqual(html, '<p>/coinflip tails</p>');
                assert(!html.includes('<code>heads</code> or <code>tails</code> are your only options here.'));
                done();
            });
        });

        it('/coinflip foo', function(done) {
            mehdown.render('/coinflip foo', function(err, html) {
                assert.notEqual(html, '<p>/coinflip foo</p>');
                assert(html.includes('<code>heads</code> or <code>tails</code> are your only options here.'));
                done();
            });
        });
    });

    describe('/concerned', function() {
        it('/concerned', function(done) {
            mehdown.render('/concerned', function(err, html) {
                assert.equal(html, '<p>ಠ_ಠ</p>');
                done();
            });
        });
    });

    describe('/cowsay', function() {
        this.timeout(10000);

        it('/cowsay', function(done) {
            mehdown.render('/cowsay', function(err, html) {
                assert.strictEqual(html, '<p>/cowsay</p>');
                done();
            });
        });

        it('/cowsay moo', function(done) {
            mehdown.render('/cowsay -b', function(err, html) {
                assert.notEqual(html, '<p>/cowsay moo</p>');
                done();
            });
        });

        it('/cowsay -h', function(done) {
            mehdown.render('/cowsay -h', function(err, html) {
                assert.notEqual(html.indexOf('<p>/cowsay -h</p>\n<pre><code>Usage: /cowsay'), -1);
                done();
            });
        });

        it('/cowsay -help', function(done) {
            mehdown.render('/cowsay -help', function(err, html) {
                assert.notEqual(html.indexOf('<p>/cowsay -help</p>\n<pre><code>Usage: /cowsay'), -1);
                done();
            });
        });

        it('/cowsay --help', function(done) {
            mehdown.render('/cowsay --help', function(err, html) {
                assert.notEqual(html.indexOf('<p>/cowsay --help</p>\n<pre><code>Usage: /cowsay'), -1);
                done();
            });
        });

        it('/cowsay -l', function(done) {
            mehdown.render('/cowsay -l', function(err, html) {
                assert.equal(html, '<p>/cowsay -l</p>\n<pre><code>beavis.zen bong bud-frogs bunny cheese cower daemon default doge elephant-in-snake elephant eyes flaming-sheep ghostbusters goat head-in hedgehog hellokitty kiss kitty koala kosh luke-koala mech-and-cow meow milk moofasa moose mutilated ren satanic sheep skeleton small squirrel stimpy supermilker surgery telebears tux vader-koala vader www\n</code></pre>');
                done();
            });
        });

        it('/cowsay hello world?', function(done) {
            mehdown.render('/cowsay hello world? || () <>', function(err, html) {
                assert.equal(html.indexOf('[object Object]'), -1);
                done();
            });
        });

        it('/cowsay hello world?', function(done) {
            mehdown.render('/cowsay "hello world? || ()"', function(err, html) {
                assert.notEqual(html.indexOf('hello world? || ()'), -1);
                done();
            });
        });
    });

    describe('/cowthink', function() {
        this.timeout(10000);

        it('/cowthink', function(done) {
            mehdown.render('/cowthink', function(err, html) {
                assert.strictEqual(html, '<p>/cowthink</p>');
                done();
            });
        });

        it('/cowthink hmm...', function(done) {
            mehdown.render('/cowthink hmm...', function(err, html) {
                assert.notEqual(html, '<p>/cowthink hmm...</p>');
                done();
            });
        });
    });

    describe('/define', function() {
        this.timeout(10000);

        if (process.env.OXFORD_DICTIONARY_APP_ID && process.env.OXFORD_DICTIONARY_APP_KEY) {
            it('/define', function(done) {
                mehdown.render('/define', function(err, html) {
                    assert.notEqual(html, '<p>/define</p>');
                    assert(html.includes('Usage: /define word'));
                    done();
                });
            });

            it('/define -h', function(done) {
                mehdown.render('/define -h', function(err, html) {
                    assert.notEqual(html, '<p>/define</p>');
                    assert(html.includes('Usage: /define word'));
                    assert(!html.includes('Error'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });

            it('/define meh', function(done) {
                mehdown.render('/define meh', function(err, html) {
                    assert.notEqual(html, '<p>/define meh</p>');
                    assert(html.includes('expressing a lack of interest or enthusiasm'));
                    assert(!html.includes('Error'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });

            it('/define test', function(done) {
                mehdown.render('/define test', function(err, html) {
                    assert.notEqual(html, '<p>/define test</p>');
                    assert(html.includes('a procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use'));
                    assert(!html.includes('Error'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });

            it('/define set', function(done) {
                mehdown.render('/define set', function(err, html) {
                    assert.notEqual(html, '<p>/define set</p>');
                    assert(html.includes('More definitions available'));
                    assert(!html.includes('Error'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });

            it('/define hot dog', function(done) {
                mehdown.render('/define hot dog', function(err, html) {
                    assert.notEqual(html, '<p>/define test</p>');
                    assert(html.includes('a frankfurter, especially one served hot in a long, soft roll and topped with various condiments'));
                    assert(!html.includes('Error'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });

            it('/define thisisnotarealword', function(done) {
                mehdown.render('/define thisisnotarealword', function(err, html) {
                    assert.notEqual(html, '<p>/define thisisnotarealword</p>');
                    assert(html.includes('No exact matches found for the specified word.'));
                    assert(!html.includes('Something went terribly wrong'));
                    done();
                });
            });
        }
    });

    describe('/eightball', function() {
        it('/eightball Do I need a new lease on life?', function(done) {
            mehdown.render('/eightball Do I need a new lease on life?', function(err, html) {
                assert.notEqual(html, '<p>/eightball Do I need a new lease on life?</p>');
                done();
            });
        });
    });

    describe('/emojify', function() {
        it('/emojify', function(done) {
            mehdown.render('/emojify', function(err, html) {
                assert.strictEqual(html, '<p>/emojify</p>');
                done();
            });
        });

        it('/emojify Basketball finishes at 5. Then it\'s pizza or tacos. Maybe go to the movies. You in?', function(done) {
            mehdown.render('/emojify Basketball finishes at 5. Then it\'s pizza or tacos. Maybe go to the movies. You in?', function(err, html) {
                assert.equal(html, '<p><img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f3c0.png" title=":basketball:" /> finishes at 5. Then it’s <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f355.png" title=":pizza:" /> or <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f32e.png" title=":taco:" />. Maybe go to the <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f3a5.png" title=":movie_camera:" />. You in?</p>');
                done();
            });
        });

        it('/emojify package package :package: package', function(done) {
            mehdown.render('/emojify package package :package: package', function(err, html) {
                assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4e6.png" title=":package:" /> <img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4e6.png" title=":package:" /> <img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4e6.png" title=":package:" /> <img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4e6.png" title=":package:" /></p>');
                done();
            });
        });

        it('/emojify no woman, no cry on mail so', function(done) {
            mehdown.render('/emojify no woman, no cry on mail so', function(err, html) {
                assert.equal(html, '<p><img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f6ab.png" title=":no_entry_sign:" /> <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f469.png" title=":woman:" />, <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f6ab.png" title=":no_entry_sign:" /> <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f622.png" title=":cry:" /> on <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4eb.png" title=":mailbox:" /> so</p>');
                done();
            });
        });

        it('/emojify shit', function(done) {
            mehdown.render('/emojify shit', function(err, html) {
                assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f4a9.png" title=":poop:" /></p>');
                done();
            });
        });
    });

    describe('/flip', function() {
        it('/flip Hello World!', function(done) {
            mehdown.render('/flip Hello World!', function(err, html) {
                assert.equal(html, '<p>¡pʃɹoM oʃʃǝH</p>');
                done();
            });
        });
    });

    describe('/giphy', function() {
        this.timeout(20000);

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

    describe('/google', function() {
        this.timeout(10000);

        if (process.env.GOOGLE_API_KEY) {
            it('/google meh', function(done) {
                mehdown.render('/google meh', function(err, html) {
                    assert.notEqual(html, '<p>/google meh</p>');
                    done();
                });
            });
        }
    });

    describe('/image', function() {
        this.timeout(10000);

        if (process.env.GOOGLE_API_KEY) {
            it('/image meh', function(done) {
                mehdown.render('/image meh', function(err, html) {
                    assert.notEqual(html, '<p>/image meh</p>');
                    done();
                });
            });
        }
    });

    describe('/jumble', function() {
        it('/jumble', function(done) {
            mehdown.render('/jumble Humans can easily read text where the middle letters are shuffled.', function(err, html) {
                assert.notEqual(html, '<p>/jumble Humans can easily read text where the middle letters are shuffled.</p>');
                done();
            });
        });
    });

    describe('/labrat', function() {
        it('/labrat', function(done) {
            mehdown.render('/labrat', function(err, html) {
                assert.equal(html, '<p><img src="https://res.cloudinary.com/mediocre/image/upload/v1537473791/mijjibf0vxdx79wtqrjh.png" /></p>');
                done();
            });
        });
    });

    describe('/leet', function() {
        it('/1337', function(done) {
            mehdown.render('/1337 elite hacker', function(err, html) {
                assert.equal(html, '<p>3L173 H4CK3R</p>');
                done();
            });
        });

        it('/l33t', function(done) {
            mehdown.render('/l33t elite hacker', function(err, html) {
                assert.equal(html, '<p>3L173 H4CK3R</p>');
                done();
            });
        });

        it('/leet', function(done) {
            mehdown.render('/leet elite hacker', function(err, html) {
                assert.equal(html, '<p>3L173 H4CK3R</p>');
                done();
            });
        });
    });

    describe('/lolspeak', function() {
        it('/lolspeak', function(done) {
            mehdown.render('/lolspeak A lolcat is an image macro of one or more cats. The image\'s text is often idiosyncratic and grammatically incorrect. Its use in this way is known as "lolspeak" or "kitty pidgin".', function(err, html) {
                assert.equal(html, '<p>A LOLCAT IZ AN IMAGE MACRO OV WAN OR MOAR CATS TEH IMAGE’S TEXT IZ OFTEN IDIOSYNCRATIC AN GRAMMATICALLY INCORRECT ITZ USE IN DIS WAI IZ KNOWN AS “LOLSPEAK” OR “KITTY PIDGIN”</p>');
                done();
            });
        });
    });

    describe('/piglatin', function() {
        it('/piglatin', function(done) {
            mehdown.render('/piglatin Juvenile language created by the rearrangement of sounds in a word such that the first sound is moved to the end and "ay" is added. In the case of a vowel as the first sound, "ay" is simply added, with an hyphen if necessary.', function(err, html) {
                assert.equal(html, '<p>Uvenilejay anguagelay eatedcray ybay ethay earrangementray ofay oundssay inay ay ordway uchsay atthay ethay irstfay oundsay isay ovedmay otay ethay enday anday “ay” isay addeday. Inay ethay asecay ofay ay owelvay asay ethay irstfay oundsay, “ay” isay implysay addeday, ithway anay yphenhay ifay ecessarynay.</p>');
                done();
            });
        });
    });

    describe('/reverse', function() {
        it('/reverse', function(done) {
            mehdown.render('/reverse Hello world.', function(err, html) {
                assert.equal(html, '<p>.dlrow olleH</p>');
                done();
            });
        });
    });

    describe('/roll', function() {
        it('/roll', function(done) {
            mehdown.render('/roll', function(err, html) {
                assert.notEqual(html, '<p>/roll</p>');
                assert(!html.includes('are invalid'));
                assert(html.includes('You rolled a'));
                assert(!html.includes('using the following'));
                done();
            });
        });

        it('/roll --help', function(done) {
            mehdown.render('/roll --help', function(err, html) {
                assert.notEqual(html, '<p>/roll --help</p>');
                assert(!html.includes('Invalid options'));
                assert(!html.includes('You rolled a'));
                assert(html.includes('Usage: /roll'));
                done();
            });
        });

        it('/roll 2d20 --show', function(done) {
            mehdown.render('/roll 2d20 --show', function(err, html) {
                assert.notEqual(html, '<p>/roll 2d20 --show</p>');
                assert(!html.includes('Invalid options'));
                assert(html.includes('You rolled a'));
                assert(html.includes('using the following 2 dice'));
                assert(!html.includes('Usage: /roll'));
                done();
            });
        });

        it('/roll 5d10+5', function(done) {
            mehdown.render('/roll 5d10+5', function(err, html) {
                assert.notEqual(html, '<p>/roll 5d10+5</p>');
                assert(!html.includes('Invalid options'));
                assert(html.includes('You rolled a'));
                assert(!html.includes('using the following'));
                assert(!html.includes('Usage: /roll'));
                done();
            });
        });

        it('/roll foo', function(done) {
            mehdown.render('/roll foo', function(err, html) {
                assert.notEqual(html, '<p>/roll foo</p>');
                assert(html.includes('Invalid options'));
                assert(!html.includes('You rolled a'));
                assert(!html.includes('using the following'));
                assert(!html.includes('Usage: /roll'));
                done();
            });
        });
    });

    describe('/rot13', function() {
        it('/rot13', function(done) {
            mehdown.render('/rot13 ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a simple letter substitution cipher that replaces a letter with the letter 13 letters after it in the alphabet.', function(err, html) {
                assert.equal(html, '<p>EBG13 (“ebgngr ol 13 cynprf”, fbzrgvzrf ulcurangrq EBG-13) vf n fvzcyr yrggre fhofgvghgvba pvcure gung ercynprf n yrggre jvgu gur yrggre 13 yrggref nsgre vg va gur nycunorg.</p>');
                done();
            });
        });
    });

    describe('/shrug', function() {
        it('/shrug', function(done) {
            mehdown.render('/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\_(ツ)_/¯</p>');
                done();
            });
        });

        it('/shrug\n/shrug', function(done) {
            mehdown.render('/shrug\n/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\_(ツ)_/¯<br />\n¯\\_(ツ)_/¯</p>');
                done();
            });
        });

        it('/shrug\n/shrug\n/shrug', function(done) {
            mehdown.render('/shrug\n/shrug\n/shrug', function(err, html) {
                assert.equal(html, '<p>¯\\_(ツ)_/¯<br />\n¯\\_(ツ)_/¯<br />\n¯\\_(ツ)_/¯</p>');
                done();
            });
        });

        it('/SHRUG', function(done) {
            mehdown.render('/SHRUG', function(err, html) {
                assert.equal(html, '<p>¯\\_(ツ)_/¯</p>');
                done();
            });
        });
    });

    describe('/tableflip', function() {
        it('/tableflip', function(done) {
            mehdown.render('/tableflip', function(err, html) {
                assert.equal(html, '<p>(╯°□°）╯︵ ┻━┻</p>');
                done();
            });
        });
    });

    describe('/vintner', function() {
        it('/vintner', function(done) {
            mehdown.render('/vintner', function(err, html) {
                assert.equal(html, '<p><img src="https://res.cloudinary.com/mediocre/image/upload/v1540480421/joddffo2zrhb1pzxz7le.png" /></p>');
                done();
            });
        });
    });

    describe('/whatdog', function() {
        this.timeout(10000);

        it('/whatdog', function(done) {
            mehdown.render('/whatdog', function(err, html) {
                assert.notEqual(html, '<p>/whatdog</p>');
                done();
            });
        });

        it('/whatdog foo', function(done) {
            mehdown.render('/whatdog foo', function(err, html) {
                assert.strictEqual(html, '<p>/whatdog foo<br />\nSomething went terribly wrong.</p>');
                done();
            });
        });

        it('/whatdog https://www.what-dog.net/Images/faces2/main007.jpg', function(done) {
            mehdown.render('/whatdog https://www.what-dog.net/Images/faces2/main007.jpg', function(err, html) {
                assert.equal(html, '<p>/whatdog<br />\n<img src="https://www.what-dog.net/Images/faces2/main007.jpg" /><br />\n<img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f436.png" title=":dog:" /> Scottish Terrier<br />\nLoving, sounds off at strangers, personable with its family</p>');
                done();
            });
        });

        it('/whatdog https://res.cloudinary.com/mediocre/image/upload/c_pad,f_auto,dpr_1.0,h_300,q_auto,w_300/pawhj2hpl5f4ivetd2ga.png', function(done) {
            mehdown.render('/whatdog https://res.cloudinary.com/mediocre/image/upload/c_pad,f_auto,dpr_1.0,h_300,q_auto,w_300/pawhj2hpl5f4ivetd2ga.png', function(err, html) {
                assert.equal(html, '<p>/whatdog<br />\n<img src="https://res.cloudinary.com/mediocre/image/upload/c_pad,f_auto,dpr_1.0,h_300,q_auto,w_300/pawhj2hpl5f4ivetd2ga.png" /><br />\n<img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/26d4.png" title=":no_entry:" /> Not a dog.</p>');
                done();
            });
        });
    });

    describe('/wootstalker', function() {
        this.timeout(10000);

        it('/wootstalker', function(done) {
            mehdown.render('/wootstalker', function(err, html) {
                assert.notEqual(html, '<p>/wootstalker</p>');
                assert(html.includes('Usage: /wootstalker site|url'));
                done();
            });
        });

        it('/wootstalker home', function(done) {
            mehdown.render('/wootstalker home', function(err, html) {
                assert.notEqual(html, '<p>/wootstalker home</p>');
                assert(html.includes('home.woot.com'));
                assert(html.includes('href'));
                done();
            });
        });

        it('/wootstalker notarealsite', function(done) {
            mehdown.render('/wootstalker notarealsite', function(err, html) {
                assert.notEqual(html, '<p>/wootstalker notarealsite</p>');
                assert(html.includes('notarealsite'));
                assert(html.includes('invalid site or URL entered'));
                assert(!html.includes('href'));
                done();
            });
        });

        it('/wootstalker https://electronics.woot.com/offers/parrot-quadcopter-swing-minidrone', function(done) {
            mehdown.render('/wootstalker https://electronics.woot.com/offers/parrot-quadcopter-swing-minidrone', function(err, html) {
                assert.notEqual(html, '<p>/wootstalker https://electronics.woot.com/offers/parrot-quadcopter-swing-minidrone</p>');
                assert(html.includes('Parrot Quadcopter Swing Minidrone'));
                assert(html.includes('href'));
                done();
            });
        });
    });

    describe('/youtube', function() {
        this.timeout(10000);

        if (process.env.GOOGLE_API_KEY) {
            it('/youtube Purple Reign', function(done) {
                mehdown.render('/youtube Purple Reign', function(err, html) {
                    assert.notEqual(html, '<p>/youtube Purple Reign</p>');
                    done();
                });
            });

            it('/youtube simon\'s cat', function(done) {
                mehdown.render('/youtube simon\'s cat', function(err, html) {
                    assert.notEqual(html, '<a href="https://www.youtube.com/channel/UCH6vXjt-BA7QHl0KnfL-7RQ" rel="nofollow" target="_blank">https://www.youtube.com/channel/UCH6vXjt-BA7QHl0KnfL-7RQ</a>');
                    done();
                });
            });
        }
    });
});

describe('detect image sizes', function() {
    it('images', function(done) {
        mehdown.render('https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /> <img height="528" src="https://res.cloudinary.com/mediocre/image/upload/kekjvvhpkxh0v8x9o6u7.png" width="528" /></p>');
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
        mehdown.render('//meh.com/404.png', { detectImageSizes: true }, function(err, html) {
            assert.equal(html, '<p><img src="//meh.com/404.png" /></p>');
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

    describe('removeAttribute', function() {
        it('removeAttribute()', function() {
            assert.strictEqual(mehdown.html.removeAttribute(), undefined);
        });

        it('removeAttribute(html, attribute)', function() {
            var html = '<div class="foo"><span>hello</span> <span>world</span></div>';
            assert.strictEqual(mehdown.html.removeAttribute(html, 'src'), '<div class="foo"><span>hello</span> <span>world</span></div>');
        });

        it('removeAttribute(html, attribute)', function() {
            var html = '<div class="foo"><span>hello</span> <span>world</span></div>';
            assert.strictEqual(mehdown.html.removeAttribute(html, 'class'), '<div ><span>hello</span> <span>world</span></div>');
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

    it('.deals is a TLD', function(done) {
        mehdown.render('https://example.deals', function(err, html) {
            assert.equal(html, '<p><a href="https://example.deals">https://example.deals</a></p>');
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

    it('anchor with blank href', function(done) {
        mehdown.render('[hello world]()', function(err, html) {
            assert.equal(html, '<p><a href="">hello world</a></p>');
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

describe('mehdown.kalturaEmbedHtml', function() {
    it('https://www.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/39156232/entry_id/0_meiqzwlr/embed/iframe?&flashvars[streamerType]=auto', function() {
        var html = mehdown.kalturaEmbedHtml('https://www.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/39156232/entry_id/0_meiqzwlr/embed/iframe?&flashvars[streamerType]=auto');
        assert.equal(html, '<iframe allowfullscreen class="kaltura" frameborder="0" src="https://cdnapisec.kaltura.com/p/2056591/embedIframeJs/uiconf_id/39156232?iframeembed=true&entry_id=0_meiqzwlr"></iframe>');
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