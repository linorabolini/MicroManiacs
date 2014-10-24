define(function (require) {
    var Model = require('fishbone'),
        sources       = [],
        sourceLoaders = [];

    var Input = Model({
        addSource: function (type, source, id) {
            var i, loader;
            id = id || sources.length;

            if (id > sources.length || 0 > id) {
                console.warn("Non used id configured might be overriden");
            }

            for (i = 0; i < sourceLoaders.length; i++) {
                loader = sourceLoaders[i];
                if (loader.type === type) {
                    loader.load(this, source, id);
                    sources.push({id: id, source: source});
                    break;
                }
            }
        },
        addSourceLoader: function (sourceLoader) {
            sourceLoaders.push(sourceLoader);
        },
        getSources: function () {
            return sources;
        }

    });

    return new Input();
});