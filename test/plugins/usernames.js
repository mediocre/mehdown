const assert = require('assert');

const mehdown = require('../../lib');

describe('usernames', function() {
    it('@username', function(done) {
        mehdown.render('@username', function(err, html) {
            assert.equal(html, '<p><a href="/@username">@username</a></p>');
            done();
        });
    });

    it('@username (with baseUrl)', function(done) {
        mehdown.render('@username', { baseUrl: 'https://mediocre.com' }, function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/@username">@username</a></p>');
            done();
        });
    });

    it('@@username', function(done) {
        mehdown.render('@@username', function(err, html) {
            assert.equal(html, '<p>@@username</p>');
            done();
        });
    });

    it('@username @othername', function(done) {
        mehdown.render('@username @othername', function(err, html) {
            assert.equal(html, '<p><a href="/@username">@username</a> <a href="/@othername">@othername</a></p>');
            done();
        });
    });

    it('abc @username 123', function(done) {
        mehdown.render('abc @username 123', function(err, html) {
            assert.equal(html, '<p>abc <a href="/@username">@username</a> 123</p>');
            done();
        });
    });

    it('abc @username1 notausername@notausername @username2 123', function(done) {
        mehdown.render('abc @username1 notausername@notausername @username2 123', function(err, html) {
            assert.equal(html, '<p>abc <a href="/@username1">@username1</a> notausername@notausername <a href="/@username2">@username2</a> 123</p>');
            done();
        });
    });

    it('mediocre.com/@username', function(done) {
        mehdown.render('mediocre.com/@username', function(err, html) {
            assert.equal(html, '<p><a href="http://mediocre.com/@username">mediocre.com/@username</a></p>');
            done();
        });
    });

    it('http://mediocre.com/@username', function(done) {
        mehdown.render('http://mediocre.com/@username', function(err, html) {
            assert.equal(html, '<p><a href="http://mediocre.com/@username">http://mediocre.com/@username</a></p>');
            done();
        });
    });

    it('https://mediocre.com/@username', function(done) {
        mehdown.render('https://mediocre.com/@username', function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/@username">https://mediocre.com/@username</a></p>');
            done();
        });
    });

    it('<a href="https://mediocre.com/@username">@username</a>', function(done) {
        mehdown.render('[@username](https://mediocre.com/@username)', function(err, html) {
            assert.equal(html, '<p><a href="https://mediocre.com/@username">@username</a></p>');
            done();
        });
    });
});
