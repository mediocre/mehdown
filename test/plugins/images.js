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
        mehdown.render('http://i.imgur.com/9oiY1aO.jpg', function(err, html) {
            assert.equal(html, '<p><img src="http://i.imgur.com/9oiY1aO.jpg" /></p>');
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
});
