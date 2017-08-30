const assert = require('assert');

const mehdown = require('../../lib');

describe('gist', function() {
    it('https://gist.github.com/javamatte/f75cc07313f45d5b78cdc967f0dabd05', function(done) {
        mehdown.render('https://gist.github.com/javamatte/f75cc07313f45d5b78cdc967f0dabd05', function(err, html) {
            assert.equal(html, '<p><script src="https://gist.github.com/javamatte/f75cc07313f45d5b78cdc967f0dabd05.js"></script></p>');
            done();
        });
    });
});
