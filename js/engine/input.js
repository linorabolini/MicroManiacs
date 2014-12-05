define(function (require) {
    var Model = require('fishbone'),
        sources = {},
        counter = 0;

    var Input = Model({
        addSource: function (source, id) {
            var i;

            id = id || counter;

            if (id > counter || 0 > id) {
                console.warn("Non used id configured might be overriden");
            }

            counter++;

            source.configure(this, id);
            sources[source.id] = source;

            this.trigger('new source', source);
        },
        getSource: function (name) {
            return sources[name];
        },
        getSources: function () {
            return sources;
        }
    });

    return new Input();
});