const assert = require('assert');

const mehdown = require('../../lib');

describe.only('unfurl', function() {
    it('https://www.npmjs.com/package/metascraper', function(done) {
        this.timeout(10000);

        mehdown.render('https://www.npmjs.com/package/metascraper', function(err, html) {
            console.log(html);
            assert.notEqual(html, '<p><a href="https://wine.woot.com/forums/viewpost.aspx?postid=7268481&amp;pageindex=12#post7293167">https://wine.woot.com/forums/viewpost.aspx?postid=7268481&amp;pageindex=12#post7293167</a></p>');
            done();
        });
    });
});
