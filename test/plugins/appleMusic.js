const assert = require('assert');

const mehdown = require('../../lib');

describe('Apple Music', function() {
    it('https://itunes.apple.com/us/album/the-rescues/id1233432159', function(done) {
        mehdown.render('https://itunes.apple.com/us/album/the-rescues/id1233432159', function(err, html) {
            assert.equal(html, '<p><iframe class="apple-music" frameborder="0" src="//tools.applemusic.com/embed/v1/album/1233432159"></iframe></p>');
            done();
        });
    });
});
