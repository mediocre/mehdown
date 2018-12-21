const usernameRegExp = /^\w{1,15}/;

module.exports = {
    validate: function(text, pos) {
        var tail = text.slice(pos);

        if (usernameRegExp.test(tail)) {
            return tail.match(usernameRegExp)[0].length;
        }

        return 0;
    },
    normalize: function(match, self) {
        match.url = `${self.baseUrl || ''}/${match.url}`;
    }
};