const assert = require('assert');

const mehdown = require('../../lib');

describe('Vine', function() {
    it('https://vine.co/v/eLnKWtjTJup', function(done) {
        mehdown.render('https://vine.co/v/eLnKWtjTJup', function(err, html) {
            assert.equal(html, '<p><iframe class="vine" frameborder="0" height="480" src="https://vine.co/v/eLnKWtjTJup/embed/simple" width="480"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script></p>');
            done();
        });
    });

    it('https://vine.co/v/eLnKWtjTJup/embed', function(done) {
        mehdown.render('https://vine.co/v/eLnKWtjTJup/embed', function(err, html) {
            assert.equal(html, '<p><iframe class="vine" frameborder="0" height="480" src="https://vine.co/v/eLnKWtjTJup/embed/simple" width="480"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script></p>');
            done();
        });
    });

    it('https://vine.co/v/eLnKWtjTJup/similar', function(done) {
        mehdown.render('https://vine.co/v/eLnKWtjTJup/similar', function(err, html) {
            assert.equal(html, '<p><iframe class="vine" frameborder="0" height="480" src="https://vine.co/v/eLnKWtjTJup/embed/simple" width="480"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script></p>');
            done();
        });
    });
});
