const assert = require('assert');

const mehdown = require('../../lib');

describe('casemates.com', function() {
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
});
