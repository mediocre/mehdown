const assert = require('assert');

const mehdown = require('../../lib');

describe('amazon', function() {
    it('https://www.amazon.com/dp/B0D3VQ6MH5', function(done) {
        mehdown.render('https://www.amazon.com/dp/B0D3VQ6MH5', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?tag=mehdown-20">https://www.amazon.com/dp/B0D3VQ6MH5</a></p>');
            done();
        });
    });

    it('https://www.amazon.com/dp/B0D3VQ6MH5?th=1', function(done) {
        mehdown.render('https://www.amazon.com/dp/B0D3VQ6MH5?th=1', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?th=1&tag=mehdown-20">https://www.amazon.com/dp/B0D3VQ6MH5?th=1</a></p>');
            done();
        });
    });

    it('https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar', function(done) {
        mehdown.render('https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar&tag=mehdown-20">https://www.amazon.com/dp/B0D3VQ6MH5?th=1&amp;foo=bar</a></p>');
            done();
        });
    });

    it('https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace', function(done) {
        mehdown.render('https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace">https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace</a></p>');
            done();
        });
    });

    it('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5)', function(done) {
        mehdown.render('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5)', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?tag=mehdown-20">amazon link</a></p>');
            done();
        });
    });

    it('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?th=1)', function(done) {
        mehdown.render('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?th=1)', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?th=1&tag=mehdown-20">amazon link</a></p>');
            done();
        });
    });

    it('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar)', function(done) {
        mehdown.render('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar)', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?th=1&foo=bar&tag=mehdown-20">amazon link</a></p>');
            done();
        });
    });

    it('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace)', function(done) {
        mehdown.render('[amazon link](https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace)', function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<p><a href="https://www.amazon.com/dp/B0D3VQ6MH5?tag=donotreplace">amazon link</a></p>');
            done();
        });
    });
});