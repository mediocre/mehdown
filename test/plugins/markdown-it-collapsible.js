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

    it('should render expanded', function(done) {
        const markdown = '++> Click me!\nHidden text\n++>';

        mehdown.render(markdown, function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<details open="">\n<summary><span class="details-marker"></span>Click me!</summary><p>Hidden text</p>\n</details>');
            done();
        });
    });

    it('should support nested collapsibles', function(done) {
        const markdown = '++++ Click me!\nHidden text\n+++ Nested\nInner hidden text\n+++\n++++';

        mehdown.render(markdown, function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<details>\n<summary><span class="details-marker"></span>Click me!</summary><p>Hidden text</p>\n<details>\n<summary><span class="details-marker"></span>Nested</summary><p>Inner hidden text</p>\n</details>\n</details>');
            done();
        });
    });

    it('should support open nested collapsibles', function(done) {
        const markdown = '+++> Click me!\nHidden text\n+++ Nested\nInner hidden text\n+++\n+++>';

        mehdown.render(markdown, function(err, html) {
            assert.ifError(err);
            assert.strictEqual(html, '<details open="">\n<summary><span class="details-marker"></span>Click me!</summary><p>Hidden text</p>\n<details>\n<summary><span class="details-marker"></span>Nested</summary><p>Inner hidden text</p>\n</details>\n</details>');
            done();
        });
    });
});