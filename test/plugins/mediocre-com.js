const assert = require('assert');

const mehdown = require('../../lib');

describe('mediocre.com', function() {
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
});
