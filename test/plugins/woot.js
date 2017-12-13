const assert = require('assert');

const mehdown = require('../../lib');

describe('woot', function() {
    it('Wine.Woot', function(done) {
        this.timeout(10000);

        mehdown.render('https://wine.woot.com/forums/viewpost.aspx?postid=7268481&pageindex=12#post7293167', function(err, html) {
            assert.notEqual(html, '<p><a href="https://wine.woot.com/forums/viewpost.aspx?postid=7268481&amp;pageindex=12#post7293167">https://wine.woot.com/forums/viewpost.aspx?postid=7268481&amp;pageindex=12#post7293167</a></p>');
            done();
        });
    });
});
