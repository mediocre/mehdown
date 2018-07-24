const assert = require('assert');

const mehdown = require('../../lib');

describe('emoji', function() {
    it('test toImage', function(done) {
        mehdown.render('Hello world! 😄 :smile:', function(err, html) {
            assert.equal(html, '<p>Hello world! <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /> <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /></p>');
            done();
        });
    });

    it('options', function(done) {
        mehdown.render('Hello world! 😄 :smile:', { emoji: { imagePathPNG: 'https://example.com/' } }, function(err, html) {
            assert.equal(html, '<p>Hello world! <img alt="" class="emojione" src="https://example.com/1f604.png" title=":smile:" /> <img alt="" class="emojione" src="https://example.com/1f604.png" title=":smile:" /></p>');
            done();
        });
    });

    it('mixed ascii, regular unicode and duplicate emoji', function(done) {
        mehdown.render(':alien: is 👽 and 저 is not :alien: or :alien: also :randomy: is not emoji', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f47d.png" title=":alien:" /> is <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f47d.png" title=":alien:" /> and 저 is not <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f47d.png" title=":alien:" /> or <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f47d.png" title=":alien:" /> also :randomy: is not emoji</p>');
            done();
        });
    });

    it('ASCII smileys', function(done) {
        mehdown.render(':)', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f642.png" title=":)" /></p>');
            done();
        });
    });

    it('Unicode 9.0 and 10.0 emoji', function(done) {
        mehdown.render(':rofl: and :face_with_monocle: are from Unicode 9.0 and 10.0, respectively.', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f923.png" title=":rofl:" /> and <img alt="" class="emojione" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f9d0.png" title=":face_with_monocle:" /> are from Unicode 9.0 and 10.0, respectively.</p>');
            done();
        });
    });

    it('jumbomoji (single emoji)', function(done) {
        mehdown.render(':smile:', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /></p>');
            done();
        });
    });

    it('jumbomoji (multiple emoji)', function(done) {
        mehdown.render('😄 :smile:', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /> <img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /></p>');
            done();
        });
    });

    it('jumbomoji (multiple line emoji)', function(done) {
        mehdown.render('😄\n:smile:', function(err, html) {
            assert.equal(html, '<p><img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /><br />\n<img alt="" class="emojione jumbo" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/64/1f604.png" title=":smile:" /></p>');
            done();
        });
    });
});
