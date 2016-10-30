const assert = require('assert');

const mehdown = require('../../lib');

describe('responsive tables', function() {
    it('responsive tables', function(done) {
        mehdown.render('Markdown | Less | Pretty\n--- | --- | ---\n*Still* | `renders` | **nicely**\n1 | 2 | 3', function(err, html) {
            assert.equal(html, '<div class="table-responsive"><table class="table"><thead>\n<tr>\n<th>Markdown</th>\n<th>Less</th>\n<th>Pretty</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><em>Still</em></td>\n<td><code>renders</code></td>\n<td><strong>nicely</strong></td>\n</tr>\n<tr>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n</tbody>\n</table></div>');
            done();
        });
    });
});
