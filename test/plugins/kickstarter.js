const assert = require('assert');

const mehdown = require('../../lib');

describe('kickstarter', function() {
    it('https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec', function(done) {
        mehdown.render('https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec', function(err, html) {
            assert.equal(html, '<p><iframe class="kickstarter" frameborder="0" scrolling="no" src="https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary/widget/card.html"></iframe></p>');
            done();
        });
    });

    it('https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary?ref=discover_rec', function(done) {
        mehdown.render('https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary?ref=discover_rec', function(err, html) {
            assert.equal(html, '<p><iframe class="kickstarter" frameborder="0" scrolling="no" src="https://www.kickstarter.com/projects/schlock/crossing-paths-film-photography-documentary/widget/card.html"></iframe></p>');
            done();
        });
    });
});
