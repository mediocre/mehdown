const assert = require('assert');

const mehdown = require('../../lib');

describe('katex', function() {
    it('$\\sqrt{3x-1}+(1+x)^2$', function(done) {
        mehdown.render('$\\sqrt{3x-1}+(1+x)^2$', function(err, html) {
            assert(html.includes('<span class="katex">'));
            done();
        });
    });
});