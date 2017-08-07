"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _phantomjsPrebuilt = require("../phantomjs-prebuilt");

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

var _child_process = require("child_process");

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _linerstream = require("../linerstream");

var _linerstream2 = _interopRequireDefault(_linerstream);

var _winston = require("winston");//log system

var _winston2 = _interopRequireDefault(_winston);

var _page = require("./page");

var _page2 = _interopRequireDefault(_page);

var _command = require("./command");

var _command2 = _interopRequireDefault(_command);

var _out_object = require("./out_object");

var _out_object2 = _interopRequireDefault(_out_object);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultLogLevel = process.env.DEBUG === 'true' ? 'debug' : 'info';

/**
 * Creates a logger using winston
 */
function createLogger() {
    return new _winston2.default.Logger({
        transports: [new _winston2.default.transports.Console({
            level: defaultLogLevel,
            colorize: true
        })]
    });
}

var defaultLogger = createLogger();

/**
 * A phantom instance that communicates with phantomjs
 */

var Phantom = function () {

    /**
     * Creates a new instance of Phantom
     *
     * @param args command args to pass to phantom process
     * @param [phantomPath] path to phantomjs executable
     * @param [logger] object containing functions used for logging
     * @param [logLevel] log level to apply on the logger (if unset or default)
     */
    function Phantom() {
        var _this = this;

        var args = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {
            phantomPath: _phantomjsPrebuilt2.default.path,
            logger: defaultLogger,
            logLevel: defaultLogLevel
        } : arguments[1];

        var _ref$phantomPath = _ref.phantomPath;
        var phantomPath = _ref$phantomPath === undefined ? _phantomjsPrebuilt2.default.path : _ref$phantomPath;
        var _ref$logger = _ref.logger;
        var logger = _ref$logger === undefined ? defaultLogger : _ref$logger;
        var _ref$logLevel = _ref.logLevel;
        var logLevel = _ref$logLevel === undefined ? defaultLogLevel : _ref$logLevel;

        _classCallCheck(this, Phantom);

        if (!Array.isArray(args)) {
            throw new Error('Unexpected type of parameters. Expecting args to be array.');
        }

        if (typeof phantomPath !== 'string') {
            throw new Error("PhantomJS binary was not found. This generally means something went wrong when installing phantomjs-prebuilt. Exiting.");
        }

        if ((typeof logger === "undefined" ? "undefined" : _typeof(logger)) !== 'object') {
            throw new Error("logger must be ba valid object.");
        }

        ['debug', 'info', 'warn', 'error'].forEach(function (method) {
            if (typeof logger[method] !== 'function') {
                logger[method] = function () {
                    return undefined;
                };
            }
        });

        this.logger = logger;

        if (logLevel !== defaultLogLevel) {
            this.logger = createLogger();
            this.logger.transports.console.level = logLevel;
        }

        var pathToShim = _path2.default.normalize(__dirname + '/shim.js');
        this.logger.debug("Starting " + phantomPath + " " + args.concat([pathToShim]).join(' '));

        this.process = (0, _child_process.spawn)(phantomPath, args.concat([pathToShim]));
        this.process.stdin.setEncoding('utf-8');

        this.commands = new Map();
        this.events = new Map();

        this.process.stdout.pipe(new _linerstream2.default()).on('data', function (data) {
            var message = data.toString('utf8');
            if (message[0] === '>') {
                var json = message.substr(1);
                _this.logger.debug('Parsing: %s', json);
                var command = JSON.parse(json);
                var deferred = _this.commands.get(command.id).deferred;

                if (command.error === undefined) {
                    deferred.resolve(command.response);
                } else {
                    deferred.reject(new Error(command.error));
                }
                _this.commands.delete(command.id);
            } else if (message.indexOf('<event>') === 0) {
                var _json = message.substr(7);
                _this.logger.debug('Parsing: %s', _json);
                var event = JSON.parse(_json);

                var emitter = _this.events[event.target];
                if (emitter) {
                    emitter.emit.apply(emitter, [event.type].concat(event.args));
                }
            } else {
                _this.logger.info(message);
            }
        });

        this.process.stderr.on('data', function (data) {
            return _this.logger.error(data.toString('utf8'));
        });
        this.process.on('exit', function (code) {
            return _this.logger.debug("Child exited with code {" + code + "}");
        });
        this.process.on('error', function (error) {
            _this.logger.error("Could not spawn [" + phantomPath + "] executable. Please make sure phantomjs is installed correctly.");
            _this.logger.error(error);
            _this.kill("Process got an error: " + error);
            process.exit(1);
        });

        this.process.stdin.on('error', function (e) {
            _this.logger.debug("Child process received error " + e + ", sending kill signal");
            _this.kill("Error reading from stdin: " + e);
        });

        this.process.stdout.on('error', function (e) {
            _this.logger.debug("Child process received error " + e + ", sending kill signal");
            _this.kill("Error reading from stdout: " + e);
        });

        this.heartBeatId = setInterval(this._heartBeat.bind(this), 100);
    }

    /**
     * Returns a value in the global space of phantom process
     * @returns {Promise}
     */


    _createClass(Phantom, [{
        key: "windowProperty",
        value: function windowProperty() {
            return this.execute('phantom', 'windowProperty', [].slice.call(arguments));
        }

        /**
         * Returns a new instance of Promise which resolves to a {@link Page}.
         * @returns {Promise.<Page>}
         */

    }, {
        key: "createPage",
        value: function createPage() {
            var _this2 = this;

            var logger = this.logger;
            return this.execute('phantom', 'createPage').then(function (response) {
                var page = new _page2.default(_this2, response.pageId);
                if (typeof Proxy === 'function') {
                    page = new Proxy(page, {
                        set: function set(target, prop) {
                            logger.warn("Using page." + prop + " = ...; is not supported. Use page.property('" + prop + "', ...) instead. See the README file for more examples of page#property.");
                            return false;
                        }
                    });
                }
                return page;
            });
        }

        /**
         * Creates a special object that can be used for returning data back from PhantomJS
         * @returns {OutObject}
         */

    }, {
        key: "createOutObject",
        value: function createOutObject() {
            return new _out_object2.default(this);
        }

        /**
         * Used for creating a callback in phantomjs for content header and footer
         * @param obj
         */

    }, {
        key: "callback",
        value: function callback(obj) {
            return { transform: true, target: obj, method: 'callback', parent: 'phantom' };
        }

        /**
         * Executes a command object
         * @param command the command to run
         * @returns {Promise}
         */

    }, {
        key: "executeCommand",
        value: function executeCommand(command) {
            var _this3 = this;

            this.commands.set(command.id, command);

            var json = JSON.stringify(command, function (key, val) {
                if (key[0] === '_') {
                    return undefined;
                } else if (typeof val === 'function') {
                    if (!val.hasOwnProperty('prototype')) {
                        _this3.logger.warn('Arrow functions such as () => {} are not supported in PhantomJS. Please use function(){} or compile to ES5.');
                        throw new Error('Arrow functions such as () => {} are not supported in PhantomJS.');
                    }
                    return val.toString();
                }
                return val;
            });

            command.deferred = {};

            var promise = new Promise(function (res, rej) {
                command.deferred.resolve = res;
                command.deferred.reject = rej;
            });

            this.logger.debug('Sending: %s', json);

            this.process.stdin.write(json + _os2.default.EOL, 'utf8');

            return promise;
        }

        /**
         * Executes a command
         *
         * @param target target object to execute against
         * @param name the name of the method execute
         * @param args an array of args to pass to the method
         * @returns {Promise}
         */

    }, {
        key: "execute",
        value: function execute(target, name) {
            var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

            return this.executeCommand(new _command2.default(null, target, name, args));
        }

        /**
         * Adds an event listener to a target object (currently only works on pages)
         *
         * @param event the event type
         * @param target target object to execute against
         * @param runOnPhantom would the callback run in phantomjs or not
         * @param callback the event callback
         * @param args an array of args to pass to the callback
         */

    }, {
        key: "on",
        value: function on(event, target, runOnPhantom, callback) {
            var args = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

            var eventDescriptor = { type: event };

            if (runOnPhantom) {
                eventDescriptor.event = callback;
                eventDescriptor.args = args;
            } else {
                var emitter = this.getEmitterForTarget(target);
                emitter.on(event, function () {
                    var params = [].slice.call(arguments).concat(args);
                    return callback.apply(null, params);
                });
            }
            return this.execute(target, 'addEvent', [eventDescriptor]);
        }

        /**
         * Removes an event from a target object
         *
         * @param event
         * @param target
         */

    }, {
        key: "off",
        value: function off(event, target) {
            var emitter = this.getEmitterForTarget(target);
            emitter.removeAllListeners(event);
            return this.execute(target, 'removeEvent', [{ type: event }]);
        }
    }, {
        key: "getEmitterForTarget",
        value: function getEmitterForTarget(target) {
            if (!this.events[target]) {
                this.events[target] = new _events2.default();
            }

            return this.events[target];
        }

        /**
         * Cleans up and end the phantom process
         */

    }, {
        key: "exit",
        value: function exit() {
            clearInterval(this.heartBeatId);
            this.execute('phantom', 'invokeMethod', ['exit']);
        }

        /**
         * Clean up and force kill this process
         */

    }, {
        key: "kill",
        value: function kill() {
            var errmsg = arguments.length <= 0 || arguments[0] === undefined ? 'Phantom process was killed' : arguments[0];

            this._rejectAllCommands(errmsg);
            this.process.kill('SIGKILL');
        }
    }, {
        key: "_heartBeat",
        value: function _heartBeat() {
            if (this.commands.size === 0) {
                this.execute('phantom', 'noop');
            }
        }

        /**
         * rejects all commands in this.commands
         */

    }, {
        key: "_rejectAllCommands",
        value: function _rejectAllCommands() {
            var errmsg = arguments.length <= 0 || arguments[0] === undefined ? 'Phantom exited prematurely' : arguments[0];

            // prevent heartbeat from preventing this from terminating
            clearInterval(this.heartBeatId);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.commands.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var command = _step.value;

                    command.deferred.reject(new Error(errmsg));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return Phantom;
}();

exports.default = Phantom;