const assert = require('assert');

const mehdown = require('../../lib');

describe('imgur', function() {
    it('http://i.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('http://i.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="zvATqgs"><a href="//imgur.com/zvATqgs">imgur.com/zvATqgs</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div></p>');
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
            assert.equal(html, '<p><a href="http://imgur.com/zvATqgs.gifv">imgur.com/zvATqgs.gifv</a></p>');
            done();
        });
    });

    it('i.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('i.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="zvATqgs"><a href="//imgur.com/zvATqgs">imgur.com/zvATqgs</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div></p>');
            done();
        });
    });

    it('www.imgur.com/zvATqgs.gifv', function(done) {
        mehdown.render('www.imgur.com/zvATqgs.gifv', function(err, html) {
            assert.equal(html, '<p><a href="http://www.imgur.com/zvATqgs.gifv">www.imgur.com/zvATqgs.gifv</a></p>');
            done();
        });
    });

    it('https://i.imgur.com/Al5Q80f.jpg', function(done) {
        mehdown.render('https://i.imgur.com/Al5Q80f.jpg', function(err, html) {
            assert.equal(html, '<p><div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="Al5Q80f"><a href="//imgur.com/Al5Q80f">imgur.com/Al5Q80f</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div></p>');
            done();
        });
    });

    it('https://i.imgur.com/PySOiro.gif', function(done) {
        mehdown.render('https://i.imgur.com/PySOiro.gif', function(err, html) {
            assert.equal(html, '<p><div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="PySOiro"><a href="//imgur.com/PySOiro">imgur.com/PySOiro</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div></p>');
            done();
        });
    });

    it('https://i.imgur.com/XyXKUBp_d.jpg?maxwidth=640&shape=thumb&fidelity=medium', function(done) {
        mehdown.render('https://i.imgur.com/XyXKUBp_d.jpg?maxwidth=640&shape=thumb&fidelity=medium', function(err, html) {
            assert.equal(html, '<p><div class="imgur-embed"><blockquote class="imgur-embed-pub" lang="en" data-id="XyXKUBp"><a href="//imgur.com/XyXKUBp">imgur.com/XyXKUBp</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></div></p>');
            done();
        });
    });
});