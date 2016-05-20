const assert = require('assert');

const mehdown = require('../../lib');

describe('vimeo', function() {
    it('http://vimeo.com/78950165', function(done) {
        mehdown.render('http://vimeo.com/78950165', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="vimeo" frameborder="0" src="https://player.vimeo.com/video/78950165"></iframe></p>');
            done();
        });
    });
});
