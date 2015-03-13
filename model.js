/**
* Creation Date: 2015-03-13
* Created By: chengbapi@gmail.com
* Last Modified: 2015-03-13
* Last Modified By: chengbapi@gmail.com
* Description:
*/
(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./events"], function(_, Events){
            return factory(_, Events);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("./underscore"),
            require("./events")
        );
    } else {
        // Browser
        root.Model = factory(root._, root.Events);
    }
}(this, function(_, Events) {

    /*
     * Model
     * */
    function Model(obj) {
        createObject(this, Model.prototype.__defaults, obj);
        this.initialize(obj);

        return this.__getInterface();
    }

    _.extend(Model.prototype, Events, {
        __defaults: {},
        initialize: function() {},
        __getInterface: function() {
            return new CommonInterface(this);
        }
    });

    Model.extend = function(options) {
        var SuperClass = this;
        var SubClass = function (obj) {
            // write attributes
            createObject(this, SubClass.prototype.__defaults, obj);
            this.initialize(obj);

            return this.__getInterface();
        };

        extend(SubClass.prototype, SuperClass.prototype, options);

        SubClass.prototype.__defaults = createObject({}, SuperClass.prototype.__defaults, options.defaults);
        SubClass.prototype.__superclass = SuperClass;

        SubClass.extend = Model.extend;

        return SubClass;
    };

    function createObject(target, defaults, obj) {
        return _.extend(target, deepCopy(defaults), deepCopy(obj));
    }

    /*
     * Model的
     * */
    function CommonInterface(model) {
        this.__model = model;
    }

    _.extend(CommonInterface.prototype, {
        // 输出一个字段,默认返回副本,
        // options.ref返回引用(不推荐)
        get: function(key, options) {
            if (options.ref) {
                return this.__model[key];
            }
            return deepCopy(this.__model[key]);
        },
        // copy一份数据,视图可以随意更改
        toJSON: function() {
            var ownProperties = _.pick(this.__model, _.keys(this.__model));
            return deepCopy(ownProperties);
        },
        // 外界对model的唯一的消息传输入口
        // 方便设置日志
        exec: function(command) {
            var args = _.toArray(arguments).slice(1);
            return this.__model[command].apply(this.__model, args);
        }
    });


    // CommonInterface 代理 model的Events
    _.mapObject(Events, function(val, key) {
        CommonInterface.prototype[key] = function() {
            return this.__model[key].apply(this.__model, arguments);
        };
    });

    // Helpers
    // reference by jQuery.extend
    function extend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !_.isFunction(target) ) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( (copyIsArray = _.isArray(copy)) || _.isObject(copy) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && _.isArray(src) ? src : [];

                        } else {
                            clone = src && _.isObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = extend( deep, clone, copy );

                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    }

    function deepCopy(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        } else if (_.isFunction(obj)) {
            return null;
        } else if (_.isArray(obj)) {
            return extend(true, [], obj);
        } else if (_.isObject(obj)) {
            return extend(true, {}, obj);
        }
    }

    return Model;
}));


