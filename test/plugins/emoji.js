const assert = require('assert');

const mehdown = require('../../lib');

describe('emoji', function() {
    it('test toImage', function(done) {
        mehdown.render('Hello world! 😄 :smile:', function(err, html) {
            assert.equal(html, '<p>Hello world! <img class="emojione" title=":smile:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f604.png?v=2.1.4"/> <img class="emojione" title=":smile:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f604.png?v=2.1.4"/></p>');
            done();
        });
    });

    it('options', function(done) {
        mehdown.render('Hello world! 😄 :smile:', { emoji: { imagePathPNG: 'https://example.com/' } }, function(err, html) {
            assert.equal(html, '<p>Hello world! <img class="emojione" title=":smile:" src="https://example.com/1f604.png?v=2.1.4"/> <img class="emojione" title=":smile:" src="https://example.com/1f604.png?v=2.1.4"/></p>');
            done();
        });
    });

    it('mixed ascii, regular unicode and duplicate emoji', function(done) {
        mehdown.render(':alien: is 👽 and 저 is not :alien: or :alien: also :randomy: is not emoji', function(err, html) {
            assert.equal(html, '<p><img class="emojione" title=":alien:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f47d.png?v=2.1.4"/> is <img class="emojione" title=":alien:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f47d.png?v=2.1.4"/> and 저 is not <img class="emojione" title=":alien:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f47d.png?v=2.1.4"/> or <img class="emojione" title=":alien:" src="https://cdn.jsdelivr.net/emojione/assets/png/1f47d.png?v=2.1.4"/> also :randomy: is not emoji</p>');
            done();
        });
    });

    it('ASCII smileys', function(done) {
        mehdown.render(':)', function(err, html) {
            assert.equal(html, '<p><img class="emojione" title=":)" src="https://cdn.jsdelivr.net/emojione/assets/png/1f642.png?v=2.1.4"/></p>');
            done();
        });
    });
});
