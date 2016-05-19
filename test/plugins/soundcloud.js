const assert = require('assert');

const mehdown = require('../../lib');

describe('SoundCloud', function() {
    it('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(done) {
        mehdown.render('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(err, html) {
            assert.equal(html, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
            done();
        });
    });
});
