const assert = require('assert');

const mehdown = require('../../lib');

describe('meh.com', function() {
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
});
