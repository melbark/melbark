!function(t) {
    "use strict";
    var i = {}
      , s = Math.max
      , h = Math.min;
    i.c = {},
    i.c.d = t(document),
    i.c.t = function(t) {
        return t.originalEvent.touches.length - 1
    }
    ,
    i.o = function() {
        var s = this;
        this.o = null,
        this.$ = null,
        this.i = null,
        this.g = null,
        this.v = null,
        this.cv = null,
        this.x = 0,
        this.y = 0,
        this.w = 0,
        this.h = 0,
        this.$c = null,
        this.c = null,
        this.t = 0,
        this.isInit = !1,
        this.fgColor = null,
        this.pColor = null,
        this.dH = null,
        this.cH = null,
        this.eH = null,
        this.rH = null,
        this.scale = 1,
        this.relative = !1,
        this.relativeWidth = !1,
        this.relativeHeight = !1,
        this.$div = null,
        this.run = function() {
            var i = function(t, i) {
                var h;
                for (h in i)
                    s.o[h] = i[h];
                s.init(),
                s._configure()._draw()
            };
            if (!this.$.data("kontroled"))
                return this.$.data("kontroled", !0),
                this.extend(),
                this.o = t.extend({
                    min: this.$.data("min") || 0,
                    max: this.$.data("max") || 100,
                    stopper: !0,
                    readOnly: this.$.data("readonly"),
                    cursor: this.$.data("cursor") === !0 && 30 || this.$.data("cursor") || 0,
                    thickness: this.$.data("thickness") || .35,
                    lineCap: this.$.data("linecap") || "butt",
                    width: this.$.data("width") || 200,
                    height: this.$.data("height") || 200,
                    displayInput: null == this.$.data("displayinput") || this.$.data("displayinput"),
                    displayPrevious: this.$.data("displayprevious"),
                    fgColor: this.$.data("fgcolor") || "#87CEEB",
                    inputColor: this.$.data("inputcolor") || this.$.data("fgcolor") || "#87CEEB",
                    font: this.$.data("font") || "Arial",
                    fontWeight: this.$.data("font-weight") || "bold",
                    inline: !1,
                    step: this.$.data("step") || 1,
                    draw: null,
                    change: null,
                    cancel: null,
                    release: null,
                    error: null
                }, this.o),
                this.$.is("fieldset") ? (this.v = {},
                this.i = this.$.find("input"),
                this.i.each(function(i) {
                    var h = t(this);
                    s.i[i] = h,
                    s.v[i] = h.val(),
                    h.bind("change", function() {
                        var t = {};
                        t[i] = h.val(),
                        s.val(t)
                    })
                }),
                this.$.find("legend").remove()) : (this.i = this.$,
                this.v = this.$.data("value"),
                "" == this.v && (this.v = this.o.min),
                this.$.bind("change", function() {
                    s.val(s._validate(s.$.val()))
                })),
                !this.o.displayInput && this.$.hide(),
                this.$c = t(document.createElement("canvas")),
                "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(this.$c[0]),
                this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null,
                this.c ? (this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1),
                this.relativeWidth = this.o.width % 1 !== 0 && this.o.width.indexOf("%"),
                this.relativeHeight = this.o.height % 1 !== 0 && this.o.height.indexOf("%"),
                this.relative = this.relativeWidth || this.relativeHeight,
                this.$div = t('<div style="' + (this.o.inline ? "display:inline;" : "") + '"></div>'),
                this.$.wrap(this.$div).before(this.$c),
                this.$div = this.$.parent(),
                this._carve(),
                this.v instanceof Object ? (this.cv = {},
                this.copy(this.v, this.cv)) : this.cv = this.v,
                this.$.bind("configure", i).parent().bind("configure", i),
                this._listen()._configure()._xy().init(),
                this.isInit = !0,
                this._draw(),
                this) : void (this.o.error && this.o.error())
        }
        ,
        this._carve = function() {
            if (this.relative) {
                var t = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width()
                  , i = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
                this.w = this.h = Math.min(t, i)
            } else
                this.w = this.o.width,
                this.h = this.o.height;
            return this.$div.css({
                width: this.w + "px",
                height: this.h + "px"
            }),
            this.$c.attr({
                width: this.w,
                height: this.h
            }),
            1 !== this.scale && (this.$c[0].width = this.$c[0].width * this.scale,
            this.$c[0].height = this.$c[0].height * this.scale,
            this.$c.width(this.w),
            this.$c.height(this.h)),
            this
        }
        ,
        this._draw = function() {
            var t = !0;
            s.g = s.c,
            s.clear(),
            s.dH && (t = s.dH()),
            t !== !1 && s.draw()
        }
        ,
        this._touch = function(t) {
            var h = function(t) {
                var i = s.xy2val(t.originalEvent.touches[s.t].pageX, t.originalEvent.touches[s.t].pageY);
                i != s.cv && (s.cH && s.cH(i) === !1 || (s.change(s._validate(i)),
                s._draw()))
            };
            return this.t = i.c.t(t),
            h(t),
            i.c.d.bind("touchmove.k", h).bind("touchend.k", function() {
                i.c.d.unbind("touchmove.k touchend.k"),
                s.rH && s.rH(s.cv) === !1 || s.val(s.cv)
            }),
            this
        }
        ,
        this._mouse = function(t) {
            var h = function(t) {
                var i = s.xy2val(t.pageX, t.pageY);
                i != s.cv && (s.cH && s.cH(i) === !1 || (s.change(s._validate(i)),
                s._draw()))
            };
            return h(t),
            i.c.d.bind("mousemove.k", h).bind("keyup.k", function(t) {
                if (27 === t.keyCode) {
                    if (i.c.d.unbind("mouseup.k mousemove.k keyup.k"),
                    s.eH && s.eH() === !1)
                        return;
                    s.cancel()
                }
            }).bind("mouseup.k", function(t) {
                i.c.d.unbind("mousemove.k mouseup.k keyup.k"),
                s.rH && s.rH(s.cv) === !1 || s.val(s.cv)
            }),
            this
        }
        ,
        this._xy = function() {
            var t = this.$c.offset();
            return this.x = t.left,
            this.y = t.top,
            this
        }
        ,
        this._listen = function() {
            return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function(t) {
                t.preventDefault(),
                s._xy()._mouse(t)
            }).bind("touchstart", function(t) {
                t.preventDefault(),
                s._xy()._touch(t)
            }),
            this.relative && t(window).resize(function() {
                s._carve().init(),
                s._draw()
            }),
            this.listen()),
            this
        }
        ,
        this._configure = function() {
            return this.o.draw && (this.dH = this.o.draw),
            this.o.change && (this.cH = this.o.change),
            this.o.cancel && (this.eH = this.o.cancel),
            this.o.release && (this.rH = this.o.release),
            this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"),
            this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor,
            this
        }
        ,
        this._clear = function() {
            this.$c[0].width = this.$c[0].width
        }
        ,
        this._validate = function(t) {
            return ~~((0 > t ? -.5 : .5) + t / this.o.step) * this.o.step
        }
        ,
        this.listen = function() {}
        ,
        this.extend = function() {}
        ,
        this.init = function() {}
        ,
        this.change = function(t) {}
        ,
        this.val = function(t) {}
        ,
        this.xy2val = function(t, i) {}
        ,
        this.draw = function() {}
        ,
        this.clear = function() {
            this._clear()
        }
        ,
        this.h2rgba = function(t, i) {
            var s;
            return t = t.substring(1, 7),
            s = [parseInt(t.substring(0, 2), 16), parseInt(t.substring(2, 4), 16), parseInt(t.substring(4, 6), 16)],
            "rgba(" + s[0] + "," + s[1] + "," + s[2] + "," + i + ")"
        }
        ,
        this.copy = function(t, i) {
            for (var s in t)
                i[s] = t[s]
        }
    }
    ,
    i.Dial = function() {
        i.o.call(this),
        this.startAngle = null,
        this.xy = null,
        this.radius = null,
        this.lineWidth = null,
        this.cursorExt = null,
        this.w2 = null,
        this.PI2 = 2 * Math.PI,
        this.extend = function() {
            this.o = t.extend({
                bgColor: this.$.data("bgcolor") || "#EEEEEE",
                angleOffset: this.$.data("angleoffset") || 0,
                angleArc: this.$.data("anglearc") || 360,
                inline: !0
            }, this.o)
        }
        ,
        this.val = function(t) {
            return null == t ? this.v : (this.cv = this.o.stopper ? s(h(t, this.o.max), this.o.min) : t,
            this.v = this.cv,
            this.$.val("Volume"),
            this._draw(),
            void 0)
        }
        ,
        this.xy2val = function(t, i) {
            var n, e;
            return n = Math.atan2(t - (this.x + this.w2), -(i - this.y - this.w2)) - this.angleOffset,
            this.angleArc != this.PI2 && 0 > n && n > -.5 ? n = 0 : 0 > n && (n += this.PI2),
            e = ~~(.5 + n * (this.o.max - this.o.min) / this.angleArc) + this.o.min,
            this.o.stopper && (e = s(h(e, this.o.max), this.o.min)),
            e
        }
        ,
        this.init = function() {
            (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min),
            this.$.val("Volume"),
            this.w2 = this.w / 2,
            this.cursorExt = this.o.cursor / 100,
            this.xy = this.w2 * this.scale,
            this.lineWidth = this.xy * this.o.thickness,
            this.lineCap = this.o.lineCap,
            this.radius = this.xy - this.lineWidth / 2,
            this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset),
            this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc),
            this.angleOffset = this.o.angleOffset * Math.PI / 180,
            this.angleArc = this.o.angleArc * Math.PI / 180,
            this.startAngle = 1.5 * Math.PI + this.angleOffset,
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
            var t = s(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
            this.o.displayInput && this.i.css({
                width: (this.w / 2 + 4 >> 0) + "px",
                height: (this.w / 3 >> 0) + "px",
                display: "inline-block",
                position: "absolute",
                "vertical-align": "middle",
                "margin-top": (this.w / 3 >> 0) + "px",
                "margin-left": "-" + (3 * this.w / 4 + 2 >> 0) + "px",
                border: 0,
                background: "none",
                font: this.o.fontWeight + " " + (this.w / t >> 0) + "px " + this.o.font,
                "text-align": "center",
                color: this.o.inputColor || this.o.fgColor,
                padding: "0px",
                "-webkit-appearance": "none"
            }) || this.i.css({
                width: "0px",
                visibility: "hidden"
            })
        }
        ,
        this.change = function(t) {
            this.cv = t,
            this.$.val(t)
        }
        ,
        this.angle = function(t) {
            return (t - this.o.min) * this.angleArc / (this.o.max - this.o.min)
        }
        ,
        this.draw = function() {
            var t, i, s = this.g, h = this.angle(this.cv), n = this.startAngle, e = n + h, a = 1;
            s.lineWidth = this.lineWidth,
            s.lineCap = this.lineCap,
            this.o.cursor && (n = e - this.cursorExt) && (e += this.cursorExt),
            s.beginPath(),
            s.strokeStyle = this.o.bgColor,
            s.arc(this.xy, this.xy, this.radius, this.endAngle, this.startAngle, !0),
            s.stroke(),
            this.o.displayPrevious && (i = this.startAngle + this.angle(this.v),
            t = this.startAngle,
            this.o.cursor && (t = i - this.cursorExt) && (i += this.cursorExt),
            s.beginPath(),
            s.strokeStyle = this.pColor,
            s.arc(this.xy, this.xy, this.radius, t, i, !1),
            s.stroke(),
            a = this.cv == this.v),
            s.beginPath(),
            s.strokeStyle = a ? this.o.fgColor : this.fgColor,
            s.arc(this.xy, this.xy, this.radius, n, e, !1),
            s.stroke()
        }
        ,
        this.cancel = function() {
            this.val(this.v)
        }
    }
    ,
    t.fn.dial = t.fn.knob = function(s) {
        return this.each(function() {
            var h = new i.Dial;
            h.o = s,
            h.$ = t(this),
            h.run()
        }).parent()
    }
}(jQuery);

