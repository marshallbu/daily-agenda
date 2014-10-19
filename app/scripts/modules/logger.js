var console, Logger;

// make using console safe if it doesn't exist (IE....)
console = window.console || {
    log: function () {
        return void 0;
    },
    info: function () {
        return void 0;
    },
    warn: function () {
        return void 0;
    },
    error: function () {
        return void 0;
    },
    dir: function() {
        return void 0;
    },
    console: function() {
        return void 0;
    }
};

console.info = console.info || console.log;
console.warn = console.warn || console.log;
console.error = console.error || console.log;
console.dir = console.dir || console.log;
console.table = console.table || console.log;

Logger = {
    info: function () {
        console.info.apply(console, arguments);
    },
    warn: function () {
        console.warn.apply(console, arguments);
    },
    error: function () {
        console.error.apply(console, arguments);
    },
    dir: function () {
        console.dir.apply(console, arguments);
    },
    table: function() {
        console.table.apply(console, arguments);
    }
};

module.exports = Logger;
