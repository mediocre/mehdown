mehdown
=======

The Markdown parser used on the forums at meh.com.

## Adds the following features to Markdown:

Converts URL-like text to links: https://meh.com
Converts image URLs to images: https://res.cloudinary.com/mediocre/image/upload/Meh36Faces128px_01_t366di.png
Optionally detects image sizes.
External links open in a new browser tab/window: https://www.woot.com
Automatic detection of `@usernames`: @shawn
Support for [tables in GitHub Flavored Markdown syntax](https://help.github.com/articles/organizing-information-with-tables/).
Typographic replacements for `(c) (r) (tm) (p) +- ... !!! ??? --`: (c) (r) (tm) (p) +- ... !!! ??? --
“Smartypants, double quotes” and ‘single quotes’
Support for strikethrough using the `~~strikethrough~~` syntax: ~~strikethrough~~
Support for adding anchors to headers.
Better linebreak/newline support.

## Emoji

- Supports common emoji :shortnames: :heart:.
- Supports native unicode emoji: 😄.
- Supports ASCII smileys: :)

## Supports turning URLs from many popular sites into HTML embeds:

GitHub gists are displayed inline.
https://gist.github.com/javamatte/f75cc07313f45d5b78cdc967f0dabd05

Image URLs are converted to images.
https://res.cloudinary.com/mediocre/image/upload/Meh36Faces128px_01_t366di.png

imgur GIFV URLs are converted to high quality looping GIF videos.
http://i.imgur.com/zvATqgs.gifv

Kickstarter URLs are converted to campaign previews.
https://www.kickstarter.com/projects/1270124222/crossing-paths-film-photography-documentary?ref=discover_rec

Reddit permalink URLs are converted to embeddable comment threads.
https://www.reddit.com/r/ProgrammerHumor/comments/30lhaf/mehcom_api_url_poking_at_steve_balmer/cptizym

SoundCloud URLs are converted to audio players.
https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town

Twitter status URLs are converted to embeddable tweets.
https://twitter.com/mediocrelabs/status/410516133955907584

Vimeo URLs are converted to video players.
http://vimeo.com/78950165

Vine URLs are converted to video players.
https://vine.co/v/hWZ9mbJZaKE

YouTube URLs are converted to video players.
http://www.youtube.com/watch?v=kU9MuM4lP18&start=10&end=20

## Supports /commands:

- `/shrug`

## Usage

```
var mehdown = require('mehdown');

mehdown.render('markdown text here', { commands: true, detectImageSizes: false }, function(err, html) {
    console.log(html);
});
```
