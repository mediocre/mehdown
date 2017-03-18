const assert = require('assert');

const mehdown = require('../../lib');

describe('images', function() {
    it('.jpeg', function(done) {
        const image = 'http://example.com/image.jpeg';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('.jpg', function(done) {
        const image = 'http://i.imgur.com/9oiY1aO.jpg';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('.gif', function(done) {
        const image = 'http://www.bubblews.com/assets/images/news/225123606_1387763263.gif';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('.png', function(done) {
        const image = 'http://fc09.deviantart.net/fs44/f/2009/067/a/a/Green_Humming_Bird_PNG_by_pixievamp_stock.png';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('.jpg with long url and query string', function(done) {
        const image = 'http://images.nationalgeographic.com/wpf/media-live/photos/000/770/cache/payunia-volcano-argentina_77070_990x742.jpg?01AD=3jGr9FxQ0BANJabwfZqq7ejovySQ1dQw8kO0oygkZlKrsJUzb-jUb7Q&01RI=1E4070A575D8186&01NA=na';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('.png with %20 (space) in url', function(done) {
        const image = 'http://izaak.jellinek.com/tuxes/images/big%20tux.png';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png', function(done) {
        const image = 'http://cl.ly/image/0w251W2U1f1Q/Screen%20Shot%202014-06-16%20at%201.26.25%20PM.png';

        mehdown.render(image, function(err, html) {
            assert.equal(html, `<p><a href="${image}" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });

    it('should not render image tags for image URLs in Markdown URL syntax', function(done) {
        const image = 'https://res.cloudinary.com/mediocre/image/upload/v1463770987/poaddeitz7s97sz47s7z.jpg';

        mehdown.render(`[Fold out back](${image})`, function(err, html) {
            assert.equal(html, `<p><a href="${image}">Fold out back</a></p>`);
            done();
        });
    });

    it('should render images linked to other urls with markdown', function(done) {
        const otherUrl = 'http://www.example.com';
        const image = 'https://www.images.com/someImage.jpg';

        mehdown.render(`[${image}](${otherUrl})`, function(err, html) {
            assert.equal(html, `<p><a href="${otherUrl}/" target="_blank"><img src="${image}" /></a></p>`);
            done();
        });
    });
});
