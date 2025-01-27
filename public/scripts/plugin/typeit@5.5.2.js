/*!
 *
 *   typeit - The most versatile animated typing utility on the planet.
 *   Author: Alex MacArthur <alex@macarthur.me> (https://macarthur.me)
 *   Version: v5.5.2
 *   URL: https://typeitjs.com
 *   License: GPL-2.0
 *
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : (e.TypeIt = t());
})(this, function () {
  "use strict";
  function e(e) {
    var t = e.getBoundingClientRect();
    return (
      !(t.right > window.innerWidth || t.bottom > window.innerHeight) &&
      !(t.top < 0 || t.left < 0)
    );
  }
  function t(e, t) {
    return Math.abs(Math.random() * (e + t - (e - t)) + (e - t));
  }
  function n(e, t) {
    return 0 === e.indexOf(t);
  }
  function i(e) {
    return Array.isArray(e) ? e.slice(0) : e.split("<br>");
  }
  window.TypeItDefaults = {
    strings: [],
    speed: 100,
    deleteSpeed: void 0,
    lifeLike: !0,
    cursor: !0,
    cursorChar: "|",
    cursorSpeed: 1e3,
    breakLines: !0,
    startDelay: 250,
    startDelete: !1,
    nextStringDelay: 750,
    loop: !1,
    loopDelay: 750,
    html: !0,
    autoStart: !0,
    callback: function () {},
  };
  var s =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          },
    o = function (e, t) {
      if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function");
    },
    r = (function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          (i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(e, i.key, i);
        }
      }
      return function (t, n, i) {
        return n && e(t.prototype, n), i && e(t, i), t;
      };
    })(),
    u = (function () {
      function s(e, t, n) {
        o(this, s),
          (this.timeouts = []),
          (this.id = t),
          (this.queue = []),
          (this.hasStarted = !1),
          (this.isFrozen = !1),
          (this.isComplete = !1),
          (this.isInTag = !1),
          (this.stringsToDelete = ""),
          (this.style =
            "display:inline;position:relative;font:inherit;color:inherit;"),
          (this.element = e),
          this.setOptions(n, window.TypeItDefaults, !1),
          this.setNextStringDelay(),
          this.init();
      }
      return (
        r(s, [
          {
            key: "setNextStringDelay",
            value: function () {
              var e = Array.isArray(this.options.nextStringDelay),
                t = e ? null : this.options.nextStringDelay / 2;
              this.options.nextStringDelay = {
                before: e ? this.options.nextStringDelay[0] : t,
                after: e ? this.options.nextStringDelay[1] : t,
                total: e
                  ? this.options.nextStringDelay.reduce(function (e, t) {
                      return e + t;
                    })
                  : this.options.nextStringDelay,
              };
            },
          },
          {
            key: "init",
            value: function () {
              this.checkElement(),
                (this.options.strings = i(this.options.strings)),
                (this.options.strings = this.options.strings.map(function (e) {
                  return e.replace(/<\!--.*?-->/g, "");
                })),
                (this.options.strings.length >= 1 &&
                  "" === this.options.strings[0]) ||
                  ((this.element.innerHTML =
                    '\n        <span style="' +
                    this.style +
                    '" class="ti-container"></span>\n      '),
                  this.element.setAttribute("data-typeitid", this.id),
                  (this.elementContainer = this.element.querySelector("span")),
                  this.options.startDelete &&
                    (this.insert(this.stringsToDelete),
                    this.queue.push([this.delete]),
                    this.insertSplitPause(1)),
                  this.cursor(),
                  this.generateQueue(),
                  this.kickoff());
            },
          },
          {
            key: "generateQueue",
            value: function () {
              var e = this,
                t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : null;
              (t = null === t ? [this.pause, this.options.startDelay] : t),
                this.queue.push(t),
                this.options.strings.forEach(function (t, n) {
                  e.queueString(t),
                    n + 1 < e.options.strings.length &&
                      (e.options.breakLines
                        ? (e.queue.push([e.break]),
                          e.insertSplitPause(e.queue.length))
                        : (e.queueDeletions(t),
                          e.insertSplitPause(e.queue.length, t.length)));
                });
            },
          },
          {
            key: "queueDeletions",
            value: function () {
              for (
                var e =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : null,
                  t = "string" == typeof e ? e.length : e,
                  n = 0;
                n < t;
                n++
              )
                this.queue.push([this.delete, 1]);
            },
          },
          {
            key: "queueString",
            value: function (e) {
              var t =
                !(arguments.length > 1 && void 0 !== arguments[1]) ||
                arguments[1];
              if (e) {
                if (
                  ((e = i(e)),
                  (document.implementation.createHTMLDocument(
                    ""
                  ).body.innerHTML = e),
                  t && (e = (e = this.rake(e))[0]),
                  this.options.html && n(e[0], "<") && !n(e[0], "</"))
                ) {
                  var s = e[0].match(/\<(.*?)\>/),
                    o = document.implementation.createHTMLDocument("");
                  (o.body.innerHTML = "<" + s[1] + "></" + s[1] + ">"),
                    this.queue.push([this.type, o.body.children[0]]);
                } else this.queue.push([this.type, e[0]]);
                e.splice(0, 1), e.length && this.queueString(e, !1);
              }
            },
          },
          {
            key: "insertSplitPause",
            value: function (e) {
              var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 1;
              this.queue.splice(e, 0, [
                this.pause,
                this.options.nextStringDelay.before,
              ]),
                this.queue.splice(e - t, 0, [
                  this.pause,
                  this.options.nextStringDelay.after,
                ]);
            },
          },
          {
            key: "kickoff",
            value: function () {
              if (this.options.autoStart)
                return (this.hasStarted = !0), void this.next();
              if (e(this.element))
                return (this.hasStarted = !0), void this.next();
              var t = this;
              window.addEventListener("scroll", function n(i) {
                e(t.element) &&
                  !t.hasStarted &&
                  ((t.hasStarted = !0),
                  t.next(),
                  i.currentTarget.removeEventListener(i.type, n));
              });
            },
          },
          {
            key: "cursor",
            value: function () {
              var e = "visibility: hidden;";
              if (this.options.cursor) {
                var t = document.createElement("style");
                t.id = this.id;
                var n =
                  "\n            @keyframes blink-" +
                  this.id +
                  " {\n              0% {opacity: 0}\n              49% {opacity: 0}\n              50% {opacity: 1}\n            }\n\n            [data-typeitid='" +
                  this.id +
                  "'] .ti-cursor {\n              animation: blink-" +
                  this.id +
                  " " +
                  this.options.cursorSpeed / 1e3 +
                  "s infinite;\n            }\n          ";
                t.appendChild(document.createTextNode(n)),
                  document.head.appendChild(t),
                  (e = "");
              }
              this.element.insertAdjacentHTML(
                "beforeend",
                '<span style="' +
                  this.style +
                  e +
                  '" class="ti-cursor">' +
                  this.options.cursorChar +
                  "</span>"
              );
            },
          },
          {
            key: "insert",
            value: function (e) {
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                ? this.elementContainer.lastChild.insertAdjacentHTML(
                    "beforeend",
                    e
                  )
                : this.elementContainer.insertAdjacentHTML("beforeend", e),
                (this.elementContainer.innerHTML =
                  this.elementContainer.innerHTML.split("").join(""));
            },
          },
          {
            key: "checkElement",
            value: function () {
              var e = this;
              [].slice.call(this.element.childNodes).forEach(function (t) {
                void 0 !== t.classList &&
                  t.classList.contains("ti-container") &&
                  (e.element.innerHTML = "");
              }),
                !this.options.startDelete && this.element.innerHTML.length > 0
                  ? (this.options.strings = this.element.innerHTML.trim())
                  : (this.stringsToDelete = this.element.innerHTML);
            },
          },
          {
            key: "break",
            value: function () {
              this.insert("<br>"), this.next();
            },
          },
          {
            key: "pause",
            value: function () {
              var e = this,
                t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : null;
              setTimeout(
                function () {
                  e.next();
                },
                null === t ? this.options.nextStringDelay.total : t
              );
            },
          },
          {
            key: "rake",
            value: function (e) {
              var t = this;
              return e.map(function (e) {
                if (((e = e.split("")), t.options.html))
                  for (var n = [], i = void 0, s = !1, o = 0; o < e.length; o++)
                    ("<" !== e[o] && "&" !== e[o]) ||
                      ((n[0] = o), (s = "&" === e[o])),
                      (">" === e[o] || (";" === e[o] && s)) &&
                        ((n[1] = o),
                        (o = 0),
                        (i = e.slice(n[0], n[1] + 1).join("")),
                        e.splice(n[0], n[1] - n[0] + 1, i),
                        (s = !1));
                return e;
              });
            },
          },
          {
            key: "type",
            value: function (e) {
              var t = this;
              this.setPace(),
                (this.timeouts[0] = setTimeout(function () {
                  return "string" != typeof e
                    ? ((e.innerHTML = ""),
                      t.elementContainer.appendChild(e),
                      (t.isInTag = !0),
                      void t.next())
                    : n(e, "</")
                    ? ((t.isInTag = !1), void t.next())
                    : (t.insert(e, t.isInTag), void t.next());
                }, this.typePace));
            },
          },
          {
            key: "setOptions",
            value: function (e) {
              var t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : null,
                n =
                  !(arguments.length > 2 && void 0 !== arguments[2]) ||
                  arguments[2],
                i = {};
              for (var s in (null === t && (t = this.options), t)) i[s] = t[s];
              for (var o in e) i[o] = e[o];
              (this.options = i), n && this.next();
            },
          },
          {
            key: "setPace",
            value: function () {
              var e = this.options.speed,
                n =
                  void 0 !== this.options.deleteSpeed
                    ? this.options.deleteSpeed
                    : this.options.speed / 3,
                i = e / 2,
                s = n / 2;
              (this.typePace = this.options.lifeLike ? t(e, i) : e),
                (this.deletePace = this.options.lifeLike ? t(n, s) : n);
            },
          },
          {
            key: "delete",
            value: function () {
              var e = this,
                t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : null;
              this.timeouts[1] = setTimeout(function () {
                e.setPace();
                for (
                  var n = e.elementContainer.innerHTML.split(""),
                    i = n.length - 1;
                  i > -1;
                  i--
                ) {
                  if ((">" !== n[i] && ";" !== n[i]) || !e.options.html) {
                    n.pop();
                    break;
                  }
                  for (var s = i; s > -1; s--) {
                    if ("<br>" === n.slice(s - 3, s + 1).join("")) {
                      n.splice(s - 3, 4);
                      break;
                    }
                    if ("&" === n[s]) {
                      n.splice(s, i - s + 1);
                      break;
                    }
                    if ("<" === n[s] && ">" !== n[s - 1]) {
                      if (";" === n[s - 1])
                        for (var o = s - 1; o > -1; o--)
                          if ("&" === n[o]) {
                            n.splice(o, s - o);
                            break;
                          }
                      n.splice(s - 1, 1);
                      break;
                    }
                  }
                  break;
                }
                if (e.elementContainer.innerHTML.indexOf("></") > -1)
                  for (
                    var r = e.elementContainer.innerHTML.indexOf("></") - 2;
                    r >= 0;
                    r--
                  )
                    if ("<" === n[r]) {
                      n.splice(r, n.length - r);
                      break;
                    }
                (e.elementContainer.innerHTML = n
                  .join("")
                  .replace(/<[^\/>][^>]*><\/[^>]+>/, "")),
                  null === t && e.queue.unshift([e.delete, n.length]),
                  t > 1 && e.queue.unshift([e.delete, t - 1]),
                  e.next();
              }, this.deletePace);
            },
          },
          {
            key: "empty",
            value: function () {
              (this.elementContainer.innerHTML = ""), this.next();
            },
          },
          {
            key: "next",
            value: function () {
              var e = this;
              if (!this.isFrozen) {
                if (this.queue.length > 0) {
                  var t = this.queue[0];
                  return this.queue.shift(), void t[0].call(this, t[1]);
                }
                this.options.callback(),
                  this.options.loop
                    ? (this.queueDeletions(this.elementContainer.innerHTML),
                      this.generateQueue([
                        this.pause,
                        this.options.loopDelay / 2,
                      ]),
                      setTimeout(function () {
                        e.next();
                      }, this.options.loopDelay / 2))
                    : (this.isComplete = !0);
              }
            },
          },
        ]),
        s
      );
    })();
  return (function () {
    function e(t, n) {
      o(this, e),
        (this.id = this.generateHash()),
        (this.instances = []),
        (this.elements = []),
        (this.args = n),
        "object" === (void 0 === t ? "undefined" : s(t)) &&
          (void 0 === t.length ? this.elements.push(t) : (this.elements = t)),
        "string" == typeof t && (this.elements = document.querySelectorAll(t)),
        this.createInstances();
    }
    return (
      r(e, [
        {
          key: "generateHash",
          value: function () {
            return (
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15)
            );
          },
        },
        {
          key: "createInstances",
          value: function () {
            var e = this;
            [].slice.call(this.elements).forEach(function (t) {
              e.instances.push(new u(t, e.id, e.args));
            });
          },
        },
        {
          key: "pushAction",
          value: function (e) {
            var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : null;
            this.instances.forEach(function (n) {
              n.queue.push([n[e], t]), !0 === n.isComplete && n.next();
            });
          },
        },
        {
          key: "type",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "";
            return (
              this.instances.forEach(function (t) {
                t.queueString(e), !0 === t.isComplete && t.next();
              }),
              this
            );
          },
        },
        {
          key: "delete",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null;
            return this.pushAction("delete", e), this;
          },
        },
        {
          key: "freeze",
          value: function () {
            this.instances.forEach(function (e) {
              e.isFrozen = !0;
            });
          },
        },
        {
          key: "unfreeze",
          value: function () {
            this.instances.forEach(function (e) {
              e.isFrozen && ((e.isFrozen = !1), e.next());
            });
          },
        },
        {
          key: "pause",
          value: function () {
            var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null;
            return this.pushAction("pause", e), this;
          },
        },
        {
          key: "destroy",
          value: function () {
            var e =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0];
            this.instances.forEach(function (t) {
              (t.timeouts = t.timeouts.map(function (e) {
                return clearTimeout(e), null;
              })),
                e &&
                  t.element.removeChild(t.element.querySelector(".ti-cursor"));
            }),
              (this.instances = []);
          },
        },
        {
          key: "empty",
          value: function () {
            return this.pushAction("empty"), this;
          },
        },
        {
          key: "break",
          value: function () {
            return this.pushAction("break"), this;
          },
        },
        {
          key: "options",
          value: function (e) {
            return this.pushAction("setOptions", e), this;
          },
        },
        {
          key: "isComplete",
          get: function () {
            return this.instances[0].isComplete;
          },
        },
      ]),
      e
    );
  })();
});
