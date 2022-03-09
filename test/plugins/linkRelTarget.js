const assert = require('assert');

const mehdown = require('../../lib');

describe('linksRelTarget', function() {
    it('should not set rel attribute or target attribute if there is no baseUrl specified', function(done) {
        mehdown.render('[Google](https://www.google.com)', function(err, html) {
            assert.equal(html, '<p><a href="https://www.google.com">Google</a></p>');
            done();
        });
    });

    it('should set rel attribute to "nofollow" and target attribute to "_blank" for a URL that is not at the same domain as the base URL', function(done) {
        mehdown.render('[Google](https://www.google.com)', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="https://www.google.com" rel="nofollow" target="_blank">Google</a></p>');
            done();
        });
    });

    it('should set rel attribute to "nofollow" and target attribute to "_blank" for a scheme relative URL that is not at the same domain as the base URL', function(done) {
        mehdown.render('[Google](//www.google.com)', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="//www.google.com" rel="nofollow" target="_blank">Google</a></p>');
            done();
        });
    });

    it('should not set rel attribute or target attribute for a local URL', function(done) {
        mehdown.render('[path](/path)', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="/path">path</a></p>');
            done();
        });
    });

    it('should not set rel attribute to "nofollow" and target attribute to "_blank" for a baseUrl with an IP address and port', function(done) {
        mehdown.render('[path](https://localhost:8000/path)', { baseUrl: 'https://localhost:8000' }, function(err, html) {
            assert.equal(html, '<p><a href="https://localhost:8000/path">path</a></p>');
            done();
        });
    });

    it('should not set rel attribute to "nofollow" and target attribute to "_blank" for a URL that is at the same domain as the base URL', function(done) {
        mehdown.render('[path](https://mediocre.com/path)', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/path">path</a></p>');
            done();
        });
    });
});
