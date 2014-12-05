define(function (require) {
    var $ = require('jquery');

    var files = {
        groups: {},
        FILES_LOADED : 0,
        TOTAL_FILES : 0,
        callback : null
    };

    files.hasFinished = function () {
        return files.FILES_LOADED === files.TOTAL_FILES;
    };

    files.getGroup = function (name) {
        if(this.groups[name] === undefined) {
            this.groups[name] = [];
        }

        return this.groups[name];
    }

    files.get = function (groupName, fileIndex) {
        var group = this.getGroup(groupName);
        return group[fileIndex];
    }

    files.loadFiles = function (path, name, number) {
        var i, fileName;
        var array = files.getGroup(name);

        files.TOTAL_FILES += number;

        for (i = 0; i < number; ++i) {
            fileName = name + "_" + i;
            $.getJSON(path + fileName + ".js", function () {
                var fileSlot = i;
                return function (data) {
                    array[fileSlot] = data;
                    files.FILES_LOADED++;

                    if (undefined !== files.callback) {
                        files.hasFinished() && files.callback();
                    }
                }
            }());
        }
    };

    files.onLoaded = function (callback) {
        this.callback = callback;
    };

    return files;
});