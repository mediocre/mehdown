const assert = require('assert');

const mehdown = require('../../lib');

describe('kaltura', function() {
    it('https://cdnapisec.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/33370462/entry_id/0_h4hdsqdk/embed/dynamic', function(done) {
        mehdown.render('https://cdnapisec.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/33370462/entry_id/0_h4hdsqdk/embed/dynamic', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="kaltura" frameborder="0" src="https://cdnapisec.kaltura.com/p/2056591/embedIframeJs/uiconf_id/33370462?iframeembed=true&entry_id=0_h4hdsqdk"></iframe></p>');
            done();
        });
    });

    it('https://cdnapisec.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/33370462/entry_id/0_h4hdsqdk/embed/dynamic#t=00:10', function(done) {
        mehdown.render('https://cdnapisec.kaltura.com/index.php/extwidget/preview/partner_id/2056591/uiconf_id/33370462/entry_id/0_h4hdsqdk/embed/dynamic#t=01:23', function(err, html) {
            assert.equal(html, '<p><iframe allowfullscreen class="kaltura" frameborder="0" src="https://cdnapisec.kaltura.com/p/2056591/embedIframeJs/uiconf_id/33370462?iframeembed=true&entry_id=0_h4hdsqdk"></iframe></p>');
            done();
        });
    });
});
