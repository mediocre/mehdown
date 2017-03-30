const assert = require('assert');

const mehdown = require('../../lib');

describe('mediocritee.com', function() {
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
});
