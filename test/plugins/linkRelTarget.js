const assert = require('assert');

const mehdown = require('../../lib');

describe('anchors', function() {
    it('rel attributes', function(done) {
        mehdown.render('[Google](http://www.google.com)', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="http://www.google.com" rel="nofollow" target="_blank">Google</a></p>');
            done();
        });
    });

    it.skip('target attributes', function() {
        var text = mehdown.parse('<p><a target="abc" href="http://www.google.com">Google</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://www.google.com">Google</a></p>');
    });

    it.skip('local href', function() {
        var text = mehdown.parse('<p><a href="/path">path</a></p>');
        assert.equal(text, '<p><a href="/path">path</a></p>');
    });

    it.skip('127.0.0.1 href', function() {
        mehdown.baseUrl = 'http://127.0.0.1:8000';
        var text = mehdown.parse('<p><a href="http://127.0.0.1:8000/path">path</a></p>');
        assert.equal(text, '<p><a href="http://127.0.0.1:8000/path">path</a></p>');
        mehdown.baseUrl = defaultBaseUrl;
    });

    it.skip('mediocre href', function() {
        var text = mehdown.parse('<p><a href="https://mediocre.com/path">path</a></p>');
        assert.equal(text, '<p><a href="https://mediocre.com/path">path</a></p>');
    });
});
