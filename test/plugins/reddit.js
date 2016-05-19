const assert = require('assert');

const mehdown = require('../../lib');

describe('Reddit URLs', function() {
    it('https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym', function(done) {
        mehdown.render('https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym', function(err, html) {
            assert.equal(html, '<p><div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-live="true"><a href="https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym">https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym</a></div><script async src="https://www.redditstatic.com/comment-embed.js"></script></p>');
            done();
        });
    });
});
