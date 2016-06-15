const assert = require('assert');

const mehdown = require('../../lib');

describe('imgur', function() {
    it('http://i.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('http://i.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
            done();
        });
    });

    it('[text](http://i.imgur.com/zvATqgs.gifv)', function(done) {
        mehdown.render('[text](http://i.imgur.com/zvATqgs.gifv)', function(err, html) {
            assert.equal(html, '<p><a href="http://i.imgur.com/zvATqgs.gifv">text</a></p>');
            done();
        });
    });

    it('imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
            done();
        });
    });

    it('i.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('i.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
            done();
        });
    });

    it('www.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('www.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-gifv"><video autoplay loop muted><source type="video/webm" src="https://i.imgur.com/zvATqgs.webm" /><source type="video/mp4" src="https://i.imgur.com/zvATqgs.mp4" /></video></div></p>');
            done();
        });
    });
});
