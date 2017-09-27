const assert = require('assert');

const mehdown = require('../../lib');

describe('xkcd', function() {
    var xkcd927ImgTag = '<img src="https://imgs.xkcd.com/comics/standards.png" title="Fortunately, the charging one has been solved now that we\'ve all standardized on mini-USB. Or is it micro-USB? Shit." />';

    it('Canonical XKCD url', function(done) {
        this.timeout(10000);

        mehdown.render('https://xkcd.com/927', function(err, html) {
            assert.equal(html, `<p><a class="xkcd-embed" href="https://xkcd.com/927">${xkcd927ImgTag}</a></p>`);
            done();
        });
    });

    it('HTTP url with ending slash', function(done) {
        mehdown.render('http://xkcd.com/927/', function(err, html) {
            assert.equal(html, `<p><a class="xkcd-embed" href="http://xkcd.com/927/">${xkcd927ImgTag}</a></p>`);
            done();
        });
    });

    it('HTTPS url with www & ending slash', function(done) {
        mehdown.render('https://www.xkcd.com/927/', function(err, html) {
            assert.equal(html, `<p><a class="xkcd-embed" href="https://www.xkcd.com/927/">${xkcd927ImgTag}</a></p>`);
            done();
        });
    });

    it('Scheme-relative url', function(done) {
        mehdown.render('//xkcd.com/927', function(err, html) {
            assert.equal(html, `<p><a class="xkcd-embed" href="//xkcd.com/927">${xkcd927ImgTag}</a></p>`);
            done();
        });
    });

    it('No protocol www url', function(done) {
        mehdown.render('www.xkcd.com/927', function(err, html) {
            assert.equal(html, `<p><a class="xkcd-embed" href="http://www.xkcd.com/927">${xkcd927ImgTag}</a></p>`);
            done();
        });
    });
});
