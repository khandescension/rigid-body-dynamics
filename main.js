
// The main constructor of the library.

var Art = function (canvas) {

  // Let Art be called without `new`.

  if (!(this instanceof Art)) {
    return new Art(canvas);
  }

  // Give the modules a reference to the core and extend it with every registered module.

  for (var m in this.modules) {
    if (this.modules.hasOwnProperty(m)) {
      this[m] = this.modules[m];
      for (var o in this.modules[m]) {
        if (this.modules[m].hasOwnProperty(o)) {
          this.modules[m][o].core = this;
        }
      }
    }
  }

  // A list of objects added to the core object.

  this.objects = [];

  // A list of scenes added to the core object.

  this.scenes = [];

  // The main canvas element of the core object.

  if (canvas instanceof Node && canvas.getContext) {
    this.canvas = canvas;
  } else if (canvas instanceof String) {
    this.canvas = document.querySelector(canvas);
  } else {
    this.canvas = document.body.appendChild(document.createElement('canvas'));
  }

  // The graphics property of the canvas.

  this.graphics = this.canvas.getContext('2d');

};

Art.prototype.add = function () {

  // Apply Array's push method to add the objects instantly.

  for (var o = 0; o < arguments.length; o += 1) {
    if (arguments[o].constructor === Array) {
      for (var _o = 0; _o < arguments[o].length; _o += 1) {
        this.objects.push(arguments[o][_o]);
      }
    } else {
      this.objects.push(arguments[o]);
    }
  }

  return this;

};

Art.prototype.remove = function () {

  // Applying Array's splice method will not work, so loop over it instead.

  for (var o = 0; o < arguments.length; o += 1) {
    this.objects.splice(this.objects.indexOf(arguments[o]), 1);
  }

  return this;

};

// The modules of the core.

Art.prototype.modules = {
  display: {
    Base: function (options) {

      // Initialize variables.

      var core = Art.prototype.modules.display.Base.core,
        extend = core.utility.extend,
        defaults = {
          x: 0,
          y: 0,
          angularVelocity: 0,
          fill: '#505050',
          _velocity: true,
          rotation: 0,
          _angular: true,
          scale: {
            x: 1,
            y: 1
          },
          angularAcceleration: 0,
          forces: {
            gravity: {
              operation: '+',
              type: {
                y: true
              },
              by: 0.05
            },
            friction: {
              operation: '*',
              type: {
                x: true,
                y: true
              },
              by: 0.99999
            }
          },
          _force: true,
          group: false,
          opacity: 1,
          velocity: {
            x: 0,
            y: 0
          },
          _check: false,
          mass: 1,
          _collision: true,
          parent: {},
          restitution: -0.5,
          _walls: true,
        };

      // Extend `this` with the defaults overwritten by the options.

      extend(this, extend(defaults, options));

      this.velocity = Art.prototype.modules.physics.vector(this.velocity.x, this.velocity.y);

      // core.objects.push(this); 
      // displaces groups for some reason...

    }
  },
  scene: {
    add: function () {

      // Define variables for brevity.

      var core = this.create.core,
        args = Array.prototype.slice.call(arguments);

      // Push the supplied scenes to the core en masse.

      core.scenes.push.apply(core.scenes, args);

      return core;

    },
    get: function (id) {

      // Declare variables for brevity and find the scene given the id.

      var core = this.get.core,
        scene = core.scenes.find(function ($scene) {
          return $scene.id === id;
        });

      return scene;

    },
    remove: function (scenes) {

      // Initialize variables.

      var core = this.remove.core,
        s = 0;

      // Loop through and splice the given scenes.

      for (; s < arguments.length; s += 1) {
        core.scenes.splice(core.scenes.indexOf(this.get(scenes[s]), 1));
      }

      return core;

    }
  },
  animation: {
    defaults: {
      easing: {
        linear: function (t, b, c, d) {
          return c * t / d + b;
        },
        easeInQuad: function (t, b, c, d) {
          t /= d;
          return c * t * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
          t /= d;
          return -c * t * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) {
          t /= d;
          return c * t * t * t + b;
        },
        easeOutCubic: function (t, b, c, d) {
          t /= d;
          t--;
          return c * (t * t * t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
          t /= d;
          return c * t * t * t * t + b;
        },
        easeOutQuart: function (t, b, c, d) {
          t /= d;
          t--;
          return -c * (t * t * t * t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t * t + b;
          t -= 2;
          return -c / 2 * (t * t * t * t - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
          t /= d;
          return c * t * t * t * t * t + b;
        },
        easeOutQuint: function (t, b, c, d) {
          t /= d;
          t--;
          return c * (t * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t * t * t + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
          return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
          return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
          return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (t, b, c, d) {
          return c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
          return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          t--;
          return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
          t /= d;
          return -c * (Math.sqrt(1 - t * t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
          t /= d;
          t--;
          return c * Math.sqrt(1 - t * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
          t -= 2;
          return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        },
        easeInBounce: function (t, b, c, d) {
          return c - this.easing.easeOutBounce(d - t, 0, c, d) + b;
        },
        easeOutBounce: function (t, b, c, d) {
          if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
          } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
          } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
          } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
          }
        },
        easeInOutBounce: function (t, b, c, d) {
          if (t < d / 2) return this.easing.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
          return this.easing.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
      },
      durations: {
        short: 500,
        normal: 1000,
        long: 2000
      }
    },
    animate: function (options) {

      // If we are animating colors, skip all of this as standard easing goes far too quickly.

      if (!options.properties.fill && !options.properties.stroke) {

        // Declare variables for brevity and using defaults if options are missing.

        var object = options.object || this,
          defaults = Art.prototype.modules.animation.defaults,
          easing = typeof options.easing === 'function' ? options.easing : defaults.easing[options.easing] || defaults.easing[Art.prototype.modules.utility.toCamelCase(options.easing)] || defaults.easing.linear,
          duration = typeof options.duration === 'number' ? options.duration : defaults.durations[options.duration] || defaults.durations.normal,
          start = performance.now(),
          total = start + duration,
          properties = options.properties,
          old = {},
          id;

        // Keep references to the original values of the properties.

        for (var p in options.properties) {
          if (options.properties.hasOwnProperty(p)) {
            old[p] = object[p];
          }
        }

        // If the animation should be looped, set the callback to a recursive animation.

        if (options.loop) {

          var animate = function () {
            for (var p in options.properties) {
              if (options.properties.hasOwnProperty(p)) {
                object[p] = old[p];
              }
            }

            Art.prototype.modules.animation.animate({
              object: object,
              properties: properties,
              easing: easing,
              duration: duration,
              callback: animate
            });
          };

          options.callback = animate;

        }

        // The animation loop itself, using requestAnimationFrame.

        (function update() {
          var now = performance.now(),
            progress = Math.min((duration - (total - now)) / duration, 1);
          for (var i in options.properties) {
            if (options.properties.hasOwnProperty(i)) {
              object[i] = easing(now - start, old[i], options.properties[i] - old[i], duration);
            }
          }
          if (progress < 1) {
            id = requestAnimationFrame(update);
          } else {
            id = cancelAnimationFrame(id);
            if (options.callback) {
              options.callback();
            }
          }
        }());

        // Return the object for chainability, as this return value is the one also used in the display object's version.

        return object;

      } else {

        // Initialize variables.

        var _object = options.object || this,
          _properties = options.properties || {},
          _id,
          fill = _properties.fill,
          stroke = _properties.stroke,
          increment = options.increment || 1,
          loop = options.loop,
          callback = options.callback,
          oldF = _object.fill,
          oldS = _object.stroke;

        if (fill) {
          var infoF = Art.prototype.modules.utility.hslaInformation(_object.fill),
            currF = infoF;

          for (var f in infoF) {
            if (infoF.hasOwnProperty(f)) {
              // Call stack is exceeded when alpha is provided, so prevent it for now. @TODO: Fix.
              if (f === 'alpha') {
                continue;
              }
              infoF[f] = Number(String(currF[f] instanceof Number ? currF[f] : infoF[f]).replace('%', ''));
            }
          }
        }

        if (stroke) {
          var infoS = Art.prototype.modules.utility.hslaInformation(_object.stroke),
            currS = infoS;

          for (var s in infoS) {
            if (infoS.hasOwnProperty(s)) {
              infoS[s] = Number(String(currS[s] instanceof Number ? currS[s] : infoS[s]).replace('%', ''));
            }
          }
        }

        if (loop) {

          var _animate = function () {

            _object.fill = oldF;

            _object.stroke = oldS;

            Art.prototype.modules.animation.animate({
              object: _object,
              properties: _properties,
              callback: _animate,
              increment: increment
            });
          };

          callback = _animate;

        }

        var equals = function (a, b, by) {

          // Initialize variables.

          var result,
            key;

          for (key in a) {
            if (a.hasOwnProperty(key)) {
              result = (a[key] - b[key] < (by || 0.1));
            }
          }

          return result;

        };

        (function update() {
          for (var p in _properties) {
            if (_properties.hasOwnProperty(p)) {
              if (p === 'fill') {
                for (var _f in _properties[p]) {
                  if (_properties[p].hasOwnProperty(_f)) {
                    currF[_f] = _properties[p][_f] > currF[_f] ? currF[_f] + increment : currF[_f] - increment;
                  }
                }
                _object[p] = Art.prototype.modules.utility.color({
                  hue: Number(String(currF.hue instanceof Number ? currF.hue : infoF.hue).replace('%', '')),
                  saturation: Number(String(currF.saturation instanceof Number ? currF.saturation : infoF.saturation).replace('%', '')),
                  light: Number(String(currF.light instanceof Number ? currF.light : infoF.light).replace('%', '')),
                  alpha: Number(String(currF.alpha instanceof Number ? currF.alpha : infoF.alpha))
                });
              } else if (p === 'stroke') {
                for (var _s in _properties[p]) {
                  if (_properties[p].hasOwnProperty(_s)) {
                    currS[_s] = _properties[p][_s] > currS[_s] ? currS[_s] + increment : currS[_s] - increment;
                  }
                }
                _object[p] = Art.prototype.modules.utility.color({
                  hue: Number(String(currS.hue instanceof Number ? currS.hue : infoS.hue).replace('%', '')),
                  saturation: Number(String(currS.saturation instanceof Number ? currS.saturation : infoS.saturation).replace('%', '')),
                  light: Number(String(currS.light instanceof Number ? currS.light : infoS.light).replace('%', '')),
                  alpha: Number(String(currS.hue instanceof Number ? currS.hue : infoS.hue))
                });
              }
            }
          }

          if (fill && stroke) {
            if (!equals(fill, currF, fill.alpha ? 0 : NaN) && !equals(stroke, currS, fill.alpha ? 0 : NaN)) {
              _id = requestAnimationFrame(update);
            } else {
              _id = cancelAnimationFrame(_id);
              if (callback instanceof Function) {
                callback.call(object, object);
              }
            }
          } else if (fill) {
            if (!equals(fill, currF, fill.alpha ? 0 : NaN)) {
              _id = requestAnimationFrame(update);
            } else {
              _id = cancelAnimationFrame(_id);
              if (callback instanceof Function) {
                callback.call(object, object);
              }
            }
          } else {
            if (!equals(stroke, currS, fill.alpha ? 0 : NaN)) {
              _id = requestAnimationFrame(update);
            } else {
              _id = cancelAnimationFrame(_id);
              if (callback instanceof Function) {
                callback.call(object, object);
              }
            }
          }

        }());

        return _object;

      }

    }

  },
  physics: {
    aabb: function (a, b) {

      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.height + a.y > b.y;

    },
    intersection: function (a, b) {
      if (this.aabb(a, b)) {
        var x,
          y,
          width,
          height;
        x = Math.max(a.x, b.x);
        y = Math.max(a.y, b.y);
        width = Math.min(a.x + a.width, b.width + b.height) - x;
        height = Math.min(a.y + a.height, b.y + b.height) - y;
        return [x, y, width, height];
      } else {
        return [0, 0, 0, 0];
      }
    },
    collision: function (a, b) {

      if (!a.group && !b.group) {

        if (a.radius && b.radius) {
          return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) < a.radius + b.radius;
        } else {
          return this.aabb(a.boundaries(), b.boundaries());
        }

      } else if (a.group && b.group) {

        var result,
          c = 0;

        for (; c < a.children.length; c += 1) {
          for (var _c = c + 1; _c < b.children.length; _c += 1) {
            var _a = Art.prototype.modules.utility.extend({}, a.children[c]),
              _b = Art.prototype.modules.utility.extend({}, b.children[_c]);
            _a.x += _a.parent.x;
            _a.y += _a.parent.y;
            _b.x += _b.parent.x;
            _b.y += _b.parent.y;
            _a.velocity = _a.parent.velocity;
            _b.velocity = _b.parent.velocity;
            if (_a.radius && _b.radius) {
              result = Math.sqrt(Math.pow(_b.x - _a.x, 2) + Math.pow(_b.y - _a.y, 2)) < _a.radius + _b.radius;
            } else {
              result = this.aabb(_a.boundaries(), _b.boundaries());
            }
            if (result) {
              return {
                collision: result,
                part: [_a, _b]
              };
            }
          }
        }

      } else if (a.group) {

        var _result,
          x = 0;

        for (; x < a.children.length; x += 1) {
          var y = Art.prototype.modules.utility.extend({}, a.children[x]);
          y.x += y.parent.x;
          y.y += y.parent.y;
          y.velocity = y.parent.velocity;
          if (y.radius && b.radius) {
            _result = Math.sqrt(Math.pow(b.x - y.x, 2) + Math.pow(b.y - y.y, 2)) < y.radius + b.radius;
          } else {
            _result = this.aabb(y.boundaries(), b.boundaries());
          }
          if (_result) {
            return {
              collision: _result,
              part: y
            };
          }
        }

      } else {

        var $result,
          _x = 0;

        for (; _x < b.children.length; _x += 1) {
          var z = Art.prototype.modules.utility.extend({}, b.children[_x]);
          z.x += z.parent.x;
          z.y += z.parent.y;
          z.velocity = z.parent.velocity;
          if (a.radius && z.radius) {
            $result = Math.sqrt(Math.pow(z.x - a.x, 2) + Math.pow(z.y.y - a.y, 2)) < a.radius + z.radius;
          } else {
            $result = this.aabb(a.boundaries(), z.boundaries());
          }
          if ($result) {
            return {
              collision: $result,
              part: z
            };
          }
        }
      }

      // Return the core for chainability.

      return this.collision.core;

    },
    force: function (options) {

      // Initialize variables.

      var object = options.object || this,
        operation = options.operation || '+',
        by = options.by || '5',
        type = options.type || {
          x: true,
          y: true
        };

      // Apply the force to the object.

      object.velocity.x = type.x ? eval(object.velocity.x = object.velocity.x + operation + by) : object.velocity.x;
      object.velocity.y = type.y ? eval(object.velocity.y = object.velocity.y + operation + by) : object.velocity.y;

      return object;

    }
  },
  ticker: {
    request: (function () {

      // Initialize variables.

      var last = 0,
        vendors = ['webkit', 'moz'];

      var rAF,
        v;

      // Try the unprefixed version of rAF.

      rAF = window.requestAnimationFrame;

      // Loop through every browser and try to get their copy of requestAnimationFrame.

      for (; v < vendors.length && !rAF; v += 1) {
        rAF = window[vendors[v] + 'RequestAnimationFrame'];
      }

      // If that fails, create a shim with setTimeout.

      if (!rAF) {
        rAF = function (callback) {
          var curr = performance.now(),
            time = Math.max(0, 16 - (curr - last));
          var id = window.setTimeout(function () {
            callback(curr + time);
          }, time);
          last = curr + time;
          return id;
        };
      }

      return rAF;

    }()).bind(window)
  },
  utility: {
    extend: function (destination, source) {

      // Loop over the source and share its properties with the destination. 
      // Also, do not perform a hasOwnProperty check to allow for cloning of display objects.

      for (var o in source) {
        if (o) {
          destination[o] = source[o];
        }
      }

      return destination;

    }
  }
};

Art.prototype.modules.display.Base.extend = function (options) {

  // Initialize variables.

  var id = options.id,
    constructor,
    Supers = options.Supers || [],
    statics = options.statics || {};

  // Redefine the constructor to also call the Base and any Supers.

  constructor = function () {
    Art.prototype.modules.display.Base.apply(this, arguments);
    for (var s = 0; s < Supers.length; s += 1) {
      Supers[s].apply(this, arguments);
    }
    options.constructor.apply(this, arguments);
  };

  // Extend the prototype of the constructor with the Base and Supers.

  var prototype = constructor.prototype,
    extend = Art.prototype.modules.utility.extend;

  for (var p in options) {
    if (p !== 'constructor' && p !== 'id' && p !== 'Supers' && p !== 'statics') {
      if (Object.prototype.toString.call(options[p]) === '[object Object]') {
        extend(constructor.prototype, options[p]);
      } else {
        constructor.prototype[p] = options[p];
      }
    }
  }

  extend(prototype, extend(options.constructor.prototype, Art.prototype.modules.display.Base.prototype));

  for (var s = 0; s < Supers.length; s += 1) {
    extend(prototype, Supers[s].prototype);
  }

  constructor.prototype = prototype;

  // Add any static methods that were supplied.

  if (Object.keys(statics).length > 0) {
    extend(constructor, statics);
  }

  // Let the objects be instantiated without `new`.

  var $constructor = function () {
    var self = Object.create(constructor.prototype);
    constructor.apply(self, arguments);
    return self;
  };

  return id ? Art.prototype.modules.display[id] = $constructor : $constructor;

};

Art.prototype.modules.display.Base.prototype.animate = function (options) {

  // Initialize variables.

  var modules = Art.prototype.modules,
    animation = modules.animation.animate({
      object: this,
      properties: options.properties,
      easing: options.easing,
      duration: options.duration,
      callback: options.callback,
      loop: options.loop,
      increment: options.increment
    });

  return animation;

};

Art.prototype.modules.display.Base.prototype.clone = function (options) {

  // Initialize variables.

  var self = new Art.prototype.modules.display.Base(),
    extend = Art.prototype.modules.utility.extend;

  // Extend the newly created object with `this`.

  extend(self, this);

  // Then, extend that with any given options so as to avoid overwriting `this`.

  extend(self, options);

  return self;

};

Art.prototype.modules.display.Base.prototype.path = function (options) {

  // Return and call the path function at once.

  return Art.prototype.modules.animation.path(Art.prototype.modules.utility.extend({
    object: this
  }, options));

};

Art.prototype.modules.display.Base.prototype.move = function (options) {

  // Move the object by the given velocity.

  if (this._velocity) {

    this.velocity.x += options.x || 0;
    this.velocity.y += options.y || 0;

  }

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.moveTo = function (options) {

  // Move the object to the given coordinate.

  this.x = options.x;
  this.y = options.y;

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.rotate = function (rotation) {

  // Rotate the object by the given rotation.

  this.rotation += rotation;

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.rotateTo = function (angle) {

  // Rotate the object to a certain position.

  this.rotate(angle - this.rotation);

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.collides = function (b, callback) {

  // If a callback is supplied and a collision is detected, call it.

  if (this._collision && b._collision) {

    var result = Art.prototype.modules.physics.collision(this, b);

    if (result) {
      if (callback) {
        callback.call(this, this, b);
      } else {
        return result;
      }
    } else {
      return result;
    }

  }

};

Art.prototype.modules.display.Base.prototype.force = function (type, options) {

  // Add or remove based on `type`.

  if (type === 'add') {

    this.forces[options.id] = {
      operation: options.operation,
      by: options.by,
      type: options.type,
      object: this
    };

  } else if (type === 'remove') {

    for (var f in this.forces) {
      if (this.forces.hasOwnProperty(f)) {
        if (f === options) {
          delete this.forces[f];
        }
      }
    }

  }

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.dragAndDrop = function (callback) {

  // Initialize variables.

  var old = this.velocity,
    canvas = Art.prototype.modules.display.Base.core.canvas,
    object = this,
    _velocity = object._velocity,
    _force = object._force;

  // Add the event listeners.

  callback = callback || function (event, object) {

    object._velocity = false;
    object._force = false;

    object.x = event.clientX;
    object.y = event.clientY;

  };

  var onMouseMove = function (event) {

    callback.call(object, event, object);

  };

  var onMouseUp = function () {

    object.dragging = false;

    object._velocity = _velocity;
    object._force = _force;

    if (!callback) {
      object.velocity.x = object.x - old.x;
      object.velocity.y = object.y - old.y;
    }

    canvas.removeEventListener('mousemove', onMouseMove, false);
    canvas.removeEventListener('mouseup', onMouseUp, false);

  };

  canvas.addEventListener('mousedown', function (event) {

    if (Art.prototype.modules.utility.containsPoint(event, object.boundaries())) {

      object.dragging = true;

      if (!callback) {
        old = object.velocity;
      }

      canvas.addEventListener('mousemove', onMouseMove, false);
      canvas.addEventListener('mouseup', onMouseUp, false);

    }

  }, false);

};

Art.prototype.modules.display.Base.prototype.walls = function (options) {

  if (this._walls) {

    return Art.prototype.modules.physics.walls(Art.prototype.modules.utility.extend({
      object: this
    }, options));

  }

};

Art.prototype.modules.display.Base.prototype.spring = function (object, spring) {

  // Set defaults.

  spring = spring || 0.1;

  // Calculate the spring and increment the velocity.

  this.velocity.x += (object.x - this.x) * spring;
  this.velocity.y += (object.y - this.y) * spring;

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.prototype.gravitate = function (bodyB) {

  // Initialize variables.

  var dx = bodyB.x - this.x,
    dy = bodyB.y = this.y,
    squaredDistance = dx * dx + dy * dy,
    distance = Math.sqrt(squaredDistance),
    force = this.mass * bodyB.mass / squaredDistance,
    ax = force * dx / distance,
    ay = force * dy / distance;

  // Calculate the gravitational pull and apply it.

  this.velocity.x += ax / this.mass;
  this.velocity.x += ay / this.mass;
  bodyB.velocity.x -= ax / bodyB.mass;
  bodyB.velocity.y -= ay / bodyB.mass;

  // Return the object for chainability.

  return this;

};

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        radius: 25
      };

    // Extend `this` with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'circle',
  draw: function () {

    // Initialize variables.

    var g = Art.prototype.modules.display.circle.core.graphics,
      t = this;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);

    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();
    g.arc(0, 0, t.radius, 0, Math.PI * 2, false);
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    return this;

  },
  boundaries: function () {

    // Return the bounding box of the object.

    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };

  },
  momentOfInertia: function () {
    return this.mass * this.radius * this.radius / 2;
  }
});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        radius: {
          x: 50,
          y: 25
        }
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'ellipse',
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.Base.core.graphics;

    // Execute the drawing commands.

    g.save();
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();
    g.ellipse(t.x, t.y, t.radius.x, t.radius.y, t.rotation, 0, Math.PI * 2, false);
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    return this;

  },
  boundaries: function () {

    // Return the bounding box of the object.

    return {
      x: this.x - this.radius.x,
      y: this.y - this.radius.y,
      width: this.radius.x * 2,
      height: this.radius.y * 2
    };

  },
  momentOfInertia: function () {
    var averageRadius = (this.radius.x + this.radius.y) / 2;
    return this.mass * averageRadius * averageRadius / 2;
  }
});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        width: 50,
        height: 25
      };

    // Extend `this` with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'rectangle',
  draw: function () {

    // Initialize variables.

    var g = Art.prototype.modules.display.rectangle.core.graphics,
      t = this;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();
    g.rect(t.width / -2, t.height / -2, t.width, t.height);
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    return this;

  },

  boundaries: function () {

    // If we have no rotation, simply return the AABB.

    if (!this.rotation) {
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        width: this.width,
        height: this.height
      };
    }

    // Otherwise... we have some math to do.

    // Initialize variables.

    var cx = this.x,
      cy = this.y,
      angle = this.rotation,
      corner = Art.prototype.modules.physics.corner;

    // Get the new corner points.

    var a = corner(cx, cy, cx - this.width / 2, cy - this.height / 2, angle),
      b = corner(cx, cy, cx + this.width / 2, cy, angle),
      c = corner(cx, cy, cx + this.width / 2, cy + this.height / 2, angle),
      d = corner(cx, cy, cx, cy + this.height / 2, angle);

    // Get the AABB.

    var x = Math.min(a.x, b.x, c.x, d.x),
      y = Math.min(a.y, b.y, c.y, d.y),
      _x = Math.max(a.x, b.x, c.x, d.x),
      _y = Math.max(a.y, b.y, c.y, d.y);

    // Return a usable form. (x, y, width, height)

    return {
      x: x,
      y: y,
      width: _x - x,
      height: _y - y
    };

  },
  
  momentOfInertia: function () {
    
    // Return the moment of inertia.
    
    return (this.width * this.width + this.height * this.height) * this.mass / 12;
    
  }

});

Art.prototype.modules.display.Base.extend({

  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        width: 25,
        height: 25,
        radius: 5
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },

  id: 'squircle',

  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.squircle.core.graphics;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.scale(t.scale.x, t.scale.y);
    g.beginPath();
    g.moveTo(t.radius, 0);
    g.lineTo(t.width - t.radius, 0);
    g.quadraticCurveTo(t.width, 0, t.width, t.radius);
    g.lineTo(t.width, t.height - t.radius);
    g.quadraticCurveTo(t.width, t.height, t.width - t.radius, t.height);
    g.lineTo(t.radius, t.height);
    g.quadraticCurveTo(0, t.height, 0, t.height - t.radius);
    g.lineTo(0, t.radius);
    g.quadraticCurveTo(0, 0, t.radius, 0);
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    // Return the object for chainability.

    return this;

  },

  boundaries: function () {

    // Return the bounding box of the object.

    return this;

  },
  
  momentOfInertia: function () {
    return (this.width * this.width + this.height * this.height) * this.mass / 12;
  }

});

Art.prototype.modules.display.Base.extend({

  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        sides: 3,
        length: 10,
        angle: (Math.PI * 2) / this.sides,
        rotation: -Math.PI / 2
      };

    extend(this, extend(defaults, options));

  },

  id: 'polygon',

  draw: function () {

    // Initialize variables.

    var g = Art.prototype.modules.display.polygon.core.graphics,
      t = this;

    // Reset the angle if the number of sides changed.

    t.angle = (Math.PI * 2) / t.sides;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();
    g.moveTo(t.length, 0);
    for (var s = 1; s < t.sides; s += 1) {
      g.lineTo(t.length * Math.cos(t.angle * s), t.length * Math.sin(t.angle * s));
    }
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    return this;

  },

  boundaries: function (options) {

    // Return the bounding box of the object.

    return {
      x: this.x - this.length,
      y: this.y - this.length,
      width: this.length * 2,
      height: this.length * 2
    };

  },
  
  momentOfInertia: function () {
    return new Art.prototype.modules.display.rectangle().momentOfInertia.call(this.boundaries());
  }

});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        text: 'Hello, world.',
        font: 'normal 20px Helvetica'
      };

    extend(this, extend(defaults, options));

    return this;

  },
  id: 'text',
  draw: function () {

    // Initialize variables.

    var g = Art.prototype.modules.display.text.core.graphics,
      t = this;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.font = t.font;
    g.beginPath();
    if (t.fill) {
      g.fillText(t.text, 0, 0);
    }
    if (t.stroke) {
      g.strokeText(t.text, 0, 0);
    }
    g.closePath();
    g.restore();

    return this;

  },

  boundaries: function () {

    // Return the bounding box of the object.

    return {
      x: this.x,
      y: this.y,
      width: Art.prototype.modules.display.text.core.graphics.measureText(this.text).width,
      height: new Art.prototype.modules.display.graph().textHeight(this.font)
    };

  },
  
  momentOfInertia: function () {
    return new Art.prototype.modules.display.rectangle().momentOfInertia.call(this.boundaries());
  }

});

Art.prototype.modules.display.path = function (path) {

  // Let Path be called without `new`.

  if (!(this instanceof Art.prototype.modules.display.path)) {
    return new Art.prototype.modules.display.path(path);
  }

  // Extend this with the given path.

  Art.prototype.modules.utility.extend(this, {
    path: path
  });

};

Art.prototype.modules.display.path.prototype.draw = function () {

  // Initialize variables.

  var path = this.path,
    graphics = Art.prototype.modules.display.path.core.graphics;

  // Execute the drawing commands.

  graphics.beginPath();
  path.call(graphics, graphics);
  graphics.closePath();

  return this;

};

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        points: [],
        tension: 0.5,
        closed: false
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'curve',
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.curve.core.graphics,
      spline = Art.prototype.modules.display.curve.spline(t.points, t.tension, t.segments, t.closed);

    // Execute the drawing commands.

    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.beginPath();
    g.moveTo(spline[0], spline[1]);
    for (var p = 2; p < spline.length; p += 2) {
      g.lineTo(spline[p], spline[p + 1]);
    }
    // g.closePath(); -- This closes the curve automatically.
    //                -- So leave it out, because the spline handles it for us.
    g.stroke();

    // Return the core for chainability.

    return this;

  }
});

Art.prototype.modules.display.curve.distance = function (a, b, c, d) {

  // Calculate the x and y distances.

  var dx = c - a,
    dy = d - b;

  // Return the distance.

  return Math.sqrt(dx * dx + dy * dy);

};

Art.prototype.modules.display.curve.coordinates = function (points, position) {

  // Initialize variables.

  var length = 0,
    _final,
    i,
    l = points.length;

  // Loop through the points and calculate the coordinate based on the current step.

  for (i = 2; i < l; i += 2) {
    _final = Art.prototype.modules.display.curve.distance(points[i], points[i + 1], points[i - 2], points[i - 1]);
    length += _final;
    if (position < length && _final) {
      length -= _final;
      position -= length;

      // Return the coordinate.

      return {
        x: points[i - 2] + (points[i] - points[i - 2]) * (position / _final),
        y: points[i - 1] + (points[i + 1] - points[i - 1]) * (position / _final)
      };

    }
  }

};

// Don't overwrite `Function.prototype.length`, so use an underscore for the name.

Art.prototype.modules.display.curve._length = function (points) {

  // Loop over the points and calculate the sum.

  for (var length = 0, i = 0; i < points.length - 2; i += 2) {
    length += Art.prototype.modules.display.curve.distance(points[i + 2], points[i + 3], points[i], points[i + 1]);
  }

  // Return it.

  return length;

};

Art.prototype.modules.display.curve.spline = function (points, tension, segments, closed) {

  // Set defaults if they are not provided.

  tension = (typeof tension === 'number') ? tension : 0.5;
  segments = (typeof segments === 'number') ? segments : 25;

  // Initialize variables.

  var _points,
    i = 1,
    l = points.length,
    _position = 0,
    rLen = (l - 2) * segments + 2 + (closed ? 2 * segments : 0),
    _spline = new Float32Array(rLen),
    cache = new Float32Array((segments + 2) * 4),
    _c = 4;

  _points = points.slice(0);

  var parse = function (_points, cache, l, tension) {

    for (var i = 2, t; i < l; i += 2) {

      var _a = _points[i],
        _b = _points[i + 1],
        _d = _points[i + 2],
        _e = _points[i + 3],

        $a = (_d - _points[i - 2]) * tension,
        $aa = (_e - _points[i - 1]) * tension,
        $b = (_points[i + 4] - _a) * tension,
        $bb = (_points[i + 5] - _b) * tension,
        c = 0,
        x, y, z, $z;

      for (t = 0; t < segments; t++) {

        x = cache[c++];
        y = cache[c++];
        z = cache[c++];
        $z = cache[c++];

        _spline[_position++] = x * _a + y * _d + z * $a + $z * $b;
        _spline[_position++] = x * _b + y * _e + z * $aa + $z * $bb;
      }
    }
  };

  // Add or remove points based on whether or not the curve should be closed.

  if (closed) {
    _points.unshift(points[l - 1]);
    _points.unshift(points[l - 2]);
    _points.push(points[0], points[1]);
  } else {
    _points.unshift(points[1]);
    _points.unshift(points[0]);
    _points.push(points[l - 2], points[l - 1]);
  }

  // Calculate the spline.

  cache[0] = 1;

  for (; i < segments; i++) {

    var a = i / segments,
      b = a * a,
      c = b * a,
      d = c * 2,
      e = b * 3;

    cache[_c++] = d - e + 1;
    cache[_c++] = e - d;
    cache[_c++] = c - 2 * b + a;
    cache[_c++] = c - b;
  }

  cache[++_c] = 1;

  parse(_points, cache, l, tension);

  if (closed) {
    _points = [];
    _points.push(points[l - 4], points[l - 3],
      points[l - 2], points[l - 1],
      points[0], points[1],
      points[2], points[3]);
    parse(_points, cache, 4, tension);
  }

  l = closed ? 0 : points.length - 2;
  _spline[_position++] = points[l++];
  _spline[_position] = points[l];

  // Return the spline.

  return _spline;

};

Art.prototype.modules.animation.path = function (options) {

  // Initialize variables.

  var _spline = Art.prototype.modules.display.curve.spline(options.points, options.tension, options.segments, options.closed),
    _length = Art.prototype.modules.display.curve._length(_spline),
    t = 0,
    speed = options.speed,
    object = options.object || this,
    position;

  // Perform the animation with requestAnimationFrame.

  (function update() {
    Art.prototype.modules.ticker.request(update);
    t += speed;
    if (t < 0 || t >= _length) {
      speed *= -1;
    }
    position = Art.prototype.modules.display.curve.coordinates(_spline, t);
    object.x = position.x || object.x;
    object.y = position.y || object.y;
  }());

  // Return the object for chainability.

  return object;

};

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        width: 250,
        margin: {
          x: 15,
          y: 15
        },
        height: 250,
        data: [
          ['Jan', 0],
          ['Feb', 50],
          ['Mar', 100]
        ],
        title: 'Test',
        labels: {
          x: 'Foo',
          y: 'Bar'
        }
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'graph',
  textHeight: function (font) {

    // Initialize variables.

    var body = document.body,
      dummy = document.createElement('div'),
      text = document.createTextNode('M'),
      result;

    // Append the div to the DOM, cache the height, and remove it.

    dummy.appendChild(text);
    dummy.setAttribute('style', font);
    body.appendChild(dummy);
    result = dummy.offsetHeight;
    body.removeChild(dummy);

    return result;

  },
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.Base.core.graphics;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(t.width, 0);
    g.moveTo(0, 2);
    g.lineTo(0, -t.height);
    g.font = '15px Helvetica';
    g.fillText(t.labels.x, t.width / 2 - (g.measureText(t.labels.x).width / 2), 40);
    g.translate(0, -t.height / 2);
    g.rotate(-Math.PI / 2);
    g.fillText(t.labels.y, -g.measureText(t.labels.y).width / 2, -40);
    g.rotate(Math.PI / 2);
    g.translate(0, t.height / 2);
    for (var d = 0; d < t.data.length; d += 1) {
      g.fillText(t.data[d][0], d * (g.measureText(t.data[d][0]).width + t.margin.x), 20);
    }
    g.rotate(-Math.PI / 2);
    for (var $d = 0; $d < t.data.length; $d += 1) {
      g.fillText(t.data[$d][1], $d * (t.textHeight('font: ' + g.font + ';') + t.margin.y), -10);
    }
    g.moveTo(0, t.data[0][1]);
    for (var _d = 1; _d < t.data.length; _d += 1) {
      g.lineTo(_d * (g.measureText(t.data[_d][0]).width + t.margin.x), t.data[_d][1]);
    }
    g.rotate(Math.PI / 2);
    g.font = '25px Helvetica';
    g.fillText(t.title, t.width / 2, -t.height - 10);
    g.font = '15px Helvetica';
    g.rotate(-Math.PI / 2);
    g.closePath();
    g.stroke();
    g.fillStyle = '#505050';
    g.beginPath();
    for (var __d = 0; __d < t.data.length; __d += 1) {
      g.arc(__d * (g.measureText(t.data[__d][0]).width + t.margin.x), t.data[__d][1], 5, 0, Math.PI * 2, false);
    }
    g.closePath();
    g.fill();
    g.restore();

    return this;

  },

  boundaries: function () {

    // Return the bounding box of the object.

    return {
      x: this.x,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    };

  }

});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        colors: [],
        data: [
          60,
          60,
          60,
          60,
          60,
          60
        ],
        labels: [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F'
        ],
        radius: 50
      };

    // Populate the array of colors.

    for (var d = 0; d < defaults.data.length; d += 1) {
      defaults.colors.push(Art.prototype.modules.utility.color({
        hue: Math.random() * 360
      }));
    }

    // Extend the object with the defaults overwritten by the objects.

    extend(this, extend(defaults, options));

  },
  id: 'chart',
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.Base.core.graphics,
      last = 0,
      total = 0,
      pieData = [];

    // Acquire the total amount for later calculations.

    for (var d = 0; d < t.data.length; d += 1) {
      total += t.data[d];
    }

    // Store the data about each slice.

    for (var $d = 0; $d < t.data.length; $d += 1) {
      pieData[$d] = [];
      pieData[$d].value = t.data[$d];
      pieData[$d].start = 2 * Math.PI * last;
      pieData[$d].end = 2 * Math.PI * (last + (t.data[$d] / total));
      last += t.data[$d] / total;
    }

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.font = '20px Helvetica';
    for (var _d = 0; _d < t.data.length; _d += 1) {
      g.fillStyle = g.strokeStyle = t.colors[_d];
      g.beginPath();
      g.moveTo(0, 0);
      g.arc(0, 0, t.radius, pieData[_d].start, pieData[_d].end, false);
      g.lineTo(0, 0);
      if (t.fill) {
        g.fill();
      }
      if (t.stroke) {
        g.stroke();
      }
      g.closePath();
      last += Math.PI * 2 * (t.data[$d] / total);
    }
    g.restore();

    return this;

  },

  boundaries: function () {

    // Return the bounding box of the object.

    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };

  },
  
  momentOfInertia: function () {
    return this.mass * this.radius * this.radius / 2;
  }

});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        rows: 5,
        columns: 5,
        width: 500,
        height: 500,
        each: {
          width: null,
          height: null
        }
      };

    // Set the default individual width and height to the rows and columns.

    defaults.each.width = defaults.rows;
    defaults.each.height = defaults.columns;

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'table',
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.Base.core.graphics;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.beginPath();

    // Calculate the offset to correct the endpoints of the table.

    var offset = g.lineWidth / 2;

    for (var x = 0; x < t.width; x += t.height / t.each.width) {
      g.moveTo(x, 0);
      g.lineTo(x, t.height + offset);
    }
    for (var y = 0; y < t.height; y += t.height / t.each.height) {
      g.moveTo(-offset, y);
      g.lineTo(t.width + offset, y);
    }
    g.moveTo(t.width, 0);
    g.lineTo(t.width, t.height);
    g.moveTo(0, t.height);
    g.lineTo(t.width + offset, t.height);
    g.closePath();
    g.stroke();
    g.restore();

    return this;

  },

  boundaries: function () {

    // Return the bounding box of the object.

    return this;

  }

});

Art.prototype.modules.display.Base.extend({
  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        spikes: 5,
        radius: {
          outer: 30,
          inner: 15
        }
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

  },
  id: 'star',
  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.star.core.graphics,
      rotation = Math.PI / 2 * 3,
      step = Math.PI / t.spikes,
      s = 0;

    // Execute the drawing commands.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.strokeStyle = t.stroke === 'super' ? t.parent.stroke : t.stroke;
    g.fillStyle = t.fill === 'super' ? t.parent.fill : t.fill;
    g.globalAlpha = t.opacity === 'super' ? t.parent.opacity : t.opacity;
    g.lineWidth = t.lineWidth === 'super' ? t.parent.lineWidth : t.lineWidth;
    g.scale(t.scale.x, t.scale.y);
    g.beginPath();
    g.moveTo(0, -t.radius.outer);
    for (; s < t.spikes; s++) {
      g.lineTo(Math.cos(rotation) * t.radius.outer, Math.sin(rotation) * t.radius.outer);
      rotation += step;
      g.lineTo(Math.cos(rotation) * t.radius.inner, Math.sin(rotation) * t.radius.inner);
      rotation += step;
    }
    g.lineTo(0, -t.radius.outer);
    g.closePath();
    if (t.fill) {
      g.fill();
    }
    if (t.stroke) {
      g.stroke();
    }
    g.restore();

    // Return the core for chainability.

    return t;

  },

  boundaries: function () {

    // Return the bounding box of the object.
    // Stars are concave, so this won't work.

    return {
      x: this.x,
      y: this.y,
      width: this.radius.outer,
      height: this.radius.inner
    };

  }

});

Art.prototype.modules.display.Base.extend({

  constructor: function (options) {

    // Initialize variables.

    var extend = Art.prototype.modules.utility.extend,
      defaults = {
        children: [],
        group: true
      };

    // Extend the object with the defaults overwritten by the options.

    extend(this, extend(defaults, options));

    // Make each child get the object as its parent.

    for (var c = 0; c < this.children.length; c += 1) {
      this.children[c].parent = this;
    }

  },

  id: 'group',

  draw: function () {

    // Initialize variables.

    var t = this,
      g = Art.prototype.modules.display.group.core.graphics,
      c = 0;

    // Draw each child relative to the object.

    g.save();
    g.translate(t.x, t.y);
    g.rotate(t.rotation);
    g.scale(t.scale.x, t.scale.y);
    for (; c < t.children.length; c += 1) {
      t.children[c].draw();
    }
    g.restore();

    // Return the object for chainability.

    return this;

  },

  boundaries: function () {

    var aabb, child, result, x = [],
      y = [];

    for (var c = 0, length = this.children.length; c < length; c += 1) {
      child = this.children[c];
      aabb = child.boundaries();
      aabb.x += this.x;
      aabb.y += this.y;
      result = result ? Art.prototype.modules.physics.aabb2(result, aabb, true) : aabb;
      for (var _b in aabb) {
        if (_b === 'x') {
          x.push(aabb[_b]);
        } else if (_b === 'y') {
          y.push(aabb[_b]);
        }
      }
    }

    var min = {
      x: Math.min.apply(null, x),
      y: Math.min.apply(null, y)
    };

    result.x = min.x;
    result.y = min.y;

    return result;

  },
  
  momentOfInertia: function () {
    
    var c,
        mOI = 0;
    
    for (; c < this.children.length; c += 1) {
      mOI += this.children[c].momentOfInertia();
    }
    
    return this.children[0].momentOfInertia() / 12000;
    
  }

});

Art.prototype.modules.physics.vector = function (x, y) {

  // Let `vector` be called without `new`.

  if (!(this instanceof Art.prototype.modules.physics.vector)) {
    return new Art.prototype.modules.physics.vector(x, y);
  }

  // Extend the object with the vector components.

  this.x = x;
  this.y = y;

};

Art.prototype.modules.physics.vector.prototype.clone = function () {

  // Return a clone of the vector.

  return Art.prototype.modules.physics.vector(this.x, this.y);

};

Art.prototype.modules.physics.vector.prototype.dot = function (vector) {

  // Return the dot product of the vector and another.

  return this.x * vector.x + this.y * vector.y;

};

Art.prototype.modules.physics.vector.prototype.vCross = function (vector) {
  return this.x * vector.y - this.y * vector.x;
};

Art.prototype.modules.physics.vector.prototype.sCross = function (scalar) {
  return Art.prototype.modules.physics.vector(scalar * this.y, -scalar * this.x);
};

Art.prototype.modules.physics.vector.prototype._sCross = function (scalar) {
  return Art.prototype.modules.physics.vector(-scalar * this.y, scalar * this.x);
};

Art.prototype.modules.physics.vector.prototype.length = function () {

  // Return the length of the vector.

  return Math.sqrt(this.x * this.x + this.y * this.y);

};

Art.prototype.modules.physics.vector.prototype.normalize = function () {

  // Normalize the vector.

  var scalar = 1 / this.length();
  this.x *= scalar;
  this.y *= scalar;

  // Return the vector for chainability.

  return this;

};

Art.prototype.modules.physics.vector.prototype.rotate = function (angle) {

  // Rotate the vector.

  this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

  // Return the vector for chainability.

  return this;

};

Art.prototype.modules.physics.vector.prototype.add = function (vector) {

  // Add the components of another vector.

  this.x += vector.x;
  this.y += vector.y;

  // Return the vector for chainability.

  return this;

};

Art.prototype.modules.physics.vector.prototype.subtract = function (vector) {

  // Add the components of another vector.

  this.x -= vector.x;
  this.y -= vector.y;

  // Return the vector for chainability.

  return this;

};

Art.prototype.modules.physics.vector.prototype.multiply = function (scalar) {

  // Return the product of the vector and another.

  return Art.prototype.modules.physics.vector(this.x * scalar, this.y * scalar);

};

Art.prototype.modules.physics.vector.prototype.divide = function (scalar) {

  // Return the product of the vector and another.

  return Art.prototype.modules.physics.vector(this.x / scalar, this.y / scalar);

};

Art.prototype.modules.physics.response = function (bodyA, bodyB) {
  var v;
  var vDelta;
  var lh;
  var rh;
  var x;
  var distance;
  var direction = this.vector(bodyA.x - bodyB.x, bodyA.y - bodyB.y);
  var d;
  var isCircle = false;
  if (bodyA.radius && bodyB.radius) {
    d = bodyA.radius + bodyB.radius;
    isCircle = true;
  } else {
    var boundsA = bodyA.boundaries(),
      boundsB = bodyB.boundaries();
    d = boundsA.width / 2 + boundsB.width / 2;
  }
  var f = direction.length();
  if (f > d) {
    return;
  }
  distance = bodyA.mass + bodyB.mass;
  direction.normalize();
  v = this.vector(direction.y, -direction.x);
  vDelta = direction.multiply((isCircle ? bodyA.radius + bodyB.radius : boundsA.width / 2 + boundsB.width / 2) - f);
  var cacheA = vDelta.multiply(bodyB.mass / distance);
  bodyA.x += cacheA.x;
  bodyA.y += cacheA.y;
  var cacheB = vDelta.multiply(-bodyA.mass / distance);
  bodyB.x += cacheB.x;
  bodyB.y += cacheB.y;
  x = -bodyA.restitution * -bodyB.restitution;
  lh = direction.multiply(bodyA.velocity.dot(direction)).length();
  rh = direction.multiply(bodyB.velocity.dot(direction)).length();
  bodyA.velocity = v.multiply(bodyA.velocity.dot(v));
  var _cacheA = direction.multiply((x * bodyB.mass * (rh - lh) + bodyA.mass * lh + bodyB.mass * rh) / distance);
  bodyA.velocity.x += _cacheA.x;
  bodyA.velocity.y += _cacheA.y;
  bodyB.velocity = v.multiply(bodyB.velocity.dot(v));
  var _cacheB = direction.multiply((x * bodyA.mass * (lh - rh) + bodyB.mass * rh + bodyA.mass * lh) / distance);
  bodyB.velocity.x += _cacheB.x;
  bodyB.velocity.y += _cacheB.y;
  var pivotA = this.vector(bodyA.x, bodyA.y);
  bodyA.angularVelocity = 1 * 0.2 * (bodyA.angularVelocity / Math.abs(bodyA.angularVelocity)) * pivotA.subtract(isCircle ? pivotA.add(bodyA.radius) : {
    x: pivotA.x + boundsA.width,
    y: pivotA.y + boundsA.height
  }).vCross(bodyA.velocity);
  var pivotB = this.vector(bodyB.x, bodyB.y);
  bodyB.angularVelocity = 1 * 0.2 * (bodyB.angularVelocity / Math.abs(bodyB.angularVelocity)) * pivotB.subtract(isCircle ? pivotB.add(bodyB.radius) : {
    x: pivotB.x + boundsB.width,
    y: pivotB.y + boundsB.height
  }).vCross(bodyB.velocity);
  return this.response.core;
};

Art.prototype.modules.physics.walls = function (options) {

  // Initialize variables.

  var canvas = this.walls.core.canvas,
    object = options.object || this,
    bounce = options.restitution || object.restitution || -0.5,
    offset = {},
    walls = {
      left: canvas.left || 0,
      right: canvas.right || canvas.width,
      top: canvas.top || 0,
      bottom: canvas.bottom || canvas.height
    };

  if (!object.group) {

    if (object.radius) {
      offset.x = offset.y = object.radius;
    } else {
      var boundaries = object.boundaries();
      offset.x = boundaries.width / 2;
      offset.y = boundaries.height / 2;
    }

    var callback = options.callback || {
      left: function () {
        object.x = offset.x;
        object.velocity.x *= bounce;
      },
      right: function () {
        object.x = walls.right - offset.x;
        object.velocity.x *= bounce;
      },
      top: function () {
        object.y = offset.y;
        object.velocity.y *= bounce;
      },
      bottom: function () {
        object.y = walls.bottom - offset.y;
        object.velocity.y *= (object.velocity.y < 0.5 ? 0 : bounce);
      }
    };

    // Perform the calculations and bounce the object.

    if (object.x - offset.x < walls.left) {
      if (typeof callback === 'function') {
        callback.call(object, object, walls);
      } else {
        if (callback.left) {
          callback.left.call(object, object, walls);
        }
      }
    } else if (object.x + offset.x > walls.right) {
      if (typeof callback === 'function') {
        callback.call(object, object, walls);
      } else {
        if (callback.right) {
          callback.right.call(object, object, walls);
        }
      }
    }
    if (object.y - offset.y < walls.top) {
      if (typeof callback === 'function') {
        callback.call(object, object, walls);
      } else {
        if (callback.top) {
          callback.top.call(object, object, walls);
        }
      }
    } else if (object.y + offset.y > walls.bottom) {
      if (typeof callback === 'function') {
        callback.call(object, object, walls);
      } else {
        if (callback.bottom) {
          callback.bottom.call(object, object, walls);
        }
      }
    }

  } else {

    for (var o = 0; o < object.children.length; o += 1) {
      var child = Art.prototype.modules.utility.extend({}, object.children[o]),
        _offset = {};
      child.x += object.x;
      child.y += object.y;
      if (child.radius) {
        _offset.x = _offset.y = child.radius;
      } else {
        var _boundaries = child.boundaries();
        _offset.x = _boundaries.width / 2;
        _offset.y = _boundaries.height / 2;
      }
      var _callback = options.callback || {
        left: function () {
          child.x = _offset.x;
          child.velocity.x *= bounce;
        },
        right: function () {
          child.x = walls.right - _offset.x;
          child.velocity.x *= bounce;
        },
        top: function () {
          child.y = _offset.y;
          child.velocity.y *= bounce;
        },
        bottom: function () {
          // object.y = walls.bottom - _offset.y;
          if (object.velocity.y > 0.5) {
            object.velocity.y *= bounce;
          }
        }
      };

      // Perform the calculations and bounce the child.

      if (child.x - offset.x < walls.left) {
        if (typeof _callback === 'function') {
          _callback.call(child, child, walls);
        } else {
          if (_callback.left) {
            _callback.left.call(child, child, walls);
          }
        }
      } else if (child.x + _offset.x > walls.right) {
        if (typeof _callback === 'function') {
          _callback.call(child, child, walls);
        } else {
          if (_callback.right) {
            _callback.right.call(child, child, walls);
          }
        }
      }
      if (child.y - _offset.y < walls.top) {
        if (typeof _callback === 'function') {
          _callback.call(child, child, walls);
        } else {
          if (_callback.top) {
            _callback.top.call(child, child, walls);
          }
        }
      } else if (child.y + _offset.y > walls.bottom) {
        if (typeof _callback === 'function') {
          _callback.call(child, child, walls);
        } else {
          if (_callback.bottom) {
            _callback.bottom.call(child, child, walls);
          }
        }
      }
    }

  }

  // Return the object for chainability.

  return object;

};

Art.prototype.modules.physics.aabb2 = function (aabb1, aabb2, modify) {

  // Initialize variables and calculate the union AABB.

  var result = modify === true ? aabb1 : {},
    maxX = Math.max(aabb1.x + aabb1.width / 2, aabb2.x + aabb2.width / 2),
    maxY = Math.max(aabb1.y + aabb1.height / 2, aabb2.y + aabb2.height / 2),
    minX = Math.min(aabb1.x - aabb1.width / 2, aabb2.x - aabb2.width / 2),
    minY = Math.min(aabb1.y - aabb1.height / 2, aabb2.y - aabb2.height / 2);

  // Set the result.

  result.width = (Math.abs(maxX - minX) * 0.5) * 2;
  result.height = (Math.abs(maxY - minY) * 0.5) * 2;
  result.x = (maxX + minX) * 0.5;
  result.y = (maxY + minY) * 0.5;

  // Return it.

  return result;

};

Art.prototype.modules.physics.corner = function (x, y, _x, _y, rotation) {

  // Initialize variables.

  var a,
    b,
    dx,
    dy,
    distance;

  // Calculate the point.

  dx = _x - x;
  dy = _y - y;
  distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  rotation += Math.atan2(dy, dx);

  a = x + distance * Math.cos(rotation);
  b = y + distance * Math.sin(rotation);

  // Return it.

  return {
    x: a,
    y: b
  };

};

Art.prototype.modules.ticker.fps = (function () {

  // Initialize variables.

  var last = performance.now(),
    count = 1,
    fps = 0;

  // Return the function to get the frames per second.

  return function () {

    // For some reason, Date.now and performance.now() do not work here.

    var current = new Date().getMilliseconds();
    if (last > current) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    last = current;
    return fps;

  };

}());

Art.prototype.modules.ticker.clear = function () {

  // Initialize variables.

  var core = this.clear.core,
    graphics = core.graphics,
    canvas = core.canvas;

  // Clear the canvas.

  graphics.clearRect(0, 0, canvas.width, canvas.height);

};

Art.prototype.modules.ticker.update = function () {

  // Initialize variables.

  var core = this.update.core,
    o = 0,
    _o,
    length = core.objects.length;

  // Loop over the objects added to the core and update them.

  for (; o < length; o += 1) {
    // Draw the object.
    core.objects[o].draw();
    // Move the object.
    core.objects[o].x += core.objects[o].velocity.x;
    core.objects[o].y += core.objects[o].velocity.y;
    // Detect collisions and call the response function if necessary.
    for (_o = o + 1; _o < length; _o += 1) {
      var result = core.objects[o].collides(core.objects[_o]);
      if (typeof result !== 'undefined' && (result.collision === true || result === true)) {
        if (!core.objects[o].group && !core.objects[_o].group) {
          core.physics.response(core.objects[o], core.objects[_o]);
        } else if (core.objects[o].group && core.objects[_o].group) {
          core.physics.response(result.part[0], result.part[1]);
        } else if (core.objects[o].group) {
          core.physics.response(result.part, core.objects[_o]);
        } else {
          core.physics.response(core.objects[o], result.part);
        }
      }
    }
    // Apply the object's forces.
    if (core.objects[o]._force) {
      for (var f in core.objects[o].forces) {
        if (core.objects[o].forces.hasOwnProperty(f)) {
          core.physics.force(core.utility.extend({
            object: core.objects[o]
          }, core.objects[o].forces[f]));
        }
      }
      // Rotate the object.
      if (core.objects[o]._angular) {
        var torque = 0;
        torque += core.objects[o].angularVelocity * -1; 
        core.objects[o].angularAcceleration = torque / core.objects[o].momentOfInertia();
        core.objects[o].angularVelocity += core.objects[o].angularAcceleration;
        core.objects[o].rotation += core.objects[o].angularVelocity;
      }
    }
    // Check for collisions against the walls.
    core.objects[o].walls();
  }

  // Return the core for chainability.

  return core;

};

Art.prototype.modules.ticker.loop = function (callback) {

  // Initialize variables.

  var id,
    self = this;

  // Run the code with requestAnimationFrame.

  (function update() {
    id = self.request(update);
    self.clear();
    self.update();
    callback();
  }());

  return id;

};

Art.prototype.modules.utility.random = function (options) {

  // Declare defaults and override them with the options.

  var defaults = {
    minimum: 0,
    maximum: 100
  };

  this.extend(defaults, options);

  return Math.floor(Math.random() * (defaults.maximum - defaults.minimum + 1)) + defaults.minimum;

};

Art.prototype.modules.utility.toCamelCase = function (string) {

  // Convert a dashed-string to a camelCase one.

  return string.replace(/(\-[a-z])/g, function (x) {
    return x.toUpperCase().replace('-', '');
  });

};

Art.prototype.modules.utility.containsPoint = function (point, rectangle) {

  // Simple AABB collision detection.

  return point.x > rectangle.x && point.x < rectangle.x + rectangle.width && point.y > rectangle.y && point.y < rectangle.y + rectangle.height;

};

Art.prototype.modules.utility.color = function (options) {

  // Initialize variables.

  var defaults = {
    hue: 180,
    saturation: 50,
    light: 50,
    alpha: 50
  };

  // Extend the defaults with the given options.

  this.extend(defaults, options);

  return 'hsla(' + defaults.hue + ', ' + defaults.saturation + '%, ' + defaults.light + '%, ' + defaults.alpha + ')';

};

Art.prototype.modules.utility.plugin = function (options) {

  // Give the plugin a reference to the core.

  options.plugin = options.plugin.bind(this.plugin.core);

  // If the plugin is a display object, have it inherit from the Base via #extend.

  if (options.module === 'display') {

    // Initialize variables.

    var display = {
        constructor: options.plugin,
        id: options.id
      },
      p;

    // Loop over the given options and give #extend any prototypical methods.

    for (p in options) {
      if (options.hasOwnProperty(p)) {
        if (p !== 'plugin' && p !== 'module' && p !== 'id') {
          display[p] = options[p];
        }
      }
    }

    // Extend the display object with the Base, also adding it to the display module.

    Art.prototype.modules.display.Base.extend(display);

  } else {

    // Otherwise, simply add the plugin to its respective module.

    Art.prototype.modules[options.module][options.id] = options.plugin;

  }

  // Return the core for chainability.

  return this.plugin.core;

};

Art.prototype.modules.utility.pointer = function () {

  // Initialize variables.

  var pointer = {},
    element = this.pointer.core.canvas,
    x,
    y;

  // Add the event listeners.

  element.addEventListener('mousemove', function (event) {
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= element.offsetLeft;
    y -= element.offsetTop;
    pointer.x = x;
    pointer.y = y;
  }, false);

  element.addEventListener('touchstart', function () {
    pointer.pressed = true;
  });

  element.addEventListener('touchmove', function (event) {
    var x,
      y,
      _touch = event.touches[0];
    if (_touch.pageX && _touch.pageY) {
      x = _touch.pageX;
      y = _touch.pageY;
    } else {
      x = _touch.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = _touch.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    pointer.x = x;
    pointer.y = y;
  });

  // Return the pointer.

  return pointer;

};

Art.prototype.modules.utility.resize = function (options) {

  // @TODO: Figure out how to dynamically resize it from here.

  // Initialize variables.

  var core = this.resize.core,
    defaults = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

  // Extend the canvas with the width and height properties.

  core.canvas.width = options.width || defaults.width;
  core.canvas.height = options.height || defaults.height;

  // If we should update the size on a `resize` event, add an event listener.

  if (options.listen) {
    (function (canvas, options, defaults) {
      window.addEventListener('resize', function () {
        canvas.width = options.width || defaults.width;
        canvas.height = options.height || defaults.height;
      });
    }(core.canvas, options, defaults));
  }

  return core;

};

Art.prototype.modules.utility.hslaInformation = function (hsla) {

  // Declare variables for brevity and retrieve the information.

  var information = hsla.slice(5, hsla.length - 1).split(', '),
    result = {
      hue: information[0],
      saturation: information[1],
      light: information[2],
      alpha: information[3]
    };

  // Return it.

  return result;

};

Art.prototype.modules.utility.style = function (options) {

  // Loop over the styles and apply them.

  for (var s in options) {
    if (options.hasOwnProperty(s)) {
      this.style.core.canvas.style[s] = options[s];
    }
  }

  // Return the core for chainability.

  return this.style.core;

};

Art.prototype.modules.utility.populate = function (options) {

  // For `n` objects, populate a given array with the return value of the callback function.

  for (var o = 0; o <= options.amount; o += 1) {
    options.stack.push(options.factory.call(o, o));
  }

  // Return the stack for assignment brevity.

  return options.stack;

};

Art.prototype.modules.utility.scratch = {

  types: {},

  pools: {},

  register: function (id, factory) {

    this.types[id] = factory;
    this.pools[id] = [];

    return factory;

  },

  get: function (id) {

    var pool = this.pools[id];

    if (pool.length !== 0) {
      return pool.pop();
    } else {
      return new this.types[id]();
    }

  },

  free: function (id, object, result) {

    this.pools[id].push(object);

    return result;

  }
};

Art.prototype.modules.utility.scratch.register('vector', Art.prototype.modules.physics.vector);


var world = Art().utility.resize({
    width: window.innerWidth,
    height: window.innerHeight
  }).utility.style({
    backgroundColor: '#171717' // dark gray
  }),

  scale = function(n) {
    return n * window.innerWidth / 600;
  },

  zero = world.display.group({
    x: world.canvas.width / 2 - scale(80),
    y: world.canvas.height / 2,
    fill: '#DC322F', // red
    stroke: '#A42222', // dark red
    restitution: -0.5, // bounciness
    children: [
      // 'super' refers to the parent's value
      world.display.rectangle({
        x: scale(-50),
        y: 0,
        width: scale(20),
        height: scale(97),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: scale(50),
        y: 0,
        width: scale(20),
        height: scale(97),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: 0,
        y: scale(75),
        width: scale(48),
        height: scale(20),
        mass: 20,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: -scale(35),
        y: scale(60),
        rotation: Math.PI / 4,
        width: scale(50),
        height: scale(20),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: scale(35),
        y: scale(60),
        rotation: -Math.PI / 4,
        width: scale(50),
        height: scale(20),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: 0,
        y: scale(-75),
        width: scale(48),
        height: scale(20),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: -scale(35),
        y: -scale(60),
        rotation: -Math.PI / 4,
        width: scale(50),
        height: scale(20),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: scale(35),
        y: -scale(60),
        rotation: Math.PI / 4,
        width: scale(50),
        height: scale(20),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      })
    ]
  }),

  point = world.display.circle({
    x: world.canvas.width / 2 + scale(6),
    y: world.canvas.height / 2 + scale(76),
    radius: scale(13),
    fill: '#DC322F', // red
    stroke: '#A42222', // dark red
  }),

  seven = world.display.group({
    x: world.canvas.width / 2 + scale(50),
    y: world.canvas.height / 2,
    fill: '#DC322F', // red
    stroke: '#A42222', // dark red
    restitution: -0.3, // bounciness
    children: [
      // 'super' refers to the parent's value
      world.display.rectangle({
        x: scale(35),
        y: -scale(80),
        width: scale(114),
        height: scale(24),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      }),
      world.display.rectangle({
        x: scale(51.5),
        y: scale(2.5),
        rotation: -70 * Math.PI / 180,
        width: scale(160),
        height: scale(28),
        mass: 40,
        fill: 'super',
        stroke: 'super'
      })
    ]
  }),

  balls = world.utility.populate({
    amount: 100,
    stack: [],
    factory: function() {
      var radius = scale(10),
        circle = world.display.circle({
          x: world.utility.random({
            minimum: radius, // to prevent it from getting stuck in a wall
            maximum: world.canvas.width
          }),
          y: -100,
          radius: radius,
          mass: 8,
          restitution: -0.6, // bounciness
          fill: '#1D6B98', // blue
          stroke: '#14546F', // dark blue
          _walls: false // temporarily, until they're past the top wall
        });
      circle.dragAndDrop();
      circle.forces.gravity.by = 0.9;
      return circle;
    }
  }),

  walls = function(ball) {
    if (ball.y - ball.radius > 0) {
      ball._walls = true;
    }
  };

zero.dragAndDrop();
point.dragAndDrop();
seven.dragAndDrop();

zero.forces.gravity.by = point.forces.gravity.by = seven.forces.gravity.by = 0.9;

world.add(zero, point, seven, balls);

world.ticker.loop(function() {
  balls.forEach(walls);
});

