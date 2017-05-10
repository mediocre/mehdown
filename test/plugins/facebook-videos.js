const assert = require('assert');

const mehdown = require('../../lib');

describe('facebook videos', function() {
    it('https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/', function(done) {
        mehdown.render('https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="facebook video" frameborder="0" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FFacebookDevelopers%2Fvideos%2F10152454700553553%2F"></iframe></p>');
            done();
        });
    });
});
