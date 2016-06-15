const assert = require('assert');

const mehdown = require('../../lib');

describe('soundcloud', function() {
    it('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(done) {
        mehdown.render('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(err, html) {
            assert.equal(html, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
            done();
        });
    });

    it('[text](https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town)', function(done) {
        mehdown.render('[text](https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town)', function(err, html) {
            assert.equal(html, '<p><a href="https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town">text</a></p>');
            done();
        });
    });

    it('soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(done) {
        mehdown.render('soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(err, html) {
            assert.equal(html, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
            done();
        });
    });

    it('www.soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(done) {
        mehdown.render('www.soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function(err, html) {
            assert.equal(html, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>');
            done();
        });
    });
});
