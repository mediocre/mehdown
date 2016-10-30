module.exports = function(md) {
    md.renderer.rules.table_open = function() {
        return '<div class="table-responsive"><table class="table">';
    };

    md.renderer.rules.table_close = function() {
        return '</table></div>';
    };
};
