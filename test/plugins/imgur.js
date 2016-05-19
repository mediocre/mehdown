const assert = require('assert');

const mehdown = require('../../lib');

describe('imgur', function() {
    it('http://i.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('http://i.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
            done();
        });
    });
});
