const assert = require('assert');

const mehdown = require('../../lib');

describe('images', function() {
    it('.jpeg', function(done) {
        mehdown.render('http://example.com/image.jpeg', function(err, html) {
            assert.equal(html, '<p><img src="http://example.com/image.jpeg" /></p>');
            done();
        });
    });

    it('.jpg', function(done) {
        mehdown.render('http://example.com/image.jpg', function(err, html) {
            assert.equal(html, '<p><img src="http://example.com/image.jpg" /></p>');
            done();
        });
    });

    it('.gif', function(done) {
        mehdown.render('http://www.bubblews.com/assets/images/news/225123606_1387763263.gif', function(err, html) {
            assert.equal(html, '<p><img src="http://www.bubblews.com/assets/images/news/225123606_1387763263.gif" /></p>');
            done();
        });
    });

    it('.png', function(done) {
        mehdown.render('http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png', function(err, html) {
            assert.equal(html, '<p><img src="http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png" /></p>');
            done();
        });
    });

    it('.jpg with long url and query string', function(done) {
        mehdown.render('http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na', function(err, html) {
            assert.equal(html, '<p><img src="http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na" /></p>');
            done();
        });
    });

    it('.png with %20 (space) in url', function(done) {
        mehdown.render('http://izaak.jellinek.com/tuxes/images/big%20tux.png', function(err, html) {
            assert.equal(html, '<p><img src="http://izaak.jellinek.com/tuxes/images/big%20tux.png" /></p>');
            done();
        });
    });

    it('http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png', function(done) {
        mehdown.render('http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png', function(err, html) {
            assert.equal(html, '<p><img src="http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png" /></p>');
            done();
        });
    });

    it('should not render image tags for image URLs in Markdown URL syntax', function(done) {
        mehdown.render('[Fold out back](https://res.cloudinary.com/mediocre/image/upload/v1463770987/poaddeitz7s97sz47s7z.jpg)', function(err, html) {
            assert.equal(html, '<p><a href="https://res.cloudinary.com/mediocre/image/upload/v1463770987/poaddeitz7s97sz47s7z.jpg">Fold out back</a></p>');
            done();
        });
    });
});