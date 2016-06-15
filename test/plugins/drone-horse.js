const assert = require('assert');

const mehdown = require('../../lib');

describe('drone.horse', function() {
    it('https://drone.horse/deals/a-slug', function(done) {
        mehdown.render('https://drone.horse/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('http://drone.horse/deals/a-slug', function(done) {
        mehdown.render('http://drone.horse/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://www.drone.horse/deals/a-slug', function(done) {
        mehdown.render('https://www.drone.horse/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('www.drone.horse/deals/a-slug', function(done) {
        mehdown.render('www.drone.horse/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('drone.horse/deals/a-slug', function(done) {
        mehdown.render('drone.horse/deals/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://drone.horse/deals/a-slug/', function(done) {
        mehdown.render('https://drone.horse/deals/a-slug/', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://drone.horse/polls/a-slug', function(done) {
        mehdown.render('https://drone.horse/polls/a-slug', function(err, html) {
            assert.equal(html, '<p><iframe class="polls" frameborder="0" scrolling="no" src="https://drone.horse/polls/a-slug/embed"></iframe></p>');
            done();
        });
    });

    it('https://drone.horse/deals/a--slug', function(done) {
        mehdown.render('https://drone.horse/deals/a--slug', function(err, html) {
            assert.equal(html, '<p><iframe class="deals" frameborder="0" scrolling="no" src="https://drone.horse/deals/a--slug/embed"></iframe></p>');
            done();
        });
    });

    it('[text](https://drone.horse/deals/a--slug)', function(done) {
        mehdown.render('[text](https://drone.horse/deals/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://drone.horse/deals/a--slug">text</a></p>');
            done();
        });
    });

    it('[text](https://drone.horse/polls/a--slug)', function(done) {
        mehdown.render('[text](https://drone.horse/polls/a--slug)', function(err, html) {
            assert.equal(html, '<p><a href="https://drone.horse/polls/a--slug">text</a></p>');
            done();
        });
    });
});
