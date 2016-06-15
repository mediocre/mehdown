const assert = require('assert');

const mehdown = require('../../lib');

describe('twitter', function() {
    it('https://twitter.com/mediocrelabs/status/410516133955907584', function(done) {
        mehdown.render('https://twitter.com/mediocrelabs/status/410516133955907584', function(err, html) {
            assert.equal(html, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/mediocrelabs/status/410516133955907584"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
            done();
        });
    });

    it('https://twitter.com/_/status/416050320272551936', function(done) {
        mehdown.render('https://twitter.com/_/status/416050320272551936', function(err, html) {
            assert.equal(html, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
            done();
        });
    });

    it('[text](https://twitter.com/_/status/416050320272551936)', function(done) {
        mehdown.render('[text](https://twitter.com/_/status/416050320272551936)', function(err, html) {
            assert.equal(html, '<p><a href="https://twitter.com/_/status/416050320272551936">text</a></p>');
            done();
        });
    });

    it('twitter.com/_/status/416050320272551936', function(done) {
        mehdown.render('twitter.com/_/status/416050320272551936', function(err, html) {
            assert.equal(html, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
            done();
        });
    });

    it('www.twitter.com/_/status/416050320272551936', function(done) {
        mehdown.render('www.twitter.com/_/status/416050320272551936', function(err, html) {
            assert.equal(html, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
            done();
        });
    });
});
