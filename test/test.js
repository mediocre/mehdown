var assert = require('assert');
var mehdown = require('../lib');

describe('hashtags', function() {
    it(' #tag', function() {
        var text = mehdown.parse(' #tag');
        assert.equal(text, ' <a href="https://mediocre.com/tags/tag">#tag</a>');
    });

    it('abc #tag 123', function() {
        var text = mehdown.parse('abc #tag 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/tags/tag">#tag</a> 123');
    });

    it('abc #tag-1 not-a-tag#not-a-tag #tag-2 123', function() {
        var text = mehdown.parse('abc #tag-1 not-a-tag#not-a-tag #tag-2 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/tags/tag-1">#tag-1</a> not-a-tag#not-a-tag <a href="https://mediocre.com/tags/tag-2">#tag-2</a> 123');
    });
});

describe('usernames', function() {
    it('@username', function() {
        var text = mehdown.parse('@username');
        assert.equal(text, '<a href="https://mediocre.com/users/username">@username</a>');
    });

    it('abc @username 123', function() {
        var text = mehdown.parse('abc @username 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/users/username">@username</a> 123');
    });

    it('abc @username1 notausername@notausername @username2 123', function() {
        var text = mehdown.parse('abc @username1 notausername@notausername @username2 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/users/username1">@username1</a> notausername@notausername <a href="https://mediocre.com/users/username2">@username2</a> 123');
    });
});

describe('hashtags, usernames', function() {
    it('abc #tag @username 123', function() {
        var text = mehdown.parse('abc #tag @username 123');
        assert.equal(text, 'abc <a href="https://mediocre.com/tags/tag">#tag</a> <a href="https://mediocre.com/users/username">@username</a> 123');
    });
});