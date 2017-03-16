const assert = require('assert');

const mehdown = require('../../lib');

describe('twitch', function() {
    it('https://www.twitch.tv/twitchplayspokemon', function(done) {
        mehdown.render('https://www.twitch.tv/twitchplayspokemon', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen="true" class="twitch-video" frameborder="0" src="https://player.twitch.tv/?channel=twitchplayspokemon&muted=true"></iframe><iframe class="twitch-chat" frameborder="0" src="https://www.twitch.tv/twitchplayspokemon/chat"></iframe></p>');
            done();
        });
    });
});
