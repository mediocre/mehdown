const assert = require('assert');

const mehdown = require('../../lib');

describe('headers', function() {
    it('adds ids for anchors', function(done) {
        mehdown.render('# What is meh', function(err, html) {
            assert.strictEqual(html, '<h1 id="what-is-meh">What is meh</h1>');
            done();
        });
    });

    it('adds the specified id as a suffix to the anchor id', function(done) {
        mehdown.render('## What is meh', { id: '012fed' }, function(err, html) {
            assert.strictEqual(html, '<h2 id="what-is-meh-012fed">What is meh</h2>');
            done();
        });
    });

    it('handle header text with non alpha-numeric characters', function(done) {
        mehdown.render('### What. is!meh?', { id: '0.1!2?f..e!!d??' }, function(err, html) {
            assert.strictEqual(html, '<h3 id="what-ismeh-012fed">What. is!meh?</h3>');
            done();
        });
    });

    it('handle header text with multiple spaces', function(done) {
        mehdown.render('#### What. is ! meh     ?', { id: '0. 1! 2?f. . e! !d? ?' }, function(err, html) {
            assert.strictEqual(html, '<h4 id="what-is-meh-0-1-2f-e-d">What. is ! meh     ?</h4>');
            done();
        });
    });

    it('handle suffix with non alpha-numeric characters', function(done) {
        mehdown.render('##### a- -b?c', { id: '!@#$%^&*()=+`~,./;\'<>?:"[]{}|' }, function(err, html) {
            assert.strictEqual(html, '<h5 id="a-bc">a- -b?c</h5>');
            done();
        });
    });

    it('collapse multiple hyphens', function(done) {
        mehdown.render('###### -- - What - - is --- -   - meh - - -', { id: '!@#$%^&*()=+`~,./;\'<>?:"[]{}|' }, function(err, html) {
            assert.strictEqual(html, '<h6 id="what-is-meh">– - What - - is — -   - meh - - -</h6>');
            done();
        });
    });

    it('handle header with other tags inside', function(done) {
        mehdown.render('# **bold**', function(err, html) {
            assert.strictEqual(html, '<h1 id="bold"><strong>bold</strong></h1>');
            done();
        });
    });
});
