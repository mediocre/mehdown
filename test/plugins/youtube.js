const assert = require('assert');

const mehdown = require('../../lib');

describe('youtube', function() {
    it('http://www.youtube.com/watch?v=kU9MuM4lP18', function(done) {
        mehdown.render('http://www.youtube.com/watch?v=kU9MuM4lP18', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
            done();
        });
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18 http://www.youtube.com/watch?v=eGDBR2L5kzI', function(done) {
        mehdown.render('http://www.youtube.com/watch?v=kU9MuM4lP18 http://www.youtube.com/watch?v=eGDBR2L5kzI', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light"></iframe> <iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/eGDBR2L5kzI?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
            done();
        });
    });

    it('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk', function(done) {
        mehdown.render('http://www.youtube.com/watch?feature=player_embedded&v=zIEIvi2MuEk', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
            done();
        });
    });

    it('`&amp;` instead of `&` in URL', function(done) {
        mehdown.render('http://www.youtube.com/watch?feature=player_embedded&amp;v=zIEIvi2MuEk', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/zIEIvi2MuEk?autohide=1&color=white&showinfo=0&theme=light"></iframe></p>');
            done();
        });
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10', function(done) {
        mehdown.render('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&start=10"></iframe></p>');
            done();
        });
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10', function(done) {
        mehdown.render('http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&start=10"></iframe></p>');
            done();
        });
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20', function(done) {
        mehdown.render('http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="https://www.youtube.com/embed/kU9MuM4lP18?autohide=1&color=white&showinfo=0&theme=light&end=20&start=10"></iframe></p>');
            done();
        });
    });

    it('[text](http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20)', function(done) {
        mehdown.render('[text](http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20)', function(err, html) {
            assert.equal(html, '<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18&amp;start=10&amp;end=20">text</a></p>');
            done();
        });
    });
});
