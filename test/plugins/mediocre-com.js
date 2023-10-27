const assert = require('assert');

const mehdown = require('../../lib');

describe('mediocre.com', function() {
    it('https://casemates.com/deals/a--slug', function(done) {
        mehdown.render('https://casemates.com/deals/a--slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://casemates.com/deals/a--slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://casemates.com/polls/a-slug', function(done) {
        mehdown.render('https://casemates.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://casemates.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('[text](https://casemates.com/polls/a--slug)', function(done) {
        mehdown.render('[text](https://casemates.com/polls/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://casemates.com/polls/a--slug">text</a></p>');
            done();
        });
    });

    it('https://mediocre.com/deals/a-slug', function(done) {
        mehdown.render('https://mediocre.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('http://mediocre.com/deals/a-slug', function(done) {
        mehdown.render('http://mediocre.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://www.mediocre.com/deals/a-slug', function(done) {
        mehdown.render('https://www.mediocre.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('www.mediocre.com/deals/a-slug', function(done) {
        mehdown.render('www.mediocre.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('mediocre.com/deals/a-slug', function(done) {
        mehdown.render('mediocre.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://mediocre.com/deals/a-slug/', function(done) {
        mehdown.render('https://mediocre.com/deals/a-slug/', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('bare relative url is just text', function(done) {
        mehdown.render('/deals/a-slug/', function(err, html) {
            assert.equal(html, '<p>/deals/a-slug/</p>');
            done();
        });
    });

    it('relative url with link text is just a link', function(done) {
        mehdown.render('[text](/deals/a-slug/)', function(err, html) {
            assert.equal(html, '<p><a href="/deals/a-slug/">text</a></p>');
            done();
        });
    });

    it('relative url to a deal forum post is a forum embed', function(done) {
        mehdown.render('[/deals/a-slug/](/deals/a-slug/)', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('relative url to a poll forum post is a forum embed', function(done) {
        mehdown.render('[/polls/a-slug/](/polls/a-slug/)', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('relative url not to a deal or poll forum post is just a link', function(done) {
        mehdown.render('[/links/a-slug/](/links/a-slug/)', function(err, html) {
            assert.equal(html, '<p><a href="/links/a-slug/">/links/a-slug/</a></p>');
            done();
        });
    });

    it('https://mediocre.com/polls/a-slug', function(done) {
        mehdown.render('https://mediocre.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://mediocre.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://mediocre.com/deals/a--slug', function(done) {
        mehdown.render('https://mediocre.com/deals/a--slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://mediocre.com/deals/a--slug/embed"></iframe></p>');
            done();
        });
    });

    it('[text](https://mediocre.com/deals/a--slug)', function(done) {
        mehdown.render('[text](https://mediocre.com/deals/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/deals/a--slug">text</a></p>');
            done();
        });
    });

    it('[text](https://mediocre.com/polls/a--slug)', function(done) {
        mehdown.render('[text](https://mediocre.com/polls/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/polls/a--slug">text</a></p>');
            done();
        });
    });

    it('https://mediocritee.com/polls/a-slug', function(done) {
        mehdown.render('https://mediocritee.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://mediocritee.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('[text](https://mediocritee.com/polls/a--slug)', function(done) {
        mehdown.render('[text](https://mediocritee.com/polls/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://mediocritee.com/polls/a--slug">text</a></p>');
            done();
        });
    });

    it('https://meh.com/deals/a-slug', function(done) {
        mehdown.render('https://meh.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('http://meh.com/deals/a-slug', function(done) {
        mehdown.render('http://meh.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://www.meh.com/deals/a-slug', function(done) {
        mehdown.render('https://www.meh.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('www.meh.com/deals/a-slug', function(done) {
        mehdown.render('www.meh.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('meh.com/deals/a-slug', function(done) {
        mehdown.render('meh.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://meh.com/deals/a-slug/', function(done) {
        mehdown.render('https://meh.com/deals/a-slug/', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://meh.com/polls/a-slug', function(done) {
        mehdown.render('https://meh.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://meh.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://meh.com/deals/a--slug', function(done) {
        mehdown.render('https://meh.com/deals/a--slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://meh.com/deals/a--slug/embed"></iframe></p>');
            done();
        });
    });

    it('[text](https://meh.com/deals/a--slug)', function(done) {
        mehdown.render('[text](https://meh.com/deals/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://meh.com/deals/a--slug">text</a></p>');
            done();
        });
    });

    it('[text](https://meh.com/polls/a--slug)', function(done) {
        mehdown.render('[text](https://meh.com/polls/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://meh.com/polls/a--slug">text</a></p>');
            done();
        });
    });

    it('https://morningsave.com/deals/a-slug', function(done) {
        mehdown.render('https://morningsave.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://morningsave.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://morningsave.com/polls/a-slug', function(done) {
        mehdown.render('https://morningsave.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://morningsave.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://pastadrop.com/deals/a-slug', function(done) {
        mehdown.render('https://pastadrop.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://pastadrop.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://pastadrop.com/polls/a-slug', function(done) {
        mehdown.render('https://pastadrop.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://pastadrop.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://sidedeal.com/deals/a-slug', function(done) {
        mehdown.render('https://sidedeal.com/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://sidedeal.com/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://sidedeal.com/polls/a-slug', function(done) {
        mehdown.render('https://sidedeal.com/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://sidedeal.com/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://casemates.com/deals/erik-banti-italian-sparkling-rosé', function(done) {
        mehdown.render('https://casemates.com/deals/erik-banti-italian-sparkling-rosé', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://casemates.com/deals/erik-banti-italian-sparkling-rosé/embed"></iframe></p>');
            done();
        });
    });
});