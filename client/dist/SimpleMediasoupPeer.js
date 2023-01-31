!(function () {
  function e(e, t, r, s) {
    Object.defineProperty(e, t, { get: r, set: s, enumerable: !0, configurable: !0 });
  }
  var t =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
        ? self
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : {},
    r = {},
    s = {},
    i = t.parcelRequirec509;
  null == i &&
    (((i = function (e) {
      if (e in r) return r[e].exports;
      if (e in s) {
        var t = s[e];
        delete s[e];
        var i = { id: e, exports: {} };
        return (r[e] = i), t.call(i.exports, i, i.exports), i.exports;
      }
      var a = new Error("Cannot find module '" + e + "'");
      throw ((a.code = "MODULE_NOT_FOUND"), a);
    }).register = function (e, t) {
      s[e] = t;
    }),
    (t.parcelRequirec509 = i)),
    i.register("j5U6Y", function (e, t) {
      var r = i("fW3Z9");
      (e.exports.formatArgs = function (t) {
        if (
          ((t[0] =
            (this.useColors ? "%c" : "") +
            this.namespace +
            (this.useColors ? " %c" : " ") +
            t[0] +
            (this.useColors ? "%c " : " ") +
            "+" +
            e.exports.humanize(this.diff)),
          !this.useColors)
        )
          return;
        const r = "color: " + this.color;
        t.splice(1, 0, r, "color: inherit");
        let s = 0,
          i = 0;
        t[0].replace(/%[a-zA-Z%]/g, (e) => {
          "%%" !== e && (s++, "%c" === e && (i = s));
        }),
          t.splice(i, 0, r);
      }),
        (e.exports.save = function (t) {
          try {
            t ? e.exports.storage.setItem("debug", t) : e.exports.storage.removeItem("debug");
          } catch (e) {}
        }),
        (e.exports.load = function () {
          let t;
          try {
            t = e.exports.storage.getItem("debug");
          } catch (e) {}
          !t && void 0 !== r && "env" in r && (t = void 0);
          return t;
        }),
        (e.exports.useColors = function () {
          return (
            !(
              "undefined" == typeof window ||
              !window.process ||
              ("renderer" !== window.process.type && !window.process.__nwjs)
            ) ||
            (("undefined" == typeof navigator ||
              !navigator.userAgent ||
              !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) &&
              (("undefined" != typeof document &&
                document.documentElement &&
                document.documentElement.style &&
                document.documentElement.style.WebkitAppearance) ||
                ("undefined" != typeof window &&
                  window.console &&
                  (window.console.firebug || (window.console.exception && window.console.table))) ||
                ("undefined" != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                  parseInt(RegExp.$1, 10) >= 31) ||
                ("undefined" != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))))
          );
        }),
        (e.exports.storage = (function () {
          try {
            return localStorage;
          } catch (e) {}
        })()),
        (e.exports.destroy = (() => {
          let e = !1;
          return () => {
            e ||
              ((e = !0),
              console.warn(
                "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
              ));
          };
        })()),
        (e.exports.colors = [
          "#0000CC",
          "#0000FF",
          "#0033CC",
          "#0033FF",
          "#0066CC",
          "#0066FF",
          "#0099CC",
          "#0099FF",
          "#00CC00",
          "#00CC33",
          "#00CC66",
          "#00CC99",
          "#00CCCC",
          "#00CCFF",
          "#3300CC",
          "#3300FF",
          "#3333CC",
          "#3333FF",
          "#3366CC",
          "#3366FF",
          "#3399CC",
          "#3399FF",
          "#33CC00",
          "#33CC33",
          "#33CC66",
          "#33CC99",
          "#33CCCC",
          "#33CCFF",
          "#6600CC",
          "#6600FF",
          "#6633CC",
          "#6633FF",
          "#66CC00",
          "#66CC33",
          "#9900CC",
          "#9900FF",
          "#9933CC",
          "#9933FF",
          "#99CC00",
          "#99CC33",
          "#CC0000",
          "#CC0033",
          "#CC0066",
          "#CC0099",
          "#CC00CC",
          "#CC00FF",
          "#CC3300",
          "#CC3333",
          "#CC3366",
          "#CC3399",
          "#CC33CC",
          "#CC33FF",
          "#CC6600",
          "#CC6633",
          "#CC9900",
          "#CC9933",
          "#CCCC00",
          "#CCCC33",
          "#FF0000",
          "#FF0033",
          "#FF0066",
          "#FF0099",
          "#FF00CC",
          "#FF00FF",
          "#FF3300",
          "#FF3333",
          "#FF3366",
          "#FF3399",
          "#FF33CC",
          "#FF33FF",
          "#FF6600",
          "#FF6633",
          "#FF9900",
          "#FF9933",
          "#FFCC00",
          "#FFCC33",
        ]),
        (e.exports.log = console.debug || console.log || (() => {})),
        (e.exports = i("f5cUy")(e.exports));
      const { formatters: s } = e.exports;
      s.j = function (e) {
        try {
          return JSON.stringify(e);
        } catch (e) {
          return "[UnexpectedJSONParseError]: " + e.message;
        }
      };
    }),
    i.register("fW3Z9", function (e, t) {
      var r,
        s,
        i = (e.exports = {});
      function a() {
        throw new Error("setTimeout has not been defined");
      }
      function n() {
        throw new Error("clearTimeout has not been defined");
      }
      function o(e) {
        if (r === setTimeout) return setTimeout(e, 0);
        if ((r === a || !r) && setTimeout) return (r = setTimeout), setTimeout(e, 0);
        try {
          return r(e, 0);
        } catch (t) {
          try {
            return r.call(null, e, 0);
          } catch (t) {
            return r.call(this, e, 0);
          }
        }
      }
      !(function () {
        try {
          r = "function" == typeof setTimeout ? setTimeout : a;
        } catch (e) {
          r = a;
        }
        try {
          s = "function" == typeof clearTimeout ? clearTimeout : n;
        } catch (e) {
          s = n;
        }
      })();
      var c,
        d = [],
        p = !1,
        l = -1;
      function u() {
        p && c && ((p = !1), c.length ? (d = c.concat(d)) : (l = -1), d.length && h());
      }
      function h() {
        if (!p) {
          var e = o(u);
          p = !0;
          for (var t = d.length; t; ) {
            for (c = d, d = []; ++l < t; ) c && c[l].run();
            (l = -1), (t = d.length);
          }
          (c = null),
            (p = !1),
            (function (e) {
              if (s === clearTimeout) return clearTimeout(e);
              if ((s === n || !s) && clearTimeout) return (s = clearTimeout), clearTimeout(e);
              try {
                s(e);
              } catch (t) {
                try {
                  return s.call(null, e);
                } catch (t) {
                  return s.call(this, e);
                }
              }
            })(e);
        }
      }
      function m(e, t) {
        (this.fun = e), (this.array = t);
      }
      function f() {}
      (i.nextTick = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
        d.push(new m(e, t)), 1 !== d.length || p || o(h);
      }),
        (m.prototype.run = function () {
          this.fun.apply(null, this.array);
        }),
        (i.title = "browser"),
        (i.browser = !0),
        (i.env = {}),
        (i.argv = []),
        (i.version = ""),
        (i.versions = {}),
        (i.on = f),
        (i.addListener = f),
        (i.once = f),
        (i.off = f),
        (i.removeListener = f),
        (i.removeAllListeners = f),
        (i.emit = f),
        (i.prependListener = f),
        (i.prependOnceListener = f),
        (i.listeners = function (e) {
          return [];
        }),
        (i.binding = function (e) {
          throw new Error("process.binding is not supported");
        }),
        (i.cwd = function () {
          return "/";
        }),
        (i.chdir = function (e) {
          throw new Error("process.chdir is not supported");
        }),
        (i.umask = function () {
          return 0;
        });
    }),
    i.register("f5cUy", function (e, t) {
      e.exports = function (e) {
        function t(e) {
          let s,
            i,
            a,
            n = null;
          function o(...e) {
            if (!o.enabled) return;
            const r = o,
              i = Number(new Date()),
              a = i - (s || i);
            (r.diff = a),
              (r.prev = s),
              (r.curr = i),
              (s = i),
              (e[0] = t.coerce(e[0])),
              "string" != typeof e[0] && e.unshift("%O");
            let n = 0;
            (e[0] = e[0].replace(/%([a-zA-Z%])/g, (s, i) => {
              if ("%%" === s) return "%";
              n++;
              const a = t.formatters[i];
              if ("function" == typeof a) {
                const t = e[n];
                (s = a.call(r, t)), e.splice(n, 1), n--;
              }
              return s;
            })),
              t.formatArgs.call(r, e);
            (r.log || t.log).apply(r, e);
          }
          return (
            (o.namespace = e),
            (o.useColors = t.useColors()),
            (o.color = t.selectColor(e)),
            (o.extend = r),
            (o.destroy = t.destroy),
            Object.defineProperty(o, "enabled", {
              enumerable: !0,
              configurable: !1,
              get: () =>
                null !== n
                  ? n
                  : (i !== t.namespaces && ((i = t.namespaces), (a = t.enabled(e))), a),
              set: (e) => {
                n = e;
              },
            }),
            "function" == typeof t.init && t.init(o),
            o
          );
        }
        function r(e, r) {
          const s = t(this.namespace + (void 0 === r ? ":" : r) + e);
          return (s.log = this.log), s;
        }
        function s(e) {
          return e
            .toString()
            .substring(2, e.toString().length - 2)
            .replace(/\.\*\?$/, "*");
        }
        return (
          (t.debug = t),
          (t.default = t),
          (t.coerce = function (e) {
            return e instanceof Error ? e.stack || e.message : e;
          }),
          (t.disable = function () {
            const e = [...t.names.map(s), ...t.skips.map(s).map((e) => "-" + e)].join(",");
            return t.enable(""), e;
          }),
          (t.enable = function (e) {
            let r;
            t.save(e), (t.namespaces = e), (t.names = []), (t.skips = []);
            const s = ("string" == typeof e ? e : "").split(/[\s,]+/),
              i = s.length;
            for (r = 0; r < i; r++)
              s[r] &&
                ("-" === (e = s[r].replace(/\*/g, ".*?"))[0]
                  ? t.skips.push(new RegExp("^" + e.substr(1) + "$"))
                  : t.names.push(new RegExp("^" + e + "$")));
          }),
          (t.enabled = function (e) {
            if ("*" === e[e.length - 1]) return !0;
            let r, s;
            for (r = 0, s = t.skips.length; r < s; r++) if (t.skips[r].test(e)) return !1;
            for (r = 0, s = t.names.length; r < s; r++) if (t.names[r].test(e)) return !0;
            return !1;
          }),
          (t.humanize = i("kcicw")),
          (t.destroy = function () {
            console.warn(
              "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
            );
          }),
          Object.keys(e).forEach((r) => {
            t[r] = e[r];
          }),
          (t.names = []),
          (t.skips = []),
          (t.formatters = {}),
          (t.selectColor = function (e) {
            let r = 0;
            for (let t = 0; t < e.length; t++) (r = (r << 5) - r + e.charCodeAt(t)), (r |= 0);
            return t.colors[Math.abs(r) % t.colors.length];
          }),
          t.enable(t.load()),
          t
        );
      };
    }),
    i.register("kcicw", function (e, t) {
      var r = 1e3,
        s = 6e4,
        i = 36e5,
        a = 864e5,
        n = 6048e5,
        o = 315576e5;
      function c(e, t, r, s) {
        var i = t >= 1.5 * r;
        return Math.round(e / r) + " " + s + (i ? "s" : "");
      }
      e.exports = function (e, t) {
        t = t || {};
        var d,
          p,
          l = typeof e;
        if ("string" === l && e.length > 0)
          return (function (e) {
            if ((e = String(e)).length > 100) return;
            var t =
              /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
                e
              );
            if (!t) return;
            var c = parseFloat(t[1]);
            switch ((t[2] || "ms").toLowerCase()) {
              case "years":
              case "year":
              case "yrs":
              case "yr":
              case "y":
                return c * o;
              case "weeks":
              case "week":
              case "w":
                return c * n;
              case "days":
              case "day":
              case "d":
                return c * a;
              case "hours":
              case "hour":
              case "hrs":
              case "hr":
              case "h":
                return c * i;
              case "minutes":
              case "minute":
              case "mins":
              case "min":
              case "m":
                return c * s;
              case "seconds":
              case "second":
              case "secs":
              case "sec":
              case "s":
                return c * r;
              case "milliseconds":
              case "millisecond":
              case "msecs":
              case "msec":
              case "ms":
                return c;
              default:
                return;
            }
          })(e);
        if ("number" === l && isFinite(e))
          return t.long
            ? ((d = e),
              (p = Math.abs(d)) >= a
                ? c(d, p, a, "day")
                : p >= i
                ? c(d, p, i, "hour")
                : p >= s
                ? c(d, p, s, "minute")
                : p >= r
                ? c(d, p, r, "second")
                : d + " ms")
            : (function (e) {
                var t = Math.abs(e);
                return t >= a
                  ? Math.round(e / a) + "d"
                  : t >= i
                  ? Math.round(e / i) + "h"
                  : t >= s
                  ? Math.round(e / s) + "m"
                  : t >= r
                  ? Math.round(e / r) + "s"
                  : e + "ms";
              })(e);
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(e)
        );
      };
    }),
    i.register("cUDrk", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          },
        n =
          (e.exports && e.exports.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.Device = e.exports.detectDevice = void 0);
      const o = n(i("1q2cn"));
      var c = i("6pHSb"),
        d = i("6DeKT"),
        p = i("difix");
      const l = a(i("dgn3R")),
        u = a(i("k5BaR"));
      var h = i("cdWGp"),
        m = i("6iDbn"),
        f = i("8AwsK"),
        g = i("gK4f7"),
        _ = i("01sYR"),
        v = i("4GmmQ"),
        b = i("9vwLt"),
        y = i("cmHMi"),
        w = i("8GXS8"),
        S = i("in3Qs");
      const R = new c.Logger("Device");
      function P() {
        if ("object" == typeof navigator && "ReactNative" === navigator.product)
          return "undefined" == typeof RTCPeerConnection
            ? void R.warn(
                "this._detectDevice() | unsupported ReactNative without RTCPeerConnection"
              )
            : (R.debug("this._detectDevice() | ReactNative handler chosen"), "ReactNative");
        if ("object" != typeof navigator || "string" != typeof navigator.userAgent)
          R.warn("this._detectDevice() | unknown device");
        else {
          const e = navigator.userAgent,
            t = o.default.getParser(e),
            r = t.getEngine();
          if (t.satisfies({ chrome: ">=74", chromium: ">=74" })) return "Chrome74";
          if (t.satisfies({ chrome: ">=70", chromium: ">=70" })) return "Chrome70";
          if (t.satisfies({ chrome: ">=67", chromium: ">=67" })) return "Chrome67";
          if (t.satisfies({ chrome: ">=55", chromium: ">=55" })) return "Chrome55";
          if (t.satisfies({ firefox: ">=60" })) return "Firefox60";
          if (
            t.satisfies({ safari: ">=12.0" }) &&
            "undefined" != typeof RTCRtpTransceiver &&
            RTCRtpTransceiver.prototype.hasOwnProperty("currentDirection")
          )
            return "Safari12";
          if (t.satisfies({ safari: ">=11" })) return "Safari11";
          if (
            t.satisfies({ "microsoft edge": ">=11" }) &&
            t.satisfies({ "microsoft edge": "<=18" })
          )
            return "Edge11";
          if (r.name && "blink" === r.name.toLowerCase()) {
            const t = e.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);
            if (t) {
              const e = Number(t[1]);
              return e >= 74
                ? "Chrome74"
                : e >= 70
                ? "Chrome70"
                : e >= 67
                ? "Chrome67"
                : "Chrome55";
            }
            return "Chrome74";
          }
          R.warn(
            "this._detectDevice() | browser not supported [name:%s, version:%s]",
            t.getBrowserName(),
            t.getBrowserVersion()
          );
        }
      }
      e.exports.detectDevice = P;
      e.exports.Device = class {
        get handlerName() {
          return this._handlerName;
        }
        get loaded() {
          return this._loaded;
        }
        get rtpCapabilities() {
          if (!this._loaded) throw new p.InvalidStateError("not loaded");
          return this._recvRtpCapabilities;
        }
        get sctpCapabilities() {
          if (!this._loaded) throw new p.InvalidStateError("not loaded");
          return this._sctpCapabilities;
        }
        get observer() {
          return this._observer;
        }
        async load({ routerRtpCapabilities: e }) {
          let t;
          R.debug("load() [routerRtpCapabilities:%o]", e), (e = l.clone(e, void 0));
          try {
            if (this._loaded) throw new p.InvalidStateError("already loaded");
            u.validateRtpCapabilities(e), (t = this._handlerFactory());
            const r = await t.getNativeRtpCapabilities();
            R.debug("load() | got native RTP capabilities:%o", r),
              u.validateRtpCapabilities(r),
              (this._extendedRtpCapabilities = u.getExtendedRtpCapabilities(r, e)),
              R.debug("load() | got extended RTP capabilities:%o", this._extendedRtpCapabilities),
              (this._canProduceByKind.audio = u.canSend("audio", this._extendedRtpCapabilities)),
              (this._canProduceByKind.video = u.canSend("video", this._extendedRtpCapabilities)),
              (this._recvRtpCapabilities = u.getRecvRtpCapabilities(this._extendedRtpCapabilities)),
              u.validateRtpCapabilities(this._recvRtpCapabilities),
              R.debug("load() | got receiving RTP capabilities:%o", this._recvRtpCapabilities),
              (this._sctpCapabilities = await t.getNativeSctpCapabilities()),
              R.debug("load() | got native SCTP capabilities:%o", this._sctpCapabilities),
              u.validateSctpCapabilities(this._sctpCapabilities),
              R.debug("load() succeeded"),
              (this._loaded = !0),
              t.close();
          } catch (e) {
            throw (t && t.close(), e);
          }
        }
        canProduce(e) {
          if (!this._loaded) throw new p.InvalidStateError("not loaded");
          if ("audio" !== e && "video" !== e) throw new TypeError(`invalid kind "${e}"`);
          return this._canProduceByKind[e];
        }
        createSendTransport({
          id: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          appData: d = {},
        }) {
          return (
            R.debug("createSendTransport()"),
            this._createTransport({
              direction: "send",
              id: e,
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              iceServers: a,
              iceTransportPolicy: n,
              additionalSettings: o,
              proprietaryConstraints: c,
              appData: d,
            })
          );
        }
        createRecvTransport({
          id: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          appData: d = {},
        }) {
          return (
            R.debug("createRecvTransport()"),
            this._createTransport({
              direction: "recv",
              id: e,
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              iceServers: a,
              iceTransportPolicy: n,
              additionalSettings: o,
              proprietaryConstraints: c,
              appData: d,
            })
          );
        }
        _createTransport({
          direction: e,
          id: t,
          iceParameters: r,
          iceCandidates: s,
          dtlsParameters: i,
          sctpParameters: a,
          iceServers: n,
          iceTransportPolicy: o,
          additionalSettings: c,
          proprietaryConstraints: d,
          appData: l = {},
        }) {
          if (!this._loaded) throw new p.InvalidStateError("not loaded");
          if ("string" != typeof t) throw new TypeError("missing id");
          if ("object" != typeof r) throw new TypeError("missing iceParameters");
          if (!Array.isArray(s)) throw new TypeError("missing iceCandidates");
          if ("object" != typeof i) throw new TypeError("missing dtlsParameters");
          if (a && "object" != typeof a) throw new TypeError("wrong sctpParameters");
          if (l && "object" != typeof l) throw new TypeError("if given, appData must be an object");
          const u = new h.Transport({
            direction: e,
            id: t,
            iceParameters: r,
            iceCandidates: s,
            dtlsParameters: i,
            sctpParameters: a,
            iceServers: n,
            iceTransportPolicy: o,
            additionalSettings: c,
            proprietaryConstraints: d,
            appData: l,
            handlerFactory: this._handlerFactory,
            extendedRtpCapabilities: this._extendedRtpCapabilities,
            canProduceByKind: this._canProduceByKind,
          });
          return this._observer.safeEmit("newtransport", u), u;
        }
        constructor({ handlerName: e, handlerFactory: t, Handler: r } = {}) {
          if (
            ((this._loaded = !1),
            (this._observer = new d.EnhancedEventEmitter()),
            R.debug("constructor()"),
            r)
          ) {
            if (
              (R.warn(
                "constructor() | Handler option is DEPRECATED, use handlerName or handlerFactory instead"
              ),
              "string" != typeof r)
            )
              throw new TypeError(
                "non string Handler option no longer supported, use handlerFactory instead"
              );
            e = r;
          }
          if (e && t)
            throw new TypeError("just one of handlerName or handlerInterface can be given");
          if (t) this._handlerFactory = t;
          else {
            if (e) R.debug("constructor() | handler given: %s", e);
            else {
              if (!(e = P())) throw new p.UnsupportedError("device not supported");
              R.debug("constructor() | detected handler: %s", e);
            }
            switch (e) {
              case "Chrome74":
                this._handlerFactory = m.Chrome74.createFactory();
                break;
              case "Chrome70":
                this._handlerFactory = f.Chrome70.createFactory();
                break;
              case "Chrome67":
                this._handlerFactory = g.Chrome67.createFactory();
                break;
              case "Chrome55":
                this._handlerFactory = _.Chrome55.createFactory();
                break;
              case "Firefox60":
                this._handlerFactory = v.Firefox60.createFactory();
                break;
              case "Safari12":
                this._handlerFactory = b.Safari12.createFactory();
                break;
              case "Safari11":
                this._handlerFactory = y.Safari11.createFactory();
                break;
              case "Edge11":
                this._handlerFactory = w.Edge11.createFactory();
                break;
              case "ReactNative":
                this._handlerFactory = S.ReactNative.createFactory();
                break;
              default:
                throw new TypeError(`unknown handlerName "${e}"`);
            }
          }
          const s = this._handlerFactory();
          (this._handlerName = s.name),
            s.close(),
            (this._extendedRtpCapabilities = void 0),
            (this._recvRtpCapabilities = void 0),
            (this._canProduceByKind = { audio: !1, video: !1 }),
            (this._sctpCapabilities = void 0);
        }
      };
    }),
    i.register("1q2cn", function (e, t) {
      e.exports,
        (e.exports = (function (e) {
          var t = {};
          function r(s) {
            if (t[s]) return t[s].exports;
            var i = (t[s] = { i: s, l: !1, exports: {} });
            return e[s].call(i.exports, i, i.exports, r), (i.l = !0), i.exports;
          }
          return (
            (r.m = e),
            (r.c = t),
            (r.d = function (e, t, s) {
              r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s });
            }),
            (r.r = function (e) {
              "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
                Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (r.t = function (e, t) {
              if ((1 & t && (e = r(e)), 8 & t)) return e;
              if (4 & t && "object" == typeof e && e && e.__esModule) return e;
              var s = Object.create(null);
              if (
                (r.r(s),
                Object.defineProperty(s, "default", { enumerable: !0, value: e }),
                2 & t && "string" != typeof e)
              )
                for (var i in e)
                  r.d(
                    s,
                    i,
                    function (t) {
                      return e[t];
                    }.bind(null, i)
                  );
              return s;
            }),
            (r.n = function (e) {
              var t =
                e && e.__esModule
                  ? function () {
                      return e.default;
                    }
                  : function () {
                      return e;
                    };
              return r.d(t, "a", t), t;
            }),
            (r.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (r.p = ""),
            r((r.s = 90))
          );
        })({
          17: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s = r(18),
              i = (function () {
                function e() {}
                return (
                  (e.getFirstMatch = function (e, t) {
                    var r = t.match(e);
                    return (r && r.length > 0 && r[1]) || "";
                  }),
                  (e.getSecondMatch = function (e, t) {
                    var r = t.match(e);
                    return (r && r.length > 1 && r[2]) || "";
                  }),
                  (e.matchAndReturnConst = function (e, t, r) {
                    if (e.test(t)) return r;
                  }),
                  (e.getWindowsVersionName = function (e) {
                    switch (e) {
                      case "NT":
                        return "NT";
                      case "XP":
                      case "NT 5.1":
                        return "XP";
                      case "NT 5.0":
                        return "2000";
                      case "NT 5.2":
                        return "2003";
                      case "NT 6.0":
                        return "Vista";
                      case "NT 6.1":
                        return "7";
                      case "NT 6.2":
                        return "8";
                      case "NT 6.3":
                        return "8.1";
                      case "NT 10.0":
                        return "10";
                      default:
                        return;
                    }
                  }),
                  (e.getMacOSVersionName = function (e) {
                    var t = e
                      .split(".")
                      .splice(0, 2)
                      .map(function (e) {
                        return parseInt(e, 10) || 0;
                      });
                    if ((t.push(0), 10 === t[0]))
                      switch (t[1]) {
                        case 5:
                          return "Leopard";
                        case 6:
                          return "Snow Leopard";
                        case 7:
                          return "Lion";
                        case 8:
                          return "Mountain Lion";
                        case 9:
                          return "Mavericks";
                        case 10:
                          return "Yosemite";
                        case 11:
                          return "El Capitan";
                        case 12:
                          return "Sierra";
                        case 13:
                          return "High Sierra";
                        case 14:
                          return "Mojave";
                        case 15:
                          return "Catalina";
                        default:
                          return;
                      }
                  }),
                  (e.getAndroidVersionName = function (e) {
                    var t = e
                      .split(".")
                      .splice(0, 2)
                      .map(function (e) {
                        return parseInt(e, 10) || 0;
                      });
                    if ((t.push(0), !(1 === t[0] && t[1] < 5)))
                      return 1 === t[0] && t[1] < 6
                        ? "Cupcake"
                        : 1 === t[0] && t[1] >= 6
                        ? "Donut"
                        : 2 === t[0] && t[1] < 2
                        ? "Eclair"
                        : 2 === t[0] && 2 === t[1]
                        ? "Froyo"
                        : 2 === t[0] && t[1] > 2
                        ? "Gingerbread"
                        : 3 === t[0]
                        ? "Honeycomb"
                        : 4 === t[0] && t[1] < 1
                        ? "Ice Cream Sandwich"
                        : 4 === t[0] && t[1] < 4
                        ? "Jelly Bean"
                        : 4 === t[0] && t[1] >= 4
                        ? "KitKat"
                        : 5 === t[0]
                        ? "Lollipop"
                        : 6 === t[0]
                        ? "Marshmallow"
                        : 7 === t[0]
                        ? "Nougat"
                        : 8 === t[0]
                        ? "Oreo"
                        : 9 === t[0]
                        ? "Pie"
                        : void 0;
                  }),
                  (e.getVersionPrecision = function (e) {
                    return e.split(".").length;
                  }),
                  (e.compareVersions = function (t, r, s) {
                    void 0 === s && (s = !1);
                    var i = e.getVersionPrecision(t),
                      a = e.getVersionPrecision(r),
                      n = Math.max(i, a),
                      o = 0,
                      c = e.map([t, r], function (t) {
                        var r = n - e.getVersionPrecision(t),
                          s = t + new Array(r + 1).join(".0");
                        return e
                          .map(s.split("."), function (e) {
                            return new Array(20 - e.length).join("0") + e;
                          })
                          .reverse();
                      });
                    for (s && (o = n - Math.min(i, a)), n -= 1; n >= o; ) {
                      if (c[0][n] > c[1][n]) return 1;
                      if (c[0][n] === c[1][n]) {
                        if (n === o) return 0;
                        n -= 1;
                      } else if (c[0][n] < c[1][n]) return -1;
                    }
                  }),
                  (e.map = function (e, t) {
                    var r,
                      s = [];
                    if (Array.prototype.map) return Array.prototype.map.call(e, t);
                    for (r = 0; r < e.length; r += 1) s.push(t(e[r]));
                    return s;
                  }),
                  (e.find = function (e, t) {
                    var r, s;
                    if (Array.prototype.find) return Array.prototype.find.call(e, t);
                    for (r = 0, s = e.length; r < s; r += 1) {
                      var i = e[r];
                      if (t(i, r)) return i;
                    }
                  }),
                  (e.assign = function (e) {
                    for (
                      var t,
                        r,
                        s = e,
                        i = arguments.length,
                        a = new Array(i > 1 ? i - 1 : 0),
                        n = 1;
                      n < i;
                      n++
                    )
                      a[n - 1] = arguments[n];
                    if (Object.assign) return Object.assign.apply(Object, [e].concat(a));
                    var o = function () {
                      var e = a[t];
                      "object" == typeof e &&
                        null !== e &&
                        Object.keys(e).forEach(function (t) {
                          s[t] = e[t];
                        });
                    };
                    for (t = 0, r = a.length; t < r; t += 1) o();
                    return e;
                  }),
                  (e.getBrowserAlias = function (e) {
                    return s.BROWSER_ALIASES_MAP[e];
                  }),
                  (e.getBrowserTypeByAlias = function (e) {
                    return s.BROWSER_MAP[e] || "";
                  }),
                  e
                );
              })();
            (t.default = i), (e.exports = t.default);
          },
          18: function (e, t, r) {
            "use strict";
            (t.__esModule = !0),
              (t.ENGINE_MAP =
                t.OS_MAP =
                t.PLATFORMS_MAP =
                t.BROWSER_MAP =
                t.BROWSER_ALIASES_MAP =
                  void 0),
              (t.BROWSER_ALIASES_MAP = {
                "Amazon Silk": "amazon_silk",
                "Android Browser": "android",
                Bada: "bada",
                BlackBerry: "blackberry",
                Chrome: "chrome",
                Chromium: "chromium",
                Electron: "electron",
                Epiphany: "epiphany",
                Firefox: "firefox",
                Focus: "focus",
                Generic: "generic",
                "Google Search": "google_search",
                Googlebot: "googlebot",
                "Internet Explorer": "ie",
                "K-Meleon": "k_meleon",
                Maxthon: "maxthon",
                "Microsoft Edge": "edge",
                "MZ Browser": "mz",
                "NAVER Whale Browser": "naver",
                Opera: "opera",
                "Opera Coast": "opera_coast",
                PhantomJS: "phantomjs",
                Puffin: "puffin",
                QupZilla: "qupzilla",
                QQ: "qq",
                QQLite: "qqlite",
                Safari: "safari",
                Sailfish: "sailfish",
                "Samsung Internet for Android": "samsung_internet",
                SeaMonkey: "seamonkey",
                Sleipnir: "sleipnir",
                Swing: "swing",
                Tizen: "tizen",
                "UC Browser": "uc",
                Vivaldi: "vivaldi",
                "WebOS Browser": "webos",
                WeChat: "wechat",
                "Yandex Browser": "yandex",
                Roku: "roku",
              }),
              (t.BROWSER_MAP = {
                amazon_silk: "Amazon Silk",
                android: "Android Browser",
                bada: "Bada",
                blackberry: "BlackBerry",
                chrome: "Chrome",
                chromium: "Chromium",
                electron: "Electron",
                epiphany: "Epiphany",
                firefox: "Firefox",
                focus: "Focus",
                generic: "Generic",
                googlebot: "Googlebot",
                google_search: "Google Search",
                ie: "Internet Explorer",
                k_meleon: "K-Meleon",
                maxthon: "Maxthon",
                edge: "Microsoft Edge",
                mz: "MZ Browser",
                naver: "NAVER Whale Browser",
                opera: "Opera",
                opera_coast: "Opera Coast",
                phantomjs: "PhantomJS",
                puffin: "Puffin",
                qupzilla: "QupZilla",
                qq: "QQ Browser",
                qqlite: "QQ Browser Lite",
                safari: "Safari",
                sailfish: "Sailfish",
                samsung_internet: "Samsung Internet for Android",
                seamonkey: "SeaMonkey",
                sleipnir: "Sleipnir",
                swing: "Swing",
                tizen: "Tizen",
                uc: "UC Browser",
                vivaldi: "Vivaldi",
                webos: "WebOS Browser",
                wechat: "WeChat",
                yandex: "Yandex Browser",
              }),
              (t.PLATFORMS_MAP = {
                tablet: "tablet",
                mobile: "mobile",
                desktop: "desktop",
                tv: "tv",
              }),
              (t.OS_MAP = {
                WindowsPhone: "Windows Phone",
                Windows: "Windows",
                MacOS: "macOS",
                iOS: "iOS",
                Android: "Android",
                WebOS: "WebOS",
                BlackBerry: "BlackBerry",
                Bada: "Bada",
                Tizen: "Tizen",
                Linux: "Linux",
                ChromeOS: "Chrome OS",
                PlayStation4: "PlayStation 4",
                Roku: "Roku",
              }),
              (t.ENGINE_MAP = {
                EdgeHTML: "EdgeHTML",
                Blink: "Blink",
                Trident: "Trident",
                Presto: "Presto",
                Gecko: "Gecko",
                WebKit: "WebKit",
              });
          },
          90: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s,
              i = (s = r(91)) && s.__esModule ? s : { default: s },
              a = r(18);
            function n(e, t) {
              for (var r = 0; r < t.length; r++) {
                var s = t[r];
                (s.enumerable = s.enumerable || !1),
                  (s.configurable = !0),
                  "value" in s && (s.writable = !0),
                  Object.defineProperty(e, s.key, s);
              }
            }
            var o = (function () {
              function e() {}
              var t;
              return (
                (e.getParser = function (e, t) {
                  if ((void 0 === t && (t = !1), "string" != typeof e))
                    throw new Error("UserAgent should be a string");
                  return new i.default(e, t);
                }),
                (e.parse = function (e) {
                  return new i.default(e).getResult();
                }),
                (t = [
                  {
                    key: "BROWSER_MAP",
                    get: function () {
                      return a.BROWSER_MAP;
                    },
                  },
                  {
                    key: "ENGINE_MAP",
                    get: function () {
                      return a.ENGINE_MAP;
                    },
                  },
                  {
                    key: "OS_MAP",
                    get: function () {
                      return a.OS_MAP;
                    },
                  },
                  {
                    key: "PLATFORMS_MAP",
                    get: function () {
                      return a.PLATFORMS_MAP;
                    },
                  },
                ]) && n(e, t),
                e
              );
            })();
            (t.default = o), (e.exports = t.default);
          },
          91: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s = c(r(92)),
              i = c(r(93)),
              a = c(r(94)),
              n = c(r(95)),
              o = c(r(17));
            function c(e) {
              return e && e.__esModule ? e : { default: e };
            }
            var d = (function () {
              function e(e, t) {
                if ((void 0 === t && (t = !1), null == e || "" === e))
                  throw new Error("UserAgent parameter can't be empty");
                (this._ua = e), (this.parsedResult = {}), !0 !== t && this.parse();
              }
              var t = e.prototype;
              return (
                (t.getUA = function () {
                  return this._ua;
                }),
                (t.test = function (e) {
                  return e.test(this._ua);
                }),
                (t.parseBrowser = function () {
                  var e = this;
                  this.parsedResult.browser = {};
                  var t = o.default.find(s.default, function (t) {
                    if ("function" == typeof t.test) return t.test(e);
                    if (t.test instanceof Array)
                      return t.test.some(function (t) {
                        return e.test(t);
                      });
                    throw new Error("Browser's test function is not valid");
                  });
                  return (
                    t && (this.parsedResult.browser = t.describe(this.getUA())),
                    this.parsedResult.browser
                  );
                }),
                (t.getBrowser = function () {
                  return this.parsedResult.browser
                    ? this.parsedResult.browser
                    : this.parseBrowser();
                }),
                (t.getBrowserName = function (e) {
                  return e
                    ? String(this.getBrowser().name).toLowerCase() || ""
                    : this.getBrowser().name || "";
                }),
                (t.getBrowserVersion = function () {
                  return this.getBrowser().version;
                }),
                (t.getOS = function () {
                  return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
                }),
                (t.parseOS = function () {
                  var e = this;
                  this.parsedResult.os = {};
                  var t = o.default.find(i.default, function (t) {
                    if ("function" == typeof t.test) return t.test(e);
                    if (t.test instanceof Array)
                      return t.test.some(function (t) {
                        return e.test(t);
                      });
                    throw new Error("Browser's test function is not valid");
                  });
                  return (
                    t && (this.parsedResult.os = t.describe(this.getUA())), this.parsedResult.os
                  );
                }),
                (t.getOSName = function (e) {
                  var t = this.getOS().name;
                  return e ? String(t).toLowerCase() || "" : t || "";
                }),
                (t.getOSVersion = function () {
                  return this.getOS().version;
                }),
                (t.getPlatform = function () {
                  return this.parsedResult.platform
                    ? this.parsedResult.platform
                    : this.parsePlatform();
                }),
                (t.getPlatformType = function (e) {
                  void 0 === e && (e = !1);
                  var t = this.getPlatform().type;
                  return e ? String(t).toLowerCase() || "" : t || "";
                }),
                (t.parsePlatform = function () {
                  var e = this;
                  this.parsedResult.platform = {};
                  var t = o.default.find(a.default, function (t) {
                    if ("function" == typeof t.test) return t.test(e);
                    if (t.test instanceof Array)
                      return t.test.some(function (t) {
                        return e.test(t);
                      });
                    throw new Error("Browser's test function is not valid");
                  });
                  return (
                    t && (this.parsedResult.platform = t.describe(this.getUA())),
                    this.parsedResult.platform
                  );
                }),
                (t.getEngine = function () {
                  return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
                }),
                (t.getEngineName = function (e) {
                  return e
                    ? String(this.getEngine().name).toLowerCase() || ""
                    : this.getEngine().name || "";
                }),
                (t.parseEngine = function () {
                  var e = this;
                  this.parsedResult.engine = {};
                  var t = o.default.find(n.default, function (t) {
                    if ("function" == typeof t.test) return t.test(e);
                    if (t.test instanceof Array)
                      return t.test.some(function (t) {
                        return e.test(t);
                      });
                    throw new Error("Browser's test function is not valid");
                  });
                  return (
                    t && (this.parsedResult.engine = t.describe(this.getUA())),
                    this.parsedResult.engine
                  );
                }),
                (t.parse = function () {
                  return (
                    this.parseBrowser(),
                    this.parseOS(),
                    this.parsePlatform(),
                    this.parseEngine(),
                    this
                  );
                }),
                (t.getResult = function () {
                  return o.default.assign({}, this.parsedResult);
                }),
                (t.satisfies = function (e) {
                  var t = this,
                    r = {},
                    s = 0,
                    i = {},
                    a = 0;
                  if (
                    (Object.keys(e).forEach(function (t) {
                      var n = e[t];
                      "string" == typeof n
                        ? ((i[t] = n), (a += 1))
                        : "object" == typeof n && ((r[t] = n), (s += 1));
                    }),
                    s > 0)
                  ) {
                    var n = Object.keys(r),
                      c = o.default.find(n, function (e) {
                        return t.isOS(e);
                      });
                    if (c) {
                      var d = this.satisfies(r[c]);
                      if (void 0 !== d) return d;
                    }
                    var p = o.default.find(n, function (e) {
                      return t.isPlatform(e);
                    });
                    if (p) {
                      var l = this.satisfies(r[p]);
                      if (void 0 !== l) return l;
                    }
                  }
                  if (a > 0) {
                    var u = Object.keys(i),
                      h = o.default.find(u, function (e) {
                        return t.isBrowser(e, !0);
                      });
                    if (void 0 !== h) return this.compareVersion(i[h]);
                  }
                }),
                (t.isBrowser = function (e, t) {
                  void 0 === t && (t = !1);
                  var r = this.getBrowserName().toLowerCase(),
                    s = e.toLowerCase(),
                    i = o.default.getBrowserTypeByAlias(s);
                  return t && i && (s = i.toLowerCase()), s === r;
                }),
                (t.compareVersion = function (e) {
                  var t = [0],
                    r = e,
                    s = !1,
                    i = this.getBrowserVersion();
                  if ("string" == typeof i)
                    return (
                      ">" === e[0] || "<" === e[0]
                        ? ((r = e.substr(1)),
                          "=" === e[1] ? ((s = !0), (r = e.substr(2))) : (t = []),
                          ">" === e[0] ? t.push(1) : t.push(-1))
                        : "=" === e[0]
                        ? (r = e.substr(1))
                        : "~" === e[0] && ((s = !0), (r = e.substr(1))),
                      t.indexOf(o.default.compareVersions(i, r, s)) > -1
                    );
                }),
                (t.isOS = function (e) {
                  return this.getOSName(!0) === String(e).toLowerCase();
                }),
                (t.isPlatform = function (e) {
                  return this.getPlatformType(!0) === String(e).toLowerCase();
                }),
                (t.isEngine = function (e) {
                  return this.getEngineName(!0) === String(e).toLowerCase();
                }),
                (t.is = function (e, t) {
                  return (
                    void 0 === t && (t = !1),
                    this.isBrowser(e, t) || this.isOS(e) || this.isPlatform(e)
                  );
                }),
                (t.some = function (e) {
                  var t = this;
                  return (
                    void 0 === e && (e = []),
                    e.some(function (e) {
                      return t.is(e);
                    })
                  );
                }),
                e
              );
            })();
            (t.default = d), (e.exports = t.default);
          },
          92: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s,
              i = (s = r(17)) && s.__esModule ? s : { default: s },
              a = /version\/(\d+(\.?_?\d+)+)/i,
              n = [
                {
                  test: [/googlebot/i],
                  describe: function (e) {
                    var t = { name: "Googlebot" },
                      r =
                        i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/opera/i],
                  describe: function (e) {
                    var t = { name: "Opera" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/opr\/|opios/i],
                  describe: function (e) {
                    var t = { name: "Opera" },
                      r =
                        i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/SamsungBrowser/i],
                  describe: function (e) {
                    var t = { name: "Samsung Internet for Android" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/Whale/i],
                  describe: function (e) {
                    var t = { name: "NAVER Whale Browser" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/MZBrowser/i],
                  describe: function (e) {
                    var t = { name: "MZ Browser" },
                      r =
                        i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/focus/i],
                  describe: function (e) {
                    var t = { name: "Focus" },
                      r =
                        i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/swing/i],
                  describe: function (e) {
                    var t = { name: "Swing" },
                      r =
                        i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/coast/i],
                  describe: function (e) {
                    var t = { name: "Opera Coast" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/opt\/\d+(?:.?_?\d+)+/i],
                  describe: function (e) {
                    var t = { name: "Opera Touch" },
                      r =
                        i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/yabrowser/i],
                  describe: function (e) {
                    var t = { name: "Yandex Browser" },
                      r =
                        i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/ucbrowser/i],
                  describe: function (e) {
                    var t = { name: "UC Browser" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/Maxthon|mxios/i],
                  describe: function (e) {
                    var t = { name: "Maxthon" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/epiphany/i],
                  describe: function (e) {
                    var t = { name: "Epiphany" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/puffin/i],
                  describe: function (e) {
                    var t = { name: "Puffin" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/sleipnir/i],
                  describe: function (e) {
                    var t = { name: "Sleipnir" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/k-meleon/i],
                  describe: function (e) {
                    var t = { name: "K-Meleon" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/micromessenger/i],
                  describe: function (e) {
                    var t = { name: "WeChat" },
                      r =
                        i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/qqbrowser/i],
                  describe: function (e) {
                    var t = { name: /qqbrowserlite/i.test(e) ? "QQ Browser Lite" : "QQ Browser" },
                      r =
                        i.default.getFirstMatch(
                          /(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,
                          e
                        ) || i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/msie|trident/i],
                  describe: function (e) {
                    var t = { name: "Internet Explorer" },
                      r = i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/\sedg\//i],
                  describe: function (e) {
                    var t = { name: "Microsoft Edge" },
                      r = i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/edg([ea]|ios)/i],
                  describe: function (e) {
                    var t = { name: "Microsoft Edge" },
                      r = i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/vivaldi/i],
                  describe: function (e) {
                    var t = { name: "Vivaldi" },
                      r = i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/seamonkey/i],
                  describe: function (e) {
                    var t = { name: "SeaMonkey" },
                      r = i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/sailfish/i],
                  describe: function (e) {
                    var t = { name: "Sailfish" },
                      r = i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/silk/i],
                  describe: function (e) {
                    var t = { name: "Amazon Silk" },
                      r = i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/phantom/i],
                  describe: function (e) {
                    var t = { name: "PhantomJS" },
                      r = i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/slimerjs/i],
                  describe: function (e) {
                    var t = { name: "SlimerJS" },
                      r = i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
                  describe: function (e) {
                    var t = { name: "BlackBerry" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/(web|hpw)[o0]s/i],
                  describe: function (e) {
                    var t = { name: "WebOS Browser" },
                      r =
                        i.default.getFirstMatch(a, e) ||
                        i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/bada/i],
                  describe: function (e) {
                    var t = { name: "Bada" },
                      r = i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/tizen/i],
                  describe: function (e) {
                    var t = { name: "Tizen" },
                      r =
                        i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/qupzilla/i],
                  describe: function (e) {
                    var t = { name: "QupZilla" },
                      r =
                        i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/firefox|iceweasel|fxios/i],
                  describe: function (e) {
                    var t = { name: "Firefox" },
                      r = i.default.getFirstMatch(
                        /(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,
                        e
                      );
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/electron/i],
                  describe: function (e) {
                    var t = { name: "Electron" },
                      r = i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/MiuiBrowser/i],
                  describe: function (e) {
                    var t = { name: "Miui" },
                      r = i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/chromium/i],
                  describe: function (e) {
                    var t = { name: "Chromium" },
                      r =
                        i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, e) ||
                        i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/chrome|crios|crmo/i],
                  describe: function (e) {
                    var t = { name: "Chrome" },
                      r = i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/GSA/i],
                  describe: function (e) {
                    var t = { name: "Google Search" },
                      r = i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: function (e) {
                    var t = !e.test(/like android/i),
                      r = e.test(/android/i);
                    return t && r;
                  },
                  describe: function (e) {
                    var t = { name: "Android Browser" },
                      r = i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/playstation 4/i],
                  describe: function (e) {
                    var t = { name: "PlayStation 4" },
                      r = i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/safari|applewebkit/i],
                  describe: function (e) {
                    var t = { name: "Safari" },
                      r = i.default.getFirstMatch(a, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/.*/i],
                  describe: function (e) {
                    var t = -1 !== e.search("\\(") ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
                    return {
                      name: i.default.getFirstMatch(t, e),
                      version: i.default.getSecondMatch(t, e),
                    };
                  },
                },
              ];
            (t.default = n), (e.exports = t.default);
          },
          93: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s,
              i = (s = r(17)) && s.__esModule ? s : { default: s },
              a = r(18),
              n = [
                {
                  test: [/Roku\/DVP/],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, e);
                    return { name: a.OS_MAP.Roku, version: t };
                  },
                },
                {
                  test: [/windows phone/i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, e);
                    return { name: a.OS_MAP.WindowsPhone, version: t };
                  },
                },
                {
                  test: [/windows /i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, e),
                      r = i.default.getWindowsVersionName(t);
                    return { name: a.OS_MAP.Windows, version: t, versionName: r };
                  },
                },
                {
                  test: [/Macintosh(.*?) FxiOS(.*?)\//],
                  describe: function (e) {
                    var t = { name: a.OS_MAP.iOS },
                      r = i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/macintosh/i],
                  describe: function (e) {
                    var t = i.default
                        .getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, e)
                        .replace(/[_\s]/g, "."),
                      r = i.default.getMacOSVersionName(t),
                      s = { name: a.OS_MAP.MacOS, version: t };
                    return r && (s.versionName = r), s;
                  },
                },
                {
                  test: [/(ipod|iphone|ipad)/i],
                  describe: function (e) {
                    var t = i.default
                      .getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, e)
                      .replace(/[_\s]/g, ".");
                    return { name: a.OS_MAP.iOS, version: t };
                  },
                },
                {
                  test: function (e) {
                    var t = !e.test(/like android/i),
                      r = e.test(/android/i);
                    return t && r;
                  },
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, e),
                      r = i.default.getAndroidVersionName(t),
                      s = { name: a.OS_MAP.Android, version: t };
                    return r && (s.versionName = r), s;
                  },
                },
                {
                  test: [/(web|hpw)[o0]s/i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, e),
                      r = { name: a.OS_MAP.WebOS };
                    return t && t.length && (r.version = t), r;
                  },
                },
                {
                  test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
                  describe: function (e) {
                    var t =
                      i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, e) ||
                      i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, e) ||
                      i.default.getFirstMatch(/\bbb(\d+)/i, e);
                    return { name: a.OS_MAP.BlackBerry, version: t };
                  },
                },
                {
                  test: [/bada/i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, e);
                    return { name: a.OS_MAP.Bada, version: t };
                  },
                },
                {
                  test: [/tizen/i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, e);
                    return { name: a.OS_MAP.Tizen, version: t };
                  },
                },
                {
                  test: [/linux/i],
                  describe: function () {
                    return { name: a.OS_MAP.Linux };
                  },
                },
                {
                  test: [/CrOS/],
                  describe: function () {
                    return { name: a.OS_MAP.ChromeOS };
                  },
                },
                {
                  test: [/PlayStation 4/],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, e);
                    return { name: a.OS_MAP.PlayStation4, version: t };
                  },
                },
              ];
            (t.default = n), (e.exports = t.default);
          },
          94: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s,
              i = (s = r(17)) && s.__esModule ? s : { default: s },
              a = r(18),
              n = [
                {
                  test: [/googlebot/i],
                  describe: function () {
                    return { type: "bot", vendor: "Google" };
                  },
                },
                {
                  test: [/huawei/i],
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/(can-l01)/i, e) && "Nova",
                      r = { type: a.PLATFORMS_MAP.mobile, vendor: "Huawei" };
                    return t && (r.model = t), r;
                  },
                },
                {
                  test: [/nexus\s*(?:7|8|9|10).*/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet, vendor: "Nexus" };
                  },
                },
                {
                  test: [/ipad/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" };
                  },
                },
                {
                  test: [/Macintosh(.*?) FxiOS(.*?)\//],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet, vendor: "Apple", model: "iPad" };
                  },
                },
                {
                  test: [/kftt build/i],
                  describe: function () {
                    return {
                      type: a.PLATFORMS_MAP.tablet,
                      vendor: "Amazon",
                      model: "Kindle Fire HD 7",
                    };
                  },
                },
                {
                  test: [/silk/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet, vendor: "Amazon" };
                  },
                },
                {
                  test: [/tablet(?! pc)/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet };
                  },
                },
                {
                  test: function (e) {
                    var t = e.test(/ipod|iphone/i),
                      r = e.test(/like (ipod|iphone)/i);
                    return t && !r;
                  },
                  describe: function (e) {
                    var t = i.default.getFirstMatch(/(ipod|iphone)/i, e);
                    return { type: a.PLATFORMS_MAP.mobile, vendor: "Apple", model: t };
                  },
                },
                {
                  test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile, vendor: "Nexus" };
                  },
                },
                {
                  test: [/[^-]mobi/i],
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile };
                  },
                },
                {
                  test: function (e) {
                    return "blackberry" === e.getBrowserName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile, vendor: "BlackBerry" };
                  },
                },
                {
                  test: function (e) {
                    return "bada" === e.getBrowserName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile };
                  },
                },
                {
                  test: function (e) {
                    return "windows phone" === e.getBrowserName();
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile, vendor: "Microsoft" };
                  },
                },
                {
                  test: function (e) {
                    var t = Number(String(e.getOSVersion()).split(".")[0]);
                    return "android" === e.getOSName(!0) && t >= 3;
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tablet };
                  },
                },
                {
                  test: function (e) {
                    return "android" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.mobile };
                  },
                },
                {
                  test: function (e) {
                    return "macos" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.desktop, vendor: "Apple" };
                  },
                },
                {
                  test: function (e) {
                    return "windows" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.desktop };
                  },
                },
                {
                  test: function (e) {
                    return "linux" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.desktop };
                  },
                },
                {
                  test: function (e) {
                    return "playstation 4" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tv };
                  },
                },
                {
                  test: function (e) {
                    return "roku" === e.getOSName(!0);
                  },
                  describe: function () {
                    return { type: a.PLATFORMS_MAP.tv };
                  },
                },
              ];
            (t.default = n), (e.exports = t.default);
          },
          95: function (e, t, r) {
            "use strict";
            (t.__esModule = !0), (t.default = void 0);
            var s,
              i = (s = r(17)) && s.__esModule ? s : { default: s },
              a = r(18),
              n = [
                {
                  test: function (e) {
                    return "microsoft edge" === e.getBrowserName(!0);
                  },
                  describe: function (e) {
                    if (/\sedg\//i.test(e)) return { name: a.ENGINE_MAP.Blink };
                    var t = i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, e);
                    return { name: a.ENGINE_MAP.EdgeHTML, version: t };
                  },
                },
                {
                  test: [/trident/i],
                  describe: function (e) {
                    var t = { name: a.ENGINE_MAP.Trident },
                      r = i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: function (e) {
                    return e.test(/presto/i);
                  },
                  describe: function (e) {
                    var t = { name: a.ENGINE_MAP.Presto },
                      r = i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: function (e) {
                    var t = e.test(/gecko/i),
                      r = e.test(/like gecko/i);
                    return t && !r;
                  },
                  describe: function (e) {
                    var t = { name: a.ENGINE_MAP.Gecko },
                      r = i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
                {
                  test: [/(apple)?webkit\/537\.36/i],
                  describe: function () {
                    return { name: a.ENGINE_MAP.Blink };
                  },
                },
                {
                  test: [/(apple)?webkit/i],
                  describe: function (e) {
                    var t = { name: a.ENGINE_MAP.WebKit },
                      r = i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, e);
                    return r && (t.version = r), t;
                  },
                },
              ];
            (t.default = n), (e.exports = t.default);
          },
        }));
    }),
    i.register("6pHSb", function (e, t) {
      "use strict";
      var r =
        (e.exports && e.exports.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Logger = void 0);
      const s = r(i("j5U6Y")),
        a = "mediasoup-client";
      e.exports.Logger = class {
        get debug() {
          return this._debug;
        }
        get warn() {
          return this._warn;
        }
        get error() {
          return this._error;
        }
        constructor(e) {
          e
            ? ((this._debug = s.default(`mediasoup-client:${e}`)),
              (this._warn = s.default(`mediasoup-client:WARN:${e}`)),
              (this._error = s.default(`mediasoup-client:ERROR:${e}`)))
            : ((this._debug = s.default(a)),
              (this._warn = s.default("mediasoup-client:WARN")),
              (this._error = s.default("mediasoup-client:ERROR"))),
            (this._debug.log = console.info.bind(console)),
            (this._warn.log = console.warn.bind(console)),
            (this._error.log = console.error.bind(console));
        }
      };
    }),
    i.register("6DeKT", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.EnhancedEventEmitter = void 0);
      var r = i("ktjSa");
      const s = new (i("6pHSb").Logger)("EnhancedEventEmitter");
      class a extends r.EventEmitter {
        safeEmit(e, ...t) {
          const r = this.listenerCount(e);
          try {
            return this.emit(e, ...t);
          } catch (t) {
            return (
              s.error("safeEmit() | event listener threw an error [event:%s]:%o", e, t), Boolean(r)
            );
          }
        }
        async safeEmitAsPromise(e, ...t) {
          return new Promise((r, i) => {
            try {
              this.emit(e, ...t, r, i);
            } catch (t) {
              s.error("safeEmitAsPromise() | event listener threw an error [event:%s]:%o", e, t),
                i(t);
            }
          });
        }
        constructor() {
          super(), this.setMaxListeners(1 / 0);
        }
      }
      e.exports.EnhancedEventEmitter = a;
    }),
    i.register("ktjSa", function (e, t) {
      "use strict";
      var r,
        s = "object" == typeof Reflect ? Reflect : null,
        i =
          s && "function" == typeof s.apply
            ? s.apply
            : function (e, t, r) {
                return Function.prototype.apply.call(e, t, r);
              };
      r =
        s && "function" == typeof s.ownKeys
          ? s.ownKeys
          : Object.getOwnPropertySymbols
          ? function (e) {
              return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
            }
          : function (e) {
              return Object.getOwnPropertyNames(e);
            };
      var a =
        Number.isNaN ||
        function (e) {
          return e != e;
        };
      function n() {
        n.init.call(this);
      }
      (e.exports = n),
        (e.exports.once = function (e, t) {
          return new Promise(function (r, s) {
            function i(r) {
              e.removeListener(t, a), s(r);
            }
            function a() {
              "function" == typeof e.removeListener && e.removeListener("error", i),
                r([].slice.call(arguments));
            }
            g(e, t, a, { once: !0 }),
              "error" !== t &&
                (function (e, t, r) {
                  "function" == typeof e.on && g(e, "error", t, r);
                })(e, i, { once: !0 });
          });
        }),
        (n.EventEmitter = n),
        (n.prototype._events = void 0),
        (n.prototype._eventsCount = 0),
        (n.prototype._maxListeners = void 0);
      var o = 10;
      function c(e) {
        if ("function" != typeof e)
          throw new TypeError(
            'The "listener" argument must be of type Function. Received type ' + typeof e
          );
      }
      function d(e) {
        return void 0 === e._maxListeners ? n.defaultMaxListeners : e._maxListeners;
      }
      function p(e, t, r, s) {
        var i, a, n, o;
        if (
          (c(r),
          void 0 === (a = e._events)
            ? ((a = e._events = Object.create(null)), (e._eventsCount = 0))
            : (void 0 !== a.newListener &&
                (e.emit("newListener", t, r.listener ? r.listener : r), (a = e._events)),
              (n = a[t])),
          void 0 === n)
        )
          (n = a[t] = r), ++e._eventsCount;
        else if (
          ("function" == typeof n ? (n = a[t] = s ? [r, n] : [n, r]) : s ? n.unshift(r) : n.push(r),
          (i = d(e)) > 0 && n.length > i && !n.warned)
        ) {
          n.warned = !0;
          var p = new Error(
            "Possible EventEmitter memory leak detected. " +
              n.length +
              " " +
              String(t) +
              " listeners added. Use emitter.setMaxListeners() to increase limit"
          );
          (p.name = "MaxListenersExceededWarning"),
            (p.emitter = e),
            (p.type = t),
            (p.count = n.length),
            (o = p),
            console && console.warn && console.warn(o);
        }
        return e;
      }
      function l() {
        if (!this.fired)
          return (
            this.target.removeListener(this.type, this.wrapFn),
            (this.fired = !0),
            0 === arguments.length
              ? this.listener.call(this.target)
              : this.listener.apply(this.target, arguments)
          );
      }
      function u(e, t, r) {
        var s = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r },
          i = l.bind(s);
        return (i.listener = r), (s.wrapFn = i), i;
      }
      function h(e, t, r) {
        var s = e._events;
        if (void 0 === s) return [];
        var i = s[t];
        return void 0 === i
          ? []
          : "function" == typeof i
          ? r
            ? [i.listener || i]
            : [i]
          : r
          ? (function (e) {
              for (var t = new Array(e.length), r = 0; r < t.length; ++r)
                t[r] = e[r].listener || e[r];
              return t;
            })(i)
          : f(i, i.length);
      }
      function m(e) {
        var t = this._events;
        if (void 0 !== t) {
          var r = t[e];
          if ("function" == typeof r) return 1;
          if (void 0 !== r) return r.length;
        }
        return 0;
      }
      function f(e, t) {
        for (var r = new Array(t), s = 0; s < t; ++s) r[s] = e[s];
        return r;
      }
      function g(e, t, r, s) {
        if ("function" == typeof e.on) s.once ? e.once(t, r) : e.on(t, r);
        else {
          if ("function" != typeof e.addEventListener)
            throw new TypeError(
              'The "emitter" argument must be of type EventEmitter. Received type ' + typeof e
            );
          e.addEventListener(t, function i(a) {
            s.once && e.removeEventListener(t, i), r(a);
          });
        }
      }
      Object.defineProperty(n, "defaultMaxListeners", {
        enumerable: !0,
        get: function () {
          return o;
        },
        set: function (e) {
          if ("number" != typeof e || e < 0 || a(e))
            throw new RangeError(
              'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                e +
                "."
            );
          o = e;
        },
      }),
        (n.init = function () {
          (void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events) ||
            ((this._events = Object.create(null)), (this._eventsCount = 0)),
            (this._maxListeners = this._maxListeners || void 0);
        }),
        (n.prototype.setMaxListeners = function (e) {
          if ("number" != typeof e || e < 0 || a(e))
            throw new RangeError(
              'The value of "n" is out of range. It must be a non-negative number. Received ' +
                e +
                "."
            );
          return (this._maxListeners = e), this;
        }),
        (n.prototype.getMaxListeners = function () {
          return d(this);
        }),
        (n.prototype.emit = function (e) {
          for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
          var s = "error" === e,
            a = this._events;
          if (void 0 !== a) s = s && void 0 === a.error;
          else if (!s) return !1;
          if (s) {
            var n;
            if ((t.length > 0 && (n = t[0]), n instanceof Error)) throw n;
            var o = new Error("Unhandled error." + (n ? " (" + n.message + ")" : ""));
            throw ((o.context = n), o);
          }
          var c = a[e];
          if (void 0 === c) return !1;
          if ("function" == typeof c) i(c, this, t);
          else {
            var d = c.length,
              p = f(c, d);
            for (r = 0; r < d; ++r) i(p[r], this, t);
          }
          return !0;
        }),
        (n.prototype.addListener = function (e, t) {
          return p(this, e, t, !1);
        }),
        (n.prototype.on = n.prototype.addListener),
        (n.prototype.prependListener = function (e, t) {
          return p(this, e, t, !0);
        }),
        (n.prototype.once = function (e, t) {
          return c(t), this.on(e, u(this, e, t)), this;
        }),
        (n.prototype.prependOnceListener = function (e, t) {
          return c(t), this.prependListener(e, u(this, e, t)), this;
        }),
        (n.prototype.removeListener = function (e, t) {
          var r, s, i, a, n;
          if ((c(t), void 0 === (s = this._events))) return this;
          if (void 0 === (r = s[e])) return this;
          if (r === t || r.listener === t)
            0 == --this._eventsCount
              ? (this._events = Object.create(null))
              : (delete s[e], s.removeListener && this.emit("removeListener", e, r.listener || t));
          else if ("function" != typeof r) {
            for (i = -1, a = r.length - 1; a >= 0; a--)
              if (r[a] === t || r[a].listener === t) {
                (n = r[a].listener), (i = a);
                break;
              }
            if (i < 0) return this;
            0 === i
              ? r.shift()
              : (function (e, t) {
                  for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                  e.pop();
                })(r, i),
              1 === r.length && (s[e] = r[0]),
              void 0 !== s.removeListener && this.emit("removeListener", e, n || t);
          }
          return this;
        }),
        (n.prototype.off = n.prototype.removeListener),
        (n.prototype.removeAllListeners = function (e) {
          var t, r, s;
          if (void 0 === (r = this._events)) return this;
          if (void 0 === r.removeListener)
            return (
              0 === arguments.length
                ? ((this._events = Object.create(null)), (this._eventsCount = 0))
                : void 0 !== r[e] &&
                  (0 == --this._eventsCount ? (this._events = Object.create(null)) : delete r[e]),
              this
            );
          if (0 === arguments.length) {
            var i,
              a = Object.keys(r);
            for (s = 0; s < a.length; ++s)
              "removeListener" !== (i = a[s]) && this.removeAllListeners(i);
            return (
              this.removeAllListeners("removeListener"),
              (this._events = Object.create(null)),
              (this._eventsCount = 0),
              this
            );
          }
          if ("function" == typeof (t = r[e])) this.removeListener(e, t);
          else if (void 0 !== t) for (s = t.length - 1; s >= 0; s--) this.removeListener(e, t[s]);
          return this;
        }),
        (n.prototype.listeners = function (e) {
          return h(this, e, !0);
        }),
        (n.prototype.rawListeners = function (e) {
          return h(this, e, !1);
        }),
        (n.listenerCount = function (e, t) {
          return "function" == typeof e.listenerCount ? e.listenerCount(t) : m.call(e, t);
        }),
        (n.prototype.listenerCount = m),
        (n.prototype.eventNames = function () {
          return this._eventsCount > 0 ? r(this._events) : [];
        });
    }),
    i.register("difix", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.InvalidStateError = e.exports.UnsupportedError = void 0);
      class r extends Error {
        constructor(e) {
          super(e),
            (this.name = "UnsupportedError"),
            Error.hasOwnProperty("captureStackTrace")
              ? Error.captureStackTrace(this, r)
              : (this.stack = new Error(e).stack);
        }
      }
      e.exports.UnsupportedError = r;
      class s extends Error {
        constructor(e) {
          super(e),
            (this.name = "InvalidStateError"),
            Error.hasOwnProperty("captureStackTrace")
              ? Error.captureStackTrace(this, s)
              : (this.stack = new Error(e).stack);
        }
      }
      e.exports.InvalidStateError = s;
    }),
    i.register("dgn3R", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.generateRandomNumber = e.exports.clone = void 0),
        (e.exports.clone = function (e, t) {
          return void 0 === e ? t : JSON.parse(JSON.stringify(e));
        }),
        (e.exports.generateRandomNumber = function () {
          return Math.round(1e7 * Math.random());
        });
    }),
    i.register("k5BaR", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.canReceive =
          e.exports.canSend =
          e.exports.generateProbatorRtpParameters =
          e.exports.reduceCodecs =
          e.exports.getSendingRemoteRtpParameters =
          e.exports.getSendingRtpParameters =
          e.exports.getRecvRtpCapabilities =
          e.exports.getExtendedRtpCapabilities =
          e.exports.validateSctpStreamParameters =
          e.exports.validateSctpParameters =
          e.exports.validateNumSctpStreams =
          e.exports.validateSctpCapabilities =
          e.exports.validateRtcpParameters =
          e.exports.validateRtpEncodingParameters =
          e.exports.validateRtpHeaderExtensionParameters =
          e.exports.validateRtpCodecParameters =
          e.exports.validateRtpParameters =
          e.exports.validateRtpHeaderExtension =
          e.exports.validateRtcpFeedback =
          e.exports.validateRtpCodecCapability =
          e.exports.validateRtpCapabilities =
            void 0);
      const n = a(i("d0NZR")),
        o = a(i("dgn3R"));
      function c(e) {
        const t = new RegExp("^(audio|video)/(.+)", "i");
        if ("object" != typeof e) throw new TypeError("codec is not an object");
        if (!e.mimeType || "string" != typeof e.mimeType)
          throw new TypeError("missing codec.mimeType");
        const r = t.exec(e.mimeType);
        if (!r) throw new TypeError("invalid codec.mimeType");
        if (
          ((e.kind = r[1].toLowerCase()),
          e.preferredPayloadType && "number" != typeof e.preferredPayloadType)
        )
          throw new TypeError("invalid codec.preferredPayloadType");
        if ("number" != typeof e.clockRate) throw new TypeError("missing codec.clockRate");
        "audio" === e.kind ? "number" != typeof e.channels && (e.channels = 1) : delete e.channels,
          (e.parameters && "object" == typeof e.parameters) || (e.parameters = {});
        for (const t of Object.keys(e.parameters)) {
          let r = e.parameters[t];
          if (
            (void 0 === r && ((e.parameters[t] = ""), (r = "")),
            "string" != typeof r && "number" != typeof r)
          )
            throw new TypeError(`invalid codec parameter [key:${t}s, value:${r}]`);
          if ("apt" === t && "number" != typeof r)
            throw new TypeError("invalid codec apt parameter");
        }
        (e.rtcpFeedback && Array.isArray(e.rtcpFeedback)) || (e.rtcpFeedback = []);
        for (const t of e.rtcpFeedback) d(t);
      }
      function d(e) {
        if ("object" != typeof e) throw new TypeError("fb is not an object");
        if (!e.type || "string" != typeof e.type) throw new TypeError("missing fb.type");
        (e.parameter && "string" == typeof e.parameter) || (e.parameter = "");
      }
      function p(e) {
        if ("object" != typeof e) throw new TypeError("ext is not an object");
        if ("audio" !== e.kind && "video" !== e.kind) throw new TypeError("invalid ext.kind");
        if (!e.uri || "string" != typeof e.uri) throw new TypeError("missing ext.uri");
        if ("number" != typeof e.preferredId) throw new TypeError("missing ext.preferredId");
        if (e.preferredEncrypt && "boolean" != typeof e.preferredEncrypt)
          throw new TypeError("invalid ext.preferredEncrypt");
        if (
          (e.preferredEncrypt || (e.preferredEncrypt = !1),
          e.direction && "string" != typeof e.direction)
        )
          throw new TypeError("invalid ext.direction");
        e.direction || (e.direction = "sendrecv");
      }
      function l(e) {
        if ("object" != typeof e) throw new TypeError("params is not an object");
        if (e.mid && "string" != typeof e.mid) throw new TypeError("params.mid is not a string");
        if (!Array.isArray(e.codecs)) throw new TypeError("missing params.codecs");
        for (const t of e.codecs) u(t);
        if (e.headerExtensions && !Array.isArray(e.headerExtensions))
          throw new TypeError("params.headerExtensions is not an array");
        e.headerExtensions || (e.headerExtensions = []);
        for (const t of e.headerExtensions) h(t);
        if (e.encodings && !Array.isArray(e.encodings))
          throw new TypeError("params.encodings is not an array");
        e.encodings || (e.encodings = []);
        for (const t of e.encodings) m(t);
        if (e.rtcp && "object" != typeof e.rtcp)
          throw new TypeError("params.rtcp is not an object");
        e.rtcp || (e.rtcp = {}), f(e.rtcp);
      }
      function u(e) {
        const t = new RegExp("^(audio|video)/(.+)", "i");
        if ("object" != typeof e) throw new TypeError("codec is not an object");
        if (!e.mimeType || "string" != typeof e.mimeType)
          throw new TypeError("missing codec.mimeType");
        const r = t.exec(e.mimeType);
        if (!r) throw new TypeError("invalid codec.mimeType");
        if ("number" != typeof e.payloadType) throw new TypeError("missing codec.payloadType");
        if ("number" != typeof e.clockRate) throw new TypeError("missing codec.clockRate");
        "audio" === r[1].toLowerCase()
          ? "number" != typeof e.channels && (e.channels = 1)
          : delete e.channels,
          (e.parameters && "object" == typeof e.parameters) || (e.parameters = {});
        for (const t of Object.keys(e.parameters)) {
          let r = e.parameters[t];
          if (
            (void 0 === r && ((e.parameters[t] = ""), (r = "")),
            "string" != typeof r && "number" != typeof r)
          )
            throw new TypeError(`invalid codec parameter [key:${t}s, value:${r}]`);
          if ("apt" === t && "number" != typeof r)
            throw new TypeError("invalid codec apt parameter");
        }
        (e.rtcpFeedback && Array.isArray(e.rtcpFeedback)) || (e.rtcpFeedback = []);
        for (const t of e.rtcpFeedback) d(t);
      }
      function h(e) {
        if ("object" != typeof e) throw new TypeError("ext is not an object");
        if (!e.uri || "string" != typeof e.uri) throw new TypeError("missing ext.uri");
        if ("number" != typeof e.id) throw new TypeError("missing ext.id");
        if (e.encrypt && "boolean" != typeof e.encrypt) throw new TypeError("invalid ext.encrypt");
        e.encrypt || (e.encrypt = !1),
          (e.parameters && "object" == typeof e.parameters) || (e.parameters = {});
        for (const t of Object.keys(e.parameters)) {
          let r = e.parameters[t];
          if (
            (void 0 === r && ((e.parameters[t] = ""), (r = "")),
            "string" != typeof r && "number" != typeof r)
          )
            throw new TypeError("invalid header extension parameter");
        }
      }
      function m(e) {
        if ("object" != typeof e) throw new TypeError("encoding is not an object");
        if (e.ssrc && "number" != typeof e.ssrc) throw new TypeError("invalid encoding.ssrc");
        if (e.rid && "string" != typeof e.rid) throw new TypeError("invalid encoding.rid");
        if (e.rtx && "object" != typeof e.rtx) throw new TypeError("invalid encoding.rtx");
        if (e.rtx && "number" != typeof e.rtx.ssrc)
          throw new TypeError("missing encoding.rtx.ssrc");
        if (
          ((e.dtx && "boolean" == typeof e.dtx) || (e.dtx = !1),
          e.scalabilityMode && "string" != typeof e.scalabilityMode)
        )
          throw new TypeError("invalid encoding.scalabilityMode");
      }
      function f(e) {
        if ("object" != typeof e) throw new TypeError("rtcp is not an object");
        if (e.cname && "string" != typeof e.cname) throw new TypeError("invalid rtcp.cname");
        (e.reducedSize && "boolean" == typeof e.reducedSize) || (e.reducedSize = !0);
      }
      function g(e) {
        if ("object" != typeof e) throw new TypeError("numStreams is not an object");
        if ("number" != typeof e.OS) throw new TypeError("missing numStreams.OS");
        if ("number" != typeof e.MIS) throw new TypeError("missing numStreams.MIS");
      }
      function _(e) {
        return !!e && /.+\/rtx$/i.test(e.mimeType);
      }
      function v(e, t, { strict: r = !1, modify: s = !1 } = {}) {
        const i = e.mimeType.toLowerCase();
        if (i !== t.mimeType.toLowerCase()) return !1;
        if (e.clockRate !== t.clockRate) return !1;
        if (e.channels !== t.channels) return !1;
        switch (i) {
          case "video/h264":
            if (
              (e.parameters["packetization-mode"] || 0) !==
              (t.parameters["packetization-mode"] || 0)
            )
              return !1;
            if (r) {
              if (!n.isSameProfile(e.parameters, t.parameters)) return !1;
              let r;
              try {
                r = n.generateProfileLevelIdForAnswer(e.parameters, t.parameters);
              } catch (e) {
                return !1;
              }
              s &&
                (r
                  ? ((e.parameters["profile-level-id"] = r), (t.parameters["profile-level-id"] = r))
                  : (delete e.parameters["profile-level-id"],
                    delete t.parameters["profile-level-id"]));
            }
            break;
          case "video/vp9":
            if (r) {
              if ((e.parameters["profile-id"] || 0) !== (t.parameters["profile-id"] || 0))
                return !1;
            }
        }
        return !0;
      }
      function b(e, t) {
        return (!e.kind || !t.kind || e.kind === t.kind) && e.uri === t.uri;
      }
      function y(e, t) {
        const r = [];
        for (const s of e.rtcpFeedback || []) {
          const e = (t.rtcpFeedback || []).find(
            (e) =>
              e.type === s.type && (e.parameter === s.parameter || (!e.parameter && !s.parameter))
          );
          e && r.push(e);
        }
        return r;
      }
      (e.exports.validateRtpCapabilities = function (e) {
        if ("object" != typeof e) throw new TypeError("caps is not an object");
        if (e.codecs && !Array.isArray(e.codecs))
          throw new TypeError("caps.codecs is not an array");
        e.codecs || (e.codecs = []);
        for (const t of e.codecs) c(t);
        if (e.headerExtensions && !Array.isArray(e.headerExtensions))
          throw new TypeError("caps.headerExtensions is not an array");
        e.headerExtensions || (e.headerExtensions = []);
        for (const t of e.headerExtensions) p(t);
      }),
        (e.exports.validateRtpCodecCapability = c),
        (e.exports.validateRtcpFeedback = d),
        (e.exports.validateRtpHeaderExtension = p),
        (e.exports.validateRtpParameters = l),
        (e.exports.validateRtpCodecParameters = u),
        (e.exports.validateRtpHeaderExtensionParameters = h),
        (e.exports.validateRtpEncodingParameters = m),
        (e.exports.validateRtcpParameters = f),
        (e.exports.validateSctpCapabilities = function (e) {
          if ("object" != typeof e) throw new TypeError("caps is not an object");
          if (!e.numStreams || "object" != typeof e.numStreams)
            throw new TypeError("missing caps.numStreams");
          g(e.numStreams);
        }),
        (e.exports.validateNumSctpStreams = g),
        (e.exports.validateSctpParameters = function (e) {
          if ("object" != typeof e) throw new TypeError("params is not an object");
          if ("number" != typeof e.port) throw new TypeError("missing params.port");
          if ("number" != typeof e.OS) throw new TypeError("missing params.OS");
          if ("number" != typeof e.MIS) throw new TypeError("missing params.MIS");
          if ("number" != typeof e.maxMessageSize)
            throw new TypeError("missing params.maxMessageSize");
        }),
        (e.exports.validateSctpStreamParameters = function (e) {
          if ("object" != typeof e) throw new TypeError("params is not an object");
          if ("number" != typeof e.streamId) throw new TypeError("missing params.streamId");
          let t = !1;
          if (
            ("boolean" == typeof e.ordered ? (t = !0) : (e.ordered = !0),
            e.maxPacketLifeTime && "number" != typeof e.maxPacketLifeTime)
          )
            throw new TypeError("invalid params.maxPacketLifeTime");
          if (e.maxRetransmits && "number" != typeof e.maxRetransmits)
            throw new TypeError("invalid params.maxRetransmits");
          if (e.maxPacketLifeTime && e.maxRetransmits)
            throw new TypeError("cannot provide both maxPacketLifeTime and maxRetransmits");
          if (t && e.ordered && (e.maxPacketLifeTime || e.maxRetransmits))
            throw new TypeError("cannot be ordered with maxPacketLifeTime or maxRetransmits");
          if (
            (t || (!e.maxPacketLifeTime && !e.maxRetransmits) || (e.ordered = !1),
            e.label && "string" != typeof e.label)
          )
            throw new TypeError("invalid params.label");
          if (e.protocol && "string" != typeof e.protocol)
            throw new TypeError("invalid params.protocol");
        }),
        (e.exports.getExtendedRtpCapabilities = function (e, t) {
          const r = { codecs: [], headerExtensions: [] };
          for (const s of t.codecs || []) {
            if (_(s)) continue;
            const t = (e.codecs || []).find((e) => v(e, s, { strict: !0, modify: !0 }));
            if (!t) continue;
            const i = {
              mimeType: t.mimeType,
              kind: t.kind,
              clockRate: t.clockRate,
              channels: t.channels,
              localPayloadType: t.preferredPayloadType,
              localRtxPayloadType: void 0,
              remotePayloadType: s.preferredPayloadType,
              remoteRtxPayloadType: void 0,
              localParameters: t.parameters,
              remoteParameters: s.parameters,
              rtcpFeedback: y(t, s),
            };
            r.codecs.push(i);
          }
          for (const s of r.codecs) {
            const r = e.codecs.find((e) => _(e) && e.parameters.apt === s.localPayloadType),
              i = t.codecs.find((e) => _(e) && e.parameters.apt === s.remotePayloadType);
            r &&
              i &&
              ((s.localRtxPayloadType = r.preferredPayloadType),
              (s.remoteRtxPayloadType = i.preferredPayloadType));
          }
          for (const s of t.headerExtensions) {
            const t = e.headerExtensions.find((e) => b(e, s));
            if (!t) continue;
            const i = {
              kind: s.kind,
              uri: s.uri,
              sendId: t.preferredId,
              recvId: s.preferredId,
              encrypt: t.preferredEncrypt,
              direction: "sendrecv",
            };
            switch (s.direction) {
              case "sendrecv":
                i.direction = "sendrecv";
                break;
              case "recvonly":
                i.direction = "sendonly";
                break;
              case "sendonly":
                i.direction = "recvonly";
                break;
              case "inactive":
                i.direction = "inactive";
            }
            r.headerExtensions.push(i);
          }
          return r;
        }),
        (e.exports.getRecvRtpCapabilities = function (e) {
          const t = { codecs: [], headerExtensions: [] };
          for (const r of e.codecs) {
            const e = {
              mimeType: r.mimeType,
              kind: r.kind,
              preferredPayloadType: r.remotePayloadType,
              clockRate: r.clockRate,
              channels: r.channels,
              parameters: r.localParameters,
              rtcpFeedback: r.rtcpFeedback,
            };
            if ((t.codecs.push(e), !r.remoteRtxPayloadType)) continue;
            const s = {
              mimeType: `${r.kind}/rtx`,
              kind: r.kind,
              preferredPayloadType: r.remoteRtxPayloadType,
              clockRate: r.clockRate,
              parameters: { apt: r.remotePayloadType },
              rtcpFeedback: [],
            };
            t.codecs.push(s);
          }
          for (const r of e.headerExtensions) {
            if ("sendrecv" !== r.direction && "recvonly" !== r.direction) continue;
            const e = {
              kind: r.kind,
              uri: r.uri,
              preferredId: r.recvId,
              preferredEncrypt: r.encrypt,
              direction: r.direction,
            };
            t.headerExtensions.push(e);
          }
          return t;
        }),
        (e.exports.getSendingRtpParameters = function (e, t) {
          const r = { mid: void 0, codecs: [], headerExtensions: [], encodings: [], rtcp: {} };
          for (const s of t.codecs) {
            if (s.kind !== e) continue;
            const t = {
              mimeType: s.mimeType,
              payloadType: s.localPayloadType,
              clockRate: s.clockRate,
              channels: s.channels,
              parameters: s.localParameters,
              rtcpFeedback: s.rtcpFeedback,
            };
            if ((r.codecs.push(t), s.localRtxPayloadType)) {
              const e = {
                mimeType: `${s.kind}/rtx`,
                payloadType: s.localRtxPayloadType,
                clockRate: s.clockRate,
                parameters: { apt: s.localPayloadType },
                rtcpFeedback: [],
              };
              r.codecs.push(e);
            }
          }
          for (const s of t.headerExtensions) {
            if (
              (s.kind && s.kind !== e) ||
              ("sendrecv" !== s.direction && "sendonly" !== s.direction)
            )
              continue;
            const t = { uri: s.uri, id: s.sendId, encrypt: s.encrypt, parameters: {} };
            r.headerExtensions.push(t);
          }
          return r;
        }),
        (e.exports.getSendingRemoteRtpParameters = function (e, t) {
          const r = { mid: void 0, codecs: [], headerExtensions: [], encodings: [], rtcp: {} };
          for (const s of t.codecs) {
            if (s.kind !== e) continue;
            const t = {
              mimeType: s.mimeType,
              payloadType: s.localPayloadType,
              clockRate: s.clockRate,
              channels: s.channels,
              parameters: s.remoteParameters,
              rtcpFeedback: s.rtcpFeedback,
            };
            if ((r.codecs.push(t), s.localRtxPayloadType)) {
              const e = {
                mimeType: `${s.kind}/rtx`,
                payloadType: s.localRtxPayloadType,
                clockRate: s.clockRate,
                parameters: { apt: s.localPayloadType },
                rtcpFeedback: [],
              };
              r.codecs.push(e);
            }
          }
          for (const s of t.headerExtensions) {
            if (
              (s.kind && s.kind !== e) ||
              ("sendrecv" !== s.direction && "sendonly" !== s.direction)
            )
              continue;
            const t = { uri: s.uri, id: s.sendId, encrypt: s.encrypt, parameters: {} };
            r.headerExtensions.push(t);
          }
          if (
            r.headerExtensions.some(
              (e) =>
                "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01" ===
                e.uri
            )
          )
            for (const e of r.codecs)
              e.rtcpFeedback = (e.rtcpFeedback || []).filter((e) => "goog-remb" !== e.type);
          else if (
            r.headerExtensions.some(
              (e) => "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time" === e.uri
            )
          )
            for (const e of r.codecs)
              e.rtcpFeedback = (e.rtcpFeedback || []).filter((e) => "transport-cc" !== e.type);
          else
            for (const e of r.codecs)
              e.rtcpFeedback = (e.rtcpFeedback || []).filter(
                (e) => "transport-cc" !== e.type && "goog-remb" !== e.type
              );
          return r;
        }),
        (e.exports.reduceCodecs = function (e, t) {
          const r = [];
          if (t) {
            for (let s = 0; s < e.length; ++s)
              if (v(e[s], t)) {
                r.push(e[s]), _(e[s + 1]) && r.push(e[s + 1]);
                break;
              }
            if (0 === r.length) throw new TypeError("no matching codec found");
          } else r.push(e[0]), _(e[1]) && r.push(e[1]);
          return r;
        }),
        (e.exports.generateProbatorRtpParameters = function (e) {
          l((e = o.clone(e, {})));
          const t = {
            mid: "probator",
            codecs: [],
            headerExtensions: [],
            encodings: [{ ssrc: 1234 }],
            rtcp: { cname: "probator" },
          };
          return (
            t.codecs.push(e.codecs[0]),
            (t.codecs[0].payloadType = 127),
            (t.headerExtensions = e.headerExtensions),
            t
          );
        }),
        (e.exports.canSend = function (e, t) {
          return t.codecs.some((t) => t.kind === e);
        }),
        (e.exports.canReceive = function (e, t) {
          if ((l(e), 0 === e.codecs.length)) return !1;
          const r = e.codecs[0];
          return t.codecs.some((e) => e.remotePayloadType === r.payloadType);
        });
    }),
    i.register("d0NZR", function (t, r) {
      var s, a, n, o, c, d, p, l, u, h, m, f, g, _, v, b, y, w, S, R, P, x, T, C, k, D, M, O;
      e(
        t.exports,
        "ProfileConstrainedBaseline",
        function () {
          return s;
        },
        function (e) {
          return (s = e);
        }
      ),
        e(
          t.exports,
          "ProfileBaseline",
          function () {
            return a;
          },
          function (e) {
            return (a = e);
          }
        ),
        e(
          t.exports,
          "ProfileMain",
          function () {
            return n;
          },
          function (e) {
            return (n = e);
          }
        ),
        e(
          t.exports,
          "ProfileConstrainedHigh",
          function () {
            return o;
          },
          function (e) {
            return (o = e);
          }
        ),
        e(
          t.exports,
          "ProfileHigh",
          function () {
            return c;
          },
          function (e) {
            return (c = e);
          }
        ),
        e(
          t.exports,
          "Level1_b",
          function () {
            return d;
          },
          function (e) {
            return (d = e);
          }
        ),
        e(
          t.exports,
          "Level1",
          function () {
            return p;
          },
          function (e) {
            return (p = e);
          }
        ),
        e(
          t.exports,
          "Level1_1",
          function () {
            return l;
          },
          function (e) {
            return (l = e);
          }
        ),
        e(
          t.exports,
          "Level1_2",
          function () {
            return u;
          },
          function (e) {
            return (u = e);
          }
        ),
        e(
          t.exports,
          "Level1_3",
          function () {
            return h;
          },
          function (e) {
            return (h = e);
          }
        ),
        e(
          t.exports,
          "Level2",
          function () {
            return m;
          },
          function (e) {
            return (m = e);
          }
        ),
        e(
          t.exports,
          "Level2_1",
          function () {
            return f;
          },
          function (e) {
            return (f = e);
          }
        ),
        e(
          t.exports,
          "Level2_2",
          function () {
            return g;
          },
          function (e) {
            return (g = e);
          }
        ),
        e(
          t.exports,
          "Level3",
          function () {
            return _;
          },
          function (e) {
            return (_ = e);
          }
        ),
        e(
          t.exports,
          "Level3_1",
          function () {
            return v;
          },
          function (e) {
            return (v = e);
          }
        ),
        e(
          t.exports,
          "Level3_2",
          function () {
            return b;
          },
          function (e) {
            return (b = e);
          }
        ),
        e(
          t.exports,
          "Level4",
          function () {
            return y;
          },
          function (e) {
            return (y = e);
          }
        ),
        e(
          t.exports,
          "Level4_1",
          function () {
            return w;
          },
          function (e) {
            return (w = e);
          }
        ),
        e(
          t.exports,
          "Level4_2",
          function () {
            return S;
          },
          function (e) {
            return (S = e);
          }
        ),
        e(
          t.exports,
          "Level5",
          function () {
            return R;
          },
          function (e) {
            return (R = e);
          }
        ),
        e(
          t.exports,
          "Level5_1",
          function () {
            return P;
          },
          function (e) {
            return (P = e);
          }
        ),
        e(
          t.exports,
          "Level5_2",
          function () {
            return x;
          },
          function (e) {
            return (x = e);
          }
        ),
        e(
          t.exports,
          "ProfileLevelId",
          function () {
            return T;
          },
          function (e) {
            return (T = e);
          }
        ),
        e(
          t.exports,
          "parseProfileLevelId",
          function () {
            return C;
          },
          function (e) {
            return (C = e);
          }
        ),
        e(
          t.exports,
          "profileLevelIdToString",
          function () {
            return k;
          },
          function (e) {
            return (k = e);
          }
        ),
        e(
          t.exports,
          "parseSdpProfileLevelId",
          function () {
            return D;
          },
          function (e) {
            return (D = e);
          }
        ),
        e(
          t.exports,
          "isSameProfile",
          function () {
            return M;
          },
          function (e) {
            return (M = e);
          }
        ),
        e(
          t.exports,
          "generateProfileLevelIdForAnswer",
          function () {
            return O;
          },
          function (e) {
            return (O = e);
          }
        );
      const E = i("j5U6Y")("h264-profile-level-id");
      E.log = console.info.bind(console);
      (s = 1), (a = 2), (n = 3), (o = 4), (c = 5);
      const I = 10;
      (d = 0),
        (p = 10),
        (l = 11),
        (u = 12),
        (h = 13),
        (m = 20),
        (f = 21),
        (g = 22),
        (_ = 30),
        (v = 31),
        (b = 32),
        (y = 40),
        (w = 41),
        (S = 42),
        (R = 50),
        (P = 51),
        (x = 52);
      class j {
        constructor(e, t) {
          (this.profile = e), (this.level = t);
        }
      }
      T = j;
      const L = new j(1, 31);
      class F {
        isMatch(e) {
          return this._maskedValue === (e & this._mask);
        }
        constructor(e) {
          (this._mask = ~N("x", e)), (this._maskedValue = N("1", e));
        }
      }
      class A {
        constructor(e, t, r) {
          (this.profile_idc = e), (this.profile_iop = t), (this.profile = r);
        }
      }
      const B = [
        new A(66, new F("x1xx0000"), 1),
        new A(77, new F("1xxx0000"), 1),
        new A(88, new F("11xx0000"), 1),
        new A(66, new F("x0xx0000"), 2),
        new A(88, new F("10xx0000"), 2),
        new A(77, new F("0x0x0000"), 3),
        new A(100, new F("00000000"), 5),
        new A(100, new F("00001100"), 4),
      ];
      function N(e, t) {
        return (
          ((t[0] === e) << 7) |
          ((t[1] === e) << 6) |
          ((t[2] === e) << 5) |
          ((t[3] === e) << 4) |
          ((t[4] === e) << 3) |
          ((t[5] === e) << 2) |
          ((t[6] === e) << 1) |
          ((t[7] === e) << 0)
        );
      }
      function z(e = {}) {
        const t = e["level-asymmetry-allowed"];
        return 1 === t || "1" === t;
      }
      (C = function (e) {
        if ("string" != typeof e || 6 !== e.length) return null;
        const t = parseInt(e, 16);
        if (0 === t) return null;
        const r = 255 & t,
          s = (t >> 8) & 255,
          i = (t >> 16) & 255;
        let a;
        switch (r) {
          case 11:
            a = 0 != (16 & s) ? 0 : 11;
            break;
          case 10:
          case 12:
          case 13:
          case 20:
          case 21:
          case 22:
          case 30:
          case 31:
          case 32:
          case 40:
          case 41:
          case 42:
          case 50:
          case 51:
          case 52:
            a = r;
            break;
          default:
            return E("parseProfileLevelId() | unrecognized level_idc:%s", r), null;
        }
        for (const e of B)
          if (i === e.profile_idc && e.profile_iop.isMatch(s)) return new j(e.profile, a);
        return E("parseProfileLevelId() | unrecognized profile_idc/profile_iop combination"), null;
      }),
        (k = function (e) {
          if (0 == e.level)
            switch (e.profile) {
              case 1:
                return "42f00b";
              case 2:
                return "42100b";
              case 3:
                return "4d100b";
              default:
                return (
                  E(
                    "profileLevelIdToString() | Level 1_b not is allowed for profile:%s",
                    e.profile
                  ),
                  null
                );
            }
          let t;
          switch (e.profile) {
            case 1:
              t = "42e0";
              break;
            case 2:
              t = "4200";
              break;
            case 3:
              t = "4d00";
              break;
            case 4:
              t = "640c";
              break;
            case 5:
              t = "6400";
              break;
            default:
              return E("profileLevelIdToString() | unrecognized profile:%s", e.profile), null;
          }
          let r = e.level.toString(16);
          return 1 === r.length && (r = `0${r}`), `${t}${r}`;
        }),
        (D = function (e = {}) {
          const t = e["profile-level-id"];
          return t ? C(t) : L;
        }),
        (M = function (e = {}, t = {}) {
          const r = D(e),
            s = D(t);
          return Boolean(r && s && r.profile === s.profile);
        }),
        (O = function (e = {}, t = {}) {
          if (!e["profile-level-id"] && !t["profile-level-id"])
            return (
              E(
                "generateProfileLevelIdForAnswer() | no profile-level-id in local and remote params"
              ),
              null
            );
          const r = D(e),
            s = D(t);
          if (!r) throw new TypeError("invalid local_profile_level_id");
          if (!s) throw new TypeError("invalid remote_profile_level_id");
          if (r.profile !== s.profile) throw new TypeError("H264 Profile mismatch");
          const i = z(e) && z(t),
            a = r.level,
            n = s.level,
            o = (function (e, t) {
              return 0 === e ? t !== I && 0 !== t : 0 === t ? e !== I : e < t;
            })((c = a), (d = n))
              ? c
              : d;
          var c, d;
          const p = i ? a : o;
          return (
            E("generateProfileLevelIdForAnswer() | result: [profile:%s, level:%s]", r.profile, p),
            k(new j(r.profile, p))
          );
        });
    }),
    i.register("cdWGp", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Transport = void 0);
      var n = i("zBJU5"),
        o = i("6pHSb"),
        c = i("6DeKT"),
        d = i("difix");
      const p = a(i("dgn3R")),
        l = a(i("k5BaR"));
      var u = i("kXaIC"),
        h = i("h2RSZ"),
        m = i("e41iV"),
        f = i("eYbsu");
      const g = new o.Logger("Transport");
      class _ extends c.EnhancedEventEmitter {
        get id() {
          return this._id;
        }
        get closed() {
          return this._closed;
        }
        get direction() {
          return this._direction;
        }
        get handler() {
          return this._handler;
        }
        get connectionState() {
          return this._connectionState;
        }
        get appData() {
          return this._appData;
        }
        set appData(e) {
          throw new Error("cannot override appData object");
        }
        get observer() {
          return this._observer;
        }
        close() {
          if (!this._closed) {
            g.debug("close()"),
              (this._closed = !0),
              this._awaitQueue.close(),
              this._handler.close();
            for (const e of this._producers.values()) e.transportClosed();
            this._producers.clear();
            for (const e of this._consumers.values()) e.transportClosed();
            this._consumers.clear();
            for (const e of this._dataProducers.values()) e.transportClosed();
            this._dataProducers.clear();
            for (const e of this._dataConsumers.values()) e.transportClosed();
            this._dataConsumers.clear(), this._observer.safeEmit("close");
          }
        }
        async getStats() {
          if (this._closed) throw new d.InvalidStateError("closed");
          return this._handler.getTransportStats();
        }
        async restartIce({ iceParameters: e }) {
          if ((g.debug("restartIce()"), this._closed)) throw new d.InvalidStateError("closed");
          if (!e) throw new TypeError("missing iceParameters");
          return this._awaitQueue.push(
            async () => this._handler.restartIce(e),
            "transport.restartIce()"
          );
        }
        async updateIceServers({ iceServers: e } = {}) {
          if ((g.debug("updateIceServers()"), this._closed))
            throw new d.InvalidStateError("closed");
          if (!Array.isArray(e)) throw new TypeError("missing iceServers");
          return this._awaitQueue.push(
            async () => this._handler.updateIceServers(e),
            "transport.updateIceServers()"
          );
        }
        async produce({
          track: e,
          encodings: t,
          codecOptions: r,
          codec: s,
          stopTracks: i = !0,
          disableTrackOnPause: a = !0,
          zeroRtpOnPause: n = !1,
          appData: o = {},
        } = {}) {
          if ((g.debug("produce() [track:%o]", e), !e)) throw new TypeError("missing track");
          if ("send" !== this._direction) throw new d.UnsupportedError("not a sending Transport");
          if (!this._canProduceByKind[e.kind])
            throw new d.UnsupportedError(`cannot produce ${e.kind}`);
          if ("ended" === e.readyState) throw new d.InvalidStateError("track ended");
          if (0 === this.listenerCount("connect") && "new" === this._connectionState)
            throw new TypeError('no "connect" listener set into this transport');
          if (0 === this.listenerCount("produce"))
            throw new TypeError('no "produce" listener set into this transport');
          if (o && "object" != typeof o) throw new TypeError("if given, appData must be an object");
          return this._awaitQueue
            .push(async () => {
              let c;
              if (t && !Array.isArray(t)) throw TypeError("encodings must be an array");
              t && 0 === t.length
                ? (c = void 0)
                : t &&
                  (c = t.map((e) => {
                    const t = { active: !0 };
                    return (
                      !1 === e.active && (t.active = !1),
                      "boolean" == typeof e.dtx && (t.dtx = e.dtx),
                      "string" == typeof e.scalabilityMode &&
                        (t.scalabilityMode = e.scalabilityMode),
                      "number" == typeof e.scaleResolutionDownBy &&
                        (t.scaleResolutionDownBy = e.scaleResolutionDownBy),
                      "number" == typeof e.maxBitrate && (t.maxBitrate = e.maxBitrate),
                      "number" == typeof e.maxFramerate && (t.maxFramerate = e.maxFramerate),
                      "boolean" == typeof e.adaptivePtime && (t.adaptivePtime = e.adaptivePtime),
                      "string" == typeof e.priority && (t.priority = e.priority),
                      "string" == typeof e.networkPriority &&
                        (t.networkPriority = e.networkPriority),
                      t
                    );
                  }));
              const {
                localId: d,
                rtpParameters: p,
                rtpSender: h,
              } = await this._handler.send({ track: e, encodings: c, codecOptions: r, codec: s });
              try {
                l.validateRtpParameters(p);
                const { id: t } = await this.safeEmitAsPromise("produce", {
                    kind: e.kind,
                    rtpParameters: p,
                    appData: o,
                  }),
                  r = new u.Producer({
                    id: t,
                    localId: d,
                    rtpSender: h,
                    track: e,
                    rtpParameters: p,
                    stopTracks: i,
                    disableTrackOnPause: a,
                    zeroRtpOnPause: n,
                    appData: o,
                  });
                return (
                  this._producers.set(r.id, r),
                  this._handleProducer(r),
                  this._observer.safeEmit("newproducer", r),
                  r
                );
              } catch (e) {
                throw (this._handler.stopSending(d).catch(() => {}), e);
              }
            }, "transport.produce()")
            .catch((t) => {
              if (i)
                try {
                  e.stop();
                } catch (e) {}
              throw t;
            });
        }
        async consume({ id: e, producerId: t, kind: r, rtpParameters: s, appData: i = {} }) {
          if ((g.debug("consume()"), (s = p.clone(s, void 0)), this._closed))
            throw new d.InvalidStateError("closed");
          if ("recv" !== this._direction) throw new d.UnsupportedError("not a receiving Transport");
          if ("string" != typeof e) throw new TypeError("missing id");
          if ("string" != typeof t) throw new TypeError("missing producerId");
          if ("audio" !== r && "video" !== r) throw new TypeError(`invalid kind '${r}'`);
          if (0 === this.listenerCount("connect") && "new" === this._connectionState)
            throw new TypeError('no "connect" listener set into this transport');
          if (i && "object" != typeof i) throw new TypeError("if given, appData must be an object");
          return this._awaitQueue.push(async () => {
            if (!l.canReceive(s, this._extendedRtpCapabilities))
              throw new d.UnsupportedError("cannot consume this Producer");
            const {
                localId: a,
                rtpReceiver: n,
                track: o,
              } = await this._handler.receive({ trackId: e, kind: r, rtpParameters: s }),
              c = new h.Consumer({
                id: e,
                localId: a,
                producerId: t,
                rtpReceiver: n,
                track: o,
                rtpParameters: s,
                appData: i,
              });
            if (
              (this._consumers.set(c.id, c),
              this._handleConsumer(c),
              !this._probatorConsumerCreated && "video" === r)
            )
              try {
                const e = l.generateProbatorRtpParameters(c.rtpParameters);
                await this._handler.receive({
                  trackId: "probator",
                  kind: "video",
                  rtpParameters: e,
                }),
                  g.debug("consume() | Consumer for RTP probation created"),
                  (this._probatorConsumerCreated = !0);
              } catch (e) {
                g.error("consume() | failed to create Consumer for RTP probation:%o", e);
              }
            return this._observer.safeEmit("newconsumer", c), c;
          }, "transport.consume()");
        }
        async produceData({
          ordered: e = !0,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s = "",
          protocol: i = "",
          appData: a = {},
        } = {}) {
          if ((g.debug("produceData()"), "send" !== this._direction))
            throw new d.UnsupportedError("not a sending Transport");
          if (!this._maxSctpMessageSize)
            throw new d.UnsupportedError("SCTP not enabled by remote Transport");
          if (0 === this.listenerCount("connect") && "new" === this._connectionState)
            throw new TypeError('no "connect" listener set into this transport');
          if (0 === this.listenerCount("producedata"))
            throw new TypeError('no "producedata" listener set into this transport');
          if (a && "object" != typeof a) throw new TypeError("if given, appData must be an object");
          return (
            (t || r) && (e = !1),
            this._awaitQueue.push(async () => {
              const { dataChannel: n, sctpStreamParameters: o } =
                await this._handler.sendDataChannel({
                  ordered: e,
                  maxPacketLifeTime: t,
                  maxRetransmits: r,
                  label: s,
                  protocol: i,
                });
              l.validateSctpStreamParameters(o);
              const { id: c } = await this.safeEmitAsPromise("producedata", {
                  sctpStreamParameters: o,
                  label: s,
                  protocol: i,
                  appData: a,
                }),
                d = new m.DataProducer({
                  id: c,
                  dataChannel: n,
                  sctpStreamParameters: o,
                  appData: a,
                });
              return (
                this._dataProducers.set(d.id, d),
                this._handleDataProducer(d),
                this._observer.safeEmit("newdataproducer", d),
                d
              );
            }, "transport.produceData()")
          );
        }
        async consumeData({
          id: e,
          dataProducerId: t,
          sctpStreamParameters: r,
          label: s = "",
          protocol: i = "",
          appData: a = {},
        }) {
          if ((g.debug("consumeData()"), (r = p.clone(r, void 0)), this._closed))
            throw new d.InvalidStateError("closed");
          if ("recv" !== this._direction) throw new d.UnsupportedError("not a receiving Transport");
          if (!this._maxSctpMessageSize)
            throw new d.UnsupportedError("SCTP not enabled by remote Transport");
          if ("string" != typeof e) throw new TypeError("missing id");
          if ("string" != typeof t) throw new TypeError("missing dataProducerId");
          if (0 === this.listenerCount("connect") && "new" === this._connectionState)
            throw new TypeError('no "connect" listener set into this transport');
          if (a && "object" != typeof a) throw new TypeError("if given, appData must be an object");
          return (
            l.validateSctpStreamParameters(r),
            this._awaitQueue.push(async () => {
              const { dataChannel: n } = await this._handler.receiveDataChannel({
                  sctpStreamParameters: r,
                  label: s,
                  protocol: i,
                }),
                o = new f.DataConsumer({
                  id: e,
                  dataProducerId: t,
                  dataChannel: n,
                  sctpStreamParameters: r,
                  appData: a,
                });
              return (
                this._dataConsumers.set(o.id, o),
                this._handleDataConsumer(o),
                this._observer.safeEmit("newdataconsumer", o),
                o
              );
            }, "transport.consumeData()")
          );
        }
        _handleHandler() {
          const e = this._handler;
          e.on("@connect", ({ dtlsParameters: e }, t, r) => {
            this._closed
              ? r(new d.InvalidStateError("closed"))
              : this.safeEmit("connect", { dtlsParameters: e }, t, r);
          }),
            e.on("@connectionstatechange", (e) => {
              e !== this._connectionState &&
                (g.debug("connection state changed to %s", e),
                (this._connectionState = e),
                this._closed || this.safeEmit("connectionstatechange", e));
            });
        }
        _handleProducer(e) {
          e.on("@close", () => {
            this._producers.delete(e.id),
              this._closed ||
                this._awaitQueue
                  .push(async () => this._handler.stopSending(e.localId), "producer @close event")
                  .catch((e) => g.warn("producer.close() failed:%o", e));
          }),
            e.on("@replacetrack", (t, r, s) => {
              this._awaitQueue
                .push(
                  async () => this._handler.replaceTrack(e.localId, t),
                  "producer @replacetrack event"
                )
                .then(r)
                .catch(s);
            }),
            e.on("@setmaxspatiallayer", (t, r, s) => {
              this._awaitQueue
                .push(
                  async () => this._handler.setMaxSpatialLayer(e.localId, t),
                  "producer @setmaxspatiallayer event"
                )
                .then(r)
                .catch(s);
            }),
            e.on("@setrtpencodingparameters", (t, r, s) => {
              this._awaitQueue
                .push(
                  async () => this._handler.setRtpEncodingParameters(e.localId, t),
                  "producer @setrtpencodingparameters event"
                )
                .then(r)
                .catch(s);
            }),
            e.on("@getstats", (t, r) => {
              if (this._closed) return r(new d.InvalidStateError("closed"));
              this._handler.getSenderStats(e.localId).then(t).catch(r);
            });
        }
        _handleConsumer(e) {
          e.on("@close", () => {
            this._consumers.delete(e.id),
              this._closed ||
                this._awaitQueue
                  .push(async () => this._handler.stopReceiving(e.localId), "consumer @close event")
                  .catch(() => {});
          }),
            e.on("@pause", () => {
              this._awaitQueue
                .push(async () => this._handler.pauseReceiving(e.localId), "consumer @pause event")
                .catch(() => {});
            }),
            e.on("@resume", () => {
              this._awaitQueue
                .push(
                  async () => this._handler.resumeReceiving(e.localId),
                  "consumer @resume event"
                )
                .catch(() => {});
            }),
            e.on("@getstats", (t, r) => {
              if (this._closed) return r(new d.InvalidStateError("closed"));
              this._handler.getReceiverStats(e.localId).then(t).catch(r);
            });
        }
        _handleDataProducer(e) {
          e.on("@close", () => {
            this._dataProducers.delete(e.id);
          });
        }
        _handleDataConsumer(e) {
          e.on("@close", () => {
            this._dataConsumers.delete(e.id);
          });
        }
        constructor({
          direction: e,
          id: t,
          iceParameters: r,
          iceCandidates: s,
          dtlsParameters: i,
          sctpParameters: a,
          iceServers: o,
          iceTransportPolicy: l,
          additionalSettings: u,
          proprietaryConstraints: h,
          appData: m,
          handlerFactory: f,
          extendedRtpCapabilities: _,
          canProduceByKind: v,
        }) {
          super(),
            (this._closed = !1),
            (this._connectionState = "new"),
            (this._producers = new Map()),
            (this._consumers = new Map()),
            (this._dataProducers = new Map()),
            (this._dataConsumers = new Map()),
            (this._probatorConsumerCreated = !1),
            (this._awaitQueue = new n.AwaitQueue({ ClosedErrorClass: d.InvalidStateError })),
            (this._observer = new c.EnhancedEventEmitter()),
            g.debug("constructor() [id:%s, direction:%s]", t, e),
            (this._id = t),
            (this._direction = e),
            (this._extendedRtpCapabilities = _),
            (this._canProduceByKind = v),
            (this._maxSctpMessageSize = a ? a.maxMessageSize : null),
            delete (u = p.clone(u, {})).iceServers,
            delete u.iceTransportPolicy,
            delete u.bundlePolicy,
            delete u.rtcpMuxPolicy,
            delete u.sdpSemantics,
            (this._handler = f()),
            this._handler.run({
              direction: e,
              iceParameters: r,
              iceCandidates: s,
              dtlsParameters: i,
              sctpParameters: a,
              iceServers: o,
              iceTransportPolicy: l,
              additionalSettings: u,
              proprietaryConstraints: h,
              extendedRtpCapabilities: _,
            }),
            (this._appData = m),
            this._handleHandler();
        }
      }
      e.exports.Transport = _;
    }),
    i.register("zBJU5", function (e, t) {
      "use strict";
      var r =
        (e.exports && e.exports.__awaiter) ||
        function (e, t, r, s) {
          return new (r || (r = Promise))(function (i, a) {
            function n(e) {
              try {
                c(s.next(e));
              } catch (e) {
                a(e);
              }
            }
            function o(e) {
              try {
                c(s.throw(e));
              } catch (e) {
                a(e);
              }
            }
            function c(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof r
                    ? t
                    : new r(function (e) {
                        e(t);
                      })).then(n, o);
            }
            c((s = s.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(e.exports, "__esModule", { value: !0 });
      e.exports.AwaitQueue = class {
        get size() {
          return this.pendingTasks.length;
        }
        close() {
          if (!this.closed) {
            this.closed = !0;
            for (const e of this.pendingTasks)
              (e.stopped = !0), e.reject(new this.ClosedErrorClass("AwaitQueue closed"));
            this.pendingTasks.length = 0;
          }
        }
        push(e, t) {
          return r(this, void 0, void 0, function* () {
            if (this.closed) throw new this.ClosedErrorClass("AwaitQueue closed");
            if ("function" != typeof e) throw new TypeError("given task is not a function");
            if (!e.name && t)
              try {
                Object.defineProperty(e, "name", { value: t });
              } catch (e) {}
            return new Promise((r, s) => {
              const i = {
                task: e,
                name: t,
                resolve: r,
                reject: s,
                stopped: !1,
                enqueuedAt: new Date(),
                executedAt: void 0,
              };
              this.pendingTasks.push(i), 1 === this.pendingTasks.length && this.next();
            });
          });
        }
        stop() {
          if (!this.closed) {
            for (const e of this.pendingTasks)
              (e.stopped = !0), e.reject(new this.StoppedErrorClass("AwaitQueue stopped"));
            this.pendingTasks.length = 0;
          }
        }
        dump() {
          const e = new Date();
          return this.pendingTasks.map((t) => ({
            task: t.task,
            name: t.name,
            enqueuedTime: t.executedAt
              ? t.executedAt.getTime() - t.enqueuedAt.getTime()
              : e.getTime() - t.enqueuedAt.getTime(),
            executingTime: t.executedAt ? e.getTime() - t.executedAt.getTime() : 0,
          }));
        }
        next() {
          return r(this, void 0, void 0, function* () {
            const e = this.pendingTasks[0];
            e && (yield this.executeTask(e), this.pendingTasks.shift(), this.next());
          });
        }
        executeTask(e) {
          return r(this, void 0, void 0, function* () {
            if (!e.stopped) {
              e.executedAt = new Date();
              try {
                const t = yield e.task();
                if (e.stopped) return;
                e.resolve(t);
              } catch (t) {
                if (e.stopped) return;
                e.reject(t);
              }
            }
          });
        }
        constructor(
          { ClosedErrorClass: e = Error, StoppedErrorClass: t = Error } = {
            ClosedErrorClass: Error,
            StoppedErrorClass: Error,
          }
        ) {
          (this.closed = !1),
            (this.pendingTasks = []),
            (this.ClosedErrorClass = Error),
            (this.StoppedErrorClass = Error),
            (this.ClosedErrorClass = e),
            (this.StoppedErrorClass = t);
        }
      };
    }),
    i.register("kXaIC", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Producer = void 0);
      var r = i("6pHSb"),
        s = i("6DeKT"),
        a = i("difix");
      const n = new r.Logger("Producer");
      class o extends s.EnhancedEventEmitter {
        get id() {
          return this._id;
        }
        get localId() {
          return this._localId;
        }
        get closed() {
          return this._closed;
        }
        get kind() {
          return this._kind;
        }
        get rtpSender() {
          return this._rtpSender;
        }
        get track() {
          return this._track;
        }
        get rtpParameters() {
          return this._rtpParameters;
        }
        get paused() {
          return this._paused;
        }
        get maxSpatialLayer() {
          return this._maxSpatialLayer;
        }
        get appData() {
          return this._appData;
        }
        set appData(e) {
          throw new Error("cannot override appData object");
        }
        get observer() {
          return this._observer;
        }
        close() {
          this._closed ||
            (n.debug("close()"),
            (this._closed = !0),
            this._destroyTrack(),
            this.emit("@close"),
            this._observer.safeEmit("close"));
        }
        transportClosed() {
          this._closed ||
            (n.debug("transportClosed()"),
            (this._closed = !0),
            this._destroyTrack(),
            this.safeEmit("transportclose"),
            this._observer.safeEmit("close"));
        }
        async getStats() {
          if (this._closed) throw new a.InvalidStateError("closed");
          return this.safeEmitAsPromise("@getstats");
        }
        pause() {
          n.debug("pause()"),
            this._closed
              ? n.error("pause() | Producer closed")
              : ((this._paused = !0),
                this._track && this._disableTrackOnPause && (this._track.enabled = !1),
                this._zeroRtpOnPause &&
                  this.safeEmitAsPromise("@replacetrack", null).catch(() => {}),
                this._observer.safeEmit("pause"));
        }
        resume() {
          n.debug("resume()"),
            this._closed
              ? n.error("resume() | Producer closed")
              : ((this._paused = !1),
                this._track && this._disableTrackOnPause && (this._track.enabled = !0),
                this._zeroRtpOnPause &&
                  this.safeEmitAsPromise("@replacetrack", this._track).catch(() => {}),
                this._observer.safeEmit("resume"));
        }
        async replaceTrack({ track: e }) {
          if ((n.debug("replaceTrack() [track:%o]", e), this._closed)) {
            if (e && this._stopTracks)
              try {
                e.stop();
              } catch (e) {}
            throw new a.InvalidStateError("closed");
          }
          if (e && "ended" === e.readyState) throw new a.InvalidStateError("track ended");
          e !== this._track
            ? ((this._zeroRtpOnPause && this._paused) ||
                (await this.safeEmitAsPromise("@replacetrack", e)),
              this._destroyTrack(),
              (this._track = e),
              this._track &&
                this._disableTrackOnPause &&
                (this._paused
                  ? this._paused && (this._track.enabled = !1)
                  : (this._track.enabled = !0)),
              this._handleTrack())
            : n.debug("replaceTrack() | same track, ignored");
        }
        async setMaxSpatialLayer(e) {
          if (this._closed) throw new a.InvalidStateError("closed");
          if ("video" !== this._kind) throw new a.UnsupportedError("not a video Producer");
          if ("number" != typeof e) throw new TypeError("invalid spatialLayer");
          e !== this._maxSpatialLayer &&
            (await this.safeEmitAsPromise("@setmaxspatiallayer", e), (this._maxSpatialLayer = e));
        }
        async setRtpEncodingParameters(e) {
          if (this._closed) throw new a.InvalidStateError("closed");
          if ("object" != typeof e) throw new TypeError("invalid params");
          await this.safeEmitAsPromise("@setrtpencodingparameters", e);
        }
        _onTrackEnded() {
          n.debug('track "ended" event'),
            this.safeEmit("trackended"),
            this._observer.safeEmit("trackended");
        }
        _handleTrack() {
          this._track && this._track.addEventListener("ended", this._onTrackEnded);
        }
        _destroyTrack() {
          if (this._track)
            try {
              this._track.removeEventListener("ended", this._onTrackEnded),
                this._stopTracks && this._track.stop();
            } catch (e) {}
        }
        constructor({
          id: e,
          localId: t,
          rtpSender: r,
          track: i,
          rtpParameters: a,
          stopTracks: o,
          disableTrackOnPause: c,
          zeroRtpOnPause: d,
          appData: p,
        }) {
          super(),
            (this._closed = !1),
            (this._observer = new s.EnhancedEventEmitter()),
            n.debug("constructor()"),
            (this._id = e),
            (this._localId = t),
            (this._rtpSender = r),
            (this._track = i),
            (this._kind = i.kind),
            (this._rtpParameters = a),
            (this._paused = !!c && !i.enabled),
            (this._maxSpatialLayer = void 0),
            (this._stopTracks = o),
            (this._disableTrackOnPause = c),
            (this._zeroRtpOnPause = d),
            (this._appData = p),
            (this._onTrackEnded = this._onTrackEnded.bind(this)),
            this._handleTrack();
        }
      }
      e.exports.Producer = o;
    }),
    i.register("h2RSZ", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Consumer = void 0);
      var r = i("6pHSb"),
        s = i("6DeKT"),
        a = i("difix");
      const n = new r.Logger("Consumer");
      class o extends s.EnhancedEventEmitter {
        get id() {
          return this._id;
        }
        get localId() {
          return this._localId;
        }
        get producerId() {
          return this._producerId;
        }
        get closed() {
          return this._closed;
        }
        get kind() {
          return this._track.kind;
        }
        get rtpReceiver() {
          return this._rtpReceiver;
        }
        get track() {
          return this._track;
        }
        get rtpParameters() {
          return this._rtpParameters;
        }
        get paused() {
          return this._paused;
        }
        get appData() {
          return this._appData;
        }
        set appData(e) {
          throw new Error("cannot override appData object");
        }
        get observer() {
          return this._observer;
        }
        close() {
          this._closed ||
            (n.debug("close()"),
            (this._closed = !0),
            this._destroyTrack(),
            this.emit("@close"),
            this._observer.safeEmit("close"));
        }
        transportClosed() {
          this._closed ||
            (n.debug("transportClosed()"),
            (this._closed = !0),
            this._destroyTrack(),
            this.safeEmit("transportclose"),
            this._observer.safeEmit("close"));
        }
        async getStats() {
          if (this._closed) throw new a.InvalidStateError("closed");
          return this.safeEmitAsPromise("@getstats");
        }
        pause() {
          n.debug("pause()"),
            this._closed
              ? n.error("pause() | Consumer closed")
              : ((this._paused = !0),
                (this._track.enabled = !1),
                this.emit("@pause"),
                this._observer.safeEmit("pause"));
        }
        resume() {
          n.debug("resume()"),
            this._closed
              ? n.error("resume() | Consumer closed")
              : ((this._paused = !1),
                (this._track.enabled = !0),
                this.emit("@resume"),
                this._observer.safeEmit("resume"));
        }
        _onTrackEnded() {
          n.debug('track "ended" event'),
            this.safeEmit("trackended"),
            this._observer.safeEmit("trackended");
        }
        _handleTrack() {
          this._track.addEventListener("ended", this._onTrackEnded);
        }
        _destroyTrack() {
          try {
            this._track.removeEventListener("ended", this._onTrackEnded), this._track.stop();
          } catch (e) {}
        }
        constructor({
          id: e,
          localId: t,
          producerId: r,
          rtpReceiver: i,
          track: a,
          rtpParameters: o,
          appData: c,
        }) {
          super(),
            (this._closed = !1),
            (this._observer = new s.EnhancedEventEmitter()),
            n.debug("constructor()"),
            (this._id = e),
            (this._localId = t),
            (this._producerId = r),
            (this._rtpReceiver = i),
            (this._track = a),
            (this._rtpParameters = o),
            (this._paused = !a.enabled),
            (this._appData = c),
            (this._onTrackEnded = this._onTrackEnded.bind(this)),
            this._handleTrack();
        }
      }
      e.exports.Consumer = o;
    }),
    i.register("e41iV", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.DataProducer = void 0);
      var r = i("6pHSb"),
        s = i("6DeKT"),
        a = i("difix");
      const n = new r.Logger("DataProducer");
      class o extends s.EnhancedEventEmitter {
        get id() {
          return this._id;
        }
        get closed() {
          return this._closed;
        }
        get sctpStreamParameters() {
          return this._sctpStreamParameters;
        }
        get readyState() {
          return this._dataChannel.readyState;
        }
        get label() {
          return this._dataChannel.label;
        }
        get protocol() {
          return this._dataChannel.protocol;
        }
        get bufferedAmount() {
          return this._dataChannel.bufferedAmount;
        }
        get bufferedAmountLowThreshold() {
          return this._dataChannel.bufferedAmountLowThreshold;
        }
        set bufferedAmountLowThreshold(e) {
          this._dataChannel.bufferedAmountLowThreshold = e;
        }
        get appData() {
          return this._appData;
        }
        set appData(e) {
          throw new Error("cannot override appData object");
        }
        get observer() {
          return this._observer;
        }
        close() {
          this._closed ||
            (n.debug("close()"),
            (this._closed = !0),
            this._dataChannel.close(),
            this.emit("@close"),
            this._observer.safeEmit("close"));
        }
        transportClosed() {
          this._closed ||
            (n.debug("transportClosed()"),
            (this._closed = !0),
            this._dataChannel.close(),
            this.safeEmit("transportclose"),
            this._observer.safeEmit("close"));
        }
        send(e) {
          if ((n.debug("send()"), this._closed)) throw new a.InvalidStateError("closed");
          this._dataChannel.send(e);
        }
        _handleDataChannel() {
          this._dataChannel.addEventListener("open", () => {
            this._closed || (n.debug('DataChannel "open" event'), this.safeEmit("open"));
          }),
            this._dataChannel.addEventListener("error", (e) => {
              if (this._closed) return;
              let { error: t } = e;
              t || (t = new Error("unknown DataChannel error")),
                "sctp-failure" === t.errorDetail
                  ? n.error(
                      "DataChannel SCTP error [sctpCauseCode:%s]: %s",
                      t.sctpCauseCode,
                      t.message
                    )
                  : n.error('DataChannel "error" event: %o', t),
                this.safeEmit("error", t);
            }),
            this._dataChannel.addEventListener("close", () => {
              this._closed ||
                (n.warn('DataChannel "close" event'),
                (this._closed = !0),
                this.emit("@close"),
                this.safeEmit("close"));
            }),
            this._dataChannel.addEventListener("message", () => {
              this._closed ||
                n.warn('DataChannel "message" event in a DataProducer, message discarded');
            }),
            this._dataChannel.addEventListener("bufferedamountlow", () => {
              this._closed || this.safeEmit("bufferedamountlow");
            });
        }
        constructor({ id: e, dataChannel: t, sctpStreamParameters: r, appData: i }) {
          super(),
            (this._closed = !1),
            (this._observer = new s.EnhancedEventEmitter()),
            n.debug("constructor()"),
            (this._id = e),
            (this._dataChannel = t),
            (this._sctpStreamParameters = r),
            (this._appData = i),
            this._handleDataChannel();
        }
      }
      e.exports.DataProducer = o;
    }),
    i.register("eYbsu", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.DataConsumer = void 0);
      var r = i("6pHSb"),
        s = i("6DeKT");
      const a = new r.Logger("DataConsumer");
      class n extends s.EnhancedEventEmitter {
        get id() {
          return this._id;
        }
        get dataProducerId() {
          return this._dataProducerId;
        }
        get closed() {
          return this._closed;
        }
        get sctpStreamParameters() {
          return this._sctpStreamParameters;
        }
        get readyState() {
          return this._dataChannel.readyState;
        }
        get label() {
          return this._dataChannel.label;
        }
        get protocol() {
          return this._dataChannel.protocol;
        }
        get binaryType() {
          return this._dataChannel.binaryType;
        }
        set binaryType(e) {
          this._dataChannel.binaryType = e;
        }
        get appData() {
          return this._appData;
        }
        set appData(e) {
          throw new Error("cannot override appData object");
        }
        get observer() {
          return this._observer;
        }
        close() {
          this._closed ||
            (a.debug("close()"),
            (this._closed = !0),
            this._dataChannel.close(),
            this.emit("@close"),
            this._observer.safeEmit("close"));
        }
        transportClosed() {
          this._closed ||
            (a.debug("transportClosed()"),
            (this._closed = !0),
            this._dataChannel.close(),
            this.safeEmit("transportclose"),
            this._observer.safeEmit("close"));
        }
        _handleDataChannel() {
          this._dataChannel.addEventListener("open", () => {
            this._closed || (a.debug('DataChannel "open" event'), this.safeEmit("open"));
          }),
            this._dataChannel.addEventListener("error", (e) => {
              if (this._closed) return;
              let { error: t } = e;
              t || (t = new Error("unknown DataChannel error")),
                "sctp-failure" === t.errorDetail
                  ? a.error(
                      "DataChannel SCTP error [sctpCauseCode:%s]: %s",
                      t.sctpCauseCode,
                      t.message
                    )
                  : a.error('DataChannel "error" event: %o', t),
                this.safeEmit("error", t);
            }),
            this._dataChannel.addEventListener("close", () => {
              this._closed ||
                (a.warn('DataChannel "close" event'),
                (this._closed = !0),
                this.emit("@close"),
                this.safeEmit("close"));
            }),
            this._dataChannel.addEventListener("message", (e) => {
              this._closed || this.safeEmit("message", e.data);
            });
        }
        constructor({
          id: e,
          dataProducerId: t,
          dataChannel: r,
          sctpStreamParameters: i,
          appData: n,
        }) {
          super(),
            (this._closed = !1),
            (this._observer = new s.EnhancedEventEmitter()),
            a.debug("constructor()"),
            (this._id = e),
            (this._dataProducerId = t),
            (this._dataChannel = r),
            (this._sctpStreamParameters = i),
            (this._appData = n),
            this._handleDataChannel();
        }
      }
      e.exports.DataConsumer = n;
    }),
    i.register("6iDbn", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Chrome74 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("kEMFf")),
        l = a(i("cIoIc"));
      var u = i("jO0hf"),
        h = i("bYqSi"),
        m = i("at4BN");
      const f = new o.Logger("Chrome74"),
        g = { OS: 1024, MIS: 1024 };
      class _ extends u.HandlerInterface {
        static createFactory() {
          return () => new _();
        }
        get name() {
          return "Chrome74";
        }
        close() {
          if ((f.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          f.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "unified-plan",
          });
          try {
            e.addTransceiver("audio"), e.addTransceiver("video");
            const t = await e.createOffer();
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return p.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return f.debug("getNativeSctpCapabilities()"), { numStreams: g };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: p,
        }) {
          f.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new h.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
            })),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", p),
              video: d.getSendingRtpParameters("video", p),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: d.getSendingRemoteRtpParameters("audio", p),
              video: d.getSendingRemoteRtpParameters("video", p),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                  sdpSemantics: "unified-plan",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          f.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (f.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              f.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              f.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            f.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            t &&
              t.length > 1 &&
              t.forEach((e, t) => {
                e.rid = `r${t}`;
              });
          const i = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          i.codecs = d.reduceCodecs(i.codecs, s);
          const a = c.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          a.codecs = d.reduceCodecs(a.codecs, s);
          const o = this._remoteSdp.getNextMediaSectionIdx(),
            u = this._pc.addTransceiver(e, {
              direction: "sendonly",
              streams: [this._sendStream],
              sendEncodings: t,
            });
          let h,
            g = await this._pc.createOffer(),
            _ = n.parse(g.sdp);
          this._transportReady ||
            (await this._setupTransport({ localDtlsRole: "server", localSdpObject: _ }));
          let v = !1;
          const b = m.parse((t || [{}])[0].scalabilityMode);
          t &&
            1 === t.length &&
            b.spatialLayers > 1 &&
            "video/vp9" === i.codecs[0].mimeType.toLowerCase() &&
            (f.debug("send() | enabling legacy simulcast for VP9 SVC"),
            (v = !0),
            (_ = n.parse(g.sdp)),
            (h = _.media[o.idx]),
            l.addLegacySimulcast({ offerMediaObject: h, numStreams: b.spatialLayers }),
            (g = { type: "offer", sdp: n.write(_) })),
            f.debug("send() | calling pc.setLocalDescription() [offer:%o]", g),
            await this._pc.setLocalDescription(g);
          const y = u.mid;
          if (
            ((i.mid = y),
            (_ = n.parse(this._pc.localDescription.sdp)),
            (h = _.media[o.idx]),
            (i.rtcp.cname = p.getCname({ offerMediaObject: h })),
            t)
          )
            if (1 === t.length) {
              let e = l.getRtpEncodings({ offerMediaObject: h });
              Object.assign(e[0], t[0]), v && (e = [e[0]]), (i.encodings = e);
            } else i.encodings = t;
          else i.encodings = l.getRtpEncodings({ offerMediaObject: h });
          if (
            i.encodings.length > 1 &&
            ("video/vp8" === i.codecs[0].mimeType.toLowerCase() ||
              "video/h264" === i.codecs[0].mimeType.toLowerCase())
          )
            for (const e of i.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: h,
            reuseMid: o.reuseMid,
            offerRtpParameters: i,
            answerRtpParameters: a,
            codecOptions: r,
            extmapAllowMixed: !0,
          });
          const w = { type: "answer", sdp: this._remoteSdp.getSdp() };
          return (
            f.debug("send() | calling pc.setRemoteDescription() [answer:%o]", w),
            await this._pc.setRemoteDescription(w),
            this._mapMidTransceiver.set(y, u),
            { localId: y, rtpParameters: i, rtpSender: u.sender }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), f.debug("stopSending() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.sender.replaceTrack(null),
            this._pc.removeTrack(t.sender),
            this._remoteSdp.closeMediaSection(t.mid);
          const r = await this._pc.createOffer();
          f.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r),
            await this._pc.setLocalDescription(r);
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? f.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : f.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          await r.sender.replaceTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            f.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.sender.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            f.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.sender.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.sender.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          f.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % g.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              f.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            f.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), f.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = r.mid || String(this._mapMidTransceiver.size);
          this._remoteSdp.receive({
            mid: s,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const i = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", i),
            await this._pc.setRemoteDescription(i);
          let a = await this._pc.createAnswer();
          const o = n.parse(a.sdp),
            c = o.media.find((e) => String(e.mid) === s);
          p.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: c }),
            (a = { type: "answer", sdp: n.write(o) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: o })),
            f.debug("receive() | calling pc.setLocalDescription() [answer:%o]", a),
            await this._pc.setLocalDescription(a);
          const d = this._pc.getTransceivers().find((e) => e.mid === s);
          if (!d) throw new Error("new RTCRtpTransceiver not found");
          return (
            this._mapMidTransceiver.set(s, d),
            { localId: s, track: d.receiver.track, rtpReceiver: d.receiver }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), f.debug("stopReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          this._remoteSdp.closeMediaSection(t.mid);
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async pauseReceiving(e) {
          this._assertRecvDirection(), f.debug("pauseReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "inactive";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("pauseReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async resumeReceiving(e) {
          this._assertRecvDirection(), f.debug("resumeReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "recvonly";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("resumeReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.receiver.getStats();
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          f.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation();
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = p.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._mapMidTransceiver = new Map()),
            (this._sendStream = new MediaStream()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Chrome74 = _;
    }),
    i.register("xeSFI", function (t, r) {
      var s, a, n, o, c, d, p, l;
      e(
        t.exports,
        "write",
        function () {
          return s;
        },
        function (e) {
          return (s = e);
        }
      ),
        e(
          t.exports,
          "parse",
          function () {
            return a;
          },
          function (e) {
            return (a = e);
          }
        ),
        e(
          t.exports,
          "parseParams",
          function () {
            return n;
          },
          function (e) {
            return (n = e);
          }
        ),
        e(
          t.exports,
          "parseFmtpConfig",
          function () {
            return o;
          },
          function (e) {
            return (o = e);
          }
        ),
        e(
          t.exports,
          "parsePayloads",
          function () {
            return c;
          },
          function (e) {
            return (c = e);
          }
        ),
        e(
          t.exports,
          "parseRemoteCandidates",
          function () {
            return d;
          },
          function (e) {
            return (d = e);
          }
        ),
        e(
          t.exports,
          "parseImageAttributes",
          function () {
            return p;
          },
          function (e) {
            return (p = e);
          }
        ),
        e(
          t.exports,
          "parseSimulcastStreamList",
          function () {
            return l;
          },
          function (e) {
            return (l = e);
          }
        );
      var u = i("f6RMB"),
        h = i("gUGrf");
      (s = h),
        (a = u.parse),
        (n = u.parseParams),
        (o = u.parseFmtpConfig),
        (c = u.parsePayloads),
        (d = u.parseRemoteCandidates),
        (p = u.parseImageAttributes),
        (l = u.parseSimulcastStreamList);
    }),
    i.register("f6RMB", function (t, r) {
      var s, a, n, o, c, d, p;
      e(
        t.exports,
        "parse",
        function () {
          return s;
        },
        function (e) {
          return (s = e);
        }
      ),
        e(
          t.exports,
          "parseParams",
          function () {
            return a;
          },
          function (e) {
            return (a = e);
          }
        ),
        e(
          t.exports,
          "parseFmtpConfig",
          function () {
            return n;
          },
          function (e) {
            return (n = e);
          }
        ),
        e(
          t.exports,
          "parsePayloads",
          function () {
            return o;
          },
          function (e) {
            return (o = e);
          }
        ),
        e(
          t.exports,
          "parseRemoteCandidates",
          function () {
            return c;
          },
          function (e) {
            return (c = e);
          }
        ),
        e(
          t.exports,
          "parseImageAttributes",
          function () {
            return d;
          },
          function (e) {
            return (d = e);
          }
        ),
        e(
          t.exports,
          "parseSimulcastStreamList",
          function () {
            return p;
          },
          function (e) {
            return (p = e);
          }
        );
      var l = function (e) {
          return String(Number(e)) === e ? Number(e) : e;
        },
        u = function (e, t, r) {
          var s = e.name && e.names;
          e.push && !t[e.push] ? (t[e.push] = []) : s && !t[e.name] && (t[e.name] = {});
          var i = e.push ? {} : s ? t[e.name] : t;
          !(function (e, t, r, s) {
            if (s && !r) t[s] = l(e[1]);
            else for (var i = 0; i < r.length; i += 1) null != e[i + 1] && (t[r[i]] = l(e[i + 1]));
          })(r.match(e.reg), i, e.names, e.name),
            e.push && t[e.push].push(i);
        },
        h = i("8nffS"),
        m = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
      s = function (e) {
        var t = {},
          r = [],
          s = t;
        return (
          e
            .split(/(\r\n|\r|\n)/)
            .filter(m)
            .forEach(function (e) {
              var t = e[0],
                i = e.slice(2);
              "m" === t && (r.push({ rtp: [], fmtp: [] }), (s = r[r.length - 1]));
              for (var a = 0; a < (h[t] || []).length; a += 1) {
                var n = h[t][a];
                if (n.reg.test(i)) return u(n, s, i);
              }
            }),
          (t.media = r),
          t
        );
      };
      var f = function (e, t) {
        var r = t.split(/=(.+)/, 2);
        return (
          2 === r.length
            ? (e[r[0]] = l(r[1]))
            : 1 === r.length && t.length > 1 && (e[r[0]] = void 0),
          e
        );
      };
      (n = a =
        function (e) {
          return e.split(/;\s?/).reduce(f, {});
        }),
        (o = function (e) {
          return e.toString().split(" ").map(Number);
        }),
        (c = function (e) {
          for (var t = [], r = e.split(" ").map(l), s = 0; s < r.length; s += 3)
            t.push({ component: r[s], ip: r[s + 1], port: r[s + 2] });
          return t;
        }),
        (d = function (e) {
          return e.split(" ").map(function (e) {
            return e
              .substring(1, e.length - 1)
              .split(",")
              .reduce(f, {});
          });
        }),
        (p = function (e) {
          return e.split(";").map(function (e) {
            return e.split(",").map(function (e) {
              var t,
                r = !1;
              return (
                "~" !== e[0] ? (t = l(e)) : ((t = l(e.substring(1, e.length))), (r = !0)),
                { scid: t, paused: r }
              );
            });
          });
        });
    }),
    i.register("8nffS", function (e, t) {
      var r = (e.exports = {
        v: [{ name: "version", reg: /^(\d*)$/ }],
        o: [
          {
            name: "origin",
            reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
            names: ["username", "sessionId", "sessionVersion", "netType", "ipVer", "address"],
            format: "%s %s %d %s IP%d %s",
          },
        ],
        s: [{ name: "name" }],
        i: [{ name: "description" }],
        u: [{ name: "uri" }],
        e: [{ name: "email" }],
        p: [{ name: "phone" }],
        z: [{ name: "timezones" }],
        r: [{ name: "repeats" }],
        t: [{ name: "timing", reg: /^(\d*) (\d*)/, names: ["start", "stop"], format: "%d %d" }],
        c: [
          {
            name: "connection",
            reg: /^IN IP(\d) (\S*)/,
            names: ["version", "ip"],
            format: "IN IP%d %s",
          },
        ],
        b: [
          {
            push: "bandwidth",
            reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
            names: ["type", "limit"],
            format: "%s:%s",
          },
        ],
        m: [
          {
            reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
            names: ["type", "port", "protocol", "payloads"],
            format: "%s %d %s %s",
          },
        ],
        a: [
          {
            push: "rtp",
            reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
            names: ["payload", "codec", "rate", "encoding"],
            format: function (e) {
              return e.encoding
                ? "rtpmap:%d %s/%s/%s"
                : e.rate
                ? "rtpmap:%d %s/%s"
                : "rtpmap:%d %s";
            },
          },
          {
            push: "fmtp",
            reg: /^fmtp:(\d*) ([\S| ]*)/,
            names: ["payload", "config"],
            format: "fmtp:%d %s",
          },
          { name: "control", reg: /^control:(.*)/, format: "control:%s" },
          {
            name: "rtcp",
            reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
            names: ["port", "netType", "ipVer", "address"],
            format: function (e) {
              return null != e.address ? "rtcp:%d %s IP%d %s" : "rtcp:%d";
            },
          },
          {
            push: "rtcpFbTrrInt",
            reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
            names: ["payload", "value"],
            format: "rtcp-fb:%s trr-int %d",
          },
          {
            push: "rtcpFb",
            reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
            names: ["payload", "type", "subtype"],
            format: function (e) {
              return null != e.subtype ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s";
            },
          },
          {
            push: "ext",
            reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
            names: ["value", "direction", "encrypt-uri", "uri", "config"],
            format: function (e) {
              return (
                "extmap:%d" +
                (e.direction ? "/%s" : "%v") +
                (e["encrypt-uri"] ? " %s" : "%v") +
                " %s" +
                (e.config ? " %s" : "")
              );
            },
          },
          { name: "extmapAllowMixed", reg: /^(extmap-allow-mixed)/ },
          {
            push: "crypto",
            reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
            names: ["id", "suite", "config", "sessionConfig"],
            format: function (e) {
              return null != e.sessionConfig ? "crypto:%d %s %s %s" : "crypto:%d %s %s";
            },
          },
          { name: "setup", reg: /^setup:(\w*)/, format: "setup:%s" },
          { name: "connectionType", reg: /^connection:(new|existing)/, format: "connection:%s" },
          { name: "mid", reg: /^mid:([^\s]*)/, format: "mid:%s" },
          { name: "msid", reg: /^msid:(.*)/, format: "msid:%s" },
          { name: "ptime", reg: /^ptime:(\d*(?:\.\d*)*)/, format: "ptime:%d" },
          { name: "maxptime", reg: /^maxptime:(\d*(?:\.\d*)*)/, format: "maxptime:%d" },
          { name: "direction", reg: /^(sendrecv|recvonly|sendonly|inactive)/ },
          { name: "icelite", reg: /^(ice-lite)/ },
          { name: "iceUfrag", reg: /^ice-ufrag:(\S*)/, format: "ice-ufrag:%s" },
          { name: "icePwd", reg: /^ice-pwd:(\S*)/, format: "ice-pwd:%s" },
          {
            name: "fingerprint",
            reg: /^fingerprint:(\S*) (\S*)/,
            names: ["type", "hash"],
            format: "fingerprint:%s %s",
          },
          {
            push: "candidates",
            reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
            names: [
              "foundation",
              "component",
              "transport",
              "priority",
              "ip",
              "port",
              "type",
              "raddr",
              "rport",
              "tcptype",
              "generation",
              "network-id",
              "network-cost",
            ],
            format: function (e) {
              var t = "candidate:%s %d %s %d %s %d typ %s";
              return (
                (t += null != e.raddr ? " raddr %s rport %d" : "%v%v"),
                (t += null != e.tcptype ? " tcptype %s" : "%v"),
                null != e.generation && (t += " generation %d"),
                (t += null != e["network-id"] ? " network-id %d" : "%v"),
                (t += null != e["network-cost"] ? " network-cost %d" : "%v")
              );
            },
          },
          { name: "endOfCandidates", reg: /^(end-of-candidates)/ },
          {
            name: "remoteCandidates",
            reg: /^remote-candidates:(.*)/,
            format: "remote-candidates:%s",
          },
          { name: "iceOptions", reg: /^ice-options:(\S*)/, format: "ice-options:%s" },
          {
            push: "ssrcs",
            reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
            names: ["id", "attribute", "value"],
            format: function (e) {
              var t = "ssrc:%d";
              return null != e.attribute && ((t += " %s"), null != e.value && (t += ":%s")), t;
            },
          },
          {
            push: "ssrcGroups",
            reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
            names: ["semantics", "ssrcs"],
            format: "ssrc-group:%s %s",
          },
          {
            name: "msidSemantic",
            reg: /^msid-semantic:\s?(\w*) (\S*)/,
            names: ["semantic", "token"],
            format: "msid-semantic: %s %s",
          },
          {
            push: "groups",
            reg: /^group:(\w*) (.*)/,
            names: ["type", "mids"],
            format: "group:%s %s",
          },
          { name: "rtcpMux", reg: /^(rtcp-mux)/ },
          { name: "rtcpRsize", reg: /^(rtcp-rsize)/ },
          {
            name: "sctpmap",
            reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
            names: ["sctpmapNumber", "app", "maxMessageSize"],
            format: function (e) {
              return null != e.maxMessageSize ? "sctpmap:%s %s %s" : "sctpmap:%s %s";
            },
          },
          { name: "xGoogleFlag", reg: /^x-google-flag:([^\s]*)/, format: "x-google-flag:%s" },
          {
            push: "rids",
            reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
            names: ["id", "direction", "params"],
            format: function (e) {
              return e.params ? "rid:%s %s %s" : "rid:%s %s";
            },
          },
          {
            push: "imageattrs",
            reg: new RegExp(
              "^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"
            ),
            names: ["pt", "dir1", "attrs1", "dir2", "attrs2"],
            format: function (e) {
              return "imageattr:%s %s %s" + (e.dir2 ? " %s %s" : "");
            },
          },
          {
            name: "simulcast",
            reg: new RegExp(
              "^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"
            ),
            names: ["dir1", "list1", "dir2", "list2"],
            format: function (e) {
              return "simulcast:%s %s" + (e.dir2 ? " %s %s" : "");
            },
          },
          {
            name: "simulcast_03",
            reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
            names: ["value"],
            format: "simulcast: %s",
          },
          { name: "framerate", reg: /^framerate:(\d+(?:$|\.\d+))/, format: "framerate:%s" },
          {
            name: "sourceFilter",
            reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
            names: ["filterMode", "netType", "addressTypes", "destAddress", "srcList"],
            format: "source-filter: %s %s %s %s %s",
          },
          { name: "bundleOnly", reg: /^(bundle-only)/ },
          { name: "label", reg: /^label:(.+)/, format: "label:%s" },
          { name: "sctpPort", reg: /^sctp-port:(\d+)$/, format: "sctp-port:%s" },
          {
            name: "maxMessageSize",
            reg: /^max-message-size:(\d+)$/,
            format: "max-message-size:%s",
          },
          {
            push: "tsRefClocks",
            reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
            names: ["clksrc", "clksrcExt"],
            format: function (e) {
              return "ts-refclk:%s" + (null != e.clksrcExt ? "=%s" : "");
            },
          },
          {
            name: "mediaClk",
            reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
            names: ["id", "mediaClockName", "mediaClockValue", "rateNumerator", "rateDenominator"],
            format: function (e) {
              var t = "mediaclk:";
              return (
                (t += null != e.id ? "id=%s %s" : "%v%s"),
                (t += null != e.mediaClockValue ? "=%s" : ""),
                (t += null != e.rateNumerator ? " rate=%s" : ""),
                (t += null != e.rateDenominator ? "/%s" : "")
              );
            },
          },
          { name: "keywords", reg: /^keywds:(.+)$/, format: "keywds:%s" },
          { name: "content", reg: /^content:(.+)/, format: "content:%s" },
          { name: "bfcpFloorCtrl", reg: /^floorctrl:(c-only|s-only|c-s)/, format: "floorctrl:%s" },
          { name: "bfcpConfId", reg: /^confid:(\d+)/, format: "confid:%s" },
          { name: "bfcpUserId", reg: /^userid:(\d+)/, format: "userid:%s" },
          {
            name: "bfcpFloorId",
            reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
            names: ["id", "mStream"],
            format: "floorid:%s mstrm:%s",
          },
          { push: "invalid", names: ["value"] },
        ],
      });
      Object.keys(r).forEach(function (e) {
        r[e].forEach(function (e) {
          e.reg || (e.reg = /(.*)/), e.format || (e.format = "%s");
        });
      });
    }),
    i.register("gUGrf", function (e, t) {
      var r = i("8nffS"),
        s = /%[sdv%]/g,
        a = function (e) {
          var t = 1,
            r = arguments,
            i = r.length;
          return e.replace(s, function (e) {
            if (t >= i) return e;
            var s = r[t];
            switch (((t += 1), e)) {
              case "%%":
                return "%";
              case "%s":
                return String(s);
              case "%d":
                return Number(s);
              case "%v":
                return "";
            }
          });
        },
        n = function (e, t, r) {
          var s = [
            e + "=" + (t.format instanceof Function ? t.format(t.push ? r : r[t.name]) : t.format),
          ];
          if (t.names)
            for (var i = 0; i < t.names.length; i += 1) {
              var n = t.names[i];
              t.name ? s.push(r[t.name][n]) : s.push(r[t.names[i]]);
            }
          else s.push(r[t.name]);
          return a.apply(null, s);
        },
        o = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"],
        c = ["i", "c", "b", "a"];
      e.exports = function (e, t) {
        (t = t || {}),
          null == e.version && (e.version = 0),
          null == e.name && (e.name = " "),
          e.media.forEach(function (e) {
            null == e.payloads && (e.payloads = "");
          });
        var s = t.outerOrder || o,
          i = t.innerOrder || c,
          a = [];
        return (
          s.forEach(function (t) {
            r[t].forEach(function (r) {
              r.name in e && null != e[r.name]
                ? a.push(n(t, r, e))
                : r.push in e &&
                  null != e[r.push] &&
                  e[r.push].forEach(function (e) {
                    a.push(n(t, r, e));
                  });
            });
          }),
          e.media.forEach(function (e) {
            a.push(n("m", r.m[0], e)),
              i.forEach(function (t) {
                r[t].forEach(function (r) {
                  r.name in e && null != e[r.name]
                    ? a.push(n(t, r, e))
                    : r.push in e &&
                      null != e[r.push] &&
                      e[r.push].forEach(function (e) {
                        a.push(n(t, r, e));
                      });
                });
              });
          }),
          a.join("\r\n") + "\r\n"
        );
      };
    }),
    i.register("kEMFf", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.applyCodecParameters =
          e.exports.getCname =
          e.exports.extractDtlsParameters =
          e.exports.extractRtpCapabilities =
            void 0);
      const n = a(i("xeSFI"));
      (e.exports.extractRtpCapabilities = function ({ sdpObject: e }) {
        const t = new Map(),
          r = [];
        let s = !1,
          i = !1;
        for (const a of e.media) {
          const e = a.type;
          switch (e) {
            case "audio":
              if (s) continue;
              s = !0;
              break;
            case "video":
              if (i) continue;
              i = !0;
              break;
            default:
              continue;
          }
          for (const r of a.rtp) {
            const s = {
              kind: e,
              mimeType: `${e}/${r.codec}`,
              preferredPayloadType: r.payload,
              clockRate: r.rate,
              channels: r.encoding,
              parameters: {},
              rtcpFeedback: [],
            };
            t.set(s.preferredPayloadType, s);
          }
          for (const e of a.fmtp || []) {
            const r = n.parseParams(e.config),
              s = t.get(e.payload);
            s &&
              (r &&
                r.hasOwnProperty("profile-level-id") &&
                (r["profile-level-id"] = String(r["profile-level-id"])),
              (s.parameters = r));
          }
          for (const e of a.rtcpFb || []) {
            const r = t.get(e.payload);
            if (!r) continue;
            const s = { type: e.type, parameter: e.subtype };
            s.parameter || delete s.parameter, r.rtcpFeedback.push(s);
          }
          for (const t of a.ext || []) {
            if (t["encrypt-uri"]) continue;
            const s = { kind: e, uri: t.uri, preferredId: t.value };
            r.push(s);
          }
        }
        return { codecs: Array.from(t.values()), headerExtensions: r };
      }),
        (e.exports.extractDtlsParameters = function ({ sdpObject: e }) {
          const t = (e.media || []).find((e) => e.iceUfrag && 0 !== e.port);
          if (!t) throw new Error("no active media section found");
          const r = t.fingerprint || e.fingerprint;
          let s;
          switch (t.setup) {
            case "active":
              s = "client";
              break;
            case "passive":
              s = "server";
              break;
            case "actpass":
              s = "auto";
          }
          return { role: s, fingerprints: [{ algorithm: r.type, value: r.hash }] };
        }),
        (e.exports.getCname = function ({ offerMediaObject: e }) {
          const t = (e.ssrcs || []).find((e) => "cname" === e.attribute);
          return t ? t.value : "";
        }),
        (e.exports.applyCodecParameters = function ({
          offerRtpParameters: e,
          answerMediaObject: t,
        }) {
          for (const r of e.codecs) {
            const e = r.mimeType.toLowerCase();
            if ("audio/opus" !== e) continue;
            if (!(t.rtp || []).find((e) => e.payload === r.payloadType)) continue;
            t.fmtp = t.fmtp || [];
            let s = t.fmtp.find((e) => e.payload === r.payloadType);
            s || ((s = { payload: r.payloadType, config: "" }), t.fmtp.push(s));
            const i = n.parseParams(s.config);
            switch (e) {
              case "audio/opus": {
                const e = r.parameters["sprop-stereo"];
                void 0 !== e && (i.stereo = e ? 1 : 0);
                break;
              }
            }
            s.config = "";
            for (const e of Object.keys(i))
              s.config && (s.config += ";"), (s.config += `${e}=${i[e]}`);
          }
        });
    }),
    i.register("cIoIc", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.addLegacySimulcast = e.exports.getRtpEncodings = void 0),
        (e.exports.getRtpEncodings = function ({ offerMediaObject: e }) {
          const t = new Set();
          for (const r of e.ssrcs || []) {
            const e = r.id;
            t.add(e);
          }
          if (0 === t.size) throw new Error("no a=ssrc lines found");
          const r = new Map();
          for (const s of e.ssrcGroups || []) {
            if ("FID" !== s.semantics) continue;
            let [e, i] = s.ssrcs.split(/\s+/);
            (e = Number(e)), (i = Number(i)), t.has(e) && (t.delete(e), t.delete(i), r.set(e, i));
          }
          for (const e of t) r.set(e, null);
          const s = [];
          for (const [e, t] of r) {
            const r = { ssrc: e };
            t && (r.rtx = { ssrc: t }), s.push(r);
          }
          return s;
        }),
        (e.exports.addLegacySimulcast = function ({ offerMediaObject: e, numStreams: t }) {
          if (t <= 1) throw new TypeError("numStreams must be greater than 1");
          const r = (e.ssrcs || []).find((e) => "msid" === e.attribute);
          if (!r) throw new Error("a=ssrc line with msid information not found");
          const [s, i] = r.value.split(" "),
            a = r.id;
          let n;
          (e.ssrcGroups || []).some((e) => {
            if ("FID" !== e.semantics) return !1;
            const t = e.ssrcs.split(/\s+/);
            return Number(t[0]) === a && ((n = Number(t[1])), !0);
          });
          const o = e.ssrcs.find((e) => "cname" === e.attribute);
          if (!o) throw new Error("a=ssrc line with cname information not found");
          const c = o.value,
            d = [],
            p = [];
          for (let e = 0; e < t; ++e) d.push(a + e), n && p.push(n + e);
          (e.ssrcGroups = []),
            (e.ssrcs = []),
            e.ssrcGroups.push({ semantics: "SIM", ssrcs: d.join(" ") });
          for (let t = 0; t < d.length; ++t) {
            const r = d[t];
            e.ssrcs.push({ id: r, attribute: "cname", value: c }),
              e.ssrcs.push({ id: r, attribute: "msid", value: `${s} ${i}` });
          }
          for (let t = 0; t < p.length; ++t) {
            const r = d[t],
              a = p[t];
            e.ssrcs.push({ id: a, attribute: "cname", value: c }),
              e.ssrcs.push({ id: a, attribute: "msid", value: `${s} ${i}` }),
              e.ssrcGroups.push({ semantics: "FID", ssrcs: `${r} ${a}` });
          }
        });
    }),
    i.register("jO0hf", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.HandlerInterface = void 0);
      var r = i("6DeKT");
      class s extends r.EnhancedEventEmitter {
        constructor() {
          super();
        }
      }
      e.exports.HandlerInterface = s;
    }),
    i.register("bYqSi", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.RemoteSdp = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb"),
        c = i("32y8j");
      const d = new o.Logger("RemoteSdp");
      e.exports.RemoteSdp = class {
        updateIceParameters(e) {
          d.debug("updateIceParameters() [iceParameters:%o]", e),
            (this._iceParameters = e),
            (this._sdpObject.icelite = e.iceLite ? "ice-lite" : void 0);
          for (const t of this._mediaSections) t.setIceParameters(e);
        }
        updateDtlsRole(e) {
          d.debug("updateDtlsRole() [role:%s]", e), (this._dtlsParameters.role = e);
          for (const t of this._mediaSections) t.setDtlsRole(e);
        }
        getNextMediaSectionIdx() {
          for (let e = 0; e < this._mediaSections.length; ++e) {
            const t = this._mediaSections[e];
            if (t.closed) return { idx: e, reuseMid: t.mid };
          }
          return { idx: this._mediaSections.length };
        }
        send({
          offerMediaObject: e,
          reuseMid: t,
          offerRtpParameters: r,
          answerRtpParameters: s,
          codecOptions: i,
          extmapAllowMixed: a = !1,
        }) {
          const n = new c.AnswerMediaSection({
            iceParameters: this._iceParameters,
            iceCandidates: this._iceCandidates,
            dtlsParameters: this._dtlsParameters,
            plainRtpParameters: this._plainRtpParameters,
            planB: this._planB,
            offerMediaObject: e,
            offerRtpParameters: r,
            answerRtpParameters: s,
            codecOptions: i,
            extmapAllowMixed: a,
          });
          t
            ? this._replaceMediaSection(n, t)
            : this._midToIndex.has(n.mid)
            ? this._replaceMediaSection(n)
            : this._addMediaSection(n);
        }
        receive({ mid: e, kind: t, offerRtpParameters: r, streamId: s, trackId: i }) {
          const a = this._midToIndex.get(e);
          let n;
          if ((void 0 !== a && (n = this._mediaSections[a]), n))
            n.planBReceive({ offerRtpParameters: r, streamId: s, trackId: i }),
              this._replaceMediaSection(n);
          else {
            n = new c.OfferMediaSection({
              iceParameters: this._iceParameters,
              iceCandidates: this._iceCandidates,
              dtlsParameters: this._dtlsParameters,
              plainRtpParameters: this._plainRtpParameters,
              planB: this._planB,
              mid: e,
              kind: t,
              offerRtpParameters: r,
              streamId: s,
              trackId: i,
            });
            const a = this._mediaSections.find((e) => e.closed);
            a ? this._replaceMediaSection(n, a.mid) : this._addMediaSection(n);
          }
        }
        disableMediaSection(e) {
          const t = this._midToIndex.get(e);
          if (void 0 === t) throw new Error(`no media section found with mid '${e}'`);
          this._mediaSections[t].disable();
        }
        closeMediaSection(e) {
          const t = this._midToIndex.get(e);
          if (void 0 === t) throw new Error(`no media section found with mid '${e}'`);
          const r = this._mediaSections[t];
          if (e === this._firstMid)
            return (
              d.debug(
                "closeMediaSection() | cannot close first media section, disabling it instead [mid:%s]",
                e
              ),
              void this.disableMediaSection(e)
            );
          r.close(), this._regenerateBundleMids();
        }
        planBStopReceiving({ mid: e, offerRtpParameters: t }) {
          const r = this._midToIndex.get(e);
          if (void 0 === r) throw new Error(`no media section found with mid '${e}'`);
          const s = this._mediaSections[r];
          s.planBStopReceiving({ offerRtpParameters: t }), this._replaceMediaSection(s);
        }
        sendSctpAssociation({ offerMediaObject: e }) {
          const t = new c.AnswerMediaSection({
            iceParameters: this._iceParameters,
            iceCandidates: this._iceCandidates,
            dtlsParameters: this._dtlsParameters,
            sctpParameters: this._sctpParameters,
            plainRtpParameters: this._plainRtpParameters,
            offerMediaObject: e,
          });
          this._addMediaSection(t);
        }
        receiveSctpAssociation({ oldDataChannelSpec: e = !1 } = {}) {
          const t = new c.OfferMediaSection({
            iceParameters: this._iceParameters,
            iceCandidates: this._iceCandidates,
            dtlsParameters: this._dtlsParameters,
            sctpParameters: this._sctpParameters,
            plainRtpParameters: this._plainRtpParameters,
            mid: "datachannel",
            kind: "application",
            oldDataChannelSpec: e,
          });
          this._addMediaSection(t);
        }
        getSdp() {
          return this._sdpObject.origin.sessionVersion++, n.write(this._sdpObject);
        }
        _addMediaSection(e) {
          this._firstMid || (this._firstMid = e.mid),
            this._mediaSections.push(e),
            this._midToIndex.set(e.mid, this._mediaSections.length - 1),
            this._sdpObject.media.push(e.getObject()),
            this._regenerateBundleMids();
        }
        _replaceMediaSection(e, t) {
          if ("string" == typeof t) {
            const r = this._midToIndex.get(t);
            if (void 0 === r) throw new Error(`no media section found for reuseMid '${t}'`);
            const s = this._mediaSections[r];
            (this._mediaSections[r] = e),
              this._midToIndex.delete(s.mid),
              this._midToIndex.set(e.mid, r),
              (this._sdpObject.media[r] = e.getObject()),
              this._regenerateBundleMids();
          } else {
            const t = this._midToIndex.get(e.mid);
            if (void 0 === t) throw new Error(`no media section found with mid '${e.mid}'`);
            (this._mediaSections[t] = e), (this._sdpObject.media[t] = e.getObject());
          }
        }
        _regenerateBundleMids() {
          this._dtlsParameters &&
            (this._sdpObject.groups[0].mids = this._mediaSections
              .filter((e) => !e.closed)
              .map((e) => e.mid)
              .join(" "));
        }
        constructor({
          iceParameters: e,
          iceCandidates: t,
          dtlsParameters: r,
          sctpParameters: s,
          plainRtpParameters: i,
          planB: a = !1,
        }) {
          if (
            ((this._mediaSections = []),
            (this._midToIndex = new Map()),
            (this._iceParameters = e),
            (this._iceCandidates = t),
            (this._dtlsParameters = r),
            (this._sctpParameters = s),
            (this._plainRtpParameters = i),
            (this._planB = a),
            (this._sdpObject = {
              version: 0,
              origin: {
                address: "0.0.0.0",
                ipVer: 4,
                netType: "IN",
                sessionId: 1e4,
                sessionVersion: 0,
                username: "mediasoup-client",
              },
              name: "-",
              timing: { start: 0, stop: 0 },
              media: [],
            }),
            e && e.iceLite && (this._sdpObject.icelite = "ice-lite"),
            r)
          ) {
            this._sdpObject.msidSemantic = { semantic: "WMS", token: "*" };
            const e = this._dtlsParameters.fingerprints.length;
            (this._sdpObject.fingerprint = {
              type: r.fingerprints[e - 1].algorithm,
              hash: r.fingerprints[e - 1].value,
            }),
              (this._sdpObject.groups = [{ type: "BUNDLE", mids: "" }]);
          }
          i &&
            ((this._sdpObject.origin.address = i.ip), (this._sdpObject.origin.ipVer = i.ipVersion));
        }
      };
    }),
    i.register("32y8j", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.OfferMediaSection =
          e.exports.AnswerMediaSection =
          e.exports.MediaSection =
            void 0);
      const n = a(i("dgn3R"));
      class o {
        get mid() {
          return String(this._mediaObject.mid);
        }
        get closed() {
          return 0 === this._mediaObject.port;
        }
        getObject() {
          return this._mediaObject;
        }
        setIceParameters(e) {
          (this._mediaObject.iceUfrag = e.usernameFragment),
            (this._mediaObject.icePwd = e.password);
        }
        disable() {
          (this._mediaObject.direction = "inactive"),
            delete this._mediaObject.ext,
            delete this._mediaObject.ssrcs,
            delete this._mediaObject.ssrcGroups,
            delete this._mediaObject.simulcast,
            delete this._mediaObject.simulcast_03,
            delete this._mediaObject.rids;
        }
        close() {
          (this._mediaObject.direction = "inactive"),
            (this._mediaObject.port = 0),
            delete this._mediaObject.ext,
            delete this._mediaObject.ssrcs,
            delete this._mediaObject.ssrcGroups,
            delete this._mediaObject.simulcast,
            delete this._mediaObject.simulcast_03,
            delete this._mediaObject.rids,
            delete this._mediaObject.extmapAllowMixed;
        }
        constructor({ iceParameters: e, iceCandidates: t, dtlsParameters: r, planB: s = !1 }) {
          if (((this._mediaObject = {}), (this._planB = s), e && this.setIceParameters(e), t)) {
            this._mediaObject.candidates = [];
            for (const e of t) {
              const t = { component: 1 };
              (t.foundation = e.foundation),
                (t.ip = e.ip),
                (t.port = e.port),
                (t.priority = e.priority),
                (t.transport = e.protocol),
                (t.type = e.type),
                e.tcpType && (t.tcptype = e.tcpType),
                this._mediaObject.candidates.push(t);
            }
            (this._mediaObject.endOfCandidates = "end-of-candidates"),
              (this._mediaObject.iceOptions = "renomination");
          }
          r && this.setDtlsRole(r.role);
        }
      }
      e.exports.MediaSection = o;
      e.exports.AnswerMediaSection = class extends o {
        setDtlsRole(e) {
          switch (e) {
            case "client":
              this._mediaObject.setup = "active";
              break;
            case "server":
              this._mediaObject.setup = "passive";
              break;
            case "auto":
              this._mediaObject.setup = "actpass";
          }
        }
        constructor({
          iceParameters: e,
          iceCandidates: t,
          dtlsParameters: r,
          sctpParameters: s,
          plainRtpParameters: i,
          planB: a = !1,
          offerMediaObject: o,
          offerRtpParameters: d,
          answerRtpParameters: p,
          codecOptions: l,
          extmapAllowMixed: u = !1,
        }) {
          switch (
            (super({ iceParameters: e, iceCandidates: t, dtlsParameters: r, planB: a }),
            (this._mediaObject.mid = String(o.mid)),
            (this._mediaObject.type = o.type),
            (this._mediaObject.protocol = o.protocol),
            i
              ? ((this._mediaObject.connection = { ip: i.ip, version: i.ipVersion }),
                (this._mediaObject.port = i.port))
              : ((this._mediaObject.connection = { ip: "127.0.0.1", version: 4 }),
                (this._mediaObject.port = 7)),
            o.type)
          ) {
            case "audio":
            case "video":
              (this._mediaObject.direction = "recvonly"),
                (this._mediaObject.rtp = []),
                (this._mediaObject.rtcpFb = []),
                (this._mediaObject.fmtp = []);
              for (const e of p.codecs) {
                const t = { payload: e.payloadType, codec: c(e), rate: e.clockRate };
                e.channels > 1 && (t.encoding = e.channels), this._mediaObject.rtp.push(t);
                const r = n.clone(e.parameters, {});
                if (l) {
                  const {
                      opusStereo: t,
                      opusFec: s,
                      opusDtx: i,
                      opusMaxPlaybackRate: a,
                      opusMaxAverageBitrate: n,
                      opusPtime: o,
                      videoGoogleStartBitrate: c,
                      videoGoogleMaxBitrate: p,
                      videoGoogleMinBitrate: u,
                    } = l,
                    h = d.codecs.find((t) => t.payloadType === e.payloadType);
                  switch (e.mimeType.toLowerCase()) {
                    case "audio/opus":
                      void 0 !== t &&
                        ((h.parameters["sprop-stereo"] = t ? 1 : 0), (r.stereo = t ? 1 : 0)),
                        void 0 !== s &&
                          ((h.parameters.useinbandfec = s ? 1 : 0), (r.useinbandfec = s ? 1 : 0)),
                        void 0 !== i && ((h.parameters.usedtx = i ? 1 : 0), (r.usedtx = i ? 1 : 0)),
                        void 0 !== a && (r.maxplaybackrate = a),
                        void 0 !== n && (r.maxaveragebitrate = n),
                        void 0 !== o && ((h.parameters.ptime = o), (r.ptime = o));
                      break;
                    case "video/vp8":
                    case "video/vp9":
                    case "video/h264":
                    case "video/h265":
                      void 0 !== c && (r["x-google-start-bitrate"] = c),
                        void 0 !== p && (r["x-google-max-bitrate"] = p),
                        void 0 !== u && (r["x-google-min-bitrate"] = u);
                  }
                }
                const s = { payload: e.payloadType, config: "" };
                for (const e of Object.keys(r))
                  s.config && (s.config += ";"), (s.config += `${e}=${r[e]}`);
                s.config && this._mediaObject.fmtp.push(s);
                for (const t of e.rtcpFeedback)
                  this._mediaObject.rtcpFb.push({
                    payload: e.payloadType,
                    type: t.type,
                    subtype: t.parameter,
                  });
              }
              (this._mediaObject.payloads = p.codecs.map((e) => e.payloadType).join(" ")),
                (this._mediaObject.ext = []);
              for (const e of p.headerExtensions) {
                (o.ext || []).some((t) => t.uri === e.uri) &&
                  this._mediaObject.ext.push({ uri: e.uri, value: e.id });
              }
              if (
                (u &&
                  "extmap-allow-mixed" === o.extmapAllowMixed &&
                  (this._mediaObject.extmapAllowMixed = "extmap-allow-mixed"),
                o.simulcast)
              ) {
                (this._mediaObject.simulcast = { dir1: "recv", list1: o.simulcast.list1 }),
                  (this._mediaObject.rids = []);
                for (const e of o.rids || [])
                  "send" === e.direction &&
                    this._mediaObject.rids.push({ id: e.id, direction: "recv" });
              } else if (o.simulcast_03) {
                (this._mediaObject.simulcast_03 = {
                  value: o.simulcast_03.value.replace(/send/g, "recv"),
                }),
                  (this._mediaObject.rids = []);
                for (const e of o.rids || [])
                  "send" === e.direction &&
                    this._mediaObject.rids.push({ id: e.id, direction: "recv" });
              }
              (this._mediaObject.rtcpMux = "rtcp-mux"),
                (this._mediaObject.rtcpRsize = "rtcp-rsize"),
                this._planB &&
                  "video" === this._mediaObject.type &&
                  (this._mediaObject.xGoogleFlag = "conference");
              break;
            case "application":
              "number" == typeof o.sctpPort
                ? ((this._mediaObject.payloads = "webrtc-datachannel"),
                  (this._mediaObject.sctpPort = s.port),
                  (this._mediaObject.maxMessageSize = s.maxMessageSize))
                : o.sctpmap &&
                  ((this._mediaObject.payloads = s.port),
                  (this._mediaObject.sctpmap = {
                    app: "webrtc-datachannel",
                    sctpmapNumber: s.port,
                    maxMessageSize: s.maxMessageSize,
                  }));
          }
        }
      };
      function c(e) {
        const t = new RegExp("^(audio|video)/(.+)", "i").exec(e.mimeType);
        if (!t) throw new TypeError("invalid codec.mimeType");
        return t[2];
      }
      e.exports.OfferMediaSection = class extends o {
        setDtlsRole(e) {
          this._mediaObject.setup = "actpass";
        }
        planBReceive({ offerRtpParameters: e, streamId: t, trackId: r }) {
          const s = e.encodings[0],
            i = s.ssrc,
            a = s.rtx && s.rtx.ssrc ? s.rtx.ssrc : void 0,
            n = this._mediaObject.payloads.split(" ");
          for (const t of e.codecs) {
            if (n.includes(String(t.payloadType))) continue;
            const e = { payload: t.payloadType, codec: c(t), rate: t.clockRate };
            t.channels > 1 && (e.encoding = t.channels), this._mediaObject.rtp.push(e);
            const r = { payload: t.payloadType, config: "" };
            for (const e of Object.keys(t.parameters))
              r.config && (r.config += ";"), (r.config += `${e}=${t.parameters[e]}`);
            r.config && this._mediaObject.fmtp.push(r);
            for (const e of t.rtcpFeedback)
              this._mediaObject.rtcpFb.push({
                payload: t.payloadType,
                type: e.type,
                subtype: e.parameter,
              });
          }
          (this._mediaObject.payloads += ` ${e.codecs
            .filter((e) => !this._mediaObject.payloads.includes(e.payloadType))
            .map((e) => e.payloadType)
            .join(" ")}`),
            (this._mediaObject.payloads = this._mediaObject.payloads.trim()),
            e.rtcp.cname &&
              this._mediaObject.ssrcs.push({ id: i, attribute: "cname", value: e.rtcp.cname }),
            this._mediaObject.ssrcs.push({ id: i, attribute: "msid", value: `${t || "-"} ${r}` }),
            a &&
              (e.rtcp.cname &&
                this._mediaObject.ssrcs.push({ id: a, attribute: "cname", value: e.rtcp.cname }),
              this._mediaObject.ssrcs.push({ id: a, attribute: "msid", value: `${t || "-"} ${r}` }),
              this._mediaObject.ssrcGroups.push({ semantics: "FID", ssrcs: `${i} ${a}` }));
        }
        planBStopReceiving({ offerRtpParameters: e }) {
          const t = e.encodings[0],
            r = t.ssrc,
            s = t.rtx && t.rtx.ssrc ? t.rtx.ssrc : void 0;
          (this._mediaObject.ssrcs = this._mediaObject.ssrcs.filter(
            (e) => e.id !== r && e.id !== s
          )),
            s &&
              (this._mediaObject.ssrcGroups = this._mediaObject.ssrcGroups.filter(
                (e) => e.ssrcs !== `${r} ${s}`
              ));
        }
        constructor({
          iceParameters: e,
          iceCandidates: t,
          dtlsParameters: r,
          sctpParameters: s,
          plainRtpParameters: i,
          planB: a = !1,
          mid: n,
          kind: o,
          offerRtpParameters: d,
          streamId: p,
          trackId: l,
          oldDataChannelSpec: u = !1,
        }) {
          switch (
            (super({ iceParameters: e, iceCandidates: t, dtlsParameters: r, planB: a }),
            (this._mediaObject.mid = String(n)),
            (this._mediaObject.type = o),
            i
              ? ((this._mediaObject.connection = { ip: i.ip, version: i.ipVersion }),
                (this._mediaObject.protocol = "RTP/AVP"),
                (this._mediaObject.port = i.port))
              : ((this._mediaObject.connection = { ip: "127.0.0.1", version: 4 }),
                (this._mediaObject.protocol = s ? "UDP/DTLS/SCTP" : "UDP/TLS/RTP/SAVPF"),
                (this._mediaObject.port = 7)),
            o)
          ) {
            case "audio":
            case "video": {
              (this._mediaObject.direction = "sendonly"),
                (this._mediaObject.rtp = []),
                (this._mediaObject.rtcpFb = []),
                (this._mediaObject.fmtp = []),
                this._planB || (this._mediaObject.msid = `${p || "-"} ${l}`);
              for (const e of d.codecs) {
                const t = { payload: e.payloadType, codec: c(e), rate: e.clockRate };
                e.channels > 1 && (t.encoding = e.channels), this._mediaObject.rtp.push(t);
                const r = { payload: e.payloadType, config: "" };
                for (const t of Object.keys(e.parameters))
                  r.config && (r.config += ";"), (r.config += `${t}=${e.parameters[t]}`);
                r.config && this._mediaObject.fmtp.push(r);
                for (const t of e.rtcpFeedback)
                  this._mediaObject.rtcpFb.push({
                    payload: e.payloadType,
                    type: t.type,
                    subtype: t.parameter,
                  });
              }
              (this._mediaObject.payloads = d.codecs.map((e) => e.payloadType).join(" ")),
                (this._mediaObject.ext = []);
              for (const e of d.headerExtensions)
                this._mediaObject.ext.push({ uri: e.uri, value: e.id });
              (this._mediaObject.rtcpMux = "rtcp-mux"),
                (this._mediaObject.rtcpRsize = "rtcp-rsize");
              const e = d.encodings[0],
                t = e.ssrc,
                r = e.rtx && e.rtx.ssrc ? e.rtx.ssrc : void 0;
              (this._mediaObject.ssrcs = []),
                (this._mediaObject.ssrcGroups = []),
                d.rtcp.cname &&
                  this._mediaObject.ssrcs.push({ id: t, attribute: "cname", value: d.rtcp.cname }),
                this._planB &&
                  this._mediaObject.ssrcs.push({
                    id: t,
                    attribute: "msid",
                    value: `${p || "-"} ${l}`,
                  }),
                r &&
                  (d.rtcp.cname &&
                    this._mediaObject.ssrcs.push({
                      id: r,
                      attribute: "cname",
                      value: d.rtcp.cname,
                    }),
                  this._planB &&
                    this._mediaObject.ssrcs.push({
                      id: r,
                      attribute: "msid",
                      value: `${p || "-"} ${l}`,
                    }),
                  this._mediaObject.ssrcGroups.push({ semantics: "FID", ssrcs: `${t} ${r}` }));
              break;
            }
            case "application":
              u
                ? ((this._mediaObject.payloads = s.port),
                  (this._mediaObject.sctpmap = {
                    app: "webrtc-datachannel",
                    sctpmapNumber: s.port,
                    maxMessageSize: s.maxMessageSize,
                  }))
                : ((this._mediaObject.payloads = "webrtc-datachannel"),
                  (this._mediaObject.sctpPort = s.port),
                  (this._mediaObject.maxMessageSize = s.maxMessageSize));
          }
        }
      };
    }),
    i.register("at4BN", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.parse = void 0);
      const r = new RegExp("^[LS]([1-9]\\d{0,1})T([1-9]\\d{0,1})");
      e.exports.parse = function (e) {
        const t = r.exec(e || "");
        return t
          ? { spatialLayers: Number(t[1]), temporalLayers: Number(t[2]) }
          : { spatialLayers: 1, temporalLayers: 1 };
      };
    }),
    i.register("8AwsK", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Chrome70 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("kEMFf")),
        l = a(i("cIoIc"));
      var u = i("jO0hf"),
        h = i("bYqSi"),
        m = i("at4BN");
      const f = new o.Logger("Chrome70"),
        g = { OS: 1024, MIS: 1024 };
      class _ extends u.HandlerInterface {
        static createFactory() {
          return () => new _();
        }
        get name() {
          return "Chrome70";
        }
        close() {
          if ((f.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          f.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "unified-plan",
          });
          try {
            e.addTransceiver("audio"), e.addTransceiver("video");
            const t = await e.createOffer();
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return p.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return f.debug("getNativeSctpCapabilities()"), { numStreams: g };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: p,
        }) {
          f.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new h.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
            })),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", p),
              video: d.getSendingRtpParameters("video", p),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: d.getSendingRemoteRtpParameters("audio", p),
              video: d.getSendingRemoteRtpParameters("video", p),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                  sdpSemantics: "unified-plan",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          f.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (f.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              f.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              f.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(), f.debug("send() [kind:%s, track.id:%s]", e.kind, e.id);
          const i = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          i.codecs = d.reduceCodecs(i.codecs, s);
          const a = c.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          a.codecs = d.reduceCodecs(a.codecs, s);
          const o = this._remoteSdp.getNextMediaSectionIdx(),
            u = this._pc.addTransceiver(e, { direction: "sendonly", streams: [this._sendStream] });
          let h,
            g = await this._pc.createOffer(),
            _ = n.parse(g.sdp);
          this._transportReady ||
            (await this._setupTransport({ localDtlsRole: "server", localSdpObject: _ })),
            t &&
              t.length > 1 &&
              (f.debug("send() | enabling legacy simulcast"),
              (_ = n.parse(g.sdp)),
              (h = _.media[o.idx]),
              l.addLegacySimulcast({ offerMediaObject: h, numStreams: t.length }),
              (g = { type: "offer", sdp: n.write(_) }));
          let v = !1;
          const b = m.parse((t || [{}])[0].scalabilityMode);
          if (
            (t &&
              1 === t.length &&
              b.spatialLayers > 1 &&
              "video/vp9" === i.codecs[0].mimeType.toLowerCase() &&
              (f.debug("send() | enabling legacy simulcast for VP9 SVC"),
              (v = !0),
              (_ = n.parse(g.sdp)),
              (h = _.media[o.idx]),
              l.addLegacySimulcast({ offerMediaObject: h, numStreams: b.spatialLayers }),
              (g = { type: "offer", sdp: n.write(_) })),
            f.debug("send() | calling pc.setLocalDescription() [offer:%o]", g),
            await this._pc.setLocalDescription(g),
            t)
          ) {
            f.debug("send() | applying given encodings");
            const e = u.sender.getParameters();
            for (let r = 0; r < (e.encodings || []).length; ++r) {
              const s = e.encodings[r],
                i = t[r];
              if (!i) break;
              e.encodings[r] = Object.assign(s, i);
            }
            await u.sender.setParameters(e);
          }
          const y = u.mid;
          if (
            ((i.mid = y),
            (_ = n.parse(this._pc.localDescription.sdp)),
            (h = _.media[o.idx]),
            (i.rtcp.cname = p.getCname({ offerMediaObject: h })),
            (i.encodings = l.getRtpEncodings({ offerMediaObject: h })),
            t)
          )
            for (let e = 0; e < i.encodings.length; ++e)
              t[e] && Object.assign(i.encodings[e], t[e]);
          if (
            (v && (i.encodings = [i.encodings[0]]),
            i.encodings.length > 1 &&
              ("video/vp8" === i.codecs[0].mimeType.toLowerCase() ||
                "video/h264" === i.codecs[0].mimeType.toLowerCase()))
          )
            for (const e of i.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: h,
            reuseMid: o.reuseMid,
            offerRtpParameters: i,
            answerRtpParameters: a,
            codecOptions: r,
          });
          const w = { type: "answer", sdp: this._remoteSdp.getSdp() };
          return (
            f.debug("send() | calling pc.setRemoteDescription() [answer:%o]", w),
            await this._pc.setRemoteDescription(w),
            this._mapMidTransceiver.set(y, u),
            { localId: y, rtpParameters: i, rtpSender: u.sender }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), f.debug("stopSending() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.sender.replaceTrack(null),
            this._pc.removeTrack(t.sender),
            this._remoteSdp.closeMediaSection(t.mid);
          const r = await this._pc.createOffer();
          f.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r),
            await this._pc.setLocalDescription(r);
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? f.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : f.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          await r.sender.replaceTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            f.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.sender.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            f.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.sender.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.sender.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmitTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          f.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % g.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              f.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            f.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), f.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = r.mid || String(this._mapMidTransceiver.size);
          this._remoteSdp.receive({
            mid: s,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const i = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", i),
            await this._pc.setRemoteDescription(i);
          let a = await this._pc.createAnswer();
          const o = n.parse(a.sdp),
            c = o.media.find((e) => String(e.mid) === s);
          p.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: c }),
            (a = { type: "answer", sdp: n.write(o) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: o })),
            f.debug("receive() | calling pc.setLocalDescription() [answer:%o]", a),
            await this._pc.setLocalDescription(a);
          const d = this._pc.getTransceivers().find((e) => e.mid === s);
          if (!d) throw new Error("new RTCRtpTransceiver not found");
          return (
            this._mapMidTransceiver.set(s, d),
            { localId: s, track: d.receiver.track, rtpReceiver: d.receiver }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), f.debug("stopReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          this._remoteSdp.closeMediaSection(t.mid);
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.receiver.getStats();
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmitTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          f.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation();
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = p.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._mapMidTransceiver = new Map()),
            (this._sendStream = new MediaStream()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Chrome70 = _;
    }),
    i.register("gK4f7", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Chrome67 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("kEMFf")),
        l = a(i("6vFw9"));
      var u = i("jO0hf"),
        h = i("bYqSi");
      const m = new o.Logger("Chrome67"),
        f = { OS: 1024, MIS: 1024 };
      class g extends u.HandlerInterface {
        static createFactory() {
          return () => new g();
        }
        get name() {
          return "Chrome67";
        }
        close() {
          if ((m.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          m.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "plan-b",
          });
          try {
            const t = await e.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return p.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return m.debug("getNativeSctpCapabilities()"), { numStreams: f };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: p,
        }) {
          m.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new h.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              planB: !0,
            })),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", p),
              video: d.getSendingRtpParameters("video", p),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: d.getSendingRemoteRtpParameters("audio", p),
              video: d.getSendingRemoteRtpParameters("video", p),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                  sdpSemantics: "plan-b",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          m.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (m.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              m.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              m.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            m.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            s && m.warn("send() | codec selection is not available in %s handler", this.name),
            this._sendStream.addTrack(e),
            this._pc.addTrack(e, this._sendStream);
          let i,
            a = await this._pc.createOffer(),
            o = n.parse(a.sdp);
          const u = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          u.codecs = d.reduceCodecs(u.codecs);
          const h = c.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          if (
            ((h.codecs = d.reduceCodecs(h.codecs)),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: o })),
            "video" === e.kind &&
              t &&
              t.length > 1 &&
              (m.debug("send() | enabling simulcast"),
              (o = n.parse(a.sdp)),
              (i = o.media.find((e) => "video" === e.type)),
              l.addLegacySimulcast({ offerMediaObject: i, track: e, numStreams: t.length }),
              (a = { type: "offer", sdp: n.write(o) })),
            m.debug("send() | calling pc.setLocalDescription() [offer:%o]", a),
            await this._pc.setLocalDescription(a),
            (o = n.parse(this._pc.localDescription.sdp)),
            (i = o.media.find((t) => t.type === e.kind)),
            (u.rtcp.cname = p.getCname({ offerMediaObject: i })),
            (u.encodings = l.getRtpEncodings({ offerMediaObject: i, track: e })),
            t)
          )
            for (let e = 0; e < u.encodings.length; ++e)
              t[e] && Object.assign(u.encodings[e], t[e]);
          if (u.encodings.length > 1 && "video/vp8" === u.codecs[0].mimeType.toLowerCase())
            for (const e of u.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: i,
            offerRtpParameters: u,
            answerRtpParameters: h,
            codecOptions: r,
          });
          const f = { type: "answer", sdp: this._remoteSdp.getSdp() };
          m.debug("send() | calling pc.setRemoteDescription() [answer:%o]", f),
            await this._pc.setRemoteDescription(f);
          const g = String(this._nextSendLocalId);
          this._nextSendLocalId++;
          const _ = this._pc.getSenders().find((t) => t.track === e);
          return (
            this._mapSendLocalIdRtpSender.set(g, _), { localId: g, rtpParameters: u, rtpSender: _ }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), m.debug("stopSending() [localId:%s]", e);
          const t = this._mapSendLocalIdRtpSender.get(e);
          if (!t) throw new Error("associated RTCRtpSender not found");
          this._pc.removeTrack(t),
            t.track && this._sendStream.removeTrack(t.track),
            this._mapSendLocalIdRtpSender.delete(e);
          const r = await this._pc.createOffer();
          m.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r);
          try {
            await this._pc.setLocalDescription(r);
          } catch (e) {
            if (0 === this._sendStream.getTracks().length)
              return void m.warn(
                "stopSending() | ignoring expected error due no sending tracks: %s",
                e.toString()
              );
            throw e;
          }
          if ("stable" === this._pc.signalingState) return;
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? m.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : m.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.track;
          await r.replaceTrack(t),
            s && this._sendStream.removeTrack(s),
            t && this._sendStream.addTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            m.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            m.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapSendLocalIdRtpSender.get(e);
          if (!t) throw new Error("associated RTCRtpSender not found");
          return t.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmitTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          m.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % f.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              m.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            m.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), m.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = e,
            i = t;
          this._remoteSdp.receive({
            mid: i,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const a = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", a),
            await this._pc.setRemoteDescription(a);
          let o = await this._pc.createAnswer();
          const c = n.parse(o.sdp),
            d = c.media.find((e) => String(e.mid) === i);
          p.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: d }),
            (o = { type: "answer", sdp: n.write(c) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: c })),
            m.debug("receive() | calling pc.setLocalDescription() [answer:%o]", o),
            await this._pc.setLocalDescription(o);
          const l = this._pc.getReceivers().find((e) => e.track && e.track.id === s);
          if (!l) throw new Error("new RTCRtpReceiver not");
          return (
            this._mapRecvLocalIdInfo.set(s, { mid: i, rtpParameters: r, rtpReceiver: l }),
            { localId: s, track: l.track, rtpReceiver: l }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), m.debug("stopReceiving() [localId:%s]", e);
          const { mid: t, rtpParameters: r } = this._mapRecvLocalIdInfo.get(e) || {};
          this._mapRecvLocalIdInfo.delete(e),
            this._remoteSdp.planBStopReceiving({ mid: t, offerRtpParameters: r });
          const s = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", s),
            await this._pc.setRemoteDescription(s);
          const i = await this._pc.createAnswer();
          m.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", i),
            await this._pc.setLocalDescription(i);
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const { rtpReceiver: t } = this._mapRecvLocalIdInfo.get(e) || {};
          if (!t) throw new Error("associated RTCRtpReceiver not found");
          return t.getStats();
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmitTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          m.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: !0 });
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = p.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._sendStream = new MediaStream()),
            (this._mapSendLocalIdRtpSender = new Map()),
            (this._nextSendLocalId = 0),
            (this._mapRecvLocalIdInfo = new Map()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Chrome67 = g;
    }),
    i.register("6vFw9", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.addLegacySimulcast = e.exports.getRtpEncodings = void 0),
        (e.exports.getRtpEncodings = function ({ offerMediaObject: e, track: t }) {
          let r;
          const s = new Set();
          for (const i of e.ssrcs || []) {
            if ("msid" !== i.attribute) continue;
            if (i.value.split(" ")[1] === t.id) {
              const e = i.id;
              s.add(e), r || (r = e);
            }
          }
          if (0 === s.size)
            throw new Error(`a=ssrc line with msid information not found [track.id:${t.id}]`);
          const i = new Map();
          for (const t of e.ssrcGroups || []) {
            if ("FID" !== t.semantics) continue;
            let [e, r] = t.ssrcs.split(/\s+/);
            (e = Number(e)), (r = Number(r)), s.has(e) && (s.delete(e), s.delete(r), i.set(e, r));
          }
          for (const e of s) i.set(e, null);
          const a = [];
          for (const [e, t] of i) {
            const r = { ssrc: e };
            t && (r.rtx = { ssrc: t }), a.push(r);
          }
          return a;
        }),
        (e.exports.addLegacySimulcast = function ({
          offerMediaObject: e,
          track: t,
          numStreams: r,
        }) {
          if (r <= 1) throw new TypeError("numStreams must be greater than 1");
          let s, i, a;
          if (
            !(e.ssrcs || []).find((e) => {
              if ("msid" !== e.attribute) return !1;
              return (
                e.value.split(" ")[1] === t.id && ((s = e.id), (a = e.value.split(" ")[0]), !0)
              );
            })
          )
            throw new Error(`a=ssrc line with msid information not found [track.id:${t.id}]`);
          (e.ssrcGroups || []).some((e) => {
            if ("FID" !== e.semantics) return !1;
            const t = e.ssrcs.split(/\s+/);
            return Number(t[0]) === s && ((i = Number(t[1])), !0);
          });
          const n = e.ssrcs.find((e) => "cname" === e.attribute && e.id === s);
          if (!n)
            throw new Error(`a=ssrc line with cname information not found [track.id:${t.id}]`);
          const o = n.value,
            c = [],
            d = [];
          for (let e = 0; e < r; ++e) c.push(s + e), i && d.push(i + e);
          (e.ssrcGroups = e.ssrcGroups || []),
            (e.ssrcs = e.ssrcs || []),
            e.ssrcGroups.push({ semantics: "SIM", ssrcs: c.join(" ") });
          for (let r = 0; r < c.length; ++r) {
            const s = c[r];
            e.ssrcs.push({ id: s, attribute: "cname", value: o }),
              e.ssrcs.push({ id: s, attribute: "msid", value: `${a} ${t.id}` });
          }
          for (let r = 0; r < d.length; ++r) {
            const s = c[r],
              i = d[r];
            e.ssrcs.push({ id: i, attribute: "cname", value: o }),
              e.ssrcs.push({ id: i, attribute: "msid", value: `${a} ${t.id}` }),
              e.ssrcGroups.push({ semantics: "FID", ssrcs: `${s} ${i}` });
          }
        });
    }),
    i.register("01sYR", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Chrome55 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb"),
        c = i("difix");
      const d = a(i("dgn3R")),
        p = a(i("k5BaR")),
        l = a(i("kEMFf")),
        u = a(i("6vFw9"));
      var h = i("jO0hf"),
        m = i("bYqSi");
      const f = new o.Logger("Chrome55"),
        g = { OS: 1024, MIS: 1024 };
      class _ extends h.HandlerInterface {
        static createFactory() {
          return () => new _();
        }
        get name() {
          return "Chrome55";
        }
        close() {
          if ((f.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          f.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "plan-b",
          });
          try {
            const t = await e.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return l.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return f.debug("getNativeSctpCapabilities()"), { numStreams: g };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: d,
        }) {
          f.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new m.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              planB: !0,
            })),
            (this._sendingRtpParametersByKind = {
              audio: p.getSendingRtpParameters("audio", d),
              video: p.getSendingRtpParameters("video", d),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: p.getSendingRemoteRtpParameters("audio", d),
              video: p.getSendingRemoteRtpParameters("video", d),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                  sdpSemantics: "plan-b",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          f.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (f.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              f.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              f.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            f.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            s && f.warn("send() | codec selection is not available in %s handler", this.name),
            this._sendStream.addTrack(e),
            this._pc.addStream(this._sendStream);
          let i,
            a = await this._pc.createOffer(),
            o = n.parse(a.sdp);
          const c = d.clone(this._sendingRtpParametersByKind[e.kind], {});
          c.codecs = p.reduceCodecs(c.codecs);
          const h = d.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          if (
            ((h.codecs = p.reduceCodecs(h.codecs)),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: o })),
            "video" === e.kind &&
              t &&
              t.length > 1 &&
              (f.debug("send() | enabling simulcast"),
              (o = n.parse(a.sdp)),
              (i = o.media.find((e) => "video" === e.type)),
              u.addLegacySimulcast({ offerMediaObject: i, track: e, numStreams: t.length }),
              (a = { type: "offer", sdp: n.write(o) })),
            f.debug("send() | calling pc.setLocalDescription() [offer:%o]", a),
            await this._pc.setLocalDescription(a),
            (o = n.parse(this._pc.localDescription.sdp)),
            (i = o.media.find((t) => t.type === e.kind)),
            (c.rtcp.cname = l.getCname({ offerMediaObject: i })),
            (c.encodings = u.getRtpEncodings({ offerMediaObject: i, track: e })),
            t)
          )
            for (let e = 0; e < c.encodings.length; ++e)
              t[e] && Object.assign(c.encodings[e], t[e]);
          if (c.encodings.length > 1 && "video/vp8" === c.codecs[0].mimeType.toLowerCase())
            for (const e of c.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: i,
            offerRtpParameters: c,
            answerRtpParameters: h,
            codecOptions: r,
          });
          const m = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("send() | calling pc.setRemoteDescription() [answer:%o]", m),
            await this._pc.setRemoteDescription(m);
          const g = String(this._nextSendLocalId);
          return (
            this._nextSendLocalId++,
            this._mapSendLocalIdTrack.set(g, e),
            { localId: g, rtpParameters: c }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), f.debug("stopSending() [localId:%s]", e);
          const t = this._mapSendLocalIdTrack.get(e);
          if (!t) throw new Error("track not found");
          this._mapSendLocalIdTrack.delete(e),
            this._sendStream.removeTrack(t),
            this._pc.addStream(this._sendStream);
          const r = await this._pc.createOffer();
          f.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r);
          try {
            await this._pc.setLocalDescription(r);
          } catch (e) {
            if (0 === this._sendStream.getTracks().length)
              return void f.warn(
                "stopSending() | ignoring expected error due no sending tracks: %s",
                e.toString()
              );
            throw e;
          }
          if ("stable" === this._pc.signalingState) return;
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s);
        }
        async replaceTrack(e, t) {
          throw new c.UnsupportedError("not implemented");
        }
        async setMaxSpatialLayer(e, t) {
          throw new c.UnsupportedError(" not implemented");
        }
        async setRtpEncodingParameters(e, t) {
          throw new c.UnsupportedError("not supported");
        }
        async getSenderStats(e) {
          throw new c.UnsupportedError("not implemented");
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmitTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          f.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % g.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              f.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            f.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), f.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = e,
            i = t,
            a = r.rtcp.cname;
          this._remoteSdp.receive({
            mid: i,
            kind: t,
            offerRtpParameters: r,
            streamId: a,
            trackId: e,
          });
          const o = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", o),
            await this._pc.setRemoteDescription(o);
          let c = await this._pc.createAnswer();
          const d = n.parse(c.sdp),
            p = d.media.find((e) => String(e.mid) === i);
          l.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: p }),
            (c = { type: "answer", sdp: n.write(d) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: d })),
            f.debug("receive() | calling pc.setLocalDescription() [answer:%o]", c),
            await this._pc.setLocalDescription(c);
          const u = this._pc
            .getRemoteStreams()
            .find((e) => e.id === a)
            .getTrackById(s);
          if (!u) throw new Error("remote track not found");
          return (
            this._mapRecvLocalIdInfo.set(s, { mid: i, rtpParameters: r }), { localId: s, track: u }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), f.debug("stopReceiving() [localId:%s]", e);
          const { mid: t, rtpParameters: r } = this._mapRecvLocalIdInfo.get(e) || {};
          this._mapRecvLocalIdInfo.delete(e),
            this._remoteSdp.planBStopReceiving({ mid: t, offerRtpParameters: r });
          const s = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", s),
            await this._pc.setRemoteDescription(s);
          const i = await this._pc.createAnswer();
          f.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", i),
            await this._pc.setLocalDescription(i);
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async getReceiverStats(e) {
          throw new c.UnsupportedError("not implemented");
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmitTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          f.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: !0 });
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = l.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._sendStream = new MediaStream()),
            (this._mapSendLocalIdTrack = new Map()),
            (this._nextSendLocalId = 0),
            (this._mapRecvLocalIdInfo = new Map()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Chrome55 = _;
    }),
    i.register("4GmmQ", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Firefox60 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb"),
        c = i("difix");
      const d = a(i("dgn3R")),
        p = a(i("k5BaR")),
        l = a(i("kEMFf")),
        u = a(i("cIoIc"));
      var h = i("jO0hf"),
        m = i("bYqSi");
      const f = new o.Logger("Firefox60"),
        g = { OS: 16, MIS: 2048 };
      class _ extends h.HandlerInterface {
        static createFactory() {
          return () => new _();
        }
        get name() {
          return "Firefox60";
        }
        close() {
          if ((f.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          f.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
              iceServers: [],
              iceTransportPolicy: "all",
              bundlePolicy: "max-bundle",
              rtcpMuxPolicy: "require",
            }),
            t = document.createElement("canvas");
          t.getContext("2d");
          const r = t.captureStream().getVideoTracks()[0];
          try {
            e.addTransceiver("audio", { direction: "sendrecv" });
            const s = e.addTransceiver(r, { direction: "sendrecv" }),
              i = s.sender.getParameters(),
              a = [
                { rid: "r0", maxBitrate: 1e5 },
                { rid: "r1", maxBitrate: 5e5 },
              ];
            (i.encodings = a), await s.sender.setParameters(i);
            const o = await e.createOffer();
            try {
              t.remove();
            } catch (e) {}
            try {
              r.stop();
            } catch (e) {}
            try {
              e.close();
            } catch (e) {}
            const c = n.parse(o.sdp);
            return l.extractRtpCapabilities({ sdpObject: c });
          } catch (s) {
            try {
              t.remove();
            } catch (e) {}
            try {
              r.stop();
            } catch (e) {}
            try {
              e.close();
            } catch (e) {}
            throw s;
          }
        }
        async getNativeSctpCapabilities() {
          return f.debug("getNativeSctpCapabilities()"), { numStreams: g };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: d,
        }) {
          f.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new m.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
            })),
            (this._sendingRtpParametersByKind = {
              audio: p.getSendingRtpParameters("audio", d),
              video: p.getSendingRtpParameters("video", d),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: p.getSendingRemoteRtpParameters("audio", d),
              video: p.getSendingRemoteRtpParameters("video", d),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          throw new c.UnsupportedError("not supported");
        }
        async restartIce(e) {
          if (
            (f.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              f.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              f.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            f.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            t &&
              (t = d.clone(t, [])).length > 1 &&
              (t.forEach((e, t) => {
                e.rid = `r${t}`;
              }),
              t.reverse());
          const i = d.clone(this._sendingRtpParametersByKind[e.kind], {});
          i.codecs = p.reduceCodecs(i.codecs, s);
          const a = d.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          a.codecs = p.reduceCodecs(a.codecs, s);
          const o = this._pc.addTransceiver(e, {
            direction: "sendonly",
            streams: [this._sendStream],
          });
          if (t) {
            const e = o.sender.getParameters();
            (e.encodings = t), await o.sender.setParameters(e);
          }
          const c = await this._pc.createOffer();
          let h = n.parse(c.sdp);
          this._transportReady ||
            (await this._setupTransport({ localDtlsRole: "client", localSdpObject: h })),
            f.debug("send() | calling pc.setLocalDescription() [offer:%o]", c),
            await this._pc.setLocalDescription(c);
          const m = o.mid;
          (i.mid = m), (h = n.parse(this._pc.localDescription.sdp));
          const g = h.media[h.media.length - 1];
          if (((i.rtcp.cname = l.getCname({ offerMediaObject: g })), t))
            if (1 === t.length) {
              const e = u.getRtpEncodings({ offerMediaObject: g });
              Object.assign(e[0], t[0]), (i.encodings = e);
            } else i.encodings = t.reverse();
          else i.encodings = u.getRtpEncodings({ offerMediaObject: g });
          if (
            i.encodings.length > 1 &&
            ("video/vp8" === i.codecs[0].mimeType.toLowerCase() ||
              "video/h264" === i.codecs[0].mimeType.toLowerCase())
          )
            for (const e of i.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: g,
            offerRtpParameters: i,
            answerRtpParameters: a,
            codecOptions: r,
            extmapAllowMixed: !0,
          });
          const _ = { type: "answer", sdp: this._remoteSdp.getSdp() };
          return (
            f.debug("send() | calling pc.setRemoteDescription() [answer:%o]", _),
            await this._pc.setRemoteDescription(_),
            this._mapMidTransceiver.set(m, o),
            { localId: m, rtpParameters: i, rtpSender: o.sender }
          );
        }
        async stopSending(e) {
          f.debug("stopSending() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated transceiver not found");
          t.sender.replaceTrack(null),
            this._pc.removeTrack(t.sender),
            this._remoteSdp.disableMediaSection(t.mid);
          const r = await this._pc.createOffer();
          f.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r),
            await this._pc.setLocalDescription(r);
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? f.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : f.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          await r.sender.replaceTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            f.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated transceiver not found");
          const s = r.sender.getParameters();
          (t = s.encodings.length - 1 - t),
            s.encodings.forEach((e, r) => {
              e.active = r >= t;
            }),
            await r.sender.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            f.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.sender.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.sender.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          f.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % g.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              f.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            f.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), f.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = r.mid || String(this._mapMidTransceiver.size);
          this._remoteSdp.receive({
            mid: s,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const i = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", i),
            await this._pc.setRemoteDescription(i);
          let a = await this._pc.createAnswer();
          const o = n.parse(a.sdp),
            c = o.media.find((e) => String(e.mid) === s);
          l.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: c }),
            (a = { type: "answer", sdp: n.write(o) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: o })),
            f.debug("receive() | calling pc.setLocalDescription() [answer:%o]", a),
            await this._pc.setLocalDescription(a);
          const d = this._pc.getTransceivers().find((e) => e.mid === s);
          if (!d) throw new Error("new RTCRtpTransceiver not found");
          return (
            this._mapMidTransceiver.set(s, d),
            { localId: s, track: d.receiver.track, rtpReceiver: d.receiver }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), f.debug("stopReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          this._remoteSdp.closeMediaSection(t.mid);
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async pauseReceiving(e) {
          this._assertRecvDirection(), f.debug("pauseReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "inactive";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("pauseReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async resumeReceiving(e) {
          this._assertRecvDirection(), f.debug("resumeReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "recvonly";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          f.debug("resumeReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.receiver.getStats();
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          f.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation();
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = l.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._mapMidTransceiver = new Map()),
            (this._sendStream = new MediaStream()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Firefox60 = _;
    }),
    i.register("9vwLt", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Safari12 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("kEMFf")),
        l = a(i("cIoIc"));
      var u = i("jO0hf"),
        h = i("bYqSi");
      const m = new o.Logger("Safari12"),
        f = { OS: 1024, MIS: 1024 };
      class g extends u.HandlerInterface {
        static createFactory() {
          return () => new g();
        }
        get name() {
          return "Safari12";
        }
        close() {
          if ((m.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          m.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
          });
          try {
            e.addTransceiver("audio"), e.addTransceiver("video");
            const t = await e.createOffer();
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return p.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return m.debug("getNativeSctpCapabilities()"), { numStreams: f };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: p,
        }) {
          m.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new h.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
            })),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", p),
              video: d.getSendingRtpParameters("video", p),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: d.getSendingRemoteRtpParameters("audio", p),
              video: d.getSendingRemoteRtpParameters("video", p),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          m.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (m.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              m.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              m.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(), m.debug("send() [kind:%s, track.id:%s]", e.kind, e.id);
          const i = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          i.codecs = d.reduceCodecs(i.codecs, s);
          const a = c.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          a.codecs = d.reduceCodecs(a.codecs, s);
          const o = this._remoteSdp.getNextMediaSectionIdx(),
            u = this._pc.addTransceiver(e, { direction: "sendonly", streams: [this._sendStream] });
          let h,
            f = await this._pc.createOffer(),
            g = n.parse(f.sdp);
          this._transportReady ||
            (await this._setupTransport({ localDtlsRole: "server", localSdpObject: g })),
            t &&
              t.length > 1 &&
              (m.debug("send() | enabling legacy simulcast"),
              (g = n.parse(f.sdp)),
              (h = g.media[o.idx]),
              l.addLegacySimulcast({ offerMediaObject: h, numStreams: t.length }),
              (f = { type: "offer", sdp: n.write(g) })),
            m.debug("send() | calling pc.setLocalDescription() [offer:%o]", f),
            await this._pc.setLocalDescription(f);
          const _ = u.mid;
          if (
            ((i.mid = _),
            (g = n.parse(this._pc.localDescription.sdp)),
            (h = g.media[o.idx]),
            (i.rtcp.cname = p.getCname({ offerMediaObject: h })),
            (i.encodings = l.getRtpEncodings({ offerMediaObject: h })),
            t)
          )
            for (let e = 0; e < i.encodings.length; ++e)
              t[e] && Object.assign(i.encodings[e], t[e]);
          if (
            i.encodings.length > 1 &&
            ("video/vp8" === i.codecs[0].mimeType.toLowerCase() ||
              "video/h264" === i.codecs[0].mimeType.toLowerCase())
          )
            for (const e of i.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: h,
            reuseMid: o.reuseMid,
            offerRtpParameters: i,
            answerRtpParameters: a,
            codecOptions: r,
          });
          const v = { type: "answer", sdp: this._remoteSdp.getSdp() };
          return (
            m.debug("send() | calling pc.setRemoteDescription() [answer:%o]", v),
            await this._pc.setRemoteDescription(v),
            this._mapMidTransceiver.set(_, u),
            { localId: _, rtpParameters: i, rtpSender: u.sender }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), m.debug("stopSending() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.sender.replaceTrack(null),
            this._pc.removeTrack(t.sender),
            this._remoteSdp.closeMediaSection(t.mid);
          const r = await this._pc.createOffer();
          m.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r),
            await this._pc.setLocalDescription(r);
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? m.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : m.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          await r.sender.replaceTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            m.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.sender.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            m.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapMidTransceiver.get(e);
          if (!r) throw new Error("associated RTCRtpTransceiver not found");
          const s = r.sender.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.sender.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.sender.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          m.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % f.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              m.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            m.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), m.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = r.mid || String(this._mapMidTransceiver.size);
          this._remoteSdp.receive({
            mid: s,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const i = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", i),
            await this._pc.setRemoteDescription(i);
          let a = await this._pc.createAnswer();
          const o = n.parse(a.sdp),
            c = o.media.find((e) => String(e.mid) === s);
          p.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: c }),
            (a = { type: "answer", sdp: n.write(o) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: o })),
            m.debug("receive() | calling pc.setLocalDescription() [answer:%o]", a),
            await this._pc.setLocalDescription(a);
          const d = this._pc.getTransceivers().find((e) => e.mid === s);
          if (!d) throw new Error("new RTCRtpTransceiver not found");
          return (
            this._mapMidTransceiver.set(s, d),
            { localId: s, track: d.receiver.track, rtpReceiver: d.receiver }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), m.debug("stopReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          this._remoteSdp.closeMediaSection(t.mid);
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          m.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s),
            this._mapMidTransceiver.delete(e);
        }
        async pauseReceiving(e) {
          this._assertRecvDirection(), m.debug("pauseReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "inactive";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          m.debug("pauseReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async resumeReceiving(e) {
          this._assertRecvDirection(), m.debug("resumeReceiving() [localId:%s]", e);
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          t.direction = "recvonly";
          const r = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]", r),
            await this._pc.setRemoteDescription(r);
          const s = await this._pc.createAnswer();
          m.debug("resumeReceiving() | calling pc.setLocalDescription() [answer:%o]", s),
            await this._pc.setLocalDescription(s);
        }
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const t = this._mapMidTransceiver.get(e);
          if (!t) throw new Error("associated RTCRtpTransceiver not found");
          return t.receiver.getStats();
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          m.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation();
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = p.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._mapMidTransceiver = new Map()),
            (this._sendStream = new MediaStream()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Safari12 = g;
    }),
    i.register("cmHMi", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Safari11 = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("kEMFf")),
        l = a(i("6vFw9"));
      var u = i("jO0hf"),
        h = i("bYqSi");
      const m = new o.Logger("Safari11"),
        f = { OS: 1024, MIS: 1024 };
      class g extends u.HandlerInterface {
        static createFactory() {
          return () => new g();
        }
        get name() {
          return "Safari11";
        }
        close() {
          if ((m.debug("close()"), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          m.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "plan-b",
          });
          try {
            const t = await e.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return p.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return m.debug("getNativeSctpCapabilities()"), { numStreams: f };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: p,
        }) {
          m.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new h.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              planB: !0,
            })),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", p),
              video: d.getSendingRtpParameters("video", p),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: d.getSendingRemoteRtpParameters("audio", p),
              video: d.getSendingRemoteRtpParameters("video", p),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          m.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (m.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              m.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              m.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              m.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            m.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            s && m.warn("send() | codec selection is not available in %s handler", this.name),
            this._sendStream.addTrack(e),
            this._pc.addTrack(e, this._sendStream);
          let i,
            a = await this._pc.createOffer(),
            o = n.parse(a.sdp);
          const u = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          u.codecs = d.reduceCodecs(u.codecs);
          const h = c.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          if (
            ((h.codecs = d.reduceCodecs(h.codecs)),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: o })),
            "video" === e.kind &&
              t &&
              t.length > 1 &&
              (m.debug("send() | enabling simulcast"),
              (o = n.parse(a.sdp)),
              (i = o.media.find((e) => "video" === e.type)),
              l.addLegacySimulcast({ offerMediaObject: i, track: e, numStreams: t.length }),
              (a = { type: "offer", sdp: n.write(o) })),
            m.debug("send() | calling pc.setLocalDescription() [offer:%o]", a),
            await this._pc.setLocalDescription(a),
            (o = n.parse(this._pc.localDescription.sdp)),
            (i = o.media.find((t) => t.type === e.kind)),
            (u.rtcp.cname = p.getCname({ offerMediaObject: i })),
            (u.encodings = l.getRtpEncodings({ offerMediaObject: i, track: e })),
            t)
          )
            for (let e = 0; e < u.encodings.length; ++e)
              t[e] && Object.assign(u.encodings[e], t[e]);
          if (u.encodings.length > 1 && "video/vp8" === u.codecs[0].mimeType.toLowerCase())
            for (const e of u.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: i,
            offerRtpParameters: u,
            answerRtpParameters: h,
            codecOptions: r,
          });
          const f = { type: "answer", sdp: this._remoteSdp.getSdp() };
          m.debug("send() | calling pc.setRemoteDescription() [answer:%o]", f),
            await this._pc.setRemoteDescription(f);
          const g = String(this._nextSendLocalId);
          this._nextSendLocalId++;
          const _ = this._pc.getSenders().find((t) => t.track === e);
          return (
            this._mapSendLocalIdRtpSender.set(g, _), { localId: g, rtpParameters: u, rtpSender: _ }
          );
        }
        async stopSending(e) {
          this._assertSendDirection();
          const t = this._mapSendLocalIdRtpSender.get(e);
          if (!t) throw new Error("associated RTCRtpSender not found");
          t.track && this._sendStream.removeTrack(t.track), this._mapSendLocalIdRtpSender.delete(e);
          const r = await this._pc.createOffer();
          m.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r);
          try {
            await this._pc.setLocalDescription(r);
          } catch (e) {
            if (0 === this._sendStream.getTracks().length)
              return void m.warn(
                "stopSending() | ignoring expected error due no sending tracks: %s",
                e.toString()
              );
            throw e;
          }
          if ("stable" === this._pc.signalingState) return;
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s);
        }
        async replaceTrack(e, t) {
          this._assertSendDirection(),
            t
              ? m.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
              : m.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.track;
          await r.replaceTrack(t),
            s && this._sendStream.removeTrack(s),
            t && this._sendStream.addTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          this._assertSendDirection(),
            m.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          this._assertSendDirection(),
            m.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._mapSendLocalIdRtpSender.get(e);
          if (!r) throw new Error("associated RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.setParameters(s);
        }
        async getSenderStats(e) {
          this._assertSendDirection();
          const t = this._mapSendLocalIdRtpSender.get(e);
          if (!t) throw new Error("associated RTCRtpSender not found");
          return t.getStats();
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          m.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % f.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              m.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            m.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), m.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = e,
            i = t;
          this._remoteSdp.receive({
            mid: i,
            kind: t,
            offerRtpParameters: r,
            streamId: r.rtcp.cname,
            trackId: e,
          });
          const a = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", a),
            await this._pc.setRemoteDescription(a);
          let o = await this._pc.createAnswer();
          const c = n.parse(o.sdp),
            d = c.media.find((e) => String(e.mid) === i);
          p.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: d }),
            (o = { type: "answer", sdp: n.write(c) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: c })),
            m.debug("receive() | calling pc.setLocalDescription() [answer:%o]", o),
            await this._pc.setLocalDescription(o);
          const l = this._pc.getReceivers().find((e) => e.track && e.track.id === s);
          if (!l) throw new Error("new RTCRtpReceiver not");
          return (
            this._mapRecvLocalIdInfo.set(s, { mid: i, rtpParameters: r, rtpReceiver: l }),
            { localId: s, track: l.track, rtpReceiver: l }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), m.debug("stopReceiving() [localId:%s]", e);
          const { mid: t, rtpParameters: r } = this._mapRecvLocalIdInfo.get(e) || {};
          this._mapRecvLocalIdInfo.delete(e),
            this._remoteSdp.planBStopReceiving({ mid: t, offerRtpParameters: r });
          const s = { type: "offer", sdp: this._remoteSdp.getSdp() };
          m.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", s),
            await this._pc.setRemoteDescription(s);
          const i = await this._pc.createAnswer();
          m.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", i),
            await this._pc.setLocalDescription(i);
        }
        async getReceiverStats(e) {
          this._assertRecvDirection();
          const { rtpReceiver: t } = this._mapRecvLocalIdInfo.get(e) || {};
          if (!t) throw new Error("associated RTCRtpReceiver not found");
          return t.getStats();
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          m.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: !0 });
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            m.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = p.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._sendStream = new MediaStream()),
            (this._mapSendLocalIdRtpSender = new Map()),
            (this._nextSendLocalId = 0),
            (this._mapRecvLocalIdInfo = new Map()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Safari11 = g;
    }),
    i.register("8GXS8", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }), (e.exports.Edge11 = void 0);
      var n = i("6pHSb"),
        o = i("difix");
      const c = a(i("dgn3R")),
        d = a(i("k5BaR")),
        p = a(i("6wXV4"));
      var l = i("jO0hf");
      const u = new n.Logger("Edge11");
      class h extends l.HandlerInterface {
        static createFactory() {
          return () => new h();
        }
        get name() {
          return "Edge11";
        }
        close() {
          u.debug("close()");
          try {
            this._iceGatherer.close();
          } catch (e) {}
          try {
            this._iceTransport.stop();
          } catch (e) {}
          try {
            this._dtlsTransport.stop();
          } catch (e) {}
          for (const e of this._rtpSenders.values())
            try {
              e.stop();
            } catch (e) {}
          for (const e of this._rtpReceivers.values())
            try {
              e.stop();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          return u.debug("getNativeRtpCapabilities()"), p.getCapabilities();
        }
        async getNativeSctpCapabilities() {
          return u.debug("getNativeSctpCapabilities()"), { numStreams: { OS: 0, MIS: 0 } };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: p,
          extendedRtpCapabilities: l,
        }) {
          u.debug("run()"),
            (this._sendingRtpParametersByKind = {
              audio: d.getSendingRtpParameters("audio", l),
              video: d.getSendingRtpParameters("video", l),
            }),
            (this._remoteIceParameters = t),
            (this._remoteIceCandidates = r),
            (this._remoteDtlsParameters = s),
            (this._cname = `CNAME-${c.generateRandomNumber()}`),
            this._setIceGatherer({ iceServers: a, iceTransportPolicy: n }),
            this._setIceTransport(),
            this._setDtlsTransport();
        }
        async updateIceServers(e) {
          throw new o.UnsupportedError("not supported");
        }
        async restartIce(e) {
          if ((u.debug("restartIce()"), (this._remoteIceParameters = e), this._transportReady)) {
            u.debug("restartIce() | calling iceTransport.start()"),
              this._iceTransport.start(this._iceGatherer, e, "controlling");
            for (const e of this._remoteIceCandidates) this._iceTransport.addRemoteCandidate(e);
            this._iceTransport.addRemoteCandidate({});
          }
        }
        async getTransportStats() {
          return this._iceTransport.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          u.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            this._transportReady || (await this._setupTransport({ localDtlsRole: "server" })),
            u.debug("send() | calling new RTCRtpSender()");
          const i = new RTCRtpSender(e, this._dtlsTransport),
            a = c.clone(this._sendingRtpParametersByKind[e.kind], {});
          a.codecs = d.reduceCodecs(a.codecs, s);
          const n = a.codecs.some((e) => /.+\/rtx$/i.test(e.mimeType));
          t || (t = [{}]);
          for (const e of t)
            (e.ssrc = c.generateRandomNumber()), n && (e.rtx = { ssrc: c.generateRandomNumber() });
          (a.encodings = t), (a.rtcp = { cname: this._cname, reducedSize: !0, mux: !0 });
          const o = p.mangleRtpParameters(a);
          u.debug("send() | calling rtpSender.send() [params:%o]", o), await i.send(o);
          const l = String(this._nextSendLocalId);
          return (
            this._nextSendLocalId++,
            this._rtpSenders.set(l, i),
            { localId: l, rtpParameters: a, rtpSender: i }
          );
        }
        async stopSending(e) {
          u.debug("stopSending() [localId:%s]", e);
          const t = this._rtpSenders.get(e);
          if (!t) throw new Error("RTCRtpSender not found");
          this._rtpSenders.delete(e);
          try {
            u.debug("stopSending() | calling rtpSender.stop()"), t.stop();
          } catch (e) {
            throw (u.warn("stopSending() | rtpSender.stop() failed:%o", e), e);
          }
        }
        async replaceTrack(e, t) {
          t
            ? u.debug("replaceTrack() [localId:%s, track.id:%s]", e, t.id)
            : u.debug("replaceTrack() [localId:%s, no track]", e);
          const r = this._rtpSenders.get(e);
          if (!r) throw new Error("RTCRtpSender not found");
          r.setTrack(t);
        }
        async setMaxSpatialLayer(e, t) {
          u.debug("setMaxSpatialLayer() [localId:%s, spatialLayer:%s]", e, t);
          const r = this._rtpSenders.get(e);
          if (!r) throw new Error("RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            e.active = r <= t;
          }),
            await r.setParameters(s);
        }
        async setRtpEncodingParameters(e, t) {
          u.debug("setRtpEncodingParameters() [localId:%s, params:%o]", e, t);
          const r = this._rtpSenders.get(e);
          if (!r) throw new Error("RTCRtpSender not found");
          const s = r.getParameters();
          s.encodings.forEach((e, r) => {
            s.encodings[r] = Object.assign(Object.assign({}, e), t);
          }),
            await r.setParameters(s);
        }
        async getSenderStats(e) {
          const t = this._rtpSenders.get(e);
          if (!t) throw new Error("RTCRtpSender not found");
          return t.getStats();
        }
        async sendDataChannel(e) {
          throw new o.UnsupportedError("not implemented");
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          u.debug("receive() [trackId:%s, kind:%s]", e, t),
            this._transportReady || (await this._setupTransport({ localDtlsRole: "server" })),
            u.debug("receive() | calling new RTCRtpReceiver()");
          const s = new RTCRtpReceiver(this._dtlsTransport, t);
          s.addEventListener("error", (e) => {
            u.error('rtpReceiver "error" event [event:%o]', e);
          });
          const i = p.mangleRtpParameters(r);
          u.debug("receive() | calling rtpReceiver.receive() [params:%o]", i), await s.receive(i);
          const a = e;
          return this._rtpReceivers.set(a, s), { localId: a, track: s.track, rtpReceiver: s };
        }
        async stopReceiving(e) {
          u.debug("stopReceiving() [localId:%s]", e);
          const t = this._rtpReceivers.get(e);
          if (!t) throw new Error("RTCRtpReceiver not found");
          this._rtpReceivers.delete(e);
          try {
            u.debug("stopReceiving() | calling rtpReceiver.stop()"), t.stop();
          } catch (e) {
            u.warn("stopReceiving() | rtpReceiver.stop() failed:%o", e);
          }
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async getReceiverStats(e) {
          const t = this._rtpReceivers.get(e);
          if (!t) throw new Error("RTCRtpReceiver not found");
          return t.getStats();
        }
        async receiveDataChannel(e) {
          throw new o.UnsupportedError("not implemented");
        }
        _setIceGatherer({ iceServers: e, iceTransportPolicy: t }) {
          const r = new RTCIceGatherer({ iceServers: e || [], gatherPolicy: t || "all" });
          r.addEventListener("error", (e) => {
            u.error('iceGatherer "error" event [event:%o]', e);
          });
          try {
            r.gather();
          } catch (e) {
            u.debug("_setIceGatherer() | iceGatherer.gather() failed: %s", e.toString());
          }
          this._iceGatherer = r;
        }
        _setIceTransport() {
          const e = new RTCIceTransport(this._iceGatherer);
          e.addEventListener("statechange", () => {
            switch (e.state) {
              case "checking":
                this.emit("@connectionstatechange", "connecting");
                break;
              case "connected":
              case "completed":
                this.emit("@connectionstatechange", "connected");
                break;
              case "failed":
                this.emit("@connectionstatechange", "failed");
                break;
              case "disconnected":
                this.emit("@connectionstatechange", "disconnected");
                break;
              case "closed":
                this.emit("@connectionstatechange", "closed");
            }
          }),
            e.addEventListener("icestatechange", () => {
              switch (e.state) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            }),
            e.addEventListener("candidatepairchange", (e) => {
              u.debug('iceTransport "candidatepairchange" event [pair:%o]', e.pair);
            }),
            (this._iceTransport = e);
        }
        _setDtlsTransport() {
          const e = new RTCDtlsTransport(this._iceTransport);
          e.addEventListener("statechange", () => {
            u.debug('dtlsTransport "statechange" event [state:%s]', e.state);
          }),
            e.addEventListener("dtlsstatechange", () => {
              u.debug('dtlsTransport "dtlsstatechange" event [state:%s]', e.state),
                "closed" === e.state && this.emit("@connectionstatechange", "closed");
            }),
            e.addEventListener("error", (e) => {
              u.error('dtlsTransport "error" event [event:%o]', e);
            }),
            (this._dtlsTransport = e);
        }
        async _setupTransport({ localDtlsRole: e }) {
          u.debug("_setupTransport()");
          const t = this._dtlsTransport.getLocalParameters();
          (t.role = e),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: t }),
            this._iceTransport.start(this._iceGatherer, this._remoteIceParameters, "controlling");
          for (const e of this._remoteIceCandidates) this._iceTransport.addRemoteCandidate(e);
          this._iceTransport.addRemoteCandidate({}),
            (this._remoteDtlsParameters.fingerprints =
              this._remoteDtlsParameters.fingerprints.filter(
                (e) =>
                  "sha-256" === e.algorithm ||
                  "sha-384" === e.algorithm ||
                  "sha-512" === e.algorithm
              )),
            this._dtlsTransport.start(this._remoteDtlsParameters),
            (this._transportReady = !0);
        }
        constructor() {
          super(),
            (this._rtpSenders = new Map()),
            (this._rtpReceivers = new Map()),
            (this._nextSendLocalId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.Edge11 = h;
    }),
    i.register("6wXV4", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.mangleRtpParameters = e.exports.getCapabilities = void 0);
      const n = a(i("dgn3R"));
      (e.exports.getCapabilities = function () {
        const e = RTCRtpReceiver.getCapabilities(),
          t = n.clone(e, {});
        for (const e of t.codecs) {
          if (
            ((e.channels = e.numChannels),
            delete e.numChannels,
            (e.mimeType = e.mimeType || `${e.kind}/${e.name}`),
            e.parameters)
          ) {
            const t = e.parameters;
            t.apt && (t.apt = Number(t.apt)),
              t["packetization-mode"] &&
                (t["packetization-mode"] = Number(t["packetization-mode"]));
          }
          for (const t of e.rtcpFeedback || []) t.parameter || (t.parameter = "");
        }
        return t;
      }),
        (e.exports.mangleRtpParameters = function (e) {
          const t = n.clone(e, {});
          t.mid && ((t.muxId = t.mid), delete t.mid);
          for (const e of t.codecs)
            e.channels && ((e.numChannels = e.channels), delete e.channels),
              e.mimeType && !e.name && (e.name = e.mimeType.split("/")[1]),
              delete e.mimeType;
          return t;
        });
    }),
    i.register("in3Qs", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__setModuleDefault) ||
          (Object.create
            ? function (e, t) {
                Object.defineProperty(e, "default", { enumerable: !0, value: t });
              }
            : function (e, t) {
                e.default = t;
              }),
        a =
          (e.exports && e.exports.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var i in e) "default" !== i && Object.hasOwnProperty.call(e, i) && r(t, e, i);
            return s(t, e), t;
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        (e.exports.ReactNative = void 0);
      const n = a(i("xeSFI"));
      var o = i("6pHSb"),
        c = i("difix");
      const d = a(i("dgn3R")),
        p = a(i("k5BaR")),
        l = a(i("kEMFf")),
        u = a(i("6vFw9"));
      var h = i("jO0hf"),
        m = i("bYqSi");
      const f = new o.Logger("ReactNative"),
        g = { OS: 1024, MIS: 1024 };
      class _ extends h.HandlerInterface {
        static createFactory() {
          return () => new _();
        }
        get name() {
          return "ReactNative";
        }
        close() {
          if ((f.debug("close()"), this._sendStream.release(!1), this._pc))
            try {
              this._pc.close();
            } catch (e) {}
        }
        async getNativeRtpCapabilities() {
          f.debug("getNativeRtpCapabilities()");
          const e = new RTCPeerConnection({
            iceServers: [],
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require",
            sdpSemantics: "plan-b",
          });
          try {
            const t = await e.createOffer({ offerToReceiveAudio: !0, offerToReceiveVideo: !0 });
            try {
              e.close();
            } catch (e) {}
            const r = n.parse(t.sdp);
            return l.extractRtpCapabilities({ sdpObject: r });
          } catch (t) {
            try {
              e.close();
            } catch (e) {}
            throw t;
          }
        }
        async getNativeSctpCapabilities() {
          return f.debug("getNativeSctpCapabilities()"), { numStreams: g };
        }
        run({
          direction: e,
          iceParameters: t,
          iceCandidates: r,
          dtlsParameters: s,
          sctpParameters: i,
          iceServers: a,
          iceTransportPolicy: n,
          additionalSettings: o,
          proprietaryConstraints: c,
          extendedRtpCapabilities: d,
        }) {
          f.debug("run()"),
            (this._direction = e),
            (this._remoteSdp = new m.RemoteSdp({
              iceParameters: t,
              iceCandidates: r,
              dtlsParameters: s,
              sctpParameters: i,
              planB: !0,
            })),
            (this._sendingRtpParametersByKind = {
              audio: p.getSendingRtpParameters("audio", d),
              video: p.getSendingRtpParameters("video", d),
            }),
            (this._sendingRemoteRtpParametersByKind = {
              audio: p.getSendingRemoteRtpParameters("audio", d),
              video: p.getSendingRemoteRtpParameters("video", d),
            }),
            (this._pc = new RTCPeerConnection(
              Object.assign(
                {
                  iceServers: a || [],
                  iceTransportPolicy: n || "all",
                  bundlePolicy: "max-bundle",
                  rtcpMuxPolicy: "require",
                  sdpSemantics: "plan-b",
                },
                o
              ),
              c
            )),
            this._pc.addEventListener("iceconnectionstatechange", () => {
              switch (this._pc.iceConnectionState) {
                case "checking":
                  this.emit("@connectionstatechange", "connecting");
                  break;
                case "connected":
                case "completed":
                  this.emit("@connectionstatechange", "connected");
                  break;
                case "failed":
                  this.emit("@connectionstatechange", "failed");
                  break;
                case "disconnected":
                  this.emit("@connectionstatechange", "disconnected");
                  break;
                case "closed":
                  this.emit("@connectionstatechange", "closed");
              }
            });
        }
        async updateIceServers(e) {
          f.debug("updateIceServers()");
          const t = this._pc.getConfiguration();
          (t.iceServers = e), this._pc.setConfiguration(t);
        }
        async restartIce(e) {
          if (
            (f.debug("restartIce()"), this._remoteSdp.updateIceParameters(e), this._transportReady)
          )
            if ("send" === this._direction) {
              const e = await this._pc.createOffer({ iceRestart: !0 });
              f.debug("restartIce() | calling pc.setLocalDescription() [offer:%o]", e),
                await this._pc.setLocalDescription(e);
              const t = { type: "answer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [answer:%o]", t),
                await this._pc.setRemoteDescription(t);
            } else {
              const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
              f.debug("restartIce() | calling pc.setRemoteDescription() [offer:%o]", e),
                await this._pc.setRemoteDescription(e);
              const t = await this._pc.createAnswer();
              f.debug("restartIce() | calling pc.setLocalDescription() [answer:%o]", t),
                await this._pc.setLocalDescription(t);
            }
        }
        async getTransportStats() {
          return this._pc.getStats();
        }
        async send({ track: e, encodings: t, codecOptions: r, codec: s }) {
          this._assertSendDirection(),
            f.debug("send() [kind:%s, track.id:%s]", e.kind, e.id),
            s && f.warn("send() | codec selection is not available in %s handler", this.name),
            this._sendStream.addTrack(e),
            this._pc.addStream(this._sendStream);
          let i,
            a = await this._pc.createOffer(),
            o = n.parse(a.sdp);
          const c = d.clone(this._sendingRtpParametersByKind[e.kind], {});
          c.codecs = p.reduceCodecs(c.codecs);
          const h = d.clone(this._sendingRemoteRtpParametersByKind[e.kind], {});
          if (
            ((h.codecs = p.reduceCodecs(h.codecs)),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: o })),
            "video" === e.kind &&
              t &&
              t.length > 1 &&
              (f.debug("send() | enabling simulcast"),
              (o = n.parse(a.sdp)),
              (i = o.media.find((e) => "video" === e.type)),
              u.addLegacySimulcast({ offerMediaObject: i, track: e, numStreams: t.length }),
              (a = { type: "offer", sdp: n.write(o) })),
            f.debug("send() | calling pc.setLocalDescription() [offer:%o]", a),
            await this._pc.setLocalDescription(a),
            (o = n.parse(this._pc.localDescription.sdp)),
            (i = o.media.find((t) => t.type === e.kind)),
            (c.rtcp.cname = l.getCname({ offerMediaObject: i })),
            (c.encodings = u.getRtpEncodings({ offerMediaObject: i, track: e })),
            t)
          )
            for (let e = 0; e < c.encodings.length; ++e)
              t[e] && Object.assign(c.encodings[e], t[e]);
          if (
            c.encodings.length > 1 &&
            ("video/vp8" === c.codecs[0].mimeType.toLowerCase() ||
              "video/h264" === c.codecs[0].mimeType.toLowerCase())
          )
            for (const e of c.encodings) e.scalabilityMode = "S1T3";
          this._remoteSdp.send({
            offerMediaObject: i,
            offerRtpParameters: c,
            answerRtpParameters: h,
            codecOptions: r,
          });
          const m = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("send() | calling pc.setRemoteDescription() [answer:%o]", m),
            await this._pc.setRemoteDescription(m);
          const g = String(this._nextSendLocalId);
          return (
            this._nextSendLocalId++,
            this._mapSendLocalIdTrack.set(g, e),
            { localId: g, rtpParameters: c }
          );
        }
        async stopSending(e) {
          this._assertSendDirection(), f.debug("stopSending() [localId:%s]", e);
          const t = this._mapSendLocalIdTrack.get(e);
          if (!t) throw new Error("track not found");
          this._mapSendLocalIdTrack.delete(e),
            this._sendStream.removeTrack(t),
            this._pc.addStream(this._sendStream);
          const r = await this._pc.createOffer();
          f.debug("stopSending() | calling pc.setLocalDescription() [offer:%o]", r);
          try {
            await this._pc.setLocalDescription(r);
          } catch (e) {
            if (0 === this._sendStream.getTracks().length)
              return void f.warn(
                "stopSending() | ignoring expected error due no sending tracks: %s",
                e.toString()
              );
            throw e;
          }
          if ("stable" === this._pc.signalingState) return;
          const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopSending() | calling pc.setRemoteDescription() [answer:%o]", s),
            await this._pc.setRemoteDescription(s);
        }
        async replaceTrack(e, t) {
          throw new c.UnsupportedError("not implemented");
        }
        async setMaxSpatialLayer(e, t) {
          throw new c.UnsupportedError("not implemented");
        }
        async setRtpEncodingParameters(e, t) {
          throw new c.UnsupportedError("not implemented");
        }
        async getSenderStats(e) {
          throw new c.UnsupportedError("not implemented");
        }
        async sendDataChannel({
          ordered: e,
          maxPacketLifeTime: t,
          maxRetransmits: r,
          label: s,
          protocol: i,
        }) {
          this._assertSendDirection();
          const a = {
            negotiated: !0,
            id: this._nextSendSctpStreamId,
            ordered: e,
            maxPacketLifeTime: t,
            maxRetransmitTime: t,
            maxRetransmits: r,
            protocol: i,
          };
          f.debug("sendDataChannel() [options:%o]", a);
          const o = this._pc.createDataChannel(s, a);
          if (
            ((this._nextSendSctpStreamId = ++this._nextSendSctpStreamId % g.MIS),
            !this._hasDataChannelMediaSection)
          ) {
            const e = await this._pc.createOffer(),
              t = n.parse(e.sdp),
              r = t.media.find((e) => "application" === e.type);
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "server", localSdpObject: t })),
              f.debug("sendDataChannel() | calling pc.setLocalDescription() [offer:%o]", e),
              await this._pc.setLocalDescription(e),
              this._remoteSdp.sendSctpAssociation({ offerMediaObject: r });
            const s = { type: "answer", sdp: this._remoteSdp.getSdp() };
            f.debug("sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]", s),
              await this._pc.setRemoteDescription(s),
              (this._hasDataChannelMediaSection = !0);
          }
          return {
            dataChannel: o,
            sctpStreamParameters: {
              streamId: a.id,
              ordered: a.ordered,
              maxPacketLifeTime: a.maxPacketLifeTime,
              maxRetransmits: a.maxRetransmits,
            },
          };
        }
        async receive({ trackId: e, kind: t, rtpParameters: r }) {
          this._assertRecvDirection(), f.debug("receive() [trackId:%s, kind:%s]", e, t);
          const s = e,
            i = t;
          let a = r.rtcp.cname;
          f.debug(
            "receive() | forcing a random remote streamId to avoid well known bug in react-native-webrtc"
          ),
            (a += `-hack-${d.generateRandomNumber()}`),
            this._remoteSdp.receive({
              mid: i,
              kind: t,
              offerRtpParameters: r,
              streamId: a,
              trackId: e,
            });
          const o = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("receive() | calling pc.setRemoteDescription() [offer:%o]", o),
            await this._pc.setRemoteDescription(o);
          let c = await this._pc.createAnswer();
          const p = n.parse(c.sdp),
            u = p.media.find((e) => String(e.mid) === i);
          l.applyCodecParameters({ offerRtpParameters: r, answerMediaObject: u }),
            (c = { type: "answer", sdp: n.write(p) }),
            this._transportReady ||
              (await this._setupTransport({ localDtlsRole: "client", localSdpObject: p })),
            f.debug("receive() | calling pc.setLocalDescription() [answer:%o]", c),
            await this._pc.setLocalDescription(c);
          const h = this._pc
            .getRemoteStreams()
            .find((e) => e.id === a)
            .getTrackById(s);
          if (!h) throw new Error("remote track not found");
          return (
            this._mapRecvLocalIdInfo.set(s, { mid: i, rtpParameters: r }), { localId: s, track: h }
          );
        }
        async stopReceiving(e) {
          this._assertRecvDirection(), f.debug("stopReceiving() [localId:%s]", e);
          const { mid: t, rtpParameters: r } = this._mapRecvLocalIdInfo.get(e) || {};
          this._mapRecvLocalIdInfo.delete(e),
            this._remoteSdp.planBStopReceiving({ mid: t, offerRtpParameters: r });
          const s = { type: "offer", sdp: this._remoteSdp.getSdp() };
          f.debug("stopReceiving() | calling pc.setRemoteDescription() [offer:%o]", s),
            await this._pc.setRemoteDescription(s);
          const i = await this._pc.createAnswer();
          f.debug("stopReceiving() | calling pc.setLocalDescription() [answer:%o]", i),
            await this._pc.setLocalDescription(i);
        }
        async pauseReceiving(e) {}
        async resumeReceiving(e) {}
        async getReceiverStats(e) {
          throw new c.UnsupportedError("not implemented");
        }
        async receiveDataChannel({ sctpStreamParameters: e, label: t, protocol: r }) {
          this._assertRecvDirection();
          const { streamId: s, ordered: i, maxPacketLifeTime: a, maxRetransmits: o } = e,
            c = {
              negotiated: !0,
              id: s,
              ordered: i,
              maxPacketLifeTime: a,
              maxRetransmitTime: a,
              maxRetransmits: o,
              protocol: r,
            };
          f.debug("receiveDataChannel() [options:%o]", c);
          const d = this._pc.createDataChannel(t, c);
          if (!this._hasDataChannelMediaSection) {
            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: !0 });
            const e = { type: "offer", sdp: this._remoteSdp.getSdp() };
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]", e),
              await this._pc.setRemoteDescription(e);
            const t = await this._pc.createAnswer();
            if (!this._transportReady) {
              const e = n.parse(t.sdp);
              await this._setupTransport({ localDtlsRole: "client", localSdpObject: e });
            }
            f.debug("receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]", t),
              await this._pc.setLocalDescription(t),
              (this._hasDataChannelMediaSection = !0);
          }
          return { dataChannel: d };
        }
        async _setupTransport({ localDtlsRole: e, localSdpObject: t }) {
          t || (t = n.parse(this._pc.localDescription.sdp));
          const r = l.extractDtlsParameters({ sdpObject: t });
          (r.role = e),
            this._remoteSdp.updateDtlsRole("client" === e ? "server" : "client"),
            await this.safeEmitAsPromise("@connect", { dtlsParameters: r }),
            (this._transportReady = !0);
        }
        _assertSendDirection() {
          if ("send" !== this._direction)
            throw new Error('method can just be called for handlers with "send" direction');
        }
        _assertRecvDirection() {
          if ("recv" !== this._direction)
            throw new Error('method can just be called for handlers with "recv" direction');
        }
        constructor() {
          super(),
            (this._sendStream = new MediaStream()),
            (this._mapSendLocalIdTrack = new Map()),
            (this._nextSendLocalId = 0),
            (this._mapRecvLocalIdInfo = new Map()),
            (this._hasDataChannelMediaSection = !1),
            (this._nextSendSctpStreamId = 0),
            (this._transportReady = !1);
        }
      }
      e.exports.ReactNative = _;
    }),
    i.register("adPEn", function (e, t) {
      "use strict";
      var r =
          (e.exports && e.exports.__createBinding) ||
          (Object.create
            ? function (e, t, r, s) {
                void 0 === s && (s = r),
                  Object.defineProperty(e, s, {
                    enumerable: !0,
                    get: function () {
                      return t[r];
                    },
                  });
              }
            : function (e, t, r, s) {
                void 0 === s && (s = r), (e[s] = t[r]);
              }),
        s =
          (e.exports && e.exports.__exportStar) ||
          function (e, t) {
            for (var s in e) "default" === s || t.hasOwnProperty(s) || r(t, e, s);
          };
      Object.defineProperty(e.exports, "__esModule", { value: !0 }),
        s(i("cUDrk"), e.exports),
        s(i("cdWGp"), e.exports),
        s(i("kXaIC"), e.exports),
        s(i("h2RSZ"), e.exports),
        s(i("e41iV"), e.exports),
        s(i("eYbsu"), e.exports),
        s(i("a4qeh"), e.exports),
        s(i("8c4LC"), e.exports),
        s(i("jO0hf"), e.exports),
        s(i("difix"), e.exports);
    }),
    i.register("a4qeh", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 });
    }),
    i.register("8c4LC", function (e, t) {
      "use strict";
      Object.defineProperty(e.exports, "__esModule", { value: !0 });
    });
  var a = {},
    n =
      (a && a.__createBinding) ||
      (Object.create
        ? function (e, t, r, s) {
            void 0 === s && (s = r),
              Object.defineProperty(e, s, {
                enumerable: !0,
                get: function () {
                  return t[r];
                },
              });
          }
        : function (e, t, r, s) {
            void 0 === s && (s = r), (e[s] = t[r]);
          }),
    o =
      (a && a.__setModuleDefault) ||
      (Object.create
        ? function (e, t) {
            Object.defineProperty(e, "default", { enumerable: !0, value: t });
          }
        : function (e, t) {
            e.default = t;
          }),
    c =
      (a && a.__importStar) ||
      function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var r in e) "default" !== r && Object.hasOwnProperty.call(e, r) && n(t, e, r);
        return o(t, e), t;
      },
    d =
      (a && a.__importDefault) ||
      function (e) {
        return e && e.__esModule ? e : { default: e };
      };
  Object.defineProperty(a, "__esModule", { value: !0 }),
    (a.debug = a.detectDevice = a.Device = a.version = a.types = void 0);
  const p = d(i("j5U6Y"));
  a.debug = p.default;
  var l = i("cUDrk");
  Object.defineProperty(a, "Device", {
    enumerable: !0,
    get: function () {
      return l.Device;
    },
  }),
    Object.defineProperty(a, "detectDevice", {
      enumerable: !0,
      get: function () {
        return l.detectDevice;
      },
    });
  const u = c(i("adPEn"));
  (a.types = u), (a.version = "3.6.43");
  var h = i("at4BN");
  Object.defineProperty(a, "parseScalabilityMode", {
    enumerable: !0,
    get: function () {
      return h.parse;
    },
  });
  var m = i("j5U6Y");
  const f = m("simple-mediasoup-peer-client:log");
  f.log = console.log.bind(console);
  const g = m("simple-mediasoup-peer-client:error");
  window.SimpleMediasoupPeer = class {
    on(e, t) {
      "track" == e && (f(`setting callback for ${e} callback`), (this.onTrackCallback = t));
    }
    callOnTrackCallback({ track: e, peerId: t, label: r }) {
      this.onTrackCallback ? this.onTrackCallback(e, t, r) : f("no onTrack Callback Set");
    }
    async disconnect() {
      f("Clearing SimpleMediasoupPeer!"),
        this.sendTransport && this.sendTransport.close(),
        this.recvTransport && this.recvTransport.close(),
        (this.producers = {}),
        (this.consumers = {}),
        (this.sendTransport = null),
        (this.recvTransport = null),
        (this.latestAvailableProducers = {});
    }
    async initialize() {
      f("Initializing SimpleMediasoupPeer!"),
        this.setupMediasoupDevice(),
        await this.connectToMediasoupRouter(),
        await this.createSendTransport(),
        await this.createRecvTransport();
      for (const e in this.tracksToProduce) {
        const t = this.tracksToProduce[e].track,
          r = this.tracksToProduce[e].broadcast,
          s = this.tracksToProduce[e].customEncodings;
        this.addProducer(t, e, r, s);
      }
    }
    async addTrack(e, t, r = !1, s = !1) {
      (this.tracksToProduce[t] = { track: e, broadcast: r, customEncodings: s }),
        f(this.tracksToProduce),
        await this.addProducer(e, t, r, s);
    }
    async addProducer(e, t, r, s) {
      let i;
      if (this.producers[t])
        return (
          f(`Already producing ${t}! Swapping track!`),
          void this.producers[t].replaceTrack({ track: e })
        );
      if ("video" === e.kind) {
        let a = [{ maxBitrate: 5e5 }];
        s && ((a = s), f("Using custom encodings:", a)),
          (i = await this.sendTransport.produce({
            track: e,
            stopTracks: !1,
            encodings: a,
            codecOptions: { videoGoogleStartBitrate: 1e3 },
            appData: { label: t, broadcast: r },
          }));
      } else if ("audio" === e.kind) {
        let a = [{ maxBitrate: 64e3 }];
        s && (a = s),
          (i = await this.sendTransport.produce({
            track: e,
            stopTracks: !1,
            encodings: a,
            appData: { label: t, broadcast: r },
          }));
      }
      i.on("transportclose", () => {
        f("transport closed"), (i = null);
      }),
        i.on("trackended", async () => {
          f("track ended");
          try {
            await this.socket.request("mediasoupSignaling", {
              type: "closeProducer",
              data: { producerId: i.id },
            });
          } catch (e) {
            g(e);
          }
          await i.close(), (i = null);
        }),
        (this.producers[t] = i);
    }
    ensureConnectedToDesiredPeerConnections() {
      f("ensure connections"),
        f("latest available producers:", this.latestAvailableProducers),
        f("desired connections:", this.desiredPeerConnections);
      for (const e in this.latestAvailableProducers)
        if (e !== this.socket.id)
          for (const t in this.latestAvailableProducers[e]) {
            if (
              this.desiredPeerConnections.has(e) ||
              this.latestAvailableProducers[e][t].broadcast
            ) {
              const r = this.consumers[e] && this.consumers[e][t];
              f("existing consumer:", r), r || this.requestConsumer(e, t);
            }
          }
    }
    requestConsumer(e, t) {
      this.consumers[e] || (this.consumers[e] = {}),
        this.socket.request("mediasoupSignaling", {
          type: "createConsumer",
          data: { producingPeerId: e, producerId: t },
        });
    }
    async createConsumer(e) {
      const {
        peerId: t,
        producerId: r,
        id: s,
        kind: i,
        rtpParameters: a,
        type: n,
        appData: o,
        producerPaused: c,
      } = e;
      this.consumers[t] || (this.consumers[t] = {});
      let d = this.consumers[t][r];
      d ||
        (f(`Creating consumer with ID ${s} for producer with ID ${r}`),
        (d = await this.recvTransport.consume({
          id: s,
          producerId: r,
          kind: i,
          rtpParameters: a,
          appData: { ...o, peerId: t },
        })),
        f("Created consumer:", d),
        (this.consumers[t][r] = d),
        d.on("transportclose", () => {
          delete this.consumers[d.id];
        }),
        await this.socket.request("mediasoupSignaling", {
          type: "resumeConsumer",
          data: { producerId: d.producerId },
        })),
        this.callOnTrackCallback({
          track: d.track,
          peerId: d.appData.peerId,
          label: d.appData.label,
        });
    }
    async handleSocketMessage(e) {
      switch (e.type) {
        case "availableProducers":
          f("tick"),
            (this.latestAvailableProducers = e.data),
            this.ensureConnectedToDesiredPeerConnections();
          break;
        case "createConsumer":
          this.createConsumer(e.data);
          break;
        case "consumerClosed": {
          f("Server-side consumerClosed, closing client side consumer."), f(e.data);
          const { producingPeerId: t, producerId: r } = e.data;
          this.consumers[t][r].close(), delete this.consumers[t][r];
          break;
        }
      }
    }
    async removePeer(e) {
      for (let t in this.consumers[e]) {
        this.consumers[e][t].close();
      }
      delete this.consumers[e];
    }
    connectToPeer(e) {
      this.desiredPeerConnections.add(e);
      for (const t in this.latestAvailableProducers[e]) {
        const r = this.consumers[e] && this.consumers[e][t];
        f("existingConsumer:", r), r || this.requestConsumer(e, t);
      }
    }
    disconnectFromPeer(e) {
      for (let t in this.consumers[e]) {
        this.consumers[e][t].close();
      }
      delete this.consumers[e], this.desiredPeerConnections.delete(id);
    }
    async pausePeer(e) {
      const t = this.consumers[e];
      for (const e in t) {
        const r = t[e];
        r &&
          !r.appData.broadcast &&
          (r.paused ||
            (f("Pausing consumer!"),
            await this.socket.request("mediasoupSignaling", {
              type: "pauseConsumer",
              data: { producerId: r.producerId },
            }),
            r.pause()));
      }
    }
    async resumePeer(e) {
      const t = this.consumers[e];
      for (const e in t) {
        const r = t[e];
        r &&
          r.paused &&
          (f("Resuming consumer!"),
          await this.socket.request("mediasoupSignaling", {
            type: "resumeConsumer",
            data: { producerId: r.producerId },
          }),
          r.resume());
      }
    }
    setupMediasoupDevice() {
      try {
        this.device = new a.Device();
      } catch (e) {
        g(e);
      }
    }
    async connectToMediasoupRouter() {
      const e = await this.socket.request("mediasoupSignaling", {
        type: "getRouterRtpCapabilities",
      });
      await this.device.load({ routerRtpCapabilities: e }), f("Router loaded!");
    }
    async createSendTransport() {
      const e = await this.socket.request("mediasoupSignaling", {
          type: "createWebRtcTransport",
          data: {
            forceTcp: !1,
            producing: !0,
            consuming: !1,
            sctpCapabilities: this.device.sctpCapabilities,
          },
        }),
        { id: t, iceParameters: r, iceCandidates: s, dtlsParameters: i, sctpParameters: a } = e;
      (this.sendTransport = this.device.createSendTransport({
        id: t,
        iceParameters: r,
        iceCandidates: s,
        dtlsParameters: i,
        sctpParameters: a,
        iceServers: [],
      })),
        this.sendTransport.on("connect", ({ dtlsParameters: e }, t, r) => {
          f("Connecting Send Transport"),
            this.socket
              .request("mediasoupSignaling", {
                type: "connectWebRtcTransport",
                data: { transportId: this.sendTransport.id, dtlsParameters: e },
              })
              .then(t)
              .catch(r);
        }),
        this.sendTransport.on(
          "produce",
          async ({ kind: e, rtpParameters: t, appData: r }, s, i) => {
            try {
              f("starting to produce");
              const { id: i } = await this.socket.request("mediasoupSignaling", {
                type: "produce",
                data: { transportId: this.sendTransport.id, kind: e, rtpParameters: t, appData: r },
              });
              s({ id: i });
            } catch (e) {
              i(e);
            }
          }
        ),
        this.sendTransport.on(
          "producedata",
          async ({ sctpStreamParameters: e, label: t, protocol: r, appData: s }, i, a) => {
            try {
              const { id: a } = await this.socket.request("mediasoupSignaling", {
                type: "produceData",
                data: {
                  transportId: this.sendTransport.id,
                  sctpStreamParameters: e,
                  label: t,
                  protocol: r,
                  appData: s,
                },
              });
              i({ id: a });
            } catch (e) {
              a(e);
            }
          }
        ),
        f("Created send transport!");
    }
    async createRecvTransport() {
      const e = await this.socket.request("mediasoupSignaling", {
          type: "createWebRtcTransport",
          data: {
            forceTcp: !1,
            producing: !1,
            consuming: !0,
            sctpCapabilities: this.device.sctpCapabilities,
          },
        }),
        { id: t, iceParameters: r, iceCandidates: s, dtlsParameters: i, sctpParameters: a } = e;
      (this.recvTransport = this.device.createRecvTransport({
        id: t,
        iceParameters: r,
        iceCandidates: s,
        dtlsParameters: i,
        sctpParameters: a,
        iceServers: [],
      })),
        this.recvTransport.on("connect", ({ dtlsParameters: e }, t, r) => {
          f("Connecting Receive Transport!"),
            this.socket
              .request("mediasoupSignaling", {
                type: "connectWebRtcTransport",
                data: { transportId: this.recvTransport.id, dtlsParameters: e },
              })
              .then(t)
              .catch(r);
        }),
        f("Created receive transport!");
    }
    constructor(e) {
      f("Setting up new MediasoupPeer"),
        (this.device = null),
        (this.socket = e),
        (this.socket.request = (t, r = {}) =>
          new Promise((s) => {
            e.emit(t, r, s);
          })),
        this.socket.on("mediasoupSignaling", (e) => {
          this.handleSocketMessage(e);
        }),
        this.socket.on("connect", async () => {
          f("Connected to Socket Server with ID: ", this.socket.id),
            await this.disconnect(),
            await this.initialize();
        }),
        (this.producers = {}),
        (this.consumers = {}),
        (this.sendTransport = null),
        (this.recvTransport = null),
        (this.tracksToProduce = {}),
        (this.latestAvailableProducers = {}),
        (this.desiredPeerConnections = new Set());
    }
  };
})();
