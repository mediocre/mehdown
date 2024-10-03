# mehdown

[![Build Status](https://github.com/mediocre/mehdown/actions/workflows/continuousIntegration.yaml/badge.svg?branch=main)](https://github.com/mediocre/mehdown/actions?query=workflow%3Abuild+branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/mehdown/badge.svg?branch=main)](https://coveralls.io/github/mediocre/mehdown?branch=main)

The Markdown parser used on the forums at meh.com.

## Adds the following features to Markdown:

- Converts URL-like text to links.
- Converts image URLs to images.
- Converts audio URLs to audio players.
- Optionally detects image sizes.
- External links open in a new browser tab/window.
- Automatic detection of `@usernames`.
- Support for [tables in GitHub Flavored Markdown syntax](https://help.github.com/articles/organizing-information-with-tables/).
- Typographic replacements for `(c) (r) (tm) (p) +- ... !!! ??? --`.
- “Smartypants, double quotes” and ‘single quotes’
- Support for strikethrough using the `~~strikethrough~~` syntax.
- Support for adding anchors to headers.
- Better linebreak/newline support.

## Emoji

- Supports common emoji :shortnames:.
- Supports native unicode emoji: 😄.
- Supports ASCII smileys: :).

## Turns URLs from many popular sites into HTML embeds:

- GitHub gists are embedded inline.
- Image URLs are converted to images.
- imgur URLs are converted to embeded images/videos.
- Kickstarter URLs are converted to campaign previews.
- Reddit permalink URLs are converted to embeddable comment threads.
- SoundCloud URLs are converted to audio players.
- Twitter status URLs are converted to embeddable tweets.
- Vimeo URLs are converted to video players.
- Vine URLs are converted to video players.
- YouTube URLs are converted to video players.

## Supports /commands:

- `/8ball question` - Ask the Magic 8-Ball a question
- `/coinflip heads or tails` - Flip a coin
- `/concerned` - ಠ_ಠ
- `/cowsay text or --help` - [ASCII cow with a message](https://en.wikipedia.org/wiki/Cowsay)
- `/eightball question` - Ask the Magic 8-Ball a question
- `/emojify text` - Swap out words with emoji
- `/flip text` - uʍop ǝpısdn ʇxǝʇ dıʃℲ
- `/giphy text` - Post a random GIF
- `/google query` - Search Google for the specified query
- `/image text` - Post a random image
- `/jumble text` - Shuffele middele letetsrs of wodrs
- `/leet text` - Translate text to L3375P34K
- `/lolspeak text` - Translate text to LOLSPEAK
- `/piglatin text` - Translate text to igpay atinlay
- `/reverse text` - txet esreveR
- `/roll notation or --help` - Roll the dice
- `/shrug` - ¯\\\_(ツ)\_/¯
- `/tableflip` - (╯°□°）╯︵ ┻━┻
- `/youtube text` - Post a random YouTube video

## Supports a subset of BBCode tags

- `[b], [code], [i], [img], [quote], [s], [url], [youtube]`

## Usage

```
var mehdown = require('mehdown');

mehdown.render('markdown text here', { baseUrl: 'https://meh.com', commands: true, detectImageSizes: false }, function(err, html) {
    console.log(html);
});
```