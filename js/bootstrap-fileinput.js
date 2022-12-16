/*!
 * bootstrap-fileinput v5.2.3
 * http://plugins.krajee.com/file-input
 *
 * Author: Kartik Visweswaran
 * Copyright: 2014 - 2021, Kartik Visweswaran, Krajee.com
 *
 * Licensed under the BSD-3-Clause
 * https://github.com/kartik-v/bootstrap-fileinput/blob/master/LICENSE.md
 */
!(function (e) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof module && module.exports
    ? (module.exports = e(require("jquery")))
    : e(window.jQuery);
})(function (e) {
  "use strict";
  var t, i;
  (e.fn.fileinputLocales = {}),
    (e.fn.fileinputThemes = {}),
    e.fn.fileinputBsVersion ||
      (e.fn.fileinputBsVersion =
        (window.Alert && window.Alert.VERSION) ||
        (window.bootstrap && window.bootstrap.Alert && bootstrap.Alert.VERSION) ||
        "3.x.x"),
    (String.prototype.setTokens = function (e) {
      var t,
        i,
        a = this.toString();
      for (t in e) e.hasOwnProperty(t) && ((i = new RegExp("{" + t + "}", "g")), (a = a.replace(i, e[t])));
      return a;
    }),
    Array.prototype.flatMap ||
      (Array.prototype.flatMap = function (e) {
        return [].concat(this.map(e));
      }),
    (t = {
      FRAMES: ".kv-preview-thumb",
      SORT_CSS: "file-sortable",
      INIT_FLAG: "init-",
      ZOOM_VAR: "?kvTemp__2873389129__=",
      OBJECT_PARAMS:
        '<param name="controller" value="true" />\n<param name="allowFullScreen" value="true" />\n<param name="allowScriptAccess" value="always" />\n<param name="autoPlay" value="false" />\n<param name="autoStart" value="false" />\n<param name="quality" value="high" />\n',
      DEFAULT_PREVIEW:
        '<div class="file-preview-other">\n<span class="{previewFileIconClass}">{previewFileIcon}</span>\n</div>',
      MODAL_ID: "kvFileinputModal",
      MODAL_EVENTS: ["show", "shown", "hide", "hidden", "loaded"],
      logMessages: {
        ajaxError: "{status}: {error}. Error Details: {text}.",
        badDroppedFiles: "Error scanning dropped files!",
        badExifParser: "Error loading the piexif.js library. {details}",
        badInputType: 'The input "type" must be set to "file" for initializing the "bootstrap-fileinput" plugin.',
        exifWarning:
          'To avoid this warning, either set "autoOrientImage" to "false" OR ensure you have loaded the "piexif.js" library correctly on your page before the "fileinput.js" script.',
        invalidChunkSize: 'Invalid upload chunk size: "{chunkSize}". Resumable uploads are disabled.',
        invalidThumb: 'Invalid thumb frame with id: "{id}".',
        noResumableSupport: "The browser does not support resumable or chunk uploads.",
        noUploadUrl: 'The "uploadUrl" is not set. Ajax uploads and resumable uploads have been disabled.',
        retryStatus: "Retrying upload for chunk # {chunk} for {filename}... retry # {retry}.",
        chunkQueueError: "Could not push task to ajax pool for chunk index # {index}.",
        resumableMaxRetriesReached: "Maximum resumable ajax retries ({n}) reached.",
        resumableRetryError: "Could not retry the resumable request (try # {n})... aborting.",
        resumableAborting: "Aborting / cancelling the resumable request.",
        resumableRequestError: "Error processing resumable request. {msg}",
      },
      objUrl: window.URL || window.webkitURL,
      isBs: function (t) {
        var i = e.trim((e.fn.fileinputBsVersion || "") + "");
        return (t = parseInt(t, 10)), i ? t === parseInt(i.charAt(0), 10) : 4 === t;
      },
      defaultButtonCss: function (e) {
        return "btn-default btn-" + (e ? "" : "outline-") + "secondary";
      },
      now: function () {
        return new Date().getTime();
      },
      round: function (e) {
        return (e = parseFloat(e)), isNaN(e) ? 0 : Math.floor(Math.round(e));
      },
      getArray: function (e) {
        var t,
          i = [],
          a = (e && e.length) || 0;
        for (t = 0; t < a; t++) i.push(e[t]);
        return i;
      },
      getFileRelativePath: function (e) {
        return String(e.newPath || e.relativePath || e.webkitRelativePath || t.getFileName(e) || null);
      },
      getFileId: function (e, i) {
        var a = t.getFileRelativePath(e);
        return "function" == typeof i ? i(e) : e && a ? e.size + "_" + encodeURIComponent(a).replace(/%/g, "_") : null;
      },
      getFrameSelector: function (e, t) {
        return '[id="' + e + '"]' + (t = t || "");
      },
      getZoomSelector: function (e, i) {
        return t.getFrameSelector("zoom-" + e, i);
      },
      getFrameElement: function (e, i, a) {
        return e.find(t.getFrameSelector(i, a));
      },
      getZoomElement: function (e, i, a) {
        return e.find(t.getZoomSelector(i, a));
      },
      getElapsed: function (i) {
        var a = i,
          r = "",
          s = {},
          n = { year: 31536e3, month: 2592e3, week: 604800, day: 86400, hour: 3600, minute: 60, second: 1 };
        return (
          t.getObjectKeys(n).forEach(function (e) {
            (s[e] = Math.floor(a / n[e])), (a -= s[e] * n[e]);
          }),
          e.each(s, function (e, t) {
            t > 0 && (r += (r ? " " : "") + t + e.substring(0, 1));
          }),
          r
        );
      },
      debounce: function (e, t) {
        var i;
        return function () {
          var a = arguments,
            r = this;
          clearTimeout(i),
            (i = setTimeout(function () {
              e.apply(r, a);
            }, t));
        };
      },
      stopEvent: function (e) {
        e.stopPropagation(), e.preventDefault();
      },
      getFileName: function (e) {
        return (e && (e.fileName || e.name)) || "";
      },
      createObjectURL: function (e) {
        return t.objUrl && t.objUrl.createObjectURL && e ? t.objUrl.createObjectURL(e) : "";
      },
      revokeObjectURL: function (e) {
        t.objUrl && t.objUrl.revokeObjectURL && e && t.objUrl.revokeObjectURL(e);
      },
      compare: function (e, t, i) {
        return void 0 !== e && (i ? e === t : e.match(t));
      },
      isIE: function (e) {
        var t, i;
        return (
          "Microsoft Internet Explorer" === navigator.appName &&
          (10 === e
            ? new RegExp("msie\\s" + e, "i").test(navigator.userAgent)
            : (((t = document.createElement("div")).innerHTML = "\x3c!--[if IE " + e + "]> <i></i> <![endif]--\x3e"),
              (i = t.getElementsByTagName("i").length),
              document.body.appendChild(t),
              t.parentNode.removeChild(t),
              i))
        );
      },
      canOrientImage: function (t) {
        var i = e(document.createElement("img")).css({ width: "1px", height: "1px" }).insertAfter(t),
          a = i.css("image-orientation");
        return i.remove(), !!a;
      },
      canAssignFilesToInput: function () {
        var e = document.createElement("input");
        try {
          return (e.type = "file"), (e.files = null), !0;
        } catch (e) {
          return !1;
        }
      },
      getDragDropFolders: function (e) {
        var t,
          i,
          a = e ? e.length : 0,
          r = 0;
        if (a > 0 && e[0].webkitGetAsEntry())
          for (t = 0; t < a; t++) (i = e[t].webkitGetAsEntry()) && i.isDirectory && r++;
        return r;
      },
      initModal: function (t) {
        var i = e("body");
        i.length && t.appendTo(i);
      },
      isFunction: function (e) {
        return "function" == typeof e;
      },
      isEmpty: function (i, a) {
        return (
          null == i ||
          "" === i ||
          (t.isString(i) && a
            ? "" === e.trim(i)
            : t.isArray(i)
            ? 0 === i.length
            : !(!e.isPlainObject(i) || !e.isEmptyObject(i)))
        );
      },
      isArray: function (e) {
        return Array.isArray(e) || "[object Array]" === Object.prototype.toString.call(e);
      },
      isString: function (e) {
        return "[object String]" === Object.prototype.toString.call(e);
      },
      ifSet: function (e, t, i) {
        return (i = i || ""), t && "object" == typeof t && e in t ? t[e] : i;
      },
      cleanArray: function (e) {
        return (
          e instanceof Array || (e = []),
          e.filter(function (e) {
            return null != e;
          })
        );
      },
      spliceArray: function (t, i, a) {
        var r,
          s,
          n = 0,
          o = [];
        if (!(t instanceof Array)) return [];
        for (s = e.extend(!0, [], t), a && s.reverse(), r = 0; r < s.length; r++) r !== i && ((o[n] = s[r]), n++);
        return a && o.reverse(), o;
      },
      getNum: function (e, t) {
        return (t = t || 0), "number" == typeof e ? e : ("string" == typeof e && (e = parseFloat(e)), isNaN(e) ? t : e);
      },
      hasFileAPISupport: function () {
        return !(!window.File || !window.FileReader);
      },
      hasDragDropSupport: function () {
        var e = document.createElement("div");
        return !t.isIE(9) && (void 0 !== e.draggable || (void 0 !== e.ondragstart && void 0 !== e.ondrop));
      },
      hasFileUploadSupport: function () {
        return t.hasFileAPISupport() && window.FormData;
      },
      hasBlobSupport: function () {
        try {
          return !!window.Blob && Boolean(new Blob());
        } catch (e) {
          return !1;
        }
      },
      hasArrayBufferViewSupport: function () {
        try {
          return 100 === new Blob([new Uint8Array(100)]).size;
        } catch (e) {
          return !1;
        }
      },
      hasResumableUploadSupport: function () {
        return (
          t.hasFileUploadSupport() &&
          t.hasBlobSupport() &&
          t.hasArrayBufferViewSupport() &&
          (!!Blob.prototype.webkitSlice || !!Blob.prototype.mozSlice || !!Blob.prototype.slice || !1)
        );
      },
      dataURI2Blob: function (e) {
        var i,
          a,
          r,
          s,
          n,
          o,
          l = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
          d = t.hasBlobSupport();
        if (!((d || l) && window.atob && window.ArrayBuffer && window.Uint8Array)) return null;
        for (
          i = e.split(",")[0].indexOf("base64") >= 0 ? atob(e.split(",")[1]) : decodeURIComponent(e.split(",")[1]),
            a = new ArrayBuffer(i.length),
            r = new Uint8Array(a),
            s = 0;
          s < i.length;
          s += 1
        )
          r[s] = i.charCodeAt(s);
        return (
          (n = e.split(",")[0].split(":")[1].split(";")[0]),
          d ? new Blob([t.hasArrayBufferViewSupport() ? r : a], { type: n }) : ((o = new l()).append(a), o.getBlob(n))
        );
      },
      arrayBuffer2String: function (e) {
        if (window.TextDecoder) return new TextDecoder("utf-8").decode(e);
        var t,
          i,
          a,
          r,
          s = Array.prototype.slice.apply(new Uint8Array(e)),
          n = "",
          o = 0;
        for (t = s.length; o < t; )
          switch ((i = s[o++]) >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
              n += String.fromCharCode(i);
              break;
            case 12:
            case 13:
              (a = s[o++]), (n += String.fromCharCode(((31 & i) << 6) | (63 & a)));
              break;
            case 14:
              (a = s[o++]),
                (r = s[o++]),
                (n += String.fromCharCode(((15 & i) << 12) | ((63 & a) << 6) | ((63 & r) << 0)));
          }
        return n;
      },
      isHtml: function (e) {
        var t = document.createElement("div");
        t.innerHTML = e;
        for (var i = t.childNodes, a = i.length; a--; ) if (1 === i[a].nodeType) return !0;
        return !1;
      },
      isSvg: function (e) {
        return e.match(/^\s*<\?xml/i) && (e.match(/<!DOCTYPE svg/i) || e.match(/<svg/i));
      },
      getMimeType: function (e, t, i) {
        switch (e) {
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
            return "image/jpeg";
          case "89504e47":
            return "image/png";
          case "47494638":
            return "image/gif";
          case "49492a00":
            return "image/tiff";
          case "52494646":
            return "image/webp";
          case "66747970":
            return "video/3gp";
          case "4f676753":
            return "video/ogg";
          case "1a45dfa3":
            return "video/mkv";
          case "000001ba":
          case "000001b3":
            return "video/mpeg";
          case "3026b275":
            return "video/wmv";
          case "25504446":
            return "application/pdf";
          case "25215053":
            return "application/ps";
          case "504b0304":
          case "504b0506":
          case "504b0508":
            return "application/zip";
          case "377abcaf":
            return "application/7z";
          case "75737461":
            return "application/tar";
          case "7801730d":
            return "application/dmg";
          default:
            switch (e.substring(0, 6)) {
              case "435753":
                return "application/x-shockwave-flash";
              case "494433":
                return "audio/mp3";
              case "425a68":
                return "application/bzip";
              default:
                switch (e.substring(0, 4)) {
                  case "424d":
                    return "image/bmp";
                  case "fffb":
                    return "audio/mp3";
                  case "4d5a":
                    return "application/exe";
                  case "1f9d":
                  case "1fa0":
                    return "application/zip";
                  case "1f8b":
                    return "application/gzip";
                  default:
                    return t && !t.match(/[^\u0000-\u007f]/) ? "application/text-plain" : i;
                }
            }
        }
      },
      addCss: function (e, t) {
        e.removeClass(t).addClass(t);
      },
      getElement: function (i, a, r) {
        return t.isEmpty(i) || t.isEmpty(i[a]) ? r : e(i[a]);
      },
      createElement: function (t, i) {
        return (i = i || "div"), e(e.parseHTML("<" + i + ">" + t + "</" + i + ">"));
      },
      uniqId: function () {
        return (new Date().getTime() + Math.floor(Math.random() * Math.pow(10, 15))).toString(36);
      },
      cspBuffer: {
        CSP_ATTRIB: "data-csp-01928735",
        domElementsStyles: {},
        stash: function (i) {
          var a = this,
            r = e.parseHTML("<div>" + i + "</div>"),
            s = e(r);
          return (
            s.find("[style]").each(function (i, r) {
              var s = e(r),
                n = s[0].style,
                o = t.uniqId(),
                l = {};
              n &&
                n.length &&
                (e(n).each(function () {
                  l[this] = n[this];
                }),
                (a.domElementsStyles[o] = l),
                s.removeAttr("style").attr(a.CSP_ATTRIB, o));
            }),
            s.filter("*").removeAttr("style"),
            (Object.values
              ? Object.values(r)
              : Object.keys(r).map(function (e) {
                  return r[e];
                })
            )
              .flatMap(function (e) {
                return e.innerHTML;
              })
              .join("")
          );
        },
        apply: function (t) {
          var i = this;
          e(t)
            .find("[" + i.CSP_ATTRIB + "]")
            .each(function (t, a) {
              var r = e(a),
                s = r.attr(i.CSP_ATTRIB),
                n = i.domElementsStyles[s];
              n && r.css(n), r.removeAttr(i.CSP_ATTRIB);
            }),
            (i.domElementsStyles = {});
        },
      },
      setHtml: function (e, i) {
        var a = t.cspBuffer;
        return e.html(a.stash(i)), a.apply(e), e;
      },
      htmlEncode: function (e, t) {
        return void 0 === e
          ? t || null
          : e
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");
      },
      replaceTags: function (t, i) {
        var a = t;
        return i
          ? (e.each(i, function (e, t) {
              "function" == typeof t && (t = t()), (a = a.split(e).join(t));
            }),
            a)
          : a;
      },
      cleanMemory: function (e) {
        var i = e.is("img") ? e.attr("src") : e.find("source").attr("src");
        t.revokeObjectURL(i);
      },
      findFileName: function (e) {
        var t = e.lastIndexOf("/");
        return -1 === t && (t = e.lastIndexOf("\\")), e.split(e.substring(t, t + 1)).pop();
      },
      checkFullScreen: function () {
        return (
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        );
      },
      toggleFullScreen: function (e) {
        var i = document,
          a = i.documentElement,
          r = t.checkFullScreen();
        a && e && !r
          ? a.requestFullscreen
            ? a.requestFullscreen()
            : a.msRequestFullscreen
            ? a.msRequestFullscreen()
            : a.mozRequestFullScreen
            ? a.mozRequestFullScreen()
            : a.webkitRequestFullscreen && a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          : r &&
            (i.exitFullscreen
              ? i.exitFullscreen()
              : i.msExitFullscreen
              ? i.msExitFullscreen()
              : i.mozCancelFullScreen
              ? i.mozCancelFullScreen()
              : i.webkitExitFullscreen && i.webkitExitFullscreen());
      },
      moveArray: function (t, i, a, r) {
        var s = e.extend(!0, [], t);
        if ((r && s.reverse(), a >= s.length)) for (var n = a - s.length; 1 + n--; ) s.push(void 0);
        return s.splice(a, 0, s.splice(i, 1)[0]), r && s.reverse(), s;
      },
      closeButton: function (e) {
        return (
          '<button type="button" class="' +
          (e = (t.isBs(5) ? "btn-close" : "close") + (e ? " " + e : "")) +
          '" aria-label="Close">\n' +
          (t.isBs(5) ? "" : '  <span aria-hidden="true">&times;</span>\n') +
          "</button>"
        );
      },
      getRotation: function (e) {
        switch (e) {
          case 2:
            return "rotateY(180deg)";
          case 3:
            return "rotate(180deg)";
          case 4:
            return "rotate(180deg) rotateY(180deg)";
          case 5:
            return "rotate(270deg) rotateY(180deg)";
          case 6:
            return "rotate(90deg)";
          case 7:
            return "rotate(90deg) rotateY(180deg)";
          case 8:
            return "rotate(270deg)";
          default:
            return "";
        }
      },
      setTransform: function (e, t) {
        e &&
          ((e.style.transform = t),
          (e.style.webkitTransform = t),
          (e.style["-moz-transform"] = t),
          (e.style["-ms-transform"] = t),
          (e.style["-o-transform"] = t));
      },
      getObjectKeys: function (t) {
        var i = [];
        return (
          t &&
            e.each(t, function (e) {
              i.push(e);
            }),
          i
        );
      },
      getObjectSize: function (e) {
        return t.getObjectKeys(e).length;
      },
      whenAll: function (i) {
        var a,
          r,
          s,
          n,
          o,
          l,
          d = [].slice,
          c = 1 === arguments.length && t.isArray(i) ? i : d.call(arguments),
          u = e.Deferred(),
          p = 0,
          f = c.length,
          h = f;
        for (
          s = n = o = Array(f),
            l = function (e, t, i) {
              return function () {
                i !== c && p++,
                  u.notifyWith((t[e] = this), (i[e] = d.call(arguments))),
                  --h || u[(p ? "reject" : "resolve") + "With"](t, i);
              };
            },
            a = 0;
          a < f;
          a++
        )
          (r = c[a]) && e.isFunction(r.promise)
            ? r.promise().done(l(a, o, c)).fail(l(a, s, n))
            : (u.notifyWith(this, r), --h);
        return h || u.resolveWith(o, c), u.promise();
      },
    }),
    ((i = function (i, a) {
      (this.$element = e(i)),
        (this.$parent = this.$element.parent()),
        this._validate() &&
          ((this.isPreviewable = t.hasFileAPISupport()),
          (this.isIE9 = t.isIE(9)),
          (this.isIE10 = t.isIE(10)),
          (this.isPreviewable || this.isIE9) && (this._init(a), this._listen()),
          this.$element.removeClass("file-loading"));
    }).prototype = {
      constructor: i,
      _cleanup: function () {
        (this.reader = null),
          this.clearFileStack(),
          (this.fileBatchCompleted = !0),
          (this.isError = !1),
          (this.isDuplicateError = !1),
          (this.isPersistentError = !1),
          (this.cancelling = !1),
          (this.paused = !1),
          (this.lastProgress = 0),
          this._initAjax();
      },
      _isAborted: function () {
        return this.cancelling || this.paused;
      },
      _initAjax: function () {
        var i = (this.taskManager = {
          pool: {},
          addPool: function (e) {
            return (i.pool[e] = new i.TasksPool(e));
          },
          getPool: function (e) {
            return i.pool[e];
          },
          addTask: function (e, t) {
            return new i.Task(e, t);
          },
          TasksPool: function (a) {
            var r = this;
            (r.id = a),
              (r.cancelled = !1),
              (r.cancelledDeferrer = e.Deferred()),
              (r.tasks = {}),
              (r.addTask = function (e, t) {
                return (r.tasks[e] = new i.Task(e, t));
              }),
              (r.size = function () {
                return t.getObjectSize(r.tasks);
              }),
              (r.run = function (i) {
                var a,
                  s,
                  n,
                  o = 0,
                  l = !1,
                  d = t.getObjectKeys(r.tasks).map(function (e) {
                    return r.tasks[e];
                  }),
                  c = [],
                  u = e.Deferred();
                if (r.cancelled) return r.cancelledDeferrer.resolve(), u.reject();
                if (!i) {
                  var p = t.getObjectKeys(r.tasks).map(function (e) {
                    return r.tasks[e].deferred;
                  });
                  return (
                    t
                      .whenAll(p)
                      .done(function () {
                        var e = t.getArray(arguments);
                        r.cancelled
                          ? (u.reject.apply(null, e), r.cancelledDeferrer.resolve())
                          : (u.resolve.apply(null, e), r.cancelledDeferrer.reject());
                      })
                      .fail(function () {
                        var e = t.getArray(arguments);
                        u.reject.apply(null, e),
                          r.cancelled ? r.cancelledDeferrer.resolve() : r.cancelledDeferrer.reject();
                      }),
                    e.each(r.tasks, function (e) {
                      (a = r.tasks[e]).run();
                    }),
                    u
                  );
                }
                for (
                  s = function (t) {
                    e.when(t.deferred)
                      .fail(function () {
                        (l = !0), n.apply(null, arguments);
                      })
                      .always(n);
                  },
                    n = function () {
                      var e = t.getArray(arguments);
                      if ((u.notify(e), c.push(e), r.cancelled))
                        return u.reject.apply(null, c), void r.cancelledDeferrer.resolve();
                      c.length === r.size() && (l ? u.reject.apply(null, c) : u.resolve.apply(null, c)),
                        d.length && ((a = d.shift()), s(a), a.run());
                    };
                  d.length && o++ < i;

                )
                  (a = d.shift()), s(a), a.run();
                return u;
              }),
              (r.cancel = function () {
                return (r.cancelled = !0), r.cancelledDeferrer;
              });
          },
          Task: function (i, a) {
            var r = this;
            (r.id = i),
              (r.deferred = e.Deferred()),
              (r.logic = a),
              (r.context = null),
              (r.run = function () {
                var e = t.getArray(arguments);
                return e.unshift(r.deferred), a.apply(r.context, e), r.deferred;
              }),
              (r.runWithContext = function (e) {
                return (r.context = e), r.run();
              });
          },
        });
        (this.ajaxQueue = []), (this.ajaxRequests = []), (this.ajaxAborted = !1);
      },
      _init: function (i, a) {
        var r,
          s,
          n,
          o,
          l = this,
          d = l.$element;
        (l.options = i),
          (l.canOrientImage = t.canOrientImage(d)),
          e.each(i, function (e, i) {
            switch (e) {
              case "minFileCount":
              case "maxFileCount":
              case "maxTotalFileCount":
              case "minFileSize":
              case "maxFileSize":
              case "maxFilePreviewSize":
              case "resizeQuality":
              case "resizeIfSizeMoreThan":
              case "progressUploadThreshold":
              case "initialPreviewCount":
              case "zoomModalHeight":
              case "minImageHeight":
              case "maxImageHeight":
              case "minImageWidth":
              case "maxImageWidth":
              case "bytesToKB":
                l[e] = t.getNum(i);
                break;
              default:
                l[e] = i;
            }
          }),
          (!l.bytesToKB || l.bytesToKB <= 0) && (l.bytesToKB = 1024),
          void 0 === l.errorCloseButton &&
            (l.errorCloseButton = t.closeButton("kv-error-close" + (t.isBs(5) ? "  float-end" : ""))),
          l.maxTotalFileCount > 0 && l.maxTotalFileCount < l.maxFileCount && (l.maxTotalFileCount = l.maxFileCount),
          l.rtl &&
            ((o = l.previewZoomButtonIcons.prev),
            (l.previewZoomButtonIcons.prev = l.previewZoomButtonIcons.next),
            (l.previewZoomButtonIcons.next = o)),
          !isNaN(l.maxAjaxThreads) &&
            l.maxAjaxThreads < l.resumableUploadOptions.maxThreads &&
            (l.resumableUploadOptions.maxThreads = l.maxAjaxThreads),
          l._initFileManager(),
          "function" == typeof l.autoOrientImage && (l.autoOrientImage = l.autoOrientImage()),
          "function" == typeof l.autoOrientImageInitial && (l.autoOrientImageInitial = l.autoOrientImageInitial()),
          a || l._cleanup(),
          (l.duplicateErrors = []),
          (l.$form = d.closest("form")),
          l._initTemplateDefaults(),
          (l.uploadFileAttr = t.isEmpty(d.attr("name")) ? "file_data" : d.attr("name")),
          (n = l._getLayoutTemplate("progress")),
          (l.progressTemplate = n.replace("{class}", l.progressClass)),
          (l.progressInfoTemplate = n.replace("{class}", l.progressInfoClass)),
          (l.progressPauseTemplate = n.replace("{class}", l.progressPauseClass)),
          (l.progressCompleteTemplate = n.replace("{class}", l.progressCompleteClass)),
          (l.progressErrorTemplate = n.replace("{class}", l.progressErrorClass)),
          (l.isDisabled = d.attr("disabled") || d.attr("readonly")),
          l.isDisabled && d.attr("disabled", !0),
          (l.isClickable =
            l.browseOnZoneClick && l.showPreview && (l.dropZoneEnabled || !t.isEmpty(l.defaultPreviewContent))),
          (l.isAjaxUpload = t.hasFileUploadSupport() && !t.isEmpty(l.uploadUrl)),
          (l.dropZoneEnabled = t.hasDragDropSupport() && l.dropZoneEnabled),
          l.isAjaxUpload || (l.dropZoneEnabled = l.dropZoneEnabled && t.canAssignFilesToInput()),
          (l.slug = "function" == typeof i.slugCallback ? i.slugCallback : l._slugDefault),
          (l.mainTemplate = l.showCaption ? l._getLayoutTemplate("main1") : l._getLayoutTemplate("main2")),
          (l.captionTemplate = l._getLayoutTemplate("caption")),
          (l.previewGenericTemplate = l._getPreviewTemplate("generic")),
          !l.imageCanvas &&
            l.resizeImage &&
            (l.maxImageWidth || l.maxImageHeight) &&
            ((l.imageCanvas = document.createElement("canvas")),
            (l.imageCanvasContext = l.imageCanvas.getContext("2d"))),
          t.isEmpty(d.attr("id")) && d.attr("id", t.uniqId()),
          (l.namespace = ".fileinput_" + d.attr("id").replace(/-/g, "_")),
          void 0 === l.$container ? (l.$container = l._createContainer()) : l._refreshContainer(),
          (s = l.$container),
          (l.$dropZone = s.find(".file-drop-zone")),
          (l.$progress = s.find(".kv-upload-progress")),
          (l.$btnUpload = s.find(".fileinput-upload")),
          (l.$captionContainer = t.getElement(i, "elCaptionContainer", s.find(".file-caption"))),
          (l.$caption = t.getElement(i, "elCaptionText", s.find(".file-caption-name"))),
          t.isEmpty(l.msgPlaceholder) ||
            ((r = d.attr("multiple") ? l.filePlural : l.fileSingle),
            l.$caption.attr("placeholder", l.msgPlaceholder.replace("{files}", r))),
          (l.$captionIcon = l.$captionContainer.find(".file-caption-icon")),
          (l.$previewContainer = t.getElement(i, "elPreviewContainer", s.find(".file-preview"))),
          (l.$preview = t.getElement(i, "elPreviewImage", s.find(".file-preview-thumbnails"))),
          (l.$previewStatus = t.getElement(i, "elPreviewStatus", s.find(".file-preview-status"))),
          (l.$errorContainer = t.getElement(i, "elErrorContainer", l.$previewContainer.find(".kv-fileinput-error"))),
          l._validateDisabled(),
          t.isEmpty(l.msgErrorClass) || t.addCss(l.$errorContainer, l.msgErrorClass),
          a
            ? l._errorsExist() || l.$errorContainer.hide()
            : (l._resetErrors(),
              l.$errorContainer.hide(),
              (l.previewInitId = "thumb-" + d.attr("id")),
              l._initPreviewCache(),
              l._initPreview(!0),
              l._initPreviewActions(),
              l.$parent.hasClass("file-loading") && (l.$container.insertBefore(l.$parent), l.$parent.remove())),
          l._setFileDropZoneTitle(),
          d.attr("disabled") && l.disable(),
          l._initZoom(),
          l.hideThumbnailContent && t.addCss(l.$preview, "hide-content");
      },
      _initFileManager: function () {
        var i = this;
        (i.uploadStartTime = t.now()),
          (i.fileManager = {
            stack: {},
            filesProcessed: [],
            errors: [],
            loadedImages: {},
            totalImages: 0,
            totalFiles: null,
            totalSize: null,
            uploadedSize: 0,
            stats: {},
            bpsLog: [],
            bps: 0,
            initStats: function (e) {
              var a = { started: t.now() };
              e ? (i.fileManager.stats[e] = a) : (i.fileManager.stats = a);
            },
            getUploadStats: function (e, a, r) {
              var s,
                n = i.fileManager,
                o = e ? (n.stats[e] && n.stats[e].started) || t.now() : i.uploadStartTime,
                l = (t.now() - o) / 1e3,
                d = Math.ceil(l ? a / l : 0),
                c = r - a,
                u = n.bpsLog.length ? i.bitrateUpdateDelay : 0;
              return (
                setTimeout(function () {
                  var e,
                    t,
                    i,
                    a = 0,
                    r = 0;
                  for (
                    n.bpsLog.push(d),
                      n.bpsLog.sort(function (e, t) {
                        return e - t;
                      }),
                      i = (t = n.bpsLog.length) > 10 ? t - 10 : Math.ceil(t / 2),
                      e = t;
                    e > i;
                    e--
                  )
                    (r = parseFloat(n.bpsLog[e])), a++;
                  n.bps = 64 * (a > 0 ? r / a : 0);
                }, u),
                (s = {
                  fileId: e,
                  started: o,
                  elapsed: l,
                  loaded: a,
                  total: r,
                  bps: n.bps,
                  bitrate: i._getSize(n.bps, i.bitRateUnits),
                  pendingBytes: c,
                }),
                e ? (n.stats[e] = s) : (n.stats = s),
                s
              );
            },
            exists: function (t) {
              return -1 !== e.inArray(t, i.fileManager.getIdList());
            },
            count: function () {
              return i.fileManager.getIdList().length;
            },
            total: function () {
              var e = i.fileManager;
              return e.totalFiles || (e.totalFiles = e.count()), e.totalFiles;
            },
            getTotalSize: function () {
              var t = i.fileManager;
              return t.totalSize
                ? t.totalSize
                : ((t.totalSize = 0),
                  e.each(i.getFileStack(), function (e, i) {
                    var a = parseFloat(i.size);
                    t.totalSize += isNaN(a) ? 0 : a;
                  }),
                  t.totalSize);
            },
            add: function (e, a) {
              a || (a = i.fileManager.getId(e)),
                a &&
                  (i.fileManager.stack[a] = {
                    file: e,
                    name: t.getFileName(e),
                    relativePath: t.getFileRelativePath(e),
                    size: e.size,
                    nameFmt: i._getFileName(e, ""),
                    sizeFmt: i._getSize(e.size),
                  });
            },
            remove: function (e) {
              var t = i._getThumbFileId(e);
              i.fileManager.removeFile(t);
            },
            removeFile: function (e) {
              var t = i.fileManager;
              e && (delete t.stack[e], delete t.loadedImages[e]);
            },
            move: function (t, a) {
              var r = {},
                s = i.fileManager.stack;
              (t || a) &&
                t !== a &&
                (e.each(s, function (e, i) {
                  e !== t && (r[e] = i), e === a && (r[t] = s[t]);
                }),
                (i.fileManager.stack = r));
            },
            list: function () {
              var t = [];
              return (
                e.each(i.getFileStack(), function (e, i) {
                  i && i.file && t.push(i.file);
                }),
                t
              );
            },
            isPending: function (t) {
              return -1 === e.inArray(t, i.fileManager.filesProcessed) && i.fileManager.exists(t);
            },
            isProcessed: function () {
              var t = !0,
                a = i.fileManager;
              return (
                e.each(i.getFileStack(), function (e) {
                  a.isPending(e) && (t = !1);
                }),
                t
              );
            },
            clear: function () {
              var e = i.fileManager;
              (i.isDuplicateError = !1),
                (i.isPersistentError = !1),
                (e.totalFiles = null),
                (e.totalSize = null),
                (e.uploadedSize = 0),
                (e.stack = {}),
                (e.errors = []),
                (e.filesProcessed = []),
                (e.stats = {}),
                (e.bpsLog = []),
                (e.bps = 0),
                e.clearImages();
            },
            clearImages: function () {
              (i.fileManager.loadedImages = {}), (i.fileManager.totalImages = 0);
            },
            addImage: function (e, t) {
              i.fileManager.loadedImages[e] = t;
            },
            removeImage: function (e) {
              delete i.fileManager.loadedImages[e];
            },
            getImageIdList: function () {
              return t.getObjectKeys(i.fileManager.loadedImages);
            },
            getImageCount: function () {
              return i.fileManager.getImageIdList().length;
            },
            getId: function (e) {
              return i._getFileId(e);
            },
            getIndex: function (e) {
              return i.fileManager.getIdList().indexOf(e);
            },
            getThumb: function (t) {
              var a = null;
              return (
                i._getThumbs().each(function () {
                  var r = e(this);
                  i._getThumbFileId(r) === t && (a = r);
                }),
                a
              );
            },
            getThumbIndex: function (e) {
              var t = i._getThumbFileId(e);
              return i.fileManager.getIndex(t);
            },
            getIdList: function () {
              return t.getObjectKeys(i.fileManager.stack);
            },
            getFile: function (e) {
              return i.fileManager.stack[e] || null;
            },
            getFileName: function (e, t) {
              var a = i.fileManager.getFile(e);
              return a ? (t ? a.nameFmt || "" : a.name || "") : "";
            },
            getFirstFile: function () {
              var e = i.fileManager.getIdList(),
                t = e && e.length ? e[0] : null;
              return i.fileManager.getFile(t);
            },
            setFile: function (e, t) {
              i.fileManager.getFile(e) ? (i.fileManager.stack[e].file = t) : i.fileManager.add(t, e);
            },
            setProcessed: function (e) {
              i.fileManager.filesProcessed.push(e);
            },
            getProgress: function () {
              var e = i.fileManager.total(),
                t = i.fileManager.filesProcessed.length;
              return e ? Math.ceil((t / e) * 100) : 0;
            },
            setProgress: function (e, t) {
              var a = i.fileManager.getFile(e);
              !isNaN(t) && a && (a.progress = t);
            },
          });
      },
      _setUploadData: function (i, a) {
        var r = this;
        e.each(a, function (e, a) {
          var s = r.uploadParamNames[e] || e;
          t.isArray(a) ? i.append(s, a[0], a[1]) : i.append(s, a);
        });
      },
      _initResumableUpload: function () {
        var i,
          a = this,
          r = a.resumableUploadOptions,
          s = t.logMessages,
          n = a.fileManager;
        if (a.enableResumableUpload)
          if (
            (!1 !== r.fallback &&
              "function" != typeof r.fallback &&
              (r.fallback = function (e) {
                e._log(s.noResumableSupport), (e.enableResumableUpload = !1);
              }),
            t.hasResumableUploadSupport() || !1 === r.fallback)
          ) {
            if (!a.uploadUrl && a.enableResumableUpload)
              return a._log(s.noUploadUrl), void (a.enableResumableUpload = !1);
            if (((r.chunkSize = parseFloat(r.chunkSize)), r.chunkSize <= 0 || isNaN(r.chunkSize)))
              return a._log(s.invalidChunkSize, { chunkSize: r.chunkSize }), void (a.enableResumableUpload = !1);
            (i = a.resumableManager =
              {
                init: function (e, t, s) {
                  (i.logs = []),
                    (i.stack = []),
                    (i.error = ""),
                    (i.id = e),
                    (i.file = t.file),
                    (i.fileName = t.name),
                    (i.fileIndex = s),
                    (i.completed = !1),
                    (i.lastProgress = 0),
                    a.showPreview &&
                      ((i.$thumb = n.getThumb(e) || null),
                      (i.$progress = i.$btnDelete = null),
                      i.$thumb &&
                        i.$thumb.length &&
                        ((i.$progress = i.$thumb.find(".file-thumb-progress")),
                        (i.$btnDelete = i.$thumb.find(".kv-file-remove")))),
                    (i.chunkSize = r.chunkSize * a.bytesToKB),
                    (i.chunkCount = i.getTotalChunks());
                },
                setAjaxError: function (e, t, n, o) {
                  e.responseJSON && e.responseJSON.error && (n = e.responseJSON.error.toString()),
                    o || (i.error = n),
                    r.showErrorLog && a._log(s.ajaxError, { status: e.status, error: n, text: e.responseText || "" });
                },
                reset: function () {
                  (i.stack = []), (i.chunksProcessed = {});
                },
                setProcessed: function (t) {
                  var s,
                    o,
                    l = i.id,
                    d = i.$thumb,
                    c = i.$progress,
                    u = d && d.length,
                    p = { id: u ? d.attr("id") : "", index: n.getIndex(l), fileId: l },
                    f = a.resumableUploadOptions.skipErrorsAndProceed;
                  (i.completed = !0),
                    (i.lastProgress = 0),
                    u && d.removeClass("file-uploading"),
                    "success" === t
                      ? ((n.uploadedSize += i.file.size),
                        a.showPreview &&
                          (a._setProgress(101, c),
                          a._setThumbStatus(d, "Success"),
                          a._initUploadSuccess(i.chunksProcessed[l].data, d)),
                        n.removeFile(l),
                        delete i.chunksProcessed[l],
                        a._raise("fileuploaded", [p.id, p.index, p.fileId]),
                        n.isProcessed() && a._setProgress(101))
                      : "cancel" !== t &&
                        (a.showPreview &&
                          (a._setThumbStatus(d, "Error"),
                          a._setPreviewError(d, !0),
                          a._setProgress(101, c, a.msgProgressError),
                          a._setProgress(101, a.$progress, a.msgProgressError),
                          (a.cancelling = !f)),
                        a.$errorContainer.find('li[data-file-id="' + p.fileId + '"]').length ||
                          ((o = { file: i.fileName, max: r.maxRetries, error: i.error }),
                          (s = a.msgResumableUploadRetriesExceeded.setTokens(o)),
                          e.extend(p, o),
                          a._showFileError(s, p, "filemaxretries"),
                          f && (n.removeFile(l), delete i.chunksProcessed[l], n.isProcessed() && a._setProgress(101)))),
                    n.isProcessed() && i.reset();
                },
                check: function () {
                  e.each(i.logs, function (e, t) {
                    if (!t) return !1, !1;
                  });
                },
                processedResumables: function () {
                  var e,
                    t = i.logs,
                    a = 0;
                  if (!t || !t.length) return 0;
                  for (e = 0; e < t.length; e++) !0 === t[e] && a++;
                  return a;
                },
                getUploadedSize: function () {
                  var e = i.processedResumables() * i.chunkSize;
                  return e > i.file.size ? i.file.size : e;
                },
                getTotalChunks: function () {
                  var e = parseFloat(i.chunkSize);
                  return !isNaN(e) && e > 0 ? Math.ceil(i.file.size / e) : 0;
                },
                getProgress: function () {
                  var e = i.processedResumables(),
                    t = i.chunkCount;
                  return 0 === t ? 0 : Math.ceil((e / t) * 100);
                },
                checkAborted: function (e) {
                  a._isAborted() && (clearInterval(e), a.unlock());
                },
                upload: function () {
                  var e,
                    r = n.getIdList(),
                    s = "new";
                  e = setInterval(function () {
                    var o;
                    if (
                      (i.checkAborted(e),
                      "new" === s &&
                        (a.lock(),
                        (s = "processing"),
                        (o = r.shift()),
                        n.initStats(o),
                        n.stack[o] && (i.init(o, n.stack[o], n.getIndex(o)), i.processUpload())),
                      !n.isPending(o) && i.completed && (s = "new"),
                      n.isProcessed())
                    ) {
                      var l = a.$preview.find(".file-preview-initial");
                      l.length && (t.addCss(l, t.SORT_CSS), a._initSortable()),
                        clearInterval(e),
                        a._clearFileInput(),
                        a.unlock(),
                        setTimeout(function () {
                          var e = a.previewCache.data;
                          e &&
                            ((a.initialPreview = e.content),
                            (a.initialPreviewConfig = e.config),
                            (a.initialPreviewThumbTags = e.tags)),
                            a._raise("filebatchuploadcomplete", [
                              a.initialPreview,
                              a.initialPreviewConfig,
                              a.initialPreviewThumbTags,
                              a._getExtraData(),
                            ]);
                        }, a.processDelay);
                    }
                  }, a.processDelay);
                },
                uploadResumable: function () {
                  var e,
                    t,
                    s = a.taskManager,
                    n = i.chunkCount;
                  for (t = s.addPool(i.id), e = 0; e < n; e++)
                    (i.logs[e] = !(!i.chunksProcessed[i.id] || !i.chunksProcessed[i.id][e])),
                      i.logs[e] || i.pushAjax(e, 0);
                  t.run(r.maxThreads)
                    .done(function () {
                      i.setProcessed("success");
                    })
                    .fail(function () {
                      i.setProcessed(t.cancelled ? "cancel" : "error");
                    });
                },
                processUpload: function () {
                  var s,
                    o,
                    l,
                    d,
                    c,
                    u,
                    p,
                    f = i.id;
                  r.testUrl
                    ? ((s = new FormData()),
                      (o = n.stack[f]),
                      a._setUploadData(s, {
                        fileId: f,
                        fileName: o.fileName,
                        fileSize: o.size,
                        fileRelativePath: o.relativePath,
                        chunkSize: i.chunkSize,
                        chunkCount: i.chunkCount,
                      }),
                      (l = function (e) {
                        (p = a._getOutData(s, e)), a._raise("filetestbeforesend", [f, n, i, p]);
                      }),
                      (d = function (r, o, l) {
                        p = a._getOutData(s, l, r);
                        var d = a.uploadParamNames.chunksUploaded || "chunksUploaded",
                          c = [f, n, i, p];
                        r[d] && t.isArray(r[d])
                          ? (i.chunksProcessed[f] || (i.chunksProcessed[f] = {}),
                            e.each(r[d], function (e, t) {
                              (i.logs[t] = !0), (i.chunksProcessed[f][t] = !0);
                            }),
                            (i.chunksProcessed[f].data = r),
                            a._raise("filetestsuccess", c))
                          : a._raise("filetesterror", c),
                          i.uploadResumable();
                      }),
                      (c = function (e, t, r) {
                        (p = a._getOutData(s, e)),
                          a._raise("filetestajaxerror", [f, n, i, p]),
                          i.setAjaxError(e, t, r, !0),
                          i.uploadResumable();
                      }),
                      (u = function () {
                        a._raise("filetestcomplete", [f, n, i, a._getOutData(s)]);
                      }),
                      a._ajaxSubmit(l, d, u, c, s, f, i.fileIndex, r.testUrl))
                    : i.uploadResumable();
                },
                pushAjax: function (e, t) {
                  var r = a.taskManager.getPool(i.id);
                  r.addTask(r.size() + 1, function (e) {
                    var t,
                      r = i.stack.shift();
                    (t = r[0]),
                      i.chunksProcessed[i.id] && i.chunksProcessed[i.id][t]
                        ? a._log(s.chunkQueueError, { index: t })
                        : i.sendAjax(t, r[1], e);
                  }),
                    i.stack.push([e, t]);
                },
                sendAjax: function (e, o, l) {
                  var d,
                    c = i.chunkSize,
                    u = i.id,
                    p = i.file,
                    f = i.$thumb,
                    h = t.logMessages,
                    m = i.$btnDelete,
                    g = function (e, t) {
                      t && (e = e.setTokens(t)),
                        (e = h.resumableRequestError.setTokens({ msg: e })),
                        a._log(e),
                        l.reject(e);
                    };
                  if (!i.chunksProcessed[u] || !i.chunksProcessed[u][e]) {
                    if (o > r.maxRetries)
                      return g(h.resumableMaxRetriesReached, { n: r.maxRetries }), void i.setProcessed("error");
                    var v,
                      w,
                      b,
                      _,
                      C,
                      x,
                      y = p[p.slice ? "slice" : p.mozSlice ? "mozSlice" : p.webkitSlice ? "webkitSlice" : "slice"](
                        c * e,
                        c * (e + 1)
                      );
                    (v = new FormData()),
                      (d = n.stack[u]),
                      a._setUploadData(v, {
                        chunkCount: i.chunkCount,
                        chunkIndex: e,
                        chunkSize: c,
                        chunkSizeStart: c * e,
                        fileBlob: [y, i.fileName],
                        fileId: u,
                        fileName: i.fileName,
                        fileRelativePath: d.relativePath,
                        fileSize: p.size,
                        retryCount: o,
                      }),
                      i.$progress && i.$progress.length && i.$progress.show(),
                      (b = function (r) {
                        (w = a._getOutData(v, r)),
                          a.showPreview &&
                            (f.hasClass("file-preview-success") ||
                              (a._setThumbStatus(f, "Loading"), t.addCss(f, "file-uploading")),
                            m.attr("disabled", !0)),
                          a._raise("filechunkbeforesend", [u, e, o, n, i, w]);
                      }),
                      (_ = function (t, d, c) {
                        if (a._isAborted()) g(h.resumableAborting);
                        else {
                          w = a._getOutData(v, c, t);
                          var p = a.uploadParamNames.chunkIndex || "chunkIndex",
                            f = [u, e, o, n, i, w];
                          t.error
                            ? (r.showErrorLog &&
                                a._log(s.retryStatus, { retry: o + 1, filename: i.fileName, chunk: e }),
                              a._raise("filechunkerror", f),
                              i.pushAjax(e, o + 1),
                              (i.error = t.error),
                              g(t.error))
                            : ((i.logs[t[p]] = !0),
                              i.chunksProcessed[u] || (i.chunksProcessed[u] = {}),
                              (i.chunksProcessed[u][t[p]] = !0),
                              (i.chunksProcessed[u].data = t),
                              l.resolve.call(null, t),
                              a._raise("filechunksuccess", f),
                              i.check());
                        }
                      }),
                      (C = function (t, r, s) {
                        a._isAborted()
                          ? g(h.resumableAborting)
                          : ((w = a._getOutData(v, t)),
                            i.setAjaxError(t, r, s),
                            a._raise("filechunkajaxerror", [u, e, o, n, i, w]),
                            i.pushAjax(e, o + 1),
                            g(h.resumableRetryError, { n: o - 1 }));
                      }),
                      (x = function () {
                        a._isAborted() || a._raise("filechunkcomplete", [u, e, o, n, i, a._getOutData(v)]);
                      }),
                      a._ajaxSubmit(b, _, x, C, v, u, i.fileIndex);
                  }
                },
              }).reset();
          } else r.fallback(a);
      },
      _initTemplateDefaults: function () {
        var i,
          a,
          r,
          s,
          n,
          o,
          l,
          d,
          c,
          u,
          p,
          f,
          h,
          m,
          g,
          v,
          w,
          b,
          _,
          C = this,
          x = function (e, i) {
            return (
              '<object class="kv-preview-data file-preview-' +
              e +
              '" title="{caption}" data="{data}" type="' +
              i +
              '"' +
              w +
              ">\n" +
              t.DEFAULT_PREVIEW +
              "\n</object>\n"
            );
          },
          y = "btn btn-sm btn-kv " + t.defaultButtonCss();
        (i =
          '{preview}\n<div class="kv-upload-progress kv-hidden"></div><div class="clearfix"></div>\n<div class="file-caption {class}">\n  <div class="input-group {inputGroupClass}">\n      {caption}\n<span class="file-caption-icon"></span>\n' +
          (t.isBs(5) ? "" : '<div class="input-group-btn input-group-append">\n') +
          "      {remove}\n      {cancel}\n      {pause}\n      {upload}\n      {browse}\n" +
          (t.isBs(5) ? "" : "    </div>\n") +
          "  </div>"),
          (a = t.closeButton("fileinput-remove")),
          (_ = t.MODAL_ID + "Label"),
          (r =
            '<div id="' +
            t.MODAL_ID +
            '" class="file-zoom-dialog modal fade" aria-labelledby="' +
            _ +
            '" {tabIndexConfig}></div>'),
          (s =
            '<div class="modal-dialog modal-lg{rtl}" role="document">\n  <div class="modal-content">\n    <div class="modal-header kv-zoom-header">\n      <h6 class="modal-title kv-zoom-title" id="' +
            _ +
            '"><span class="kv-zoom-caption"></span> <span class="kv-zoom-size"></span></h6>\n      <div class="kv-zoom-actions">{toggleheader}{fullscreen}{borderless}{close}</div>\n    </div>\n    <div class="floating-buttons"></div>\n    <div class="kv-zoom-body file-zoom-content {zoomFrameClass}"></div>\n{prev} {next}\n    <div class="kv-zoom-description"></div>\n  </div>\n</div>\n'),
          (n =
            '<div class="file-preview-frame {frameClass}" id="{previewId}" data-fileindex="{fileindex}" data-fileid="{fileid}" data-template="{template}" data-zoom="{zoomData}"'),
          (w = " {style}"),
          (o = x("html", "text/html")),
          (d = x("text", "text/plain;charset=UTF-8")),
          (g = x("pdf", "application/pdf")),
          (l = '<img src="{data}" class="file-preview-image kv-preview-data" title="{title}" alt="{alt}"' + w + ">\n"),
          (c =
            '<iframe class="kv-preview-data file-preview-office" src="https://view.officeapps.live.com/op/embed.aspx?src={data}"' +
            w +
            "></iframe>"),
          (u =
            '<iframe class="kv-preview-data file-preview-gdocs" src="https://docs.google.com/gview?url={data}&embedded=true"' +
            w +
            "></iframe>"),
          (p =
            '<video class="kv-preview-data file-preview-video" controls' +
            w +
            '>\n<source src="{data}" type="{type}">\n' +
            t.DEFAULT_PREVIEW +
            "\n</video>\n"),
          (f =
            '\x3c!--suppress ALL --\x3e<audio class="kv-preview-data file-preview-audio" controls' +
            w +
            '>\n<source src="{data}" type="{type}">\n' +
            t.DEFAULT_PREVIEW +
            "\n</audio>\n"),
          (h =
            '<embed class="kv-preview-data file-preview-flash" src="{data}" type="application/x-shockwave-flash"' +
            w +
            ">\n"),
          (m =
            '<object class="kv-preview-data file-preview-object file-object {typeCss}" data="{data}" type="{type}"' +
            w +
            '>\n<param name="movie" value="{caption}" />\n' +
            t.OBJECT_PARAMS +
            " " +
            t.DEFAULT_PREVIEW +
            "\n</object>\n"),
          (v = '<div class="kv-preview-data file-preview-other-frame"' + w + ">\n" + t.DEFAULT_PREVIEW + "\n</div>\n"),
          (b = { width: "100%", height: "100%", "min-height": "480px" }),
          C._isPdfRendered() && (g = C.pdfRendererTemplate.replace("{renderer}", C._encodeURI(C.pdfRendererUrl))),
          (C.defaults = {
            layoutTemplates: {
              main1: i,
              main2:
                '{preview}\n<div class="kv-upload-progress kv-hidden"></div>\n<div class="clearfix"></div>\n<span class="{class}">{remove}\n{cancel}\n{upload}\n{browse}\n</span>',
              preview:
                '<div class="file-preview {class}">\n  {close}  <div class="{dropClass} clearfix">\n    <div class="file-preview-thumbnails clearfix">\n    </div>\n    <div class="file-preview-status text-center text-success"></div>\n    <div class="kv-fileinput-error"></div>\n  </div>\n</div>',
              close: a,
              fileIcon: '<i class="bi-file-earmark-arrow-up"></i>',
              caption: '<input readonly class="file-caption-name form-control {class}">\n',
              modalMain: r,
              modal: s,
              descriptionClose: '<button type="button" class="kv-desc-hide" aria-label="Close">{closeIcon}</button>',
              progress:
                '<div class="progress">\n    <div class="{class}" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n        {status}\n     </div>\n</div>{stats}',
              stats:
                '<div class="text-primary file-upload-stats"><span class="pending-time">{pendingTime}</span> <span class="upload-speed">{uploadSpeed}</span></div>',
              size: " <samp>({sizeText})</samp>",
              footer:
                '<div class="file-thumbnail-footer">\n    <div class="file-footer-caption" title="{caption}">\n        <div class="file-caption-info">{caption}</div>\n        <div class="file-size-info">{size}</div>\n    </div>\n    {progress}\n{indicator}\n{actions}\n</div>',
              indicator: '<div class="file-upload-indicator" title="{indicatorTitle}">{indicator}</div>',
              actions:
                '<div class="file-actions">\n    <div class="file-footer-buttons">\n        {download} {upload} {delete} {zoom} {other}    </div>\n</div>\n{drag}\n<div class="clearfix"></div>',
              actionDelete:
                '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}" {dataUrl}{dataKey}>{removeIcon}</button>\n',
              actionUpload:
                '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">{uploadIcon}</button>',
              actionDownload:
                '<a class="kv-file-download {downloadClass}" title="{downloadTitle}" href="{downloadUrl}" download="{caption}" target="_blank">{downloadIcon}</a>',
              actionZoom:
                '<button type="button" class="kv-file-zoom {zoomClass}" title="{zoomTitle}">{zoomIcon}</button>',
              actionDrag: '<span class="file-drag-handle {dragClass}" title="{dragTitle}">{dragIcon}</span>',
              btnDefault:
                '<button type="{type}" title="{title}" class="{css}" {status} {tabIndexConfig}>{icon} {label}</button>',
              btnLink: '<a href="{href}" title="{title}" class="{css}" {status} {tabIndexConfig}>{icon} {label}</a>',
              btnBrowse: '<div class="{css}" {status} {tabIndexConfig}>{icon} {label}</div>',
              zoomCache: '<div class="kv-zoom-cache">{zoomContent}</div>',
            },
            previewMarkupTags: {
              tagBefore1:
                '<div class="file-preview-frame {frameClass}" id="{previewId}" data-fileindex="{fileindex}" data-fileid="{fileid}" data-template="{template}" data-zoom="{zoomData}"><div class="kv-file-content">\n',
              tagBefore2:
                '<div class="file-preview-frame {frameClass}" id="{previewId}" data-fileindex="{fileindex}" data-fileid="{fileid}" data-template="{template}" data-zoom="{zoomData}" title="{caption}"><div class="kv-file-content">\n',
              tagAfter: "</div>{footer}\n{zoomCache}</div>\n",
            },
            previewContentTemplates: {
              generic: "{content}\n",
              html: o,
              image: l,
              text: d,
              office: c,
              gdocs: u,
              video: p,
              audio: f,
              flash: h,
              object: m,
              pdf: g,
              other: v,
            },
            allowedPreviewTypes: ["image", "html", "text", "video", "audio", "flash", "pdf", "object"],
            previewTemplates: {},
            previewSettings: {
              image: { width: "auto", height: "auto", "max-width": "100%", "max-height": "100%" },
              html: { width: "213px", height: "160px" },
              text: { width: "213px", height: "160px" },
              office: { width: "213px", height: "160px" },
              gdocs: { width: "213px", height: "160px" },
              video: { width: "213px", height: "160px" },
              audio: { width: "100%", height: "30px" },
              flash: { width: "213px", height: "160px" },
              object: { width: "213px", height: "160px" },
              pdf: { width: "100%", height: "160px", position: "relative" },
              other: { width: "213px", height: "160px" },
            },
            previewSettingsSmall: {
              image: { width: "auto", height: "auto", "max-width": "100%", "max-height": "100%" },
              html: { width: "100%", height: "160px" },
              text: { width: "100%", height: "160px" },
              office: { width: "100%", height: "160px" },
              gdocs: { width: "100%", height: "160px" },
              video: { width: "100%", height: "auto" },
              audio: { width: "100%", height: "30px" },
              flash: { width: "100%", height: "auto" },
              object: { width: "100%", height: "auto" },
              pdf: { width: "100%", height: "160px" },
              other: { width: "100%", height: "160px" },
            },
            previewZoomSettings: {
              image: { width: "auto", height: "auto", "max-width": "100%", "max-height": "100%" },
              html: b,
              text: b,
              office: { width: "100%", height: "100%", "max-width": "100%", "min-height": "480px" },
              gdocs: { width: "100%", height: "100%", "max-width": "100%", "min-height": "480px" },
              video: { width: "auto", height: "100%", "max-width": "100%" },
              audio: { width: "100%", height: "30px" },
              flash: { width: "auto", height: "480px" },
              object: { width: "auto", height: "100%", "max-width": "100%", "min-height": "480px" },
              pdf: b,
              other: { width: "auto", height: "100%", "min-height": "480px" },
            },
            mimeTypeAliases: { "video/quicktime": "video/mp4" },
            fileTypeSettings: {
              image: function (e, i) {
                return (
                  (t.compare(e, "image.*") && !t.compare(e, /(tiff?|wmf)$/i)) || t.compare(i, /\.(gif|png|jpe?g)$/i)
                );
              },
              html: function (e, i) {
                return t.compare(e, "text/html") || t.compare(i, /\.(htm|html)$/i);
              },
              office: function (e, i) {
                return (
                  t.compare(e, /(word|excel|powerpoint|office)$/i) || t.compare(i, /\.(docx?|xlsx?|pptx?|pps|potx?)$/i)
                );
              },
              gdocs: function (e, i) {
                return (
                  t.compare(e, /(word|excel|powerpoint|office|iwork-pages|tiff?)$/i) ||
                  t.compare(i, /\.(docx?|xlsx?|pptx?|pps|potx?|rtf|ods|odt|pages|ai|dxf|ttf|tiff?|wmf|e?ps)$/i)
                );
              },
              text: function (e, i) {
                return (
                  t.compare(e, "text.*") ||
                  t.compare(i, /\.(xml|javascript)$/i) ||
                  t.compare(i, /\.(txt|md|nfo|ini|json|php|js|css)$/i)
                );
              },
              video: function (e, i) {
                return (
                  t.compare(e, "video.*") &&
                  (t.compare(e, /(ogg|mp4|mp?g|mov|webm|3gp)$/i) || t.compare(i, /\.(og?|mp4|webm|mp?g|mov|3gp)$/i))
                );
              },
              audio: function (e, i) {
                return (
                  t.compare(e, "audio.*") &&
                  (t.compare(i, /(ogg|mp3|mp?g|wav)$/i) || t.compare(i, /\.(og?|mp3|mp?g|wav)$/i))
                );
              },
              flash: function (e, i) {
                return t.compare(e, "application/x-shockwave-flash", !0) || t.compare(i, /\.(swf)$/i);
              },
              pdf: function (e, i) {
                return t.compare(e, "application/pdf", !0) || t.compare(i, /\.(pdf)$/i);
              },
              object: function () {
                return !0;
              },
              other: function () {
                return !0;
              },
            },
            fileActionSettings: {
              showRemove: !0,
              showUpload: !0,
              showDownload: !0,
              showZoom: !0,
              showDrag: !0,
              removeIcon: '<i class="bi-trash"></i>',
              removeClass: y,
              removeErrorClass: "btn btn-sm btn-kv btn-danger",
              removeTitle: "Remove file",
              uploadIcon: '<i class="bi-upload"></i>',
              uploadClass: y,
              uploadTitle: "Upload file",
              uploadRetryIcon: '<i class="bi-arrow-clockwise"></i>',
              uploadRetryTitle: "Retry upload",
              downloadIcon: '<i class="bi-download"></i>',
              downloadClass: y,
              downloadTitle: "Download file",
              zoomIcon: '<i class="bi-zoom-in"></i>',
              zoomClass: y,
              zoomTitle: "View Details",
              dragIcon: '<i class="bi-arrows-move"></i>',
              dragClass: "text-primary",
              dragTitle: "Move / Rearrange",
              dragSettings: {},
              indicatorNew: '<i class="bi-plus-lg text-warning"></i>',
              indicatorSuccess: '<i class="bi-check-lg text-success"></i>',
              indicatorError: '<i class="bi-exclamation-lg text-danger"></i>',
              indicatorLoading: '<i class="bi-hourglass-bottom text-muted"></i>',
              indicatorPaused: '<i class="bi-pause-fill text-primary"></i>',
              indicatorNewTitle: "Not uploaded yet",
              indicatorSuccessTitle: "Uploaded",
              indicatorErrorTitle: "Upload Error",
              indicatorLoadingTitle: "Uploading &hellip;",
              indicatorPausedTitle: "Upload Paused",
            },
          }),
          e.each(C.defaults, function (t, i) {
            "allowedPreviewTypes" !== t
              ? (C[t] = e.extend(!0, {}, i, C[t]))
              : void 0 === C.allowedPreviewTypes && (C.allowedPreviewTypes = i);
          }),
          C._initPreviewTemplates();
      },
      _initPreviewTemplates: function () {
        var i,
          a = this,
          r = a.previewMarkupTags,
          s = r.tagAfter;
        e.each(a.previewContentTemplates, function (e, n) {
          t.isEmpty(a.previewTemplates[e]) &&
            ((i = r.tagBefore2),
            ("generic" !== e && "image" !== e) || (i = r.tagBefore1),
            a._isPdfRendered() && "pdf" === e && (i = i.replace("kv-file-content", "kv-file-content kv-pdf-rendered")),
            (a.previewTemplates[e] = i + n + s));
        });
      },
      _initPreviewCache: function () {
        var i = this;
        (i.previewCache = {
          data: {},
          init: function () {
            var e = i.initialPreview;
            e.length > 0 && !t.isArray(e) && (e = e.split(i.initialPreviewDelimiter)),
              (i.previewCache.data = { content: e, config: i.initialPreviewConfig, tags: i.initialPreviewThumbTags });
          },
          count: function (e) {
            return i.previewCache.data && i.previewCache.data.content
              ? e
                ? i.previewCache.data.content.filter(function (e) {
                    return null !== e;
                  }).length
                : i.previewCache.data.content.length
              : 0;
          },
          get: function (e, a) {
            var r,
              s,
              n,
              o,
              l,
              d,
              c,
              u = t.INIT_FLAG + e,
              p = i.previewCache.data,
              f = p.config[e],
              h = p.content[e],
              m = t.ifSet("previewAsData", f, i.initialPreviewAsData),
              g = f ? { title: f.title || null, alt: f.alt || null } : { title: null, alt: null },
              v = function (e, a, r, s, n, o, l, d) {
                var c = " file-preview-initial " + t.SORT_CSS + (l ? " " + l : ""),
                  u = i.previewInitId + "-" + o,
                  p = (f && f.fileId) || u;
                return i._generatePreviewTemplate(e, a, r, s, u, p, !1, null, c, n, o, d, g, (f && f.zoomData) || a);
              };
            return h && h.length
              ? ((a = void 0 === a || a),
                (n = t.ifSet("type", f, i.initialPreviewFileType || "generic")),
                (l = t.ifSet("filename", f, t.ifSet("caption", f))),
                (d = t.ifSet("filetype", f, n)),
                (o = i.previewCache.footer(e, a, (f && f.size) || null)),
                (c = t.ifSet("frameClass", f)),
                (r = m
                  ? v(n, h, l, d, o, u, c)
                  : v("generic", h, l, d, o, u, c, n).setTokens({ content: p.content[e] })),
                p.tags.length && p.tags[e] && (r = t.replaceTags(r, p.tags[e])),
                t.isEmpty(f) ||
                  t.isEmpty(f.frameAttr) ||
                  ((s = t.createElement(r)).find(".file-preview-initial").attr(f.frameAttr),
                  (r = s.html()),
                  s.remove()),
                r)
              : "";
          },
          clean: function (e) {
            (e.content = t.cleanArray(e.content)),
              (e.config = t.cleanArray(e.config)),
              (e.tags = t.cleanArray(e.tags)),
              (i.previewCache.data = e);
          },
          add: function (e, a, r, s) {
            var n,
              o = i.previewCache.data;
            return e && e.length
              ? ((n = e.length - 1),
                t.isArray(e) || (e = e.split(i.initialPreviewDelimiter)),
                s && o.content
                  ? ((n = o.content.push(e[0]) - 1), (o.config[n] = a), (o.tags[n] = r))
                  : ((o.content = e), (o.config = a), (o.tags = r)),
                i.previewCache.clean(o),
                n)
              : 0;
          },
          set: function (e, a, r, s) {
            var n,
              o = i.previewCache.data;
            if (
              e &&
              e.length &&
              (t.isArray(e) || (e = e.split(i.initialPreviewDelimiter)),
              e.filter(function (e) {
                return null !== e;
              }).length)
            ) {
              if (
                (void 0 === o.content && (o.content = []),
                void 0 === o.config && (o.config = []),
                void 0 === o.tags && (o.tags = []),
                s)
              ) {
                for (n = 0; n < e.length; n++) e[n] && o.content.push(e[n]);
                for (n = 0; n < a.length; n++) a[n] && o.config.push(a[n]);
                for (n = 0; n < r.length; n++) r[n] && o.tags.push(r[n]);
              } else (o.content = e), (o.config = a), (o.tags = r);
              i.previewCache.clean(o);
            }
          },
          unset: function (a) {
            var r = i.previewCache.count(),
              s = i.reversePreviewOrder;
            if (r) {
              if (1 === r)
                return (
                  (i.previewCache.data.content = []),
                  (i.previewCache.data.config = []),
                  (i.previewCache.data.tags = []),
                  (i.initialPreview = []),
                  (i.initialPreviewConfig = []),
                  void (i.initialPreviewThumbTags = [])
                );
              (i.previewCache.data.content = t.spliceArray(i.previewCache.data.content, a, s)),
                (i.previewCache.data.config = t.spliceArray(i.previewCache.data.config, a, s)),
                (i.previewCache.data.tags = t.spliceArray(i.previewCache.data.tags, a, s));
              var n = e.extend(!0, {}, i.previewCache.data);
              i.previewCache.clean(n);
            }
          },
          out: function () {
            var e,
              t,
              a = "",
              r = i.previewCache.count();
            if (0 === r) return { content: "", caption: "" };
            for (e = 0; e < r; e++) (t = i.previewCache.get(e)), (a = i.reversePreviewOrder ? t + a : a + t);
            return { content: a, caption: i._getMsgSelected(r) };
          },
          footer: function (e, a, r) {
            var s = i.previewCache.data || {};
            if (t.isEmpty(s.content)) return "";
            (t.isEmpty(s.config) || t.isEmpty(s.config[e])) && (s.config[e] = {}), (a = void 0 === a || a);
            var n,
              o = s.config[e],
              l = t.ifSet("caption", o),
              d = t.ifSet("width", o, "auto"),
              c = t.ifSet("url", o, !1),
              u = t.ifSet("key", o, null),
              p = t.ifSet("fileId", o, null),
              f = i.fileActionSettings,
              h = i.initialPreviewShowDelete || !1,
              m = i.initialPreviewDownloadUrl
                ? i.initialPreviewDownloadUrl + "?key=" + u + (p ? "&fileId=" + p : "")
                : "",
              g = o.downloadUrl || m,
              v = o.filename || o.caption || "",
              w = !!g,
              b = t.ifSet("showRemove", o, h),
              _ = t.ifSet("showDownload", o, t.ifSet("showDownload", f, w)),
              C = t.ifSet("showZoom", o, t.ifSet("showZoom", f, !0)),
              x = t.ifSet("showDrag", o, t.ifSet("showDrag", f, !0)),
              y = !1 === c && a;
            return (
              (_ = _ && !1 !== o.downloadUrl && !!g),
              (n = i._renderFileActions(o, !1, _, b, C, x, y, c, u, !0, g, v)),
              i._getLayoutTemplate("footer").setTokens({
                progress: i._renderThumbProgress(),
                actions: n,
                caption: l,
                size: i._getSize(r),
                width: d,
                indicator: "",
              })
            );
          },
        }),
          i.previewCache.init();
      },
      _isPdfRendered: function () {
        var e = this.usePdfRenderer;
        return ("function" == typeof e ? e() : !!e) && this.pdfRendererUrl;
      },
      _handler: function (e, t, i) {
        var a = this.namespace,
          r = t.split(" ").join(a + " ") + a;
        e && e.length && e.off(r).on(r, i);
      },
      _encodeURI: function (e) {
        return this.encodeUrl ? encodeURI(e) : e;
      },
      _log: function (e, t) {
        var i = this.$element.attr("id");
        this.showConsoleLogs &&
          (i && (e = '"' + i + '": ' + e),
          (e = "bootstrap-fileinput: " + e),
          "object" == typeof t && (e = e.setTokens(t)),
          window.console && void 0 !== window.console.log ? window.console.log(e) : window.alert(e));
      },
      _validate: function () {
        var e = "file" === this.$element.attr("type");
        return e || this._log(t.logMessages.badInputType), e;
      },
      _errorsExist: function () {
        var i;
        return (
          !!this.$errorContainer.find("li").length ||
          ((i = t.createElement(this.$errorContainer.html())).find(".kv-error-close").remove(),
          i.find("ul").remove(),
          !!e.trim(i.text()).length)
        );
      },
      _errorHandler: function (e, t) {
        var i = this,
          a = e.target.error,
          r = function (e) {
            i._showError(e.replace("{name}", t));
          };
        a.code === a.NOT_FOUND_ERR
          ? r(i.msgFileNotFound)
          : a.code === a.SECURITY_ERR
          ? r(i.msgFileSecured)
          : a.code === a.NOT_READABLE_ERR
          ? r(i.msgFileNotReadable)
          : a.code === a.ABORT_ERR
          ? r(i.msgFilePreviewAborted)
          : r(i.msgFilePreviewError);
      },
      _addError: function (e) {
        var i = this,
          a = i.$errorContainer;
        e &&
          a.length &&
          (t.setHtml(a, i.errorCloseButton + e),
          i._handler(a.find(".kv-error-close"), "click", function () {
            setTimeout(function () {
              i.showPreview && !i.getFrames().length && i.clear(), a.fadeOut("slow");
            }, i.processDelay);
          }));
      },
      _setValidationError: function (e) {
        (e = (e ? e + " " : "") + "has-error"),
          this.$container.removeClass(e).addClass("has-error"),
          t.addCss(this.$caption, "is-invalid");
      },
      _resetErrors: function (e) {
        var t = this.$errorContainer,
          i = this.resumableUploadOptions.retainErrorHistory;
        this.isPersistentError ||
          (this.enableResumableUpload && i) ||
          ((this.isError = !1),
          this.$container.removeClass("has-error"),
          this.$caption.removeClass("is-invalid is-valid file-processing"),
          t.html(""),
          e ? t.fadeOut("slow") : t.hide());
      },
      _showFolderError: function (e) {
        var t,
          i = this.$errorContainer;
        e &&
          (this.isAjaxUpload || this._clearFileInput(),
          (t = this.msgFoldersNotAllowed.replace("{n}", e)),
          this._addError(t),
          this._setValidationError(),
          i.fadeIn(this.fadeDelay),
          this._raise("filefoldererror", [e, t]));
      },
      _showFileError: function (e, t, i) {
        var a = this.$errorContainer,
          r = i || "fileuploaderror",
          s = (t && t.fileId) || "",
          n =
            t && t.id
              ? '<li data-thumb-id="' + t.id + '" data-file-id="' + s + '">' + e + "</li>"
              : "<li>" + e + "</li>";
        return (
          0 === a.find("ul").length ? this._addError("<ul>" + n + "</ul>") : a.find("ul").append(n),
          a.fadeIn(this.fadeDelay),
          this._raise(r, [t, e]),
          this._setValidationError("file-input-new"),
          !0
        );
      },
      _showError: function (e, t, i) {
        var a = this.$errorContainer,
          r = i || "fileerror";
        return (
          ((t = t || {}).reader = this.reader),
          this._addError(e),
          a.fadeIn(this.fadeDelay),
          this._raise(r, [t, e]),
          this.isAjaxUpload || this._clearFileInput(),
          this._setValidationError("file-input-new"),
          this.$btnUpload.attr("disabled", !0),
          !0
        );
      },
      _noFilesError: function (e) {
        var t = this.minFileCount > 1 ? this.filePlural : this.fileSingle,
          i = this.msgFilesTooLess.replace("{n}", this.minFileCount).replace("{files}", t),
          a = this.$errorContainer;
        (i = "<li>" + i + "</li>"),
          0 === a.find("ul").length ? this._addError("<ul>" + i + "</ul>") : a.find("ul").append(i),
          (this.isError = !0),
          this._updateFileDetails(0),
          a.fadeIn(this.fadeDelay),
          this._raise("fileerror", [e, i]),
          this._clearFileInput(),
          this._setValidationError();
      },
      _parseError: function (t, i, a, r) {
        var s,
          n,
          o,
          l = e.trim(a + "");
        return (
          (o = (n = i.responseJSON && i.responseJSON.error ? i.responseJSON.error.toString() : "") || i.responseText),
          this.cancelling && this.msgUploadAborted && (l = this.msgUploadAborted),
          this.showAjaxErrorDetails &&
            o &&
            (n
              ? (l = e.trim(n + ""))
              : ((s = (o = e.trim(o.replace(/\n\s*\n/g, "\n"))).length ? "<pre>" + o + "</pre>" : ""),
                (l += l ? s : o))),
          l || (l = this.msgAjaxError.replace("{operation}", t)),
          (this.cancelling = !1),
          r ? "<b>" + r + ": </b>" + l : l
        );
      },
      _parseFileType: function (e, i) {
        var a,
          r,
          s,
          n = this.allowedPreviewTypes || [];
        if ("application/text-plain" === e) return "text";
        for (s = 0; s < n.length; s++)
          if (((r = n[s]), (a = (0, this.fileTypeSettings[r])(e, i) ? r : ""), !t.isEmpty(a))) return a;
        return "other";
      },
      _getPreviewIcon: function (t) {
        var i,
          a = this,
          r = null;
        return (
          t &&
            t.indexOf(".") > -1 &&
            ((i = t.split(".").pop()),
            a.previewFileIconSettings &&
              (r = a.previewFileIconSettings[i] || a.previewFileIconSettings[i.toLowerCase()] || null),
            a.previewFileExtSettings &&
              e.each(a.previewFileExtSettings, function (e, t) {
                a.previewFileIconSettings[e] && t(i) && (r = a.previewFileIconSettings[e]);
              })),
          r || a.previewFileIcon
        );
      },
      _parseFilePreviewIcon: function (e, t) {
        var i = this._getPreviewIcon(t),
          a = e;
        return (
          a.indexOf("{previewFileIcon}") > -1 &&
            (a = a.setTokens({ previewFileIconClass: this.previewFileIconClass, previewFileIcon: i })),
          a
        );
      },
      _raise: function (t, i) {
        var a = e.Event(t);
        void 0 !== i ? this.$element.trigger(a, i) : this.$element.trigger(a);
        var r = a.result,
          s = !1 === r;
        if (a.isDefaultPrevented() || s) return !1;
        if ("filebatchpreupload" === a.type && (r || s)) return (this.ajaxAborted = r), !1;
        switch (t) {
          case "filebatchuploadcomplete":
          case "filebatchuploadsuccess":
          case "fileuploaded":
          case "fileclear":
          case "filecleared":
          case "filereset":
          case "fileerror":
          case "filefoldererror":
          case "fileuploaderror":
          case "filebatchuploaderror":
          case "filedeleteerror":
          case "filecustomerror":
          case "filesuccessremove":
            break;
          default:
            this.ajaxAborted || (this.ajaxAborted = r);
        }
        return !0;
      },
      _listenFullScreen: function (e) {
        var t,
          i,
          a = this.$modal;
        a &&
          a.length &&
          ((t = a && a.find(".btn-kv-fullscreen")),
          (i = a && a.find(".btn-kv-borderless")),
          t.length &&
            i.length &&
            (t.removeClass("active").attr("aria-pressed", "false"),
            i.removeClass("active").attr("aria-pressed", "false"),
            e ? t.addClass("active").attr("aria-pressed", "true") : i.addClass("active").attr("aria-pressed", "true"),
            a.hasClass("file-zoom-fullscreen")
              ? this._maximizeZoomDialog()
              : e
              ? this._maximizeZoomDialog()
              : i.removeClass("active").attr("aria-pressed", "false")));
      },
      _listen: function () {
        var i = this,
          a = i.$element,
          r = i.$form,
          s = i.$container;
        i._handler(a, "click", function (e) {
          i._initFileSelected(),
            a.hasClass("file-no-browse") && (a.data("zoneClicked") ? a.data("zoneClicked", !1) : e.preventDefault());
        }),
          i._handler(a, "change", e.proxy(i._change, i)),
          i._handler(i.$caption, "paste", e.proxy(i.paste, i)),
          i.showBrowse &&
            (i._handler(i.$btnFile, "click", e.proxy(i._browse, i)),
            i._handler(i.$btnFile, "keypress", function (e) {
              13 === (e.keyCode || e.which) && (a.trigger("click"), i._browse(e));
            })),
          i._handler(s.find(".fileinput-remove:not([disabled])"), "click", e.proxy(i.clear, i)),
          i._handler(s.find(".fileinput-cancel"), "click", e.proxy(i.cancel, i)),
          i._handler(s.find(".fileinput-pause"), "click", e.proxy(i.pause, i)),
          i._initDragDrop(),
          i._handler(r, "reset", e.proxy(i.clear, i)),
          i.isAjaxUpload || i._handler(r, "submit", e.proxy(i._submitForm, i)),
          i._handler(i.$container.find(".fileinput-upload"), "click", e.proxy(i._uploadClick, i)),
          i._handler(e(window), "resize", function () {
            i._listenFullScreen(screen.width === window.innerWidth && screen.height === window.innerHeight);
          }),
          i._handler(
            e(document),
            "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",
            function () {
              i._listenFullScreen(t.checkFullScreen());
            }
          ),
          i.$caption.on("focus", function () {
            i.$captionContainer.focus();
          }),
          i._autoFitContent(),
          i._initClickable(),
          i._refreshPreview();
      },
      _autoFitContent: function () {
        var t,
          i = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
          a = this,
          r =
            i < 400
              ? a.previewSettingsSmall || a.defaults.previewSettingsSmall
              : a.previewSettings || a.defaults.previewSettings;
        e.each(r, function (e, i) {
          (t = ".file-preview-frame .file-preview-" + e),
            a.$preview.find(t + ".kv-preview-data," + t + " .kv-preview-data").css(i);
        });
      },
      _scanDroppedItems: function (e, i, a) {
        a = a || "";
        var r,
          s,
          n,
          o = this,
          l = function (e) {
            o._log(t.logMessages.badDroppedFiles), o._log(e);
          };
        e.isFile
          ? e.file(function (e) {
              a && (e.newPath = a + e.name), i.push(e);
            }, l)
          : e.isDirectory &&
            ((s = e.createReader()),
            (n = function () {
              s.readEntries(function (t) {
                if (t && t.length > 0) {
                  for (r = 0; r < t.length; r++) o._scanDroppedItems(t[r], i, a + e.name + "/");
                  n();
                }
                return null;
              }, l);
            })());
      },
      _initDragDrop: function () {
        var t = this.$dropZone;
        this.dropZoneEnabled &&
          this.showPreview &&
          (this._handler(t, "dragenter dragover", e.proxy(this._zoneDragEnter, this)),
          this._handler(t, "dragleave", e.proxy(this._zoneDragLeave, this)),
          this._handler(t, "drop", e.proxy(this._zoneDrop, this)),
          this._handler(e(document), "dragenter dragover drop", this._zoneDragDropInit));
      },
      _zoneDragDropInit: function (e) {
        e.stopPropagation(), e.preventDefault();
      },
      _zoneDragEnter: function (i) {
        var a = i.originalEvent.dataTransfer,
          r = e.inArray("Files", a.types) > -1;
        if ((this._zoneDragDropInit(i), this.isDisabled || !r))
          return (a.effectAllowed = "none"), void (a.dropEffect = "none");
        (a.dropEffect = "copy"),
          this._raise("fileDragEnter", { sourceEvent: i, files: a.types.Files }) &&
            t.addCss(this.$dropZone, "file-highlighted");
      },
      _zoneDragLeave: function (e) {
        this._zoneDragDropInit(e),
          this.isDisabled ||
            (this._raise("fileDragLeave", { sourceEvent: e }) && this.$dropZone.removeClass("file-highlighted"));
      },
      _dropFiles: function (e, t) {
        var i = this,
          a = i.$element;
        i.isAjaxUpload
          ? i._change(e, t)
          : ((i.changeTriggered = !0),
            (a.get(0).files = t),
            setTimeout(function () {
              (i.changeTriggered = !1), a.trigger("change" + i.namespace);
            }, i.processDelay)),
          i.$dropZone.removeClass("file-highlighted");
      },
      _zoneDrop: function (e) {
        var i,
          a = this,
          r = (a.$element, e.originalEvent.dataTransfer),
          s = r.files,
          n = r.items,
          o = t.getDragDropFolders(n);
        if (
          (e.preventDefault(), !a.isDisabled && !t.isEmpty(s) && a._raise("fileDragDrop", { sourceEvent: e, files: s }))
        )
          if (o > 0) {
            if (!a.isAjaxUpload) return void a._showFolderError(o);
            for (s = [], i = 0; i < n.length; i++) {
              var l = n[i].webkitGetAsEntry();
              l && a._scanDroppedItems(l, s);
            }
            setTimeout(function () {
              a._dropFiles(e, s);
            }, 500);
          } else a._dropFiles(e, s);
      },
      _uploadClick: function (e) {
        var i,
          a = this.$container.find(".fileinput-upload"),
          r = !a.hasClass("disabled") && t.isEmpty(a.attr("disabled"));
        (e && e.isDefaultPrevented()) ||
          (this.isAjaxUpload
            ? (e.preventDefault(), r && this.upload())
            : r &&
              "submit" !== a.attr("type") &&
              ((i = a.closest("form")).length && i.trigger("submit"), e.preventDefault()));
      },
      _submitForm: function () {
        return this._isFileSelectionValid() && !this._abort({});
      },
      _clearPreview: function () {
        (this.showUploadedThumbs ? this.getFrames(":not(.file-preview-success)") : this.getFrames()).each(function () {
          e(this).remove();
        }),
          (this.getFrames().length && this.showPreview) || this._resetUpload(),
          this._validateDefaultPreview();
      },
      _initSortable: function () {
        var i,
          a,
          r,
          s,
          n = this,
          o = n.$preview,
          l = "." + t.SORT_CSS,
          d = e("body"),
          c = e("html"),
          u = n.reversePreviewOrder,
          p = window.Sortable;
        p &&
          0 !== o.find(l).length &&
          ((a = d.length ? d : c.length ? c : n.$container),
          (i = {
            handle: ".drag-handle-init",
            dataIdAttr: "data-fileid",
            animation: 400,
            draggable: l,
            scroll: !0,
            forceFallback: !0,
            onChoose: (r = function () {
              a.addClass("file-grabbing");
            }),
            onStart: r,
            onUnchoose: (s = function () {
              a.removeClass("file-grabbing");
            }),
            onEnd: s,
            onSort: function (i) {
              var a = i.oldIndex,
                r = i.newIndex,
                s = 0,
                o = n.initialPreviewConfig.length,
                l = o > 0 && r >= o,
                d = e(i.item);
              l && (r = o - 1),
                (n.initialPreview = t.moveArray(n.initialPreview, a, r, u)),
                (n.initialPreviewConfig = t.moveArray(n.initialPreviewConfig, a, r, u)),
                n.previewCache.init(),
                n.getFrames(".file-preview-initial").each(function () {
                  e(this).attr("data-fileindex", t.INIT_FLAG + s), s++;
                }),
                n._raise("filesorted", {
                  previewId: d.attr("id"),
                  oldIndex: a,
                  newIndex: r,
                  stack: n.initialPreviewConfig,
                });
            },
          }),
          e.extend(!0, i, n.fileActionSettings.dragSettings),
          n.sortable && n.sortable.destroy(),
          (n.sortable = p.create(o[0], i)));
      },
      _setPreviewContent: function (e) {
        t.setHtml(this.$preview, e), this._autoFitContent();
      },
      _initPreviewImageOrientations: function () {
        var t = this,
          i = 0,
          a = t.canOrientImage;
        (t.autoOrientImageInitial || a) &&
          t.getFrames(".file-preview-initial").each(function () {
            var r,
              s,
              n,
              o = e(this),
              l = t.initialPreviewConfig[i];
            l &&
              l.exif &&
              l.exif.Orientation &&
              ((n = o.attr("id")),
              (r = o.find(">.kv-file-content img")),
              (s = t._getZoom(n, " >.kv-file-content img")),
              a
                ? r.css("image-orientation", t.autoOrientImageInitial ? "from-image" : "none")
                : t.setImageOrientation(r, s, l.exif.Orientation, o)),
              i++;
          });
      },
      _initPreview: function (e) {
        var i,
          a = this.initialCaption || "";
        if (!this.previewCache.count(!0))
          return this._clearPreview(), void (e ? this._setCaption(a) : this._initCaption());
        (i = this.previewCache.out()),
          (a = e && this.initialCaption ? this.initialCaption : i.caption),
          this._setPreviewContent(i.content),
          this._setInitThumbAttr(),
          this._setCaption(a),
          this._initSortable(),
          t.isEmpty(i.content) || this.$container.removeClass("file-input-new"),
          this._initPreviewImageOrientations();
      },
      _getZoomButton: function (e) {
        var i = this.previewZoomButtonIcons[e],
          a = this.previewZoomButtonClasses[e],
          r = ' title="' + (this.previewZoomButtonTitles[e] || "") + '" ',
          s = t.isBs(5) ? "bs-" : "",
          n = r + ("close" === e ? " data-" + s + 'dismiss="modal" aria-hidden="true"' : "");
        return (
          ("fullscreen" !== e && "borderless" !== e && "toggleheader" !== e) ||
            (n += ' data-toggle="button" aria-pressed="false" autocomplete="off"'),
          '<button type="button" class="' + a + " btn-kv-" + e + '"' + n + ">" + i + "</button>"
        );
      },
      _getModalContent: function () {
        return this._getLayoutTemplate("modal").setTokens({
          rtl: this.rtl ? " kv-rtl" : "",
          zoomFrameClass: this.frameClass,
          prev: this._getZoomButton("prev"),
          next: this._getZoomButton("next"),
          toggleheader: this._getZoomButton("toggleheader"),
          fullscreen: this._getZoomButton("fullscreen"),
          borderless: this._getZoomButton("borderless"),
          close: this._getZoomButton("close"),
        });
      },
      _listenModalEvent: function (e) {
        var i = this,
          a = i.$modal;
        a.on(e + ".bs.modal", function (r) {
          if ("bs.modal" === r.namespace) {
            var s = a.find(".btn-fullscreen"),
              n = a.find(".btn-borderless");
            a.data("fileinputPluginId") === i.$element.attr("id") &&
              i._raise(
                "filezoom" + e,
                (function (e) {
                  return { sourceEvent: e, previewId: a.data("previewId"), modal: a };
                })(r)
              ),
              "shown" === e &&
                (n.removeClass("active").attr("aria-pressed", "false"),
                s.removeClass("active").attr("aria-pressed", "false"),
                a.hasClass("file-zoom-fullscreen") &&
                  (i._maximizeZoomDialog(),
                  t.checkFullScreen()
                    ? s.addClass("active").attr("aria-pressed", "true")
                    : n.addClass("active").attr("aria-pressed", "true")));
          }
        });
      },
      _initZoom: function () {
        var i,
          a = this,
          r = a._getLayoutTemplate("modalMain"),
          s = "#" + t.MODAL_ID;
        (r = a._setTabIndex("modal", r)),
          a.showPreview &&
            ((a.$modal = e(s)),
            (a.$modal && a.$modal.length) ||
              ((i = t.createElement(t.cspBuffer.stash(r)).insertAfter(a.$container)),
              (a.$modal = e(s).insertBefore(i)),
              t.cspBuffer.apply(a.$modal),
              i.remove()),
            t.initModal(a.$modal),
            a.$modal.html(t.cspBuffer.stash(a._getModalContent())),
            t.cspBuffer.apply(a.$modal),
            e.each(t.MODAL_EVENTS, function (e, t) {
              a._listenModalEvent(t);
            }));
      },
      _initZoomButtons: function () {
        var t,
          i,
          a = this.$modal.data("previewId") || "",
          r = this.getFrames().toArray(),
          s = r.length,
          n = this.$modal.find(".btn-kv-prev"),
          o = this.$modal.find(".btn-kv-next");
        if (r.length < 2) return n.hide(), void o.hide();
        n.show(),
          o.show(),
          s &&
            ((t = e(r[0])),
            (i = e(r[s - 1])),
            n.removeAttr("disabled"),
            o.removeAttr("disabled"),
            this.reversePreviewOrder && ([n, o] = [o, n]),
            t.length && t.attr("id") === a && n.attr("disabled", !0),
            i.length && i.attr("id") === a && o.attr("disabled", !0));
      },
      _maximizeZoomDialog: function () {
        var t = this.$modal,
          i = t.find(".modal-header:visible"),
          a = t.find(".modal-footer:visible"),
          r = t.find(".kv-zoom-body"),
          s = e(window).height();
        t.addClass("file-zoom-fullscreen"),
          i && i.length && (s -= i.outerHeight(!0)),
          a && a.length && (s -= a.outerHeight(!0)),
          r && r.length && (s -= r.outerHeight(!0) - r.height()),
          t.find(".kv-zoom-body").height(s);
      },
      _resizeZoomDialog: function (e) {
        var i = this.$modal,
          a = i.find(".btn-kv-fullscreen"),
          r = i.find(".btn-kv-borderless");
        if (i.hasClass("file-zoom-fullscreen"))
          t.toggleFullScreen(!1),
            e
              ? a.hasClass("active") ||
                (i.removeClass("file-zoom-fullscreen"),
                this._resizeZoomDialog(!0),
                r.hasClass("active") && r.removeClass("active").attr("aria-pressed", "false"))
              : a.hasClass("active")
              ? a.removeClass("active").attr("aria-pressed", "false")
              : (i.removeClass("file-zoom-fullscreen"),
                this.$modal.find(".kv-zoom-body").css("height", this.zoomModalHeight));
        else {
          if (!e) return void this._maximizeZoomDialog();
          t.toggleFullScreen(!0);
        }
        i.focus();
      },
      _setZoomContent: function (i, a) {
        var r,
          s,
          n,
          o,
          l,
          d,
          c,
          u,
          p,
          f,
          h,
          m,
          g = this,
          v = i.attr("id"),
          w = g._getZoom(v),
          b = g.$modal,
          _ = b.find(".btn-kv-fullscreen"),
          C = b.find(".btn-kv-borderless"),
          x = b.find(".btn-kv-toggleheader"),
          y = i.data("zoom");
        y &&
          ((y = decodeURIComponent(y)),
          (m = w.html().replace(t.ZOOM_VAR, "").setTokens({ zoomData: y })),
          w.html(m),
          i.data("zoom", ""),
          w.attr("data-zoom", y)),
          (s = w.attr("data-template") || "generic"),
          (n = (r = w.find(".kv-file-content")).length ? '<span class="kv-spacer"></span>\n' + r.html() : ""),
          (f = i.data("caption") || g.msgZoomModalHeading),
          (h = i.data("size") || ""),
          (u = i.data("description") || ""),
          b.find(".kv-zoom-caption").attr("title", f).html(f),
          b.find(".kv-zoom-size").html(h),
          (p = b.find(".kv-zoom-description").hide()),
          u &&
            (g.showDescriptionClose &&
              (u =
                g._getLayoutTemplate("descriptionClose").setTokens({ closeIcon: g.previewZoomButtonIcons.close }) +
                "</button>" +
                u),
            p.show().html(u),
            g.showDescriptionClose &&
              g._handler(b.find(".kv-desc-hide"), "click", function () {
                e(this)
                  .parent()
                  .fadeOut("fast", function () {
                    b.focus();
                  });
              })),
          (o = b.find(".kv-zoom-body")),
          b.removeClass("kv-single-content"),
          a
            ? ((c = o.addClass("file-thumb-loading").clone().insertAfter(o)),
              t.setHtml(o, n).hide(),
              c.fadeOut("fast", function () {
                o.fadeIn("fast", function () {
                  o.removeClass("file-thumb-loading");
                }),
                  c.remove();
              }))
            : t.setHtml(o, n),
          (d = g.previewZoomSettings[s]) &&
            ((l = o.find(".kv-preview-data")),
            t.addCss(l, "file-zoom-detail"),
            e.each(d, function (e, t) {
              l.css(e, t),
                ((l.attr("width") && "width" === e) || (l.attr("height") && "height" === e)) && l.removeAttr(e);
            })),
          b.data("previewId", v),
          g._handler(b.find(".btn-kv-prev"), "click", function () {
            g._zoomSlideShow("prev", v);
          }),
          g._handler(b.find(".btn-kv-next"), "click", function () {
            g._zoomSlideShow("next", v);
          }),
          g._handler(_, "click", function () {
            g._resizeZoomDialog(!0);
          }),
          g._handler(C, "click", function () {
            g._resizeZoomDialog(!1);
          }),
          g._handler(x, "click", function () {
            var e,
              t = b.find(".modal-header"),
              i = b.find(".floating-buttons"),
              a = t.find(".kv-zoom-actions"),
              r = function (e) {
                var i = g.$modal.find(".kv-zoom-body"),
                  a = g.zoomModalHeight;
                b.hasClass("file-zoom-fullscreen") && ((a = i.outerHeight(!0)), e || (a -= t.outerHeight(!0))),
                  i.css("height", e ? a + e : a);
              };
            t.is(":visible")
              ? ((e = t.outerHeight(!0)),
                t.slideUp("slow", function () {
                  a.find(".btn").appendTo(i), r(e);
                }))
              : (i.find(".btn").appendTo(a),
                t.slideDown("slow", function () {
                  r();
                })),
              b.focus();
          }),
          g._handler(b, "keydown", function (t) {
            var i,
              a,
              r = t.which || t.keyCode,
              s = g.processDelay + 1,
              n = e(this).find(".btn-kv-prev"),
              o = e(this).find(".btn-kv-next"),
              l = e(this).data("previewId");
            ([i, a] = g.rtl ? [39, 37] : [37, 39]),
              e.each({ prev: [n, i], next: [o, a] }, function (e, t) {
                var i = t[0],
                  a = t[1];
                r === a &&
                  i.length &&
                  (b.focus(),
                  i.attr("disabled") ||
                    (i.focus(),
                    g._zoomSlideShow(e, l),
                    setTimeout(function () {
                      i.attr("disabled") && b.focus();
                    }, s)));
              });
          });
      },
      _showModal: function (e) {
        var i = this.$modal;
        e &&
          e.length &&
          (t.initModal(i),
          t.setHtml(i, this._getModalContent()),
          this._setZoomContent(e),
          i.data({ backdrop: !1 }),
          i.modal("show"),
          this._initZoomButtons());
      },
      _zoomPreview: function (e) {
        var i;
        if (!e.length) throw "Cannot zoom to detailed preview!";
        (i = e.closest(t.FRAMES)), this._showModal(i);
      },
      _zoomSlideShow: function (t, i) {
        var a,
          r,
          s,
          n,
          o = this.$modal.find(".kv-zoom-actions .btn-kv-" + t),
          l = this.getFrames().toArray(),
          d = [],
          c = l.length;
        if ((this.reversePreviewOrder && (t = "prev" === t ? "next" : "prev"), !o.attr("disabled"))) {
          for (r = 0; r < c; r++) (s = e(l[r])) && s.length && s.find(".kv-file-zoom:visible").length && d.push(l[r]);
          for (c = d.length, r = 0; r < c; r++)
            if (e(d[r]).attr("id") === i) {
              n = "prev" === t ? r - 1 : r + 1;
              break;
            }
          n < 0 ||
            n >= c ||
            !d[n] ||
            ((a = e(d[n])).length && this._setZoomContent(a, t),
            this._initZoomButtons(),
            this._raise("filezoom" + t, { previewId: i, modal: this.$modal }));
        }
      },
      _initZoomButton: function () {
        var t = this;
        t.$preview.find(".kv-file-zoom").each(function () {
          var i = e(this);
          t._handler(i, "click", function () {
            t._zoomPreview(i);
          });
        });
      },
      _inputFileCount: function () {
        return this.$element[0].files.length;
      },
      _refreshPreview: function () {
        var t;
        (this._inputFileCount() || this.isAjaxUpload) &&
          this.showPreview &&
          this.isPreviewable &&
          (this.isAjaxUpload && this.fileManager.count() > 0
            ? ((t = e.extend(!0, {}, this.getFileList())), this.fileManager.clear(), this._clearFileInput())
            : (t = this.$element[0].files),
          t && t.length && (this.readFiles(t), this._setFileDropZoneTitle()));
      },
      _clearObjects: function (t) {
        t.find("video audio").each(function () {
          this.pause(), e(this).remove();
        }),
          t.find("img object div").each(function () {
            e(this).remove();
          });
      },
      _clearFileInput: function () {
        var t,
          i,
          a,
          r = this.$element;
        this._inputFileCount() &&
          ((t = r.closest("form")),
          (i = e(document.createElement("form"))),
          (a = e(document.createElement("div"))),
          r.before(a),
          t.length ? t.after(i) : a.after(i),
          i.append(r).trigger("reset"),
          a.before(r).remove(),
          i.remove());
      },
      _resetUpload: function () {
        (this.uploadStartTime = t.now()),
          (this.uploadCache = []),
          this.$btnUpload.removeAttr("disabled"),
          this._setProgress(0),
          this._hideProgress(),
          this._resetErrors(!1),
          this._initAjax(),
          this.fileManager.clearImages(),
          this._resetCanvas(),
          this.overwriteInitial &&
            ((this.initialPreview = []),
            (this.initialPreviewConfig = []),
            (this.initialPreviewThumbTags = []),
            (this.previewCache.data = { content: [], config: [], tags: [] }));
      },
      _resetCanvas: function () {
        this.imageCanvas &&
          this.imageCanvasContext &&
          this.imageCanvasContext.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
      },
      _hasInitialPreview: function () {
        return !this.overwriteInitial && this.previewCache.count(!0);
      },
      _resetPreview: function () {
        var i,
          a,
          r,
          s = this.showUploadedThumbs,
          n = !this.removeFromPreviewOnError,
          o = (s || n) && this.isDuplicateError;
        this.previewCache.count(!0)
          ? ((i = this.previewCache.out()),
            o &&
              ((r = t.createElement("").insertAfter(this.$container)),
              this.getFrames().each(function () {
                var t = e(this);
                ((s && t.hasClass("file-preview-success")) || (n && t.hasClass("file-preview-error"))) && r.append(t);
              })),
            this._setPreviewContent(i.content),
            this._setInitThumbAttr(),
            (a = this.initialCaption ? this.initialCaption : i.caption),
            this._setCaption(a),
            o && (r.contents().appendTo(this.$preview), r.remove()))
          : (this._clearPreview(), this._initCaption()),
          this.showPreview && (this._initZoom(), this._initSortable()),
          (this.isDuplicateError = !1);
      },
      _clearDefaultPreview: function () {
        this.$preview.find(".file-default-preview").remove();
      },
      _validateDefaultPreview: function () {
        this.showPreview &&
          !t.isEmpty(this.defaultPreviewContent) &&
          (this._setPreviewContent('<div class="file-default-preview">' + this.defaultPreviewContent + "</div>"),
          this.$container.removeClass("file-input-new"),
          this._initClickable());
      },
      _resetPreviewThumbs: function (e) {
        var t;
        if (e) return this._clearPreview(), void this.clearFileStack();
        this._hasInitialPreview()
          ? ((t = this.previewCache.out()),
            this._setPreviewContent(t.content),
            this._setInitThumbAttr(),
            this._setCaption(t.caption),
            this._initPreviewActions())
          : this._clearPreview();
      },
      _getLayoutTemplate: function (e) {
        var i = this.layoutTemplates[e];
        return t.isEmpty(this.customLayoutTags) ? i : t.replaceTags(i, this.customLayoutTags);
      },
      _getPreviewTemplate: function (e) {
        var i = this.previewTemplates,
          a = i[e] || i.other;
        return t.isEmpty(this.customPreviewTags) ? a : t.replaceTags(a, this.customPreviewTags);
      },
      _getOutData: function (e, t, i, a) {
        return (
          (t = t || {}),
          (i = i || {}),
          {
            formdata: e,
            files: (a = a || this.fileManager.list()),
            filenames: this.filenames,
            filescount: this.getFilesCount(),
            extra: this._getExtraData(),
            response: i,
            reader: this.reader,
            jqXHR: t,
          }
        );
      },
      _getMsgSelected: function (e, t) {
        var i = 1 === e ? this.fileSingle : this.filePlural;
        return e > 0
          ? this.msgSelected.replace("{n}", e).replace("{files}", i)
          : t
          ? this.msgProcessing
          : this.msgNoFilesSelected;
      },
      _getFrame: function (e, i) {
        var a = t.getFrameElement(this.$preview, e);
        return !this.showPreview || i || a.length || this._log(t.logMessages.invalidThumb, { id: e }), a;
      },
      _getZoom: function (e, i) {
        var a = t.getZoomElement(this.$preview, e, i);
        return this.showPreview && !a.length && this._log(t.logMessages.invalidThumb, { id: e }), a;
      },
      _getThumbs: function (e) {
        return (e = e || ""), this.getFrames(":not(.file-preview-initial)" + e);
      },
      _getThumbId: function (e) {
        return this.previewInitId + "-" + e;
      },
      _getExtraData: function (e, t) {
        var i = this.uploadExtraData;
        return "function" == typeof this.uploadExtraData && (i = this.uploadExtraData(e, t)), i;
      },
      _initXhr: function (e, i) {
        var a = this,
          r = a.fileManager,
          s = function (e) {
            var s = 0,
              n = e.total,
              o = e.loaded || e.position,
              l = r.getUploadStats(i, o, n);
            e.lengthComputable && !a.enableResumableUpload && (s = t.round((o / n) * 100)),
              i ? a._setFileUploadStats(i, s, l) : a._setProgress(s, null, null, a._getStats(l)),
              a._raise("fileajaxprogress", [l]);
          };
        return (
          e.upload &&
            (a.progressDelay && (s = t.debounce(s, a.progressDelay)), e.upload.addEventListener("progress", s, !1)),
          e
        );
      },
      _initAjaxSettings: function () {
        (this._ajaxSettings = e.extend(!0, {}, this.ajaxSettings)),
          (this._ajaxDeleteSettings = e.extend(!0, {}, this.ajaxDeleteSettings));
      },
      _mergeAjaxCallback: function (e, t, i) {
        var a,
          r = this._ajaxSettings,
          s = this.mergeAjaxCallbacks;
        "delete" === i && ((r = this._ajaxDeleteSettings), (s = this.mergeAjaxDeleteCallbacks)),
          (a = r[e]),
          (r[e] =
            s && "function" == typeof a
              ? "before" === s
                ? function () {
                    a.apply(this, arguments), t.apply(this, arguments);
                  }
                : function () {
                    t.apply(this, arguments), a.apply(this, arguments);
                  }
              : t);
      },
      _ajaxSubmit: function (t, i, a, r, s, n, o, l) {
        var d,
          c,
          u,
          p,
          f = this;
        f._raise("filepreajax", [s, n, o]) &&
          (s.append("initialPreview", JSON.stringify(f.initialPreview)),
          s.append("initialPreviewConfig", JSON.stringify(f.initialPreviewConfig)),
          s.append("initialPreviewThumbTags", JSON.stringify(f.initialPreviewThumbTags)),
          f._initAjaxSettings(),
          f._mergeAjaxCallback("beforeSend", t),
          f._mergeAjaxCallback("success", i),
          f._mergeAjaxCallback("complete", a),
          f._mergeAjaxCallback("error", r),
          "function" == typeof (l = l || f.uploadUrlThumb || f.uploadUrl) && (l = l()),
          "object" == typeof (u = f._getExtraData(n, o) || {}) &&
            e.each(u, function (e, t) {
              s.append(e, t);
            }),
          (c = {
            xhr: function () {
              var t = e.ajaxSettings.xhr();
              return f._initXhr(t, n);
            },
            url: f._encodeURI(l),
            type: "POST",
            dataType: "json",
            data: s,
            cache: !1,
            processData: !1,
            contentType: !1,
          }),
          (d = e.extend(!0, {}, c, f._ajaxSettings)),
          (p = f.taskManager.addTask(n + "-" + o, function () {
            var t,
              i,
              a = this.self;
            (t = a.ajaxQueue.shift()), (i = e.ajax(t)), a.ajaxRequests.push(i);
          })),
          f.ajaxQueue.push(d),
          p.runWithContext({ self: f }));
      },
      _mergeArray: function (e, i) {
        var a = t.cleanArray(this[e]),
          r = t.cleanArray(i);
        this[e] = a.concat(r);
      },
      _initUploadSuccess: function (i, a, r) {
        var s,
          n,
          o,
          l,
          d,
          c,
          u,
          p,
          f,
          h = this;
        h.showPreview && "object" == typeof i && !e.isEmptyObject(i)
          ? (void 0 !== i.initialPreview &&
              i.initialPreview.length > 0 &&
              ((h.hasInitData = !0),
              (d = i.initialPreview || []),
              (c = i.initialPreviewConfig || []),
              (u = i.initialPreviewThumbTags || []),
              (s = void 0 === i.append || i.append),
              d.length > 0 && !t.isArray(d) && (d = d.split(h.initialPreviewDelimiter)),
              d.length &&
                (h._mergeArray("initialPreview", d),
                h._mergeArray("initialPreviewConfig", c),
                h._mergeArray("initialPreviewThumbTags", u)),
              void 0 !== a
                ? r
                  ? ((p = a.attr("id")),
                    null !== (f = h._getUploadCacheIndex(p)) &&
                      (h.uploadCache[f] = { id: p, content: d[0], config: c[0] || [], tags: u[0] || [], append: s }))
                  : ((o = h.previewCache.add(d[0], c[0], u[0], s)),
                    (n = h.previewCache.get(o, !1)),
                    (l = t.createElement(n).hide().appendTo(a)),
                    a.fadeOut("slow", function () {
                      var e = l.find("> .file-preview-frame");
                      e && e.length && e.insertBefore(a).fadeIn("slow").css("display:inline-block"),
                        h._initPreviewActions(),
                        h._clearFileInput(),
                        a.remove(),
                        l.remove(),
                        h._initSortable();
                    }))
                : (h.previewCache.set(d, c, u, s), h._initPreview(), h._initPreviewActions())),
            h._resetCaption())
          : h._resetCaption();
      },
      _getUploadCacheIndex: function (e) {
        var t,
          i = this.uploadCache.length;
        for (t = 0; t < i; t++) if (this.uploadCache[t].id === e) return t;
        return null;
      },
      _initSuccessThumbs: function () {
        var i = this;
        i.showPreview &&
          setTimeout(function () {
            i._getThumbs(t.FRAMES + ".file-preview-success").each(function () {
              var a = e(this),
                r = a.find(".kv-file-remove");
              r.removeAttr("disabled"),
                i._handler(r, "click", function () {
                  var e = a.attr("id"),
                    r = i._raise("filesuccessremove", [e, a.attr("data-fileindex")]);
                  t.cleanMemory(a),
                    !1 !== r &&
                      (i.$caption.attr("title", ""),
                      a.fadeOut("slow", function () {
                        i.fileManager;
                        a.remove(), i.getFrames().length || i.reset();
                      }));
                });
            });
          }, i.processDelay);
      },
      _updateInitialPreview: function () {
        var t = this,
          i = t.uploadCache;
        t.showPreview &&
          (e.each(i, function (e, i) {
            t.previewCache.add(i.content, i.config, i.tags, i.append);
          }),
          t.hasInitData && (t._initPreview(), t._initPreviewActions()));
      },
      _getThumbFileId: function (e) {
        return this.showPreview && void 0 !== e ? e.attr("data-fileid") : null;
      },
      _getThumbFile: function (e) {
        var t = this._getThumbFileId(e);
        return t ? this.fileManager.getFile(t) : null;
      },
      _uploadSingle: function (i, a, r) {
        var s,
          n,
          o,
          l,
          d,
          c,
          u,
          p,
          f,
          h,
          m,
          g,
          v,
          w = this,
          b = w.fileManager,
          _ = b.count(),
          C = new FormData(),
          x = w._getThumbId(a),
          y = _ > 0 || !e.isEmptyObject(w.uploadExtraData),
          T = w.ajaxOperations.uploadThumb,
          P = b.getFile(a),
          k = { id: x, index: i, fileId: a },
          F = w.fileManager.getFileName(a, !0);
        w.enableResumableUpload ||
          (w.showPreview &&
            ((n = b.getThumb(a)),
            (u = n.find(".file-thumb-progress")),
            (l = n.find(".kv-file-upload")),
            (d = n.find(".kv-file-remove")),
            u.show()),
          0 === _ ||
            !y ||
            (w.showPreview && l && l.hasClass("disabled")) ||
            w._abort(k) ||
            ((v = function () {
              c ? b.errors.push(a) : b.removeFile(a),
                b.setProcessed(a),
                b.isProcessed() && ((w.fileBatchCompleted = !0), o());
            }),
            (o = function () {
              var e;
              w.fileBatchCompleted &&
                setTimeout(function () {
                  var i = 0 === b.count(),
                    a = b.errors.length;
                  w._updateInitialPreview(),
                    w.unlock(i),
                    i && w._clearFileInput(),
                    (e = w.$preview.find(".file-preview-initial")),
                    w.uploadAsync && e.length && (t.addCss(e, t.SORT_CSS), w._initSortable()),
                    w._raise("filebatchuploadcomplete", [b.stack, w._getExtraData()]),
                    (w.retryErrorUploads && 0 !== a) || b.clear(),
                    w._setProgress(101),
                    (w.ajaxAborted = !1);
                }, w.processDelay);
            }),
            (p = function (o) {
              (s = w._getOutData(C, o)),
                b.initStats(a),
                (w.fileBatchCompleted = !1),
                r || (w.ajaxAborted = !1),
                w.showPreview &&
                  (n.hasClass("file-preview-success") ||
                    (w._setThumbStatus(n, "Loading"), t.addCss(n, "file-uploading")),
                  l.attr("disabled", !0),
                  d.attr("disabled", !0)),
                r || w.lock(),
                -1 !== b.errors.indexOf(a) && delete b.errors[a],
                w._raise("filepreupload", [s, x, i, w._getThumbFileId(n)]),
                e.extend(!0, k, s),
                w._abort(k) &&
                  (o.abort(),
                  r ||
                    (w._setThumbStatus(n, "New"),
                    n.removeClass("file-uploading"),
                    l.removeAttr("disabled"),
                    d.removeAttr("disabled")),
                  w._setProgressCancelled());
            }),
            (h = function (o, d, p) {
              var h = w.showPreview && n.attr("id") ? n.attr("id") : x;
              (s = w._getOutData(C, p, o)),
                e.extend(!0, k, s),
                setTimeout(function () {
                  t.isEmpty(o) || t.isEmpty(o.error)
                    ? (w.showPreview &&
                        (w._setThumbStatus(n, "Success"),
                        l.hide(),
                        w._initUploadSuccess(o, n, r),
                        w._setProgress(101, u)),
                      w._raise("fileuploaded", [s, h, i, w._getThumbFileId(n)]),
                      r ? v() : w.fileManager.remove(n))
                    : ((c = !0),
                      (f = w._parseError(T, p, w.msgUploadError, w.fileManager.getFileName(a))),
                      w._showFileError(f, k),
                      w._setPreviewError(n, !0),
                      w.retryErrorUploads || l.hide(),
                      r && v(),
                      w._setProgress(101, w._getFrame(h).find(".file-thumb-progress"), w.msgUploadError));
                }, w.processDelay);
            }),
            (m = function () {
              w.showPreview && (l.removeAttr("disabled"), d.removeAttr("disabled"), n.removeClass("file-uploading")),
                r ? o() : (w.unlock(!1), w._clearFileInput()),
                w._initSuccessThumbs();
            }),
            (g = function (t, i, s) {
              (f = w._parseError(T, t, s, w.fileManager.getFileName(a))),
                (c = !0),
                setTimeout(function () {
                  var i;
                  r && v(),
                    w.fileManager.setProgress(a, 100),
                    w._setPreviewError(n, !0),
                    w.retryErrorUploads || l.hide(),
                    e.extend(!0, k, w._getOutData(C, t)),
                    w._setProgress(101, w.$progress, w.msgAjaxProgressError.replace("{operation}", T)),
                    (i = w.showPreview && n ? n.find(".file-thumb-progress") : ""),
                    w._setProgress(101, i, w.msgUploadError),
                    w._showFileError(f, k);
                }, w.processDelay);
            }),
            w._setFileData(C, P.file, F, a),
            w._setUploadData(C, { fileId: a }),
            w._ajaxSubmit(p, h, m, g, C, a, i)));
      },
      _setFileData: function (e, t, i, a) {
        var r = this.preProcessUpload;
        r && "function" == typeof r ? e.append(this.uploadFileAttr, r(a, t)) : e.append(this.uploadFileAttr, t, i);
      },
      _checkBatchPreupload: function (t, i) {
        var a = this;
        return (
          !!a._raise("filebatchpreupload", [t]) ||
          (a._abort(t),
          i && i.abort(),
          a._getThumbs().each(function () {
            var t = e(this),
              i = t.find(".kv-file-upload"),
              r = t.find(".kv-file-remove");
            t.hasClass("file-preview-loading") && (a._setThumbStatus(t, "New"), t.removeClass("file-uploading")),
              i.removeAttr("disabled"),
              r.removeAttr("disabled");
          }),
          a._setProgressCancelled(),
          !1)
        );
      },
      _uploadBatch: function () {
        var i,
          a,
          r,
          s,
          n,
          o,
          l = this,
          d = l.fileManager,
          c = d.total(),
          u = c > 0 || !e.isEmptyObject(l.uploadExtraData),
          p = new FormData(),
          f = l.ajaxOperations.uploadBatch;
        if (0 !== c && u && !l._abort({})) {
          (o = function () {
            l.fileManager.clear(), l._clearFileInput();
          }),
            (i = function (i) {
              l.lock(), d.initStats();
              var a = l._getOutData(p, i);
              (l.ajaxAborted = !1),
                l.showPreview &&
                  l._getThumbs().each(function () {
                    var i = e(this),
                      a = i.find(".kv-file-upload"),
                      r = i.find(".kv-file-remove");
                    i.hasClass("file-preview-success") ||
                      (l._setThumbStatus(i, "Loading"), t.addCss(i, "file-uploading")),
                      a.attr("disabled", !0),
                      r.attr("disabled", !0);
                  }),
                l._checkBatchPreupload(a, i);
            }),
            (a = function (i, a, r) {
              var s = l._getOutData(p, r, i),
                d = 0,
                c = l._getThumbs(":not(.file-preview-success)"),
                u = t.isEmpty(i) || t.isEmpty(i.errorkeys) ? [] : i.errorkeys;
              t.isEmpty(i) || t.isEmpty(i.error)
                ? (l._raise("filebatchuploadsuccess", [s]),
                  o(),
                  l.showPreview
                    ? (c.each(function () {
                        var t = e(this);
                        l._setThumbStatus(t, "Success"),
                          t.removeClass("file-uploading"),
                          t.find(".kv-file-upload").hide().removeAttr("disabled");
                      }),
                      l._initUploadSuccess(i))
                    : l.reset(),
                  l._setProgress(101))
                : (l.showPreview &&
                    (c.each(function () {
                      var t = e(this);
                      t.removeClass("file-uploading"),
                        t.find(".kv-file-upload").removeAttr("disabled"),
                        t.find(".kv-file-remove").removeAttr("disabled"),
                        0 === u.length || -1 !== e.inArray(d, u)
                          ? (l._setPreviewError(t, !0),
                            l.retryErrorUploads || (t.find(".kv-file-upload").hide(), l.fileManager.remove(t)))
                          : (t.find(".kv-file-upload").hide(),
                            l._setThumbStatus(t, "Success"),
                            l.fileManager.remove(t)),
                        (t.hasClass("file-preview-error") && !l.retryErrorUploads) || d++;
                    }),
                    l._initUploadSuccess(i)),
                  (n = l._parseError(f, r, l.msgUploadError)),
                  l._showFileError(n, s, "filebatchuploaderror"),
                  l._setProgress(101, l.$progress, l.msgUploadError));
            }),
            (s = function () {
              l.unlock(),
                l._initSuccessThumbs(),
                l._clearFileInput(),
                l._raise("filebatchuploadcomplete", [l.fileManager.stack, l._getExtraData()]);
            }),
            (r = function (t, i, a) {
              var r = l._getOutData(p, t);
              (n = l._parseError(f, t, a)),
                l._showFileError(n, r, "filebatchuploaderror"),
                (l.uploadFileCount = c - 1),
                l.showPreview &&
                  (l._getThumbs().each(function () {
                    var t = e(this);
                    t.removeClass("file-uploading"), l._getThumbFile(t) && l._setPreviewError(t);
                  }),
                  l._getThumbs().removeClass("file-uploading"),
                  l._getThumbs(" .kv-file-upload").removeAttr("disabled"),
                  l._getThumbs(" .kv-file-delete").removeAttr("disabled"),
                  l._setProgress(101, l.$progress, l.msgAjaxProgressError.replace("{operation}", f)));
            });
          var h = 0;
          e.each(l.fileManager.stack, function (e, i) {
            t.isEmpty(i.file) || l._setFileData(p, i.file, i.nameFmt || "untitled_" + h, e), h++;
          }),
            l._ajaxSubmit(i, a, s, r, p);
        }
      },
      _uploadExtraOnly: function () {
        var e,
          i,
          a,
          r,
          s,
          n = this,
          o = {},
          l = new FormData(),
          d = n.ajaxOperations.uploadExtra;
        (e = function (e) {
          n.lock();
          var t = n._getOutData(l, e);
          n._setProgress(50), (o.data = t), (o.xhr = e), n._checkBatchPreupload(t, e);
        }),
          (i = function (e, i, a) {
            var r = n._getOutData(l, a, e);
            t.isEmpty(e) || t.isEmpty(e.error)
              ? (n._raise("filebatchuploadsuccess", [r]),
                n._clearFileInput(),
                n._initUploadSuccess(e),
                n._setProgress(101))
              : ((s = n._parseError(d, a, n.msgUploadError)), n._showFileError(s, r, "filebatchuploaderror"));
          }),
          (a = function () {
            n.unlock(),
              n._clearFileInput(),
              n._raise("filebatchuploadcomplete", [n.fileManager.stack, n._getExtraData()]);
          }),
          (r = function (e, t, i) {
            var a = n._getOutData(l, e);
            (s = n._parseError(d, e, i)),
              (o.data = a),
              n._showFileError(s, a, "filebatchuploaderror"),
              n._setProgress(101, n.$progress, n.msgAjaxProgressError.replace("{operation}", d));
          }),
          n._ajaxSubmit(e, i, a, r, l);
      },
      _deleteFileIndex: function (i) {
        var a = i.attr("data-fileindex"),
          r = this.reversePreviewOrder;
        a.substring(0, 5) === t.INIT_FLAG &&
          ((a = parseInt(a.replace(t.INIT_FLAG, ""))),
          (this.initialPreview = t.spliceArray(this.initialPreview, a, r)),
          (this.initialPreviewConfig = t.spliceArray(this.initialPreviewConfig, a, r)),
          (this.initialPreviewThumbTags = t.spliceArray(this.initialPreviewThumbTags, a, r)),
          this.getFrames().each(function () {
            var i = e(this),
              r = i.attr("data-fileindex");
            r.substring(0, 5) === t.INIT_FLAG &&
              (r = parseInt(r.replace(t.INIT_FLAG, ""))) > a &&
              (r--, i.attr("data-fileindex", t.INIT_FLAG + r));
          }));
      },
      _resetCaption: function () {
        var e = this;
        setTimeout(function () {
          var t,
            i,
            a,
            r = "",
            s = e.previewCache.count(!0),
            n = e.fileManager.count(),
            o = e.showPreview && e.getFrames(":not(.file-preview-success):not(.file-preview-error)").length;
          0 !== n || 0 !== s || o
            ? ((t = s + n) > 1
                ? (r = e._getMsgSelected(t))
                : 0 === n
                ? ((r = ""),
                  (a = e.initialPreviewConfig[0]) && (r = a.caption || a.filename || ""),
                  r || (r = e._getMsgSelected(t)))
                : (r = (i = e.fileManager.getFirstFile()) ? i.nameFmt : "_"),
              e._setCaption(r))
            : e.reset();
        }, e.processDelay);
      },
      _initFileActions: function () {
        var i = this;
        i.showPreview &&
          (i._initZoomButton(),
          i.getFrames(" .kv-file-remove").each(function () {
            var a,
              r = e(this),
              s = r.closest(t.FRAMES),
              n = s.attr("id"),
              o = s.attr("data-fileindex");
            i.fileManager;
            i._handler(r, "click", function () {
              if (!1 === i._raise("filepreremove", [n, o]) || !i._validateMinCount()) return !1;
              (a = s.hasClass("file-preview-error")),
                t.cleanMemory(s),
                s.fadeOut("slow", function () {
                  i.fileManager.remove(s),
                    i._clearObjects(s),
                    s.remove(),
                    n &&
                      a &&
                      i.$errorContainer.find('li[data-thumb-id="' + n + '"]').fadeOut("fast", function () {
                        e(this).remove(), i._errorsExist() || i._resetErrors();
                      }),
                    i._clearFileInput(),
                    i._resetCaption(),
                    i._raise("fileremoved", [n, o]);
                });
            });
          }),
          i.getFrames(" .kv-file-upload").each(function () {
            var a = e(this);
            i._handler(a, "click", function () {
              var e = a.closest(t.FRAMES),
                r = i._getThumbFileId(e);
              i._hideProgress(),
                (e.hasClass("file-preview-error") && !i.retryErrorUploads) ||
                  i._uploadSingle(i.fileManager.getIndex(r), r, !1);
            });
          }));
      },
      _initPreviewActions: function () {
        var i = this,
          a = i.$preview,
          r = i.deleteExtraData || {},
          s = t.FRAMES + " .kv-file-remove",
          n = i.fileActionSettings,
          o = n.removeClass,
          l = n.removeErrorClass,
          d = function () {
            var e = i.isAjaxUpload ? i.previewCache.count(!0) : i._inputFileCount();
            i.getFrames().length || e ? i._resetCaption() : (i._setCaption(""), i.reset(), (i.initialCaption = ""));
          };
        i._initZoomButton(),
          a.find(s).each(function () {
            var a,
              s,
              n,
              c,
              u = e(this),
              p = u.data("url") || i.deleteUrl,
              f = u.data("key"),
              h = i.ajaxOperations.deleteThumb;
            if (!t.isEmpty(p) && void 0 !== f) {
              "function" == typeof p && (p = p());
              var m,
                g,
                v,
                w,
                b,
                _ = u.closest(t.FRAMES),
                C = i.previewCache.data,
                x = _.attr("data-fileindex");
              (x = parseInt(x.replace(t.INIT_FLAG, ""))),
                (v = t.isEmpty(C.config) && t.isEmpty(C.config[x]) ? null : C.config[x]),
                (b = t.isEmpty(v) || t.isEmpty(v.extra) ? r : v.extra),
                (w = (v && (v.filename || v.caption)) || ""),
                "function" == typeof b && (b = b()),
                (g = { id: u.attr("id"), key: f, extra: b }),
                (s = function (e) {
                  (i.ajaxAborted = !1),
                    i._raise("filepredelete", [f, e, b]),
                    i._abort()
                      ? e.abort()
                      : (u.removeClass(l), t.addCss(_, "file-uploading"), t.addCss(u, "disabled " + o));
                }),
                (n = function (e, r, s) {
                  var n, c;
                  if (!t.isEmpty(e) && !t.isEmpty(e.error))
                    return (
                      (g.jqXHR = s),
                      (g.response = e),
                      (a = i._parseError(h, s, i.msgDeleteError, w)),
                      i._showFileError(a, g, "filedeleteerror"),
                      _.removeClass("file-uploading"),
                      u.removeClass("disabled " + o).addClass(l),
                      void d()
                    );
                  _.removeClass("file-uploading").addClass("file-deleted"),
                    _.fadeOut("slow", function () {
                      (x = parseInt(_.attr("data-fileindex").replace(t.INIT_FLAG, ""))),
                        i.previewCache.unset(x),
                        i._deleteFileIndex(_),
                        (n = i.previewCache.count(!0)),
                        (c = n > 0 ? i._getMsgSelected(n) : ""),
                        i._setCaption(c),
                        i._raise("filedeleted", [f, s, b]),
                        i._clearObjects(_),
                        _.remove(),
                        d();
                    });
                }),
                (c = function (e, t, a) {
                  var r = i._parseError(h, e, a, w);
                  (g.jqXHR = e),
                    (g.response = {}),
                    i._showFileError(r, g, "filedeleteerror"),
                    _.removeClass("file-uploading"),
                    u.removeClass("disabled " + o).addClass(l),
                    d();
                }),
                i._initAjaxSettings(),
                i._mergeAjaxCallback("beforeSend", s, "delete"),
                i._mergeAjaxCallback("success", n, "delete"),
                i._mergeAjaxCallback("error", c, "delete"),
                (m = e.extend(
                  !0,
                  {},
                  { url: i._encodeURI(p), type: "POST", dataType: "json", data: e.extend(!0, {}, { key: f }, b) },
                  i._ajaxDeleteSettings
                )),
                i._handler(u, "click", function () {
                  if (!i._validateMinCount()) return !1;
                  (i.ajaxAborted = !1),
                    i._raise("filebeforedelete", [f, b]),
                    i.ajaxAborted instanceof Promise
                      ? i.ajaxAborted.then(function (t) {
                          t || e.ajax(m);
                        })
                      : i.ajaxAborted || e.ajax(m);
                });
            }
          });
      },
      _hideFileIcon: function () {
        this.overwriteInitial && this.$captionContainer.removeClass("icon-visible");
      },
      _showFileIcon: function () {
        t.addCss(this.$captionContainer, "icon-visible");
      },
      _getSize: function (t, i) {
        var a,
          r,
          s = parseFloat(t),
          n = this.fileSizeGetter;
        return e.isNumeric(t) && e.isNumeric(s)
          ? ("function" == typeof n
              ? (r = n(s))
              : 0 === s
              ? (r = "0.00 B")
              : (i || (i = this.sizeUnits),
                (a = Math.floor(Math.log(s) / Math.log(this.bytesToKB))),
                (r = (s / Math.pow(this.bytesToKB, a)).toFixed(2) + " " + i[a])),
            this._getLayoutTemplate("size").replace("{sizeText}", r))
          : "";
      },
      _getFileType: function (e) {
        return this.mimeTypeAliases[e] || e;
      },
      _generatePreviewTemplate: function (i, a, r, s, n, o, l, d, c, u, p, f, h, m) {
        var g,
          v,
          w = this,
          b = w.slug(r),
          _ = "",
          C = "",
          x = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
          y = b,
          T = b,
          P = "type-default",
          k = u || w._renderFileFooter(i, b, d, "auto", l),
          F = w.preferIconicPreview,
          S = w.preferIconicZoomPreview,
          E = F ? "other" : i;
        return (
          (g =
            x < 400
              ? w.previewSettingsSmall[E] || w.defaults.previewSettingsSmall[E]
              : w.previewSettings[E] || w.defaults.previewSettings[E]) &&
            e.each(g, function (e, t) {
              C += e + ":" + t + ";";
            }),
          (v = function (a, l, d, u, m) {
            var g,
              v = d ? "zoom-" + n : n,
              _ = w._getPreviewTemplate(a),
              x = (c || "") + " " + u;
            return (
              w.frameClass && (x = w.frameClass + " " + x),
              d && (x = x.replace(" " + t.SORT_CSS, "")),
              (_ = w._parseFilePreviewIcon(_, r)),
              "object" !== i ||
                s ||
                e.each(w.defaults.fileTypeSettings, function (e, t) {
                  "object" !== e && "other" !== e && t(r, s) && (P = "type-" + e);
                }),
              t.isEmpty(h) ||
                (void 0 !== h.title && null !== h.title && (y = h.title),
                void 0 !== h.alt && null !== h.alt && (y = h.alt)),
              (g = {
                previewId: v,
                caption: b,
                title: y,
                alt: T,
                frameClass: x,
                type: w._getFileType(s),
                fileindex: p,
                fileid: o || "",
                typeCss: P,
                footer: k,
                data: d && m ? t.ZOOM_VAR + "{zoomData}" : l,
                template: f || i,
                style: C ? 'style="' + C + '"' : "",
                zoomData: m ? encodeURIComponent(m) : "",
              }),
              d && ((g.zoomCache = ""), (g.zoomData = "{zoomData}")),
              _.setTokens(g)
            );
          }),
          (p = p || n.slice(n.lastIndexOf("-") + 1)),
          w.fileActionSettings.showZoom && (_ = v(S ? "other" : i, a, !0, "kv-zoom-thumb", m)),
          (_ = "\n" + w._getLayoutTemplate("zoomCache").replace("{zoomContent}", _)),
          "function" == typeof w.sanitizeZoomCache && (_ = w.sanitizeZoomCache(_)),
          v(F ? "other" : i, a, !1, "kv-preview-thumb", m).setTokens({ zoomCache: _ })
        );
      },
      _addToPreview: function (e, i) {
        var a;
        return (
          (i = t.cspBuffer.stash(i)),
          (a = this.reversePreviewOrder ? e.prepend(i) : e.append(i)),
          t.cspBuffer.apply(e),
          a
        );
      },
      _previewDefault: function (e, i) {
        var a = this.$preview;
        if (this.showPreview) {
          var r,
            s = t.getFileName(e),
            n = e ? e.type : "",
            o = e.size || 0,
            l = this._getFileName(e, ""),
            d = !0 === i && !this.isAjaxUpload,
            c = t.createObjectURL(e),
            u = this.fileManager.getId(e),
            p = this._getThumbId(u);
          this._clearDefaultPreview(),
            (r = this._generatePreviewTemplate("other", c, s, n, p, u, d, o)),
            this._addToPreview(a, r),
            this._setThumbAttr(p, l, o),
            !0 === i && this.isAjaxUpload && this._setThumbStatus(this._getFrame(p), "Error");
        }
      },
      _previewFile: function (e, i, a, r, s) {
        if (this.showPreview) {
          var n,
            o = t.getFileName(i),
            l = s.type,
            d = s.name,
            c = this._parseFileType(l, o),
            u = this.$preview,
            p = i.size || 0,
            f = "image" === c ? a.target.result : r,
            h = this.fileManager.getId(i),
            m = this._getThumbId(h);
          (n = this._generatePreviewTemplate(c, f, o, l, m, h, !1, p)),
            this._clearDefaultPreview(),
            this._addToPreview(u, n);
          var g = this._getFrame(m);
          this._validateImageOrientation(g.find("img"), i, m, h, d, l, p, f),
            this._setThumbAttr(m, d, p),
            this._initSortable();
        }
      },
      _setThumbAttr: function (e, t, i, a) {
        var r = this._getFrame(e);
        r.length && ((i = i && i > 0 ? this._getSize(i) : ""), r.data({ caption: t, size: i, description: a || "" }));
      },
      _setInitThumbAttr: function () {
        var e,
          i,
          a,
          r,
          s,
          n = this.previewCache.data,
          o = this.previewCache.count(!0);
        if (0 !== o)
          for (var l = 0; l < o; l++)
            (e = n.config[l]),
              (s = this.previewInitId + "-" + t.INIT_FLAG + l),
              (i = t.ifSet("caption", e, t.ifSet("filename", e))),
              (a = t.ifSet("size", e)),
              (r = t.ifSet("description", e)),
              this._setThumbAttr(s, i, a, r);
      },
      _slugDefault: function (e) {
        return t.isEmpty(e, !0) ? "" : String(e).replace(/[\[\]\/\{}:;#%=\(\)\*\+\?\\\^\$\|<>&"']/g, "_");
      },
      _updateFileDetails: function (e) {
        var i,
          a,
          r,
          s,
          n = this.$element,
          o = (t.isIE(9) && t.findFileName(n.val())) || (n[0].files[0] && n[0].files[0].name);
        (i = !o && this.fileManager.count() > 0 ? this.fileManager.getFirstFile().nameFmt : o ? this.slug(o) : "_"),
          (a = this.isAjaxUpload ? this.fileManager.count() : e),
          (s = this.previewCache.count(!0) + a),
          (r = 1 === a ? i : this._getMsgSelected(s, !this.isAjaxUpload && !this.isError)),
          this.isError
            ? (this.$previewContainer.removeClass("file-thumb-loading"),
              this._initCapStatus(),
              this.$previewStatus.html(""),
              this.$captionContainer.removeClass("icon-visible"))
            : this._showFileIcon(),
          this._setCaption(r, this.isError),
          this.$container.removeClass("file-input-new file-input-ajax-new"),
          this._raise("fileselect", [e, i]),
          this.previewCache.count(!0) && this._initPreviewActions();
      },
      _setThumbStatus: function (e, i) {
        if (this.showPreview) {
          var a = "indicator" + i,
            r = a + "Title",
            s = "file-preview-" + i.toLowerCase(),
            n = e.find(".file-upload-indicator"),
            o = this.fileActionSettings;
          e.removeClass("file-preview-success file-preview-error file-preview-paused file-preview-loading"),
            "Success" === i && e.find(".file-drag-handle").remove(),
            t.setHtml(n, o[a]),
            n.attr("title", o[r]),
            e.addClass(s),
            "Error" !== i || this.retryErrorUploads || e.find(".kv-file-upload").attr("disabled", !0);
        }
      },
      _setProgressCancelled: function () {
        this._setProgress(101, this.$progress, this.msgCancelled);
      },
      _setProgress: function (e, i, a, r) {
        if ((i = i || this.$progress).length) {
          var s,
            n = Math.min(e, 100),
            o = this.progressUploadThreshold,
            l = e <= 100 ? this.progressTemplate : this.progressCompleteTemplate,
            d =
              n < 100
                ? this.progressTemplate
                : a
                ? this.paused
                  ? this.progressPauseTemplate
                  : this.progressErrorTemplate
                : l;
          e >= 100 && (r = ""),
            t.isEmpty(d) ||
              ((r = r || ""),
              (s = (s =
                o && n > o && e <= 100
                  ? d.setTokens({ percent: o, status: this.msgUploadThreshold })
                  : d.setTokens({ percent: n, status: e > 100 ? this.msgUploadEnd : n + "%" })).setTokens({
                stats: r,
              })),
              t.setHtml(i, s),
              a && t.setHtml(i.find('[role="progressbar"]'), a));
        }
      },
      _hasFiles: function () {
        var e = this.$element[0];
        return !!(e && e.files && e.files.length);
      },
      _setFileDropZoneTitle: function () {
        var e,
          i = this.$container.find(".file-drop-zone"),
          a = this.dropZoneTitle;
        this.isClickable &&
          ((e = t.isEmpty(this.$element.attr("multiple")) ? this.fileSingle : this.filePlural),
          (a += this.dropZoneClickTitle.replace("{files}", e))),
          i.find("." + this.dropZoneTitleClass).remove(),
          !this.showPreview ||
            0 === i.length ||
            this.fileManager.count() > 0 ||
            !this.dropZoneEnabled ||
            (!this.isAjaxUpload && this._hasFiles()) ||
            (0 === i.find(t.FRAMES).length &&
              t.isEmpty(this.defaultPreviewContent) &&
              i.prepend('<div class="' + this.dropZoneTitleClass + '">' + a + "</div>"),
            this.$container.removeClass("file-input-new"),
            t.addCss(this.$container, "file-input-ajax-new"));
      },
      _getStats: function (e) {
        var i, a;
        return this.showUploadStats && e && e.bitrate
          ? ((a = this._getLayoutTemplate("stats")),
            (i =
              e.elapsed && e.bps
                ? this.msgPendingTime.setTokens({ time: t.getElapsed(Math.ceil(e.pendingBytes / e.bps)) })
                : this.msgCalculatingTime),
            a.setTokens({ uploadSpeed: e.bitrate, pendingTime: i }))
          : "";
      },
      _setResumableProgress: function (e, t, i) {
        var a = this.resumableManager,
          r = i ? a : this,
          s = i ? i.find(".file-thumb-progress") : null;
        0 === r.lastProgress && (r.lastProgress = e),
          e < r.lastProgress && (e = r.lastProgress),
          this._setProgress(e, s, null, this._getStats(t)),
          (r.lastProgress = e);
      },
      _toggleResumableProgress: function (e, i) {
        var a = this.$progress;
        a && a.length && t.setHtml(a, e.setTokens({ percent: 101, status: i, stats: "" }));
      },
      _setFileUploadStats: function (i, a, r) {
        var s = this.$progress;
        if (this.showPreview || (s && s.length)) {
          var n,
            o = this.fileManager,
            l = this.resumableManager,
            d = o.getThumb(i),
            c = 0,
            u = o.getTotalSize(),
            p = e.extend(!0, {}, r);
          if (this.enableResumableUpload) {
            var f,
              h = r.loaded,
              m = l.getUploadedSize(),
              g = l.file.size;
            (h += m),
              (f = o.uploadedSize + h),
              (a = t.round((100 * h) / g)),
              (r.pendingBytes = g - m),
              this._setResumableProgress(a, r, d),
              (n = Math.floor((100 * f) / u)),
              (p.pendingBytes = u - f),
              this._setResumableProgress(n, p);
          } else
            o.setProgress(i, a),
              (s = d && d.length ? d.find(".file-thumb-progress") : null),
              this._setProgress(a, s, null, this._getStats(r)),
              e.each(o.stats, function (e, t) {
                c += t.loaded;
              }),
              (p.pendingBytes = u - c),
              (n = t.round((c / u) * 100)),
              this._setProgress(n, null, null, this._getStats(p));
        }
      },
      _validateMinCount: function () {
        var e = this.isAjaxUpload ? this.fileManager.count() : this._inputFileCount();
        return (
          !(this.validateInitialCount && this.minFileCount > 0 && this._getFileCount(e - 1) < this.minFileCount) ||
          (this._noFilesError({}), !1)
        );
      },
      _getFileCount: function (e, t) {
        return (
          void 0 === t && (t = this.validateInitialCount && !this.overwriteInitial),
          t && (e += this.previewCache.count(!0)),
          e
        );
      },
      _getFileId: function (e) {
        return t.getFileId(e, this.generateFileId);
      },
      _getFileName: function (e, i) {
        var a = t.getFileName(e);
        return a ? this.slug(a) : i;
      },
      _getFileNames: function (e) {
        return this.filenames.filter(function (t) {
          return e ? void 0 !== t : null != t;
        });
      },
      _setPreviewError: function (e, t) {
        var i = this.removeFromPreviewOnError && !this.retryErrorUploads;
        (t && !i) || this.fileManager.remove(e),
          this.showPreview && (i ? e.remove() : (this._setThumbStatus(e, "Error"), this._refreshUploadButton(e)));
      },
      _refreshUploadButton: function (e) {
        var i = e.find(".kv-file-upload"),
          a = this.fileActionSettings,
          r = a.uploadIcon,
          s = a.uploadTitle;
        i.length &&
          (this.retryErrorUploads && ((r = a.uploadRetryIcon), (s = a.uploadRetryTitle)),
          i.attr("title", s),
          t.setHtml(i, r));
      },
      _checkDimensions: function (e, i, a, r, s, n, o) {
        var l,
          d,
          c,
          u = this[("Small" === i ? "min" : "max") + "Image" + n];
        !t.isEmpty(u) &&
          a.length &&
          ((c = a[0]),
          (d = "Width" === n ? c.naturalWidth || c.width : c.naturalHeight || c.height),
          ("Small" === i ? d >= u : d <= u) ||
            ((l = this["msgImage" + n + i].setTokens({ name: s, size: u })),
            this._showFileError(l, o),
            this._setPreviewError(r)));
      },
      _getExifObj: function (e) {
        var i,
          a = t.logMessages.exifWarning;
        if ("data:image/jpeg;base64," === e.slice(0, 23) || "data:image/jpg;base64," === e.slice(0, 22)) {
          try {
            i = window.piexif ? window.piexif.load(e) : null;
          } catch (e) {
            (i = null), (a = (e && e.message) || "");
          }
          return i || this._log(t.logMessages.badExifParser, { details: a }), i;
        }
        i = null;
      },
      setImageOrientation: function (i, a, r, s) {
        var n,
          o,
          l,
          d = this,
          c = !i || !i.length,
          u = !a || !a.length,
          p = !1,
          f = c && s && "image" === s.attr("data-template");
        (c && u) ||
          ((l = "load.fileinputimageorient"),
          f
            ? ((i = a),
              (a = null),
              i.css(d.previewSettings.image),
              (o = e(document.createElement("div")).appendTo(s.find(".kv-file-content"))),
              (n = e(document.createElement("span")).insertBefore(i)),
              i.css("visibility", "hidden").removeClass("file-zoom-detail").appendTo(o))
            : (p = !i.is(":visible")),
          i.off(l).on(l, function () {
            p && (d.$preview.removeClass("hide-content"), s.find(".kv-file-content").css("visibility", "hidden"));
            var e = i[0],
              l = a && a.length ? a[0] : null,
              c = e.offsetHeight,
              u = e.offsetWidth,
              h = t.getRotation(r);
            if (
              (p && (s.find(".kv-file-content").css("visibility", "visible"), d.$preview.addClass("hide-content")),
              i.data("orientation", r),
              l && a.data("orientation", r),
              r < 5)
            )
              return t.setTransform(e, h), void t.setTransform(l, h);
            var m = Math.atan(u / c),
              g = Math.sqrt(Math.pow(c, 2) + Math.pow(u, 2)),
              v = g ? c / Math.cos(Math.PI / 2 + m) / g : 1,
              w = " scale(" + Math.abs(v) + ")";
            t.setTransform(e, h + w),
              t.setTransform(l, h + w),
              f && (i.css("visibility", "visible").insertAfter(n).addClass("file-zoom-detail"), n.remove(), o.remove());
          }));
      },
      _validateImageOrientation: function (i, a, r, s, n, o, l, d) {
        var c,
          u,
          p = null,
          f = this.autoOrientImage;
        if (this.canOrientImage)
          return i.css("image-orientation", f ? "from-image" : "none"), void this._validateImage(r, s, n, o, l, d, p);
        (u = t.getZoomSelector(r, " img")),
          (c = (p = f ? this._getExifObj(d) : null) ? p["0th"][piexif.ImageIFD.Orientation] : null)
            ? (this.setImageOrientation(i, e(u), c, this._getFrame(r)),
              this._raise("fileimageoriented", { $img: i, file: a }),
              this._validateImage(r, s, n, o, l, d, p))
            : this._validateImage(r, s, n, o, l, d, p);
      },
      _validateImage: function (e, t, i, a, r, s, n) {
        var o,
          l,
          d,
          c = this,
          u = c.$preview,
          p = c._getFrame(e),
          f = p.attr("data-fileindex"),
          h = p.find("img");
        (i = i || "Untitled"),
          h
            .one("load", function () {
              (l = p.width()),
                (d = u.width()),
                l > d && h.css("width", "100%"),
                (o = { ind: f, id: e, fileId: t }),
                c._checkDimensions(f, "Small", h, p, i, "Width", o),
                c._checkDimensions(f, "Small", h, p, i, "Height", o),
                c.resizeImage ||
                  (c._checkDimensions(f, "Large", h, p, i, "Width", o),
                  c._checkDimensions(f, "Large", h, p, i, "Height", o)),
                c._raise("fileimageloaded", [e]),
                c.fileManager.addImage(t, {
                  ind: f,
                  img: h,
                  thumb: p,
                  pid: e,
                  typ: a,
                  siz: r,
                  validated: !1,
                  imgData: s,
                  exifObj: n,
                }),
                p.data("exif", n),
                c._validateAllImages();
            })
            .one("error", function () {
              c._raise("fileimageloaderror", [e]);
            });
      },
      _validateAllImages: function () {
        var t,
          i = this,
          a = { val: 0 },
          r = i.fileManager.getImageCount(),
          s = i.resizeIfSizeMoreThan;
        r === i.fileManager.totalImages &&
          (i._raise("fileimagesloaded"),
          i.resizeImage &&
            e.each(i.fileManager.loadedImages, function (e, n) {
              n.validated || ((t = n.siz) && t > s * i.bytesToKB && i._getResizedImage(e, n, a, r), (n.validated = !0));
            }));
      },
      _getResizedImage: function (i, a, r, s) {
        var n,
          o,
          l,
          d,
          c,
          u,
          p,
          f,
          h,
          m = this,
          g = e(a.img)[0],
          v = g.naturalWidth,
          w = g.naturalHeight,
          b = 1,
          _ = m.maxImageWidth || v,
          C = m.maxImageHeight || w,
          x = !(!v || !w),
          y = m.imageCanvas,
          T = m.imageCanvasContext,
          P = a.typ,
          k = a.pid,
          F = a.ind,
          S = a.thumb,
          E = a.exifObj;
        if (
          ((c = function (e, t, i) {
            m.isAjaxUpload ? m._showFileError(e, t, i) : m._showError(e, t, i), m._setPreviewError(S);
          }),
          (f = { id: k, index: F, fileId: i }),
          (h = [i, k, F]),
          ((p = m.fileManager.getFile(i)) && x && !(v <= _ && w <= C)) ||
            (x && p && m._raise("fileimageresized", h), r.val++, r.val === s && m._raise("fileimagesresized"), x))
        ) {
          (P = P || m.resizeDefaultImageType),
            (o = v > _),
            (l = w > C),
            (b = "width" === m.resizePreference ? (o ? _ / v : l ? C / w : 1) : l ? C / w : o ? _ / v : 1),
            m._resetCanvas(),
            (v *= b),
            (w *= b),
            (y.width = v),
            (y.height = w);
          try {
            T.drawImage(g, 0, 0, v, w),
              (d = y.toDataURL(P, m.resizeQuality)),
              E && ((u = window.piexif.dump(E)), (d = window.piexif.insert(u, d))),
              (n = t.dataURI2Blob(d)),
              m.fileManager.setFile(i, n),
              m._raise("fileimageresized", h),
              r.val++,
              r.val === s && m._raise("fileimagesresized", [void 0, void 0]),
              n instanceof Blob || c(m.msgImageResizeError, f, "fileimageresizeerror");
          } catch (e) {
            r.val++,
              r.val === s && m._raise("fileimagesresized", [void 0, void 0]),
              c(m.msgImageResizeException.replace("{errors}", e.message), f, "fileimageresizeexception");
          }
        } else c(m.msgImageResizeError, f, "fileimageresizeerror");
      },
      _showProgress: function () {
        this.$progress && this.$progress.length && this.$progress.show();
      },
      _hideProgress: function () {
        this.$progress && this.$progress.length && this.$progress.hide();
      },
      _initBrowse: function (e) {
        var i = this.$element;
        this.showBrowse
          ? (this.$btnFile = e.find(".btn-file").append(i))
          : (i.appendTo(e).attr("tabindex", -1), t.addCss(i, "file-no-browse"));
      },
      _initClickable: function () {
        var i,
          a,
          r = this;
        r.isClickable &&
          ((i = r.$dropZone),
          r.isAjaxUpload || ((a = r.$preview.find(".file-default-preview")).length && (i = a)),
          t.addCss(i, "clickable"),
          i.attr("tabindex", -1),
          r._handler(i, "click", function (t) {
            var a = e(t.target);
            r.$errorContainer.is(":visible") ||
              (a.parents(".file-preview-thumbnails").length && !a.parents(".file-default-preview").length) ||
              (r.$element.data("zoneClicked", !0).trigger("click"), i.blur());
          }));
      },
      _initCaption: function () {
        var e = this.initialCaption || "";
        return this.overwriteInitial || t.isEmpty(e) ? (this.$caption.val(""), !1) : (this._setCaption(e), !0);
      },
      _setCaption: function (i, a) {
        var r, s, n, o, l, d;
        if (this.$caption.length) {
          if ((this.$captionContainer.removeClass("icon-visible"), a))
            (r = e("<div>" + this.msgValidationError + "</div>").text()),
              (o = this.fileManager.count())
                ? ((d = this.fileManager.getFirstFile()), (l = 1 === o && d ? d.nameFmt : this._getMsgSelected(o)))
                : (l = this._getMsgSelected(this.msgNo)),
              (s = t.isEmpty(i) ? l : i),
              (n = '<span class="' + this.msgValidationErrorClass + '">' + this.msgValidationErrorIcon + "</span>");
          else {
            if (t.isEmpty(i)) return void this.$caption.attr("title", "");
            (s = r = e("<div>" + i + "</div>").text()), (n = this._getLayoutTemplate("fileIcon"));
          }
          this.$captionContainer.addClass("icon-visible"),
            this.$caption.attr("title", r).val(s),
            t.setHtml(this.$captionIcon, n);
        }
      },
      _createContainer: function () {
        var e = { class: "file-input file-input-new" + (this.rtl ? " kv-rtl" : "") },
          i = t.createElement(t.cspBuffer.stash(this._renderMain()));
        return (
          t.cspBuffer.apply(i),
          i.insertBefore(this.$element).attr(e),
          this._initBrowse(i),
          this.theme && i.addClass("theme-" + this.theme),
          i
        );
      },
      _refreshContainer: function () {
        var e = this.$container;
        this.$element.insertAfter(e), t.setHtml(e, this._renderMain()), this._initBrowse(e), this._validateDisabled();
      },
      _validateDisabled: function () {
        this.$caption.attr({ readonly: this.isDisabled });
      },
      _setTabIndex: function (e, t) {
        var i = this.tabIndexConfig[e];
        return t.setTokens({ tabIndexConfig: null == i ? "" : 'tabindex="' + i + '"' });
      },
      _renderMain: function () {
        var e = this.dropZoneEnabled ? " file-drop-zone" : "file-drop-disabled",
          t = this.showClose ? this._getLayoutTemplate("close") : "",
          i = this.showPreview
            ? this._getLayoutTemplate("preview").setTokens({ class: this.previewClass, dropClass: e })
            : "",
          a = this.isDisabled ? this.captionClass + " file-caption-disabled" : this.captionClass,
          r = this.captionTemplate.setTokens({ class: a + " kv-fileinput-caption" });
        return (
          (r = this._setTabIndex("caption", r)),
          this.mainTemplate.setTokens({
            class: this.mainClass + (!this.showBrowse && this.showCaption ? " no-browse" : ""),
            inputGroupClass: this.inputGroupClass,
            preview: i,
            close: t,
            caption: r,
            upload: this._renderButton("upload"),
            remove: this._renderButton("remove"),
            cancel: this._renderButton("cancel"),
            pause: this._renderButton("pause"),
            browse: this._renderButton("browse"),
          })
        );
      },
      _renderButton: function (e) {
        var i = this._getLayoutTemplate("btnDefault"),
          a = this[e + "Class"],
          r = this[e + "Title"],
          s = this[e + "Icon"],
          n = this[e + "Label"],
          o = this.isDisabled ? " disabled" : "",
          l = "button";
        switch (e) {
          case "remove":
            if (!this.showRemove) return "";
            break;
          case "cancel":
            if (!this.showCancel) return "";
            a += " kv-hidden";
            break;
          case "pause":
            if (!this.showPause) return "";
            a += " kv-hidden";
            break;
          case "upload":
            if (!this.showUpload) return "";
            this.isAjaxUpload && !this.isDisabled
              ? (i = this._getLayoutTemplate("btnLink").replace("{href}", this.uploadUrl))
              : (l = "submit");
            break;
          case "browse":
            if (!this.showBrowse) return "";
            i = this._getLayoutTemplate("btnBrowse");
            break;
          default:
            return "";
        }
        return (
          (i = this._setTabIndex(e, i)),
          (a += "browse" === e ? " btn-file" : " fileinput-" + e + " fileinput-" + e + "-button"),
          t.isEmpty(n) || (n = ' <span class="' + this.buttonLabelClass + '">' + n + "</span>"),
          i.setTokens({ type: l, css: a, title: r, status: o, icon: s, label: n })
        );
      },
      _renderThumbProgress: function () {
        return (
          '<div class="file-thumb-progress kv-hidden">' +
          this.progressInfoTemplate.setTokens({ percent: 101, status: this.msgUploadBegin, stats: "" }) +
          "</div>"
        );
      },
      _renderFileFooter: function (e, i, a, r, s) {
        var n,
          o,
          l = this.fileActionSettings,
          d = l.showRemove,
          c = l.showDrag,
          u = l.showUpload,
          p = l.showZoom,
          f = this._getLayoutTemplate("footer"),
          h = this._getLayoutTemplate("indicator"),
          m = s ? l.indicatorError : l.indicatorNew,
          g = s ? l.indicatorErrorTitle : l.indicatorNewTitle,
          v = h.setTokens({ indicator: m, indicatorTitle: g });
        return (
          (o = { type: e, caption: i, size: (a = this._getSize(a)), width: r, progress: "", indicator: v }),
          this.isAjaxUpload
            ? ((o.progress = this._renderThumbProgress()),
              (o.actions = this._renderFileActions(o, u, !1, d, p, c, !1, !1, !1)))
            : (o.actions = this._renderFileActions(o, !1, !1, !1, p, c, !1, !1, !1)),
          (n = f.setTokens(o)),
          (n = t.replaceTags(n, this.previewThumbTags))
        );
      },
      _renderFileActions: function (e, t, i, a, r, s, n, o, l, d, c, u) {
        if (
          (!e.type && d && (e.type = "image"),
          this.enableResumableUpload ? (t = !1) : "function" == typeof t && (t = t(e)),
          "function" == typeof i && (i = i(e)),
          "function" == typeof a && (a = a(e)),
          "function" == typeof r && (r = r(e)),
          "function" == typeof s && (s = s(e)),
          !(t || i || a || r || s))
        )
          return "";
        var p,
          f = !1 === o ? "" : ' data-url="' + o + '"',
          h = "",
          m = "",
          g = !1 === l ? "" : ' data-key="' + l + '"',
          v = "",
          w = "",
          b = "",
          _ = this._getLayoutTemplate("actions"),
          C = this.fileActionSettings,
          x = this.otherActionButtons.setTokens({ dataKey: g, key: l }),
          y = n ? C.removeClass + " disabled" : C.removeClass;
        return (
          a &&
            (v = this._getLayoutTemplate("actionDelete").setTokens({
              removeClass: y,
              removeIcon: C.removeIcon,
              removeTitle: C.removeTitle,
              dataUrl: f,
              dataKey: g,
              key: l,
            })),
          t &&
            (w = this._getLayoutTemplate("actionUpload").setTokens({
              uploadClass: C.uploadClass,
              uploadIcon: C.uploadIcon,
              uploadTitle: C.uploadTitle,
            })),
          i &&
            (b = (b = this._getLayoutTemplate("actionDownload").setTokens({
              downloadClass: C.downloadClass,
              downloadIcon: C.downloadIcon,
              downloadTitle: C.downloadTitle,
              downloadUrl: c || this.initialPreviewDownloadUrl,
            })).setTokens({ filename: u, key: l })),
          r &&
            (h = this._getLayoutTemplate("actionZoom").setTokens({
              zoomClass: C.zoomClass,
              zoomIcon: C.zoomIcon,
              zoomTitle: C.zoomTitle,
            })),
          s &&
            ((p = "drag-handle-init " + C.dragClass),
            (m = this._getLayoutTemplate("actionDrag").setTokens({
              dragClass: p,
              dragTitle: C.dragTitle,
              dragIcon: C.dragIcon,
            }))),
          _.setTokens({ delete: v, upload: w, download: b, zoom: h, drag: m, other: x })
        );
      },
      _browse: function (e) {
        (e && e.isDefaultPrevented()) ||
          !this._raise("filebrowse") ||
          (this.isError && !this.isAjaxUpload && this.clear(),
          this.focusCaptionOnBrowse && this.$captionContainer.focus());
      },
      _change: function (i) {
        var a = this;
        if ((e(document.body).off("focusin.fileinput focusout.fileinput"), !a.changeTriggered)) {
          a._setLoading("show");
          var r,
            s,
            n,
            o,
            l = a.$element,
            d = arguments.length > 1,
            c = a.isAjaxUpload,
            u = d ? arguments[1] : l[0].files,
            p = a.fileManager.count(),
            f = t.isEmpty(l.attr("multiple")),
            h = !c && f ? 1 : a.maxFileCount,
            m = a.maxTotalFileCount,
            g = m > 0 && m > h,
            v = f && p > 0,
            w = function (t, i, r) {
              var s,
                n,
                o,
                l,
                d,
                p,
                f = r ? a.msgTotalFilesTooMany : a.msgFilesTooMany;
              (f = f.replace("{m}", i).replace("{n}", t)),
                (a.isError =
                  ((s = f),
                  (n = null),
                  (o = null),
                  (l = null),
                  (d = e.extend(!0, {}, a._getOutData(null, {}, {}, u), { id: o, index: l })),
                  (p = { id: o, index: l, file: n, files: u }),
                  (a.isPersistentError = !0),
                  a._setLoading("hide"),
                  c ? a._showFileError(s, d) : a._showError(s, p))),
                a.$captionContainer.removeClass("icon-visible"),
                a._setCaption("", !0),
                a.$container.removeClass("file-input-new file-input-ajax-new");
            };
          if (
            ((a.reader = null),
            a._resetUpload(),
            a._hideFileIcon(),
            a.dropZoneEnabled,
            c ||
              (u =
                i.target && void 0 === i.target.files
                  ? i.target.value
                    ? [{ name: i.target.value.replace(/^.+\\/, "") }]
                    : []
                  : i.target.files || {}),
            (r = u),
            t.isEmpty(r) || 0 === r.length)
          )
            return c || a.clear(), void a._raise("fileselectnone");
          if (
            (a._resetErrors(),
            (o = r.length),
            (n = c ? a.fileManager.count() + o : o),
            (s = a._getFileCount(n, !g && void 0)),
            h > 0 && s > h)
          ) {
            if (!a.autoReplace || o > h) return void w(a.autoReplace && o > h ? o : s, h);
            s > h && a._resetPreviewThumbs(c);
          } else {
            if (g && ((s = a._getFileCount(n, !0)), m > 0 && s > m)) {
              if (!a.autoReplace || o > h) return void w(a.autoReplace && o > m ? o : s, m, !0);
              s > h && a._resetPreviewThumbs(c);
            }
            !c || v
              ? (a._resetPreviewThumbs(!1), v && a.clearFileStack())
              : !c || 0 !== p || (a.previewCache.count(!0) && !a.overwriteInitial) || a._resetPreviewThumbs(!0);
          }
          a.readFiles(r), a._setLoading("hide");
        }
      },
      _abort: function (t) {
        var i;
        return this.ajaxAborted && "object" == typeof this.ajaxAborted && void 0 !== this.ajaxAborted.message
          ? (((i = e.extend(!0, {}, this._getOutData(null), t)).abortData = this.ajaxAborted.data || {}),
            (i.abortMessage = this.ajaxAborted.message),
            this._setProgress(101, this.$progress, this.msgCancelled),
            this._showFileError(this.ajaxAborted.message, i, "filecustomerror"),
            this.cancel(),
            this.unlock(),
            !0)
          : !!this.ajaxAborted;
      },
      _resetFileStack: function () {
        var t = this,
          i = 0;
        t._getThumbs().each(function () {
          var a = e(this),
            r = a.attr("data-fileindex"),
            s = a.attr("id");
          "-1" !== r &&
            -1 !== r &&
            (t._getThumbFile(a) ? a.attr({ "data-fileindex": "-1" }) : (a.attr({ "data-fileindex": i }), i++),
            t._getZoom(s).attr({ "data-fileindex": a.attr("data-fileindex") }));
        });
      },
      _isFileSelectionValid: function (e) {
        return (
          (e = e || 0),
          this.required && !this.getFilesCount()
            ? (this.$errorContainer.html(""), this._showFileError(this.msgFileRequired), !1)
            : !(this.minFileCount > 0 && this._getFileCount(e) < this.minFileCount) || (this._noFilesError({}), !1)
        );
      },
      _canPreview: function (e) {
        if (!(e && this.showPreview && this.$preview && this.$preview.length)) return !1;
        var i,
          a,
          r,
          s = e.name || "",
          n = e.type || "",
          o = (e.size || 0) / this.bytesToKB,
          l = this._parseFileType(n, s),
          d = this.allowedPreviewTypes,
          c = this.allowedPreviewMimeTypes,
          u = this.allowedPreviewExtensions || [],
          p = this.disabledPreviewTypes,
          f = this.disabledPreviewMimeTypes,
          h = this.disabledPreviewExtensions || [],
          m = (this.maxFilePreviewSize && parseFloat(this.maxFilePreviewSize)) || 0,
          g = new RegExp("\\.(" + u.join("|") + ")$", "i"),
          v = new RegExp("\\.(" + h.join("|") + ")$", "i");
        return (
          (i = !d || -1 !== d.indexOf(l)),
          (a = !c || -1 !== c.indexOf(n)),
          (r = !u.length || t.compare(s, g)),
          !(
            (p && -1 !== p.indexOf(l)) ||
            (f && -1 !== f.indexOf(n)) ||
            (h.length && t.compare(s, v)) ||
            (m && !isNaN(m) && o > m)
          ) &&
            (i || a || r)
        );
      },
      addToStack: function (e, t) {
        this.fileManager.add(e, t);
      },
      clearFileStack: function () {
        return (
          this.fileManager.clear(),
          this._initResumableUpload(),
          this.enableResumableUpload
            ? (null === this.showPause && (this.showPause = !0), null === this.showCancel && (this.showCancel = !1))
            : ((this.showPause = !1), null === this.showCancel && (this.showCancel = !0)),
          this.$element
        );
      },
      getFileStack: function () {
        return this.fileManager.stack;
      },
      getFileList: function () {
        return this.fileManager.list();
      },
      getFilesSize: function () {
        return this.fileManager.getTotalSize();
      },
      getFilesCount: function (e) {
        var t = this.isAjaxUpload ? this.fileManager.count() : this._inputFileCount();
        return e && (t += this.previewCache.count(!0)), this._getFileCount(t);
      },
      _initCapStatus: function (e) {
        var t = this.$caption;
        t.removeClass("is-valid file-processing"),
          e && ("processing" === e ? t.addClass("file-processing") : t.addClass("is-valid"));
      },
      _setLoading: function (e) {
        this.$previewStatus.html("hide" === e ? "" : this.msgProcessing),
          this.$container.removeClass("file-thumb-loading"),
          this._initCapStatus("hide" === e ? "" : "processing"),
          "hide" !== e && (this.dropZoneEnabled, this.$container.addClass("file-thumb-loading"));
      },
      _initFileSelected: function () {
        var t = this,
          i = t.$element,
          a = e(document.body),
          r = "focusin.fileinput focusout.fileinput";
        a.length
          ? a
              .off(r)
              .on("focusout.fileinput", function () {
                t._setLoading("show");
              })
              .on("focusin.fileinput", function () {
                setTimeout(function () {
                  i.val() || (t._setLoading("hide"), t._setFileDropZoneTitle()), a.off(r);
                }, 2500);
              })
          : t._setLoading("hide");
      },
      readFiles: function (i) {
        this.reader = new FileReader();
        var a,
          r = this,
          s = r.reader,
          n = r.$previewContainer,
          o = r.$previewStatus,
          l = r.msgLoading,
          d = r.msgProgress,
          c = r.previewInitId,
          u = i.length,
          p = r.fileTypeSettings,
          f = r.allowedFileTypes,
          h = f ? f.length : 0,
          m = r.allowedFileExtensions,
          g = t.isEmpty(m) ? "" : m.join(", "),
          v = function (t, s, n, o, l) {
            var d,
              c = e.extend(!0, {}, r._getOutData(null, {}, {}, i), { id: n, index: o, fileId: l }),
              p = { id: n, index: o, fileId: l, file: s, files: i };
            r._previewDefault(s, !0),
              (d = r._getFrame(n, !0)),
              r._setLoading("hide"),
              r.isAjaxUpload
                ? setTimeout(function () {
                    a(o + 1);
                  }, r.processDelay)
                : (r.unlock(), (u = 0)),
              r.removeFromPreviewOnError && d.length
                ? d.remove()
                : (r._initFileActions(), d.find(".kv-file-upload").remove()),
              (r.isPersistentError = !0),
              (r.isError = r.isAjaxUpload ? r._showFileError(t, c) : r._showError(t, p)),
              r._updateFileDetails(u);
          };
        r.fileManager.clearImages(),
          e.each(i, function (e, t) {
            var i = r.fileTypeSettings.image;
            i && i(t.type) && r.fileManager.totalImages++;
          }),
          (a = function (w) {
            var b,
              _ = r.$errorContainer,
              C = r.fileManager;
            if (w >= u)
              return (
                r.unlock(),
                r.duplicateErrors.length &&
                  ((b = "<li>" + r.duplicateErrors.join("</li><li>") + "</li>"),
                  0 === _.find("ul").length
                    ? t.setHtml(_, r.errorCloseButton + "<ul>" + b + "</ul>")
                    : _.find("ul").append(b),
                  _.fadeIn(r.fadeDelay),
                  r._handler(_.find(".kv-error-close"), "click", function () {
                    _.fadeOut(r.fadeDelay);
                  }),
                  (r.duplicateErrors = [])),
                r.isAjaxUpload
                  ? (r._raise("filebatchselected", [C.stack]), 0 !== C.count() || r.isError || r.reset())
                  : r._raise("filebatchselected", [i]),
                n.removeClass("file-thumb-loading"),
                r._initCapStatus("valid"),
                void o.html("")
              );
            r.lock(!0);
            var x,
              y,
              T,
              P,
              k,
              F,
              S,
              E,
              I,
              A,
              D,
              z = i[w],
              j = r._getFileId(z),
              U = c + "-" + j,
              $ = p.image,
              M = r._getFileName(z, ""),
              R = ((z && z.size) || 0) / r.bytesToKB,
              B = "",
              O = t.createObjectURL(z),
              L = 0,
              N = "",
              Z = !1,
              H = 0,
              W = function () {
                var e = !!C.loadedImages[j],
                  t = d.setTokens({ index: w + 1, files: u, percent: 50, name: M });
                setTimeout(function () {
                  o.html(t), r._updateFileDetails(u), a(w + 1);
                }, r.processDelay),
                  r._raise("fileloaded", [z, U, j, w, s]) && r.isAjaxUpload ? e || C.add(z) : e && C.removeFile(j);
              };
            if (z) {
              if (((E = C.getId(z)), h > 0))
                for (y = 0; y < h; y++) (F = f[y]), (S = r.msgFileTypes[F] || F), (N += 0 === y ? S : ", " + S);
              if (!1 !== M) {
                if (0 === M.length)
                  return (
                    (T = r.msgInvalidFileName.replace("{name}", t.htmlEncode(t.getFileName(z), "[unknown]"))),
                    void v(T, z, U, w, E)
                  );
                if (
                  (t.isEmpty(m) || (B = new RegExp("\\.(" + m.join("|") + ")$", "i")),
                  (x = R.toFixed(2)),
                  (r.isAjaxUpload && C.exists(E)) || r._getFrame(U, !0).length)
                ) {
                  var V = { id: U, index: w, fileId: E, file: z, files: i };
                  return (
                    (T = r.msgDuplicateFile.setTokens({ name: M, size: x })),
                    void (r.isAjaxUpload
                      ? (r.duplicateErrors.push(T),
                        (r.isDuplicateError = !0),
                        r._raise("fileduplicateerror", [z, E, M, x, U, w]),
                        a(w + 1),
                        r._updateFileDetails(u))
                      : (r._showError(T, V),
                        r.unlock(),
                        (u = 0),
                        r._clearFileInput(),
                        r.reset(),
                        r._updateFileDetails(u)))
                  );
                }
                if (r.maxFileSize > 0 && R > r.maxFileSize)
                  return (
                    (T = r.msgSizeTooLarge.setTokens({ name: M, size: x, maxSize: r.maxFileSize })),
                    void v(T, z, U, w, E)
                  );
                if (null !== r.minFileSize && R <= t.getNum(r.minFileSize))
                  return (
                    (T = r.msgSizeTooSmall.setTokens({ name: M, size: x, minSize: r.minFileSize })),
                    void v(T, z, U, w, E)
                  );
                if (!t.isEmpty(f) && t.isArray(f)) {
                  for (y = 0; y < f.length; y += 1)
                    (P = f[y]), (L += (A = p[P]) && "function" == typeof A && A(z.type, t.getFileName(z)) ? 1 : 0);
                  if (0 === L)
                    return (T = r.msgInvalidFileType.setTokens({ name: M, types: N })), void v(T, z, U, w, E);
                }
                if (
                  0 === L &&
                  !t.isEmpty(m) &&
                  t.isArray(m) &&
                  !t.isEmpty(B) &&
                  ((k = t.compare(M, B)), 0 === (L += t.isEmpty(k) ? 0 : k.length))
                )
                  return (T = r.msgInvalidFileExtension.setTokens({ name: M, extensions: g })), void v(T, z, U, w, E);
                if (!r._canPreview(z))
                  return (
                    (I = r.isAjaxUpload && r._raise("filebeforeload", [z, w, s])),
                    r.isAjaxUpload && I && C.add(z),
                    r.showPreview &&
                      I &&
                      (n.addClass("file-thumb-loading"),
                      r._initCapStatus("processing"),
                      r._previewDefault(z),
                      r._initFileActions()),
                    void setTimeout(function () {
                      I && r._updateFileDetails(u), a(w + 1), r._raise("fileloaded", [z, U, j, w]);
                    }, 10)
                  );
                (D = $(z.type, M)),
                  o.html(l.replace("{index}", w + 1).replace("{files}", u)),
                  n.addClass("file-thumb-loading"),
                  r._initCapStatus("processing"),
                  (s.onerror = function (e) {
                    r._errorHandler(e, M);
                  }),
                  (s.onload = function (i) {
                    var a,
                      l,
                      d,
                      c,
                      u,
                      f,
                      h,
                      m = [];
                    if (
                      ((l = { name: M, type: z.type }),
                      e.each(p, function (e, t) {
                        "object" !== e && "other" !== e && "function" == typeof t && t(z.type, M) && H++;
                      }),
                      0 === H)
                    ) {
                      for (d = new Uint8Array(i.target.result), y = 0; y < d.length; y++)
                        (c = d[y].toString(16)), m.push(c);
                      if (
                        ((a = m.join("").toLowerCase().substring(0, 8)),
                        (f = t.getMimeType(a, "", "")),
                        t.isEmpty(f) &&
                          ((u = t.arrayBuffer2String(s.result)),
                          (f = t.isSvg(u) ? "image/svg+xml" : t.getMimeType(a, u, z.type))),
                        (l = { name: M, type: f }),
                        (D = $(f, "")))
                      )
                        return (
                          ((h = new FileReader()).onerror = function (e) {
                            r._errorHandler(e, M);
                          }),
                          (h.onload = function (e) {
                            if (r.isAjaxUpload && !r._raise("filebeforeload", [z, w, s]))
                              return (
                                (Z = !0),
                                r._resetCaption(),
                                s.abort(),
                                o.html(""),
                                n.removeClass("file-thumb-loading"),
                                r._initCapStatus("valid"),
                                void r.enable()
                              );
                            r._previewFile(w, z, e, O, l), r._initFileActions(), W();
                          }),
                          void h.readAsDataURL(z)
                        );
                    }
                    if (r.isAjaxUpload && !r._raise("filebeforeload", [z, w, s]))
                      return (
                        (Z = !0),
                        r._resetCaption(),
                        s.abort(),
                        o.html(""),
                        n.removeClass("file-thumb-loading"),
                        r._initCapStatus("valid"),
                        void r.enable()
                      );
                    r._previewFile(w, z, i, O, l), r._initFileActions(), W();
                  }),
                  (s.onprogress = function (e) {
                    if (e.lengthComputable) {
                      var t = (e.loaded / e.total) * 100,
                        i = Math.ceil(t);
                      (T = d.setTokens({ index: w + 1, files: u, percent: i, name: M })),
                        setTimeout(function () {
                          Z || o.html(T);
                        }, r.processDelay);
                    }
                  }),
                  D ? s.readAsDataURL(z) : s.readAsArrayBuffer(z);
              } else a(w + 1);
            }
          })(0),
          r._updateFileDetails(u);
      },
      lock: function (e) {
        var t = this.$container;
        return (
          this._resetErrors(),
          this.disable(),
          !e && this.showCancel && t.find(".fileinput-cancel").show(),
          !e && this.showPause && t.find(".fileinput-pause").show(),
          this._initCapStatus("processing"),
          this._raise("filelock", [this.fileManager.stack, this._getExtraData()]),
          this.$element
        );
      },
      unlock: function (e) {
        var t = this.$container;
        return (
          void 0 === e && (e = !0),
          this.enable(),
          t.removeClass("is-locked"),
          this.showCancel && t.find(".fileinput-cancel").hide(),
          this.showPause && t.find(".fileinput-pause").hide(),
          e && this._resetFileStack(),
          this._initCapStatus(),
          this._raise("fileunlock", [this.fileManager.stack, this._getExtraData()]),
          this.$element
        );
      },
      resume: function () {
        var e = this.fileManager,
          t = !1,
          i = this.resumableManager;
        return (
          (e.bpsLog = []),
          (e.bps = 0),
          this.enableResumableUpload
            ? (this.paused ? this._toggleResumableProgress(this.progressPauseTemplate, this.msgUploadResume) : (t = !0),
              (this.paused = !1),
              t && this._toggleResumableProgress(this.progressInfoTemplate, this.msgUploadBegin),
              setTimeout(function () {
                i.upload();
              }, this.processDelay),
              this.$element)
            : this.$element
        );
      },
      paste: function (e) {
        var t = e.originalEvent,
          i = (t.clipboardData && t.clipboardData.files) || null;
        return i && this._dropFiles(e, i), this.$element;
      },
      pause: function () {
        var t,
          i = this,
          a = i.resumableManager,
          r = i.ajaxRequests,
          s = r.length,
          n = a.getProgress(),
          o = i.fileActionSettings,
          l = i.taskManager.getPool(a.id);
        if (!i.enableResumableUpload) return i.$element;
        if ((l && l.cancel(), i._raise("fileuploadpaused", [i.fileManager, a]), s > 0))
          for (t = 0; t < s; t += 1) (i.paused = !0), r[t].abort();
        return (
          i.showPreview &&
            i._getThumbs().each(function () {
              var t,
                a = e(this),
                r = i._getLayoutTemplate("stats"),
                s = a.find(".file-upload-indicator");
              a.removeClass("file-uploading"),
                s.attr("title") === o.indicatorLoadingTitle &&
                  (i._setThumbStatus(a, "Paused"),
                  (t = r.setTokens({ pendingTime: i.msgPaused, uploadSpeed: "" })),
                  (i.paused = !0),
                  i._setProgress(n, a.find(".file-thumb-progress"), n + "%", t)),
                i._getThumbFile(a) || a.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled");
            }),
          i._setProgress(101, i.$progress, i.msgPaused),
          i.$element
        );
      },
      cancel: function () {
        var t,
          i = this,
          a = i.ajaxRequests,
          r = i.resumableManager,
          s = i.taskManager,
          n = r ? s.getPool(r.id) : void 0,
          o = a.length;
        if (
          (i.enableResumableUpload && n
            ? (n.cancel().done(function () {
                i._setProgressCancelled();
              }),
              r.reset(),
              i._raise("fileuploadcancelled", [i.fileManager, r]))
            : i._raise("fileuploadcancelled", [i.fileManager]),
          i._initAjax(),
          o > 0)
        )
          for (t = 0; t < o; t += 1) (i.cancelling = !0), a[t].abort();
        return (
          i._getThumbs().each(function () {
            var t = e(this),
              a = t.find(".file-thumb-progress");
            t.removeClass("file-uploading"),
              i._setProgress(0, a),
              a.hide(),
              i._getThumbFile(t) ||
                (t.find(".kv-file-upload").removeClass("disabled").removeAttr("disabled"),
                t.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")),
              i.unlock();
          }),
          setTimeout(function () {
            i._setProgressCancelled();
          }, i.processDelay),
          i.$element
        );
      },
      clear: function () {
        var i,
          a = this;
        if (a._raise("fileclear"))
          return (
            a.$btnUpload.removeAttr("disabled"),
            a
              ._getThumbs()
              .find("video,audio,img")
              .each(function () {
                t.cleanMemory(e(this));
              }),
            a._clearFileInput(),
            a._resetUpload(),
            a.clearFileStack(),
            (a.isDuplicateError = !1),
            (a.isPersistentError = !1),
            a._resetErrors(!0),
            a._hasInitialPreview()
              ? (a._showFileIcon(),
                a._resetPreview(),
                a._initPreviewActions(),
                a.$container.removeClass("file-input-new"))
              : (a._getThumbs().each(function () {
                  a._clearObjects(e(this));
                }),
                a.isAjaxUpload && (a.previewCache.data = {}),
                a.$preview.html(""),
                (i = !a.overwriteInitial && a.initialCaption.length > 0 ? a.initialCaption : ""),
                a.$caption.attr("title", "").val(i),
                t.addCss(a.$container, "file-input-new"),
                a._validateDefaultPreview()),
            0 === a.$container.find(t.FRAMES).length &&
              (a._initCaption() || a.$captionContainer.removeClass("icon-visible")),
            a._hideFileIcon(),
            a.focusCaptionOnClear && a.$captionContainer.focus(),
            a._setFileDropZoneTitle(),
            a._raise("filecleared"),
            a.$element
          );
      },
      reset: function () {
        if (this._raise("filereset"))
          return (
            (this.lastProgress = 0),
            this._resetPreview(),
            this.$container.find(".fileinput-filename").text(""),
            t.addCss(this.$container, "file-input-new"),
            this.getFrames().length && this.$container.removeClass("file-input-new"),
            this.clearFileStack(),
            this._setFileDropZoneTitle(),
            this.$element
          );
      },
      disable: function () {
        var e = this.$container;
        return (
          (this.isDisabled = !0),
          this._raise("filedisabled"),
          this.$element.attr("disabled", "disabled"),
          e.addClass("is-locked"),
          t.addCss(e.find(".btn-file"), "disabled"),
          e.find(".kv-fileinput-caption").addClass("file-caption-disabled"),
          e.find(".fileinput-remove, .fileinput-upload, .file-preview-frame button").attr("disabled", !0),
          this._initDragDrop(),
          this.$element
        );
      },
      enable: function () {
        var e = this.$container;
        return (
          (this.isDisabled = !1),
          this._raise("fileenabled"),
          this.$element.removeAttr("disabled"),
          e.removeClass("is-locked"),
          e.find(".kv-fileinput-caption").removeClass("file-caption-disabled"),
          e.find(".fileinput-remove, .fileinput-upload, .file-preview-frame button").removeAttr("disabled"),
          e.find(".btn-file").removeClass("disabled"),
          this._initDragDrop(),
          this.$element
        );
      },
      upload: function () {
        var i,
          a,
          r = this,
          s = r.fileManager,
          n = s.count(),
          o = !e.isEmptyObject(r._getExtraData());
        if (((s.bpsLog = []), (s.bps = 0), r.isAjaxUpload && !r.isDisabled && r._isFileSelectionValid(n))) {
          if (((r.lastProgress = 0), r._resetUpload(), 0 !== n || o)) {
            if (((r.cancelling = !1), r._showProgress(), r.lock(), 0 === n && o))
              return r._setProgress(2), void r._uploadExtraOnly();
            if (r.enableResumableUpload) return r.resume();
            if (r.uploadAsync || r.enableResumableUpload) {
              if (((a = r._getOutData(null)), !r._checkBatchPreupload(a))) return;
              (r.fileBatchCompleted = !1),
                (r.uploadCache = []),
                e.each(r.getFileStack(), function (e) {
                  var t = r._getThumbId(e);
                  r.uploadCache.push({ id: t, content: null, config: null, tags: null, append: !0 });
                }),
                r.$preview.find(".file-preview-initial").removeClass(t.SORT_CSS),
                r._initSortable();
            }
            return (
              r._setProgress(2),
              (r.hasInitData = !1),
              r.uploadAsync
                ? ((i = 0),
                  void e.each(r.getFileStack(), function (e) {
                    r._uploadSingle(i, e, !0), i++;
                  }))
                : (r._uploadBatch(), r.$element)
            );
          }
          r._showFileError(r.msgUploadEmpty);
        }
      },
      destroy: function () {
        var t = this.$form,
          i = this.$container,
          a = this.$element,
          r = this.namespace;
        return (
          e(document).off(r),
          e(window).off(r),
          t && t.length && t.off(r),
          this.isAjaxUpload && this._clearFileInput(),
          this._cleanup(),
          this._initPreviewCache(),
          a.insertBefore(i).off(r).removeData(),
          i.off().remove(),
          a
        );
      },
      refresh: function (i) {
        var a = this.$element;
        return (
          (i = "object" != typeof i || t.isEmpty(i) ? this.options : e.extend(!0, {}, this.options, i)),
          this._init(i, !0),
          this._listen(),
          a
        );
      },
      zoom: function (e) {
        var t = this._getFrame(e);
        this._showModal(t);
      },
      getExif: function (e) {
        var t = this._getFrame(e);
        return (t && t.data("exif")) || null;
      },
      getFrames: function (i) {
        var a;
        return (
          (i = i || ""),
          (a = this.$preview.find(t.FRAMES + i)),
          this.reversePreviewOrder && (a = e(a.get().reverse())),
          a
        );
      },
      getPreview: function () {
        return { content: this.initialPreview, config: this.initialPreviewConfig, tags: this.initialPreviewThumbTags };
      },
    }),
    (e.fn.fileinput = function (a) {
      if (t.hasFileAPISupport() || t.isIE(9)) {
        var r = Array.apply(null, arguments),
          s = [];
        switch (
          (r.shift(),
          this.each(function () {
            var n,
              o = e(this),
              l = o.data("fileinput"),
              d = "object" == typeof a && a,
              c = d.theme || o.data("theme"),
              u = {},
              p = {},
              f = d.language || o.data("language") || e.fn.fileinput.defaults.language || "en";
            l ||
              (c && (p = e.fn.fileinputThemes[c] || {}),
              "en" === f || t.isEmpty(e.fn.fileinputLocales[f]) || (u = e.fn.fileinputLocales[f] || {}),
              (n = e.extend(!0, {}, e.fn.fileinput.defaults, p, e.fn.fileinputLocales.en, u, d, o.data())),
              (l = new i(this, n)),
              o.data("fileinput", l)),
              "string" == typeof a && s.push(l[a].apply(l, r));
          }),
          s.length)
        ) {
          case 0:
            return this;
          case 1:
            return s[0];
          default:
            return s;
        }
      }
    });
  var a = "btn btn-sm btn-kv " + t.defaultButtonCss(),
    r = "btn " + t.defaultButtonCss(!0);
  (e.fn.fileinput.defaults = {
    language: "en",
    bytesToKB: 1024,
    showCaption: !0,
    showBrowse: !0,
    showPreview: !0,
    showRemove: !0,
    showUpload: !0,
    showUploadStats: !0,
    showCancel: null,
    showPause: null,
    showClose: !0,
    showUploadedThumbs: !0,
    showConsoleLogs: !1,
    browseOnZoneClick: !1,
    autoReplace: !1,
    showDescriptionClose: !0,
    autoOrientImage: function () {
      var e = window.navigator.userAgent,
        t = !!e.match(/WebKit/i);
      return !(!!e.match(/iP(od|ad|hone)/i) && t && !e.match(/CriOS/i));
    },
    autoOrientImageInitial: !0,
    required: !1,
    rtl: !1,
    hideThumbnailContent: !1,
    encodeUrl: !0,
    focusCaptionOnBrowse: !0,
    focusCaptionOnClear: !0,
    generateFileId: null,
    previewClass: "",
    captionClass: "",
    frameClass: "krajee-default",
    mainClass: "",
    inputGroupClass: "",
    mainTemplate: null,
    fileSizeGetter: null,
    initialCaption: "",
    initialPreview: [],
    initialPreviewDelimiter: "*$$*",
    initialPreviewAsData: !1,
    initialPreviewFileType: "image",
    initialPreviewConfig: [],
    initialPreviewThumbTags: [],
    previewThumbTags: {},
    initialPreviewShowDelete: !0,
    initialPreviewDownloadUrl: "",
    removeFromPreviewOnError: !1,
    deleteUrl: "",
    deleteExtraData: {},
    overwriteInitial: !0,
    sanitizeZoomCache: function (e) {
      var i = t.createElement(e);
      return i.find("input,textarea,select,datalist,form,.file-thumbnail-footer").remove(), i.html();
    },
    previewZoomButtonIcons: {
      prev: '<i class="bi-chevron-left"></i>',
      next: '<i class="bi-chevron-right"></i>',
      toggleheader: '<i class="bi-arrows-expand"></i>',
      fullscreen: '<i class="bi-arrows-fullscreen"></i>',
      borderless: '<i class="bi-arrows-angle-expand"></i>',
      close: '<i class="bi-x-lg"></i>',
    },
    previewZoomButtonClasses: {
      prev: "btn btn-default btn-outline-secondary btn-navigate",
      next: "btn btn-default btn-outline-secondary btn-navigate",
      toggleheader: a,
      fullscreen: a,
      borderless: a,
      close: a,
    },
    previewTemplates: {},
    previewContentTemplates: {},
    preferIconicPreview: !1,
    preferIconicZoomPreview: !1,
    allowedFileTypes: null,
    allowedFileExtensions: null,
    allowedPreviewTypes: void 0,
    allowedPreviewMimeTypes: null,
    allowedPreviewExtensions: null,
    disabledPreviewTypes: void 0,
    disabledPreviewExtensions: ["msi", "exe", "com", "zip", "rar", "app", "vb", "scr"],
    disabledPreviewMimeTypes: null,
    defaultPreviewContent: null,
    customLayoutTags: {},
    customPreviewTags: {},
    previewFileIcon: '<i class="bi-file-earmark-fill"></i>',
    previewFileIconClass: "file-other-icon",
    previewFileIconSettings: {},
    previewFileExtSettings: {},
    buttonLabelClass: "hidden-xs",
    browseIcon: '<i class="bi-folder2-open"></i> ',
    browseClass: "btn btn-primary",
    removeIcon: '<i class="bi-trash"></i>',
    removeClass: r,
    cancelIcon: '<i class="bi-slash-circle"></i>',
    cancelClass: r,
    pauseIcon: '<i class="bi-pause-fill"></i>',
    pauseClass: r,
    uploadIcon: '<i class="bi-upload"></i>',
    uploadClass: r,
    uploadUrl: null,
    uploadUrlThumb: null,
    uploadAsync: !0,
    uploadParamNames: {
      chunkCount: "chunkCount",
      chunkIndex: "chunkIndex",
      chunkSize: "chunkSize",
      chunkSizeStart: "chunkSizeStart",
      chunksUploaded: "chunksUploaded",
      fileBlob: "fileBlob",
      fileId: "fileId",
      fileName: "fileName",
      fileRelativePath: "fileRelativePath",
      fileSize: "fileSize",
      retryCount: "retryCount",
    },
    maxAjaxThreads: 5,
    fadeDelay: 800,
    processDelay: 100,
    bitrateUpdateDelay: 500,
    queueDelay: 10,
    progressDelay: 0,
    enableResumableUpload: !1,
    resumableUploadOptions: {
      fallback: null,
      testUrl: null,
      chunkSize: 2048,
      maxThreads: 4,
      maxRetries: 3,
      showErrorLog: !0,
      retainErrorHistory: !0,
      skipErrorsAndProceed: !1,
    },
    uploadExtraData: {},
    zoomModalHeight: 480,
    minImageWidth: null,
    minImageHeight: null,
    maxImageWidth: null,
    maxImageHeight: null,
    resizeImage: !1,
    resizePreference: "width",
    resizeQuality: 0.92,
    resizeDefaultImageType: "image/jpeg",
    resizeIfSizeMoreThan: 0,
    minFileSize: -1,
    maxFileSize: 0,
    maxFilePreviewSize: 25600,
    minFileCount: 0,
    maxFileCount: 0,
    maxTotalFileCount: 0,
    validateInitialCount: !1,
    msgValidationErrorClass: "text-danger",
    msgValidationErrorIcon: '<i class="bi-exclamation-circle-fill"></i> ',
    msgErrorClass: "file-error-message",
    progressThumbClass: "progress-bar progress-bar-striped active progress-bar-animated",
    progressClass: "progress-bar bg-success progress-bar-success progress-bar-striped active progress-bar-animated",
    progressInfoClass: "progress-bar bg-info progress-bar-info progress-bar-striped active progress-bar-animated",
    progressCompleteClass: "progress-bar bg-success progress-bar-success",
    progressPauseClass:
      "progress-bar bg-primary progress-bar-primary progress-bar-striped active progress-bar-animated",
    progressErrorClass: "progress-bar bg-danger progress-bar-danger",
    progressUploadThreshold: 99,
    previewFileType: "image",
    elCaptionContainer: null,
    elCaptionText: null,
    elPreviewContainer: null,
    elPreviewImage: null,
    elPreviewStatus: null,
    elErrorContainer: null,
    errorCloseButton: void 0,
    slugCallback: null,
    dropZoneEnabled: !0,
    dropZoneTitleClass: "file-drop-zone-title",
    fileActionSettings: {},
    otherActionButtons: "",
    textEncoding: "UTF-8",
    preProcessUpload: null,
    ajaxSettings: {},
    ajaxDeleteSettings: {},
    showAjaxErrorDetails: !0,
    mergeAjaxCallbacks: !1,
    mergeAjaxDeleteCallbacks: !1,
    retryErrorUploads: !0,
    reversePreviewOrder: !1,
    usePdfRenderer: function () {
      var e = !!window.MSInputMethodContext && !!document.documentMode;
      return !!navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/i) || e;
    },
    pdfRendererUrl: "",
    pdfRendererTemplate:
      '<iframe class="kv-preview-data file-preview-pdf" src="{renderer}?file={data}" {style}></iframe>',
    tabIndexConfig: { browse: 500, remove: 500, upload: 500, cancel: null, pause: null, modal: -1 },
  }),
    (e.fn.fileinputLocales.en = {
      sizeUnits: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      bitRateUnits: ["B/s", "KB/s", "MB/s", "GB/s", "TB/s", "PB/s", "EB/s", "ZB/s", "YB/s"],
      fileSingle: "file",
      filePlural: "files",
      browseLabel: "Browse &hellip;",
      removeLabel: "Remove",
      removeTitle: "Clear all unprocessed files",
      cancelLabel: "Cancel",
      cancelTitle: "Abort ongoing upload",
      pauseLabel: "Pause",
      pauseTitle: "Pause ongoing upload",
      uploadLabel: "Upload",
      uploadTitle: "Upload selected files",
      msgNo: "No",
      msgNoFilesSelected: "No files selected",
      msgCancelled: "Cancelled",
      msgPaused: "Paused",
      msgPlaceholder: "Select {files} ...",
      msgZoomModalHeading: "Detailed Preview",
      msgFileRequired: "You must select a file to upload.",
      msgSizeTooSmall: 'File "{name}" (<b>{size} KB</b>) is too small and must be larger than <b>{minSize} KB</b>.',
      msgSizeTooLarge: 'File "{name}" (<b>{size} KB</b>) exceeds maximum allowed upload size of <b>{maxSize} KB</b>.',
      msgFilesTooLess: "You must select at least <b>{n}</b> {files} to upload.",
      msgFilesTooMany: "Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.",
      msgTotalFilesTooMany: "You can upload a maximum of <b>{m}</b> files (<b>{n}</b> files detected).",
      msgFileNotFound: 'File "{name}" not found!',
      msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
      msgFileNotReadable: 'File "{name}" is not readable.',
      msgFilePreviewAborted: 'File preview aborted for "{name}".',
      msgFilePreviewError: 'An error occurred while reading the file "{name}".',
      msgInvalidFileName: 'Invalid or unsupported characters in file name "{name}".',
      msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
      msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
      msgFileTypes: {
        image: "image",
        html: "HTML",
        text: "text",
        video: "video",
        audio: "audio",
        flash: "flash",
        pdf: "PDF",
        object: "object",
      },
      msgUploadAborted: "The file upload was aborted",
      msgUploadThreshold: "Processing &hellip;",
      msgUploadBegin: "Initializing &hellip;",
      msgUploadEnd: "Done",
      msgUploadResume: "Resuming upload &hellip;",
      msgUploadEmpty: "No valid data available for upload.",
      msgUploadError: "Upload Error",
      msgDeleteError: "Delete Error",
      msgProgressError: "Error",
      msgValidationError: "Validation Error",
      msgLoading: "Loading file {index} of {files} &hellip;",
      msgProgress: "Loading file {index} of {files} - {name} - {percent}% completed.",
      msgSelected: "{n} {files} selected",
      msgProcessing: "Processing ...",
      msgFoldersNotAllowed: "Drag & drop files only! {n} folder(s) dropped were skipped.",
      msgImageWidthSmall: 'Width of image file "{name}" must be at least {size} px.',
      msgImageHeightSmall: 'Height of image file "{name}" must be at least {size} px.',
      msgImageWidthLarge: 'Width of image file "{name}" cannot exceed {size} px.',
      msgImageHeightLarge: 'Height of image file "{name}" cannot exceed {size} px.',
      msgImageResizeError: "Could not get the image dimensions to resize.",
      msgImageResizeException: "Error while resizing the image.<pre>{errors}</pre>",
      msgAjaxError: "Something went wrong with the {operation} operation. Please try again later!",
      msgAjaxProgressError: "{operation} failed",
      msgDuplicateFile:
        'File "{name}" of same size "{size} KB" has already been selected earlier. Skipping duplicate selection.',
      msgResumableUploadRetriesExceeded:
        "Upload aborted beyond <b>{max}</b> retries for file <b>{file}</b>! Error Details: <pre>{error}</pre>",
      msgPendingTime: "{time} remaining",
      msgCalculatingTime: "calculating time remaining",
      ajaxOperations: {
        deleteThumb: "file delete",
        uploadThumb: "file upload",
        uploadBatch: "batch file upload",
        uploadExtra: "form data upload",
      },
      dropZoneTitle: "Drag & drop files here &hellip;",
      dropZoneClickTitle: "<br>(or click to select {files})",
      previewZoomButtonTitles: {
        prev: "View previous file",
        next: "View next file",
        toggleheader: "Toggle header",
        fullscreen: "Toggle full screen",
        borderless: "Toggle borderless mode",
        close: "Close detailed preview",
      },
    }),
    (e.fn.fileinput.Constructor = i),
    e(document).ready(function () {
      var t = e("input.file[type=file]");
      t.length && t.fileinput();
    });
});

// ----------multiplefile-upload---------
$("#multiplefileupload").fileinput({
  theme: "explorer-fas",
  uploadUrl: "#",
  deleteUrl: "#",
  initialPreviewAsData: true,
  overwriteInitial: false,
  dropZoneTitle:
    '<div class="upload-area"><i class="far fa-images"></i><p>Browse or Drag and Drop .jpg, .png</p> <div> <button type="button" class="selectfilebutton">Select Files</button> </div></div>',
  dropZoneClickTitle: "",
  browseOnZoneClick: true,
  showRemove: false,
  showUpload: false,
  showZoom: false,
  showCaption: false,
  showBrowse: false,
  browseClass: "btn btn-danger",
  browseLabel: "",
  browseIcon: "<i class='fa fa-plus'></i>",
  fileActionSettings: {
    showUpload: false,
    showDownload: false,
    showZoom: false,
    showDrag: true,
    removeIcon: "<i class='fa fa-times'></i>",
    uploadIcon: "<i class='fa fa-upload'></i>",
    dragIcon: "<i class='fa fa-arrows-alt'></i>",
    uploadRetryIcon: "<i class='fa fa-undo-alt'></i>",
    dragClass: "file-drag",
    removeClass: "file-remove",
    removeErrorClass: "file-remove",
    uploadClass: "file-upload",
  },
  frameClass: "file-sortable",
  layoutTemplates: {
    preview:
      '<div class="file-preview {class}">\n' +
      '    <div class="{dropClass}">\n' +
      '    <div class="clearfix"></div>' +
      '    <div class="file-preview-status text-center text-success"></div>\n' +
      '    <div class="kv-fileinput-error"></div>\n' +
      "    </div>\n" +
      "</div>" +
      ' <div class="file-preview-thumbnails">\n' +
      " </div>\n",
    actionDrag: '<button class="file-drag-handle {dragClass}" title="{dragTitle}">{dragIcon}</button>',
    footer:
      '<div class="file-thumbnail-footer">\n' +
      '<div class="file-detail">' +
      '<div class="file-caption-name">{caption}</div>\n' +
      '    <div class="file-size">{size}</div>\n' +
      "</div>" +
      "   {actions}\n" +
      "</div>",
  },
});
