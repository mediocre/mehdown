const assert = require('assert');

const mehdown = require('../../lib');

describe('markdown-it-collapsible', function() {
    it('should render <details> and <summary>', function(done) {
        const markdown = '+++ Click me!\nHidden text\n+++';

        mehdown.render(markdown, function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<details>\n<summary><span class="details-marker"></span>Click me!</summary><p>Hidden text</p>\n</details>');
            done();
        });
    });
});