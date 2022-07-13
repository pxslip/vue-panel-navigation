import scrollmonitor from 'scrollmonitor';
import shortid from 'shortid';
import get from 'lodash.get';
import smoothscroll from 'smoothscroll';
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

var NavMixin = {
  props: {
    classes: {
      type: Object,
      default: function _default() {
        return {
          textSectionUl: ["vp--text-sections"],
          textSectionLi: ["vp--text", "vp--section"],
          textPanelUl: ["vp--text-panels"],
          textPanelLi: ["vp--text", "vp--panel"],
          dotSectionUl: ["vp--dot-sections"],
          dotSectionLi: ["vp--dot", "vp--section"],
          dotPanelUl: ["vp--dot-panels"],
          dotPanelLi: ["vp--dot", "vp--panel"]
        };
      }
    }
  },
  data: function data() {
    return {
      sections: [],
      panels: {}
    };
  },

  methods: {
    scrollTo: function scrollTo(elem) {
      this.$scrollTo(elem);
    },
    hasClass: function hasClass(elem, classToAdd) {
      return elem.classList.contains(classToAdd);
    },
    sectionClicked: function sectionClicked(section, $event) {
      var _this = this;

      if (!this.$listeners.sectionclicked) {
        // handle the click ourselves
        this.scrollTo(section);
      } else {
        this.$emit("sectionclicked", section, $event, function () {
          _this.scrollTo(section);
        });
      }
    },
    panelClicked: function panelClicked(panel, $event) {
      var _this2 = this;

      if (!this.$listeners.panelclicked) {
        // handle the click ourselves
        this.scrollTo(panel);
      } else {
        this.$emit("panelclicked", panel, $event, function () {
          _this2.scrollTo(panel);
        });
      }
    }
  },
  created: function created() {
    this.sections = this.$getSections();
    this.panels = this.$getPanels();
  }
};

//
var script = {
    mixins: [NavMixin]
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("ul", { class: _vm.classes.dotSectionUl }, _vm._l(_vm.sections, function (section, index) {
    return _c("li", {
      key: index,
      class: [_vm.classes.dotSectionLi, { active: section.active }],
      attrs: { "aria-label": section.title }
    }, [_c("a", {
      directives: [{
        name: "tooltip",
        rawName: "v-tooltip.right",
        value: section.title,
        expression: "section.title",
        modifiers: { right: true }
      }],
      on: {
        click: function click($event) {
          return _vm.sectionClicked(section.element, $event);
        }
      }
    }), _vm._v(" "), _c("ul", { class: _vm.classes.dotPanelUl }, [_vm._l(_vm.panels[section.element.dataset.uuid], function (panel, index) {
      return [!panel.excludeFromNav ? _c("li", {
        key: index,
        class: [_vm.classes.dotPanelLi, { active: panel.active }]
      }, [_c("a", {
        directives: [{
          name: "tooltip",
          rawName: "v-tooltip.right",
          value: panel.title,
          expression: "panel.title",
          modifiers: { right: true }
        }],
        attrs: { "aria-label": panel.title },
        on: {
          click: function click($event) {
            return _vm.panelClicked(panel.element, $event);
          }
        }
      })]) : _vm._e()];
    })], 2)]);
  }), 0);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-48c57098_0", { source: "\n\n/*# sourceMappingURL=DotsNav.vue.map */", map: { "version": 3, "sources": ["DotsNav.vue"], "names": [], "mappings": ";;AAEA,sCAAsC", "file": "DotsNav.vue" }, media: undefined });
};
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

//
var script$1 = {
  props: {
    showExpander: {
      type: Boolean,
      default: false
    },
    expanderClass: {
      type: String,
      default: "fa fa-angle-down"
    },
    linkAttrs: {
      type: Object,
      default: function _default() {}
    }
  },
  mixins: [NavMixin]
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("ul", { class: _vm.classes.textSectionUl }, _vm._l(_vm.sections, function (section, index) {
    return _c("li", {
      key: index,
      class: [_vm.classes.textSectionLi, { active: section.active }],
      attrs: { "aria-label": section.title, title: section.title }
    }, [_c("a", {
      on: {
        click: function click($event) {
          return _vm.sectionClicked(section.element, $event);
        }
      }
    }, [_vm._v(_vm._s(section.title) + " "), _vm.showExpander ? _c("i", { class: _vm.expanderClass }) : _vm._e()]), _vm._v(" "), _c("ul", { class: _vm.classes.textPanelUl }, [_vm._l(_vm.panels[section.element.dataset.uuid], function (panel, index) {
      return [!panel.excludeFromNav ? _c("li", {
        key: "vp_text_nav_li_" + index,
        class: [_vm.classes.textPanelLi, { active: panel.active }],
        attrs: {
          "aria-label": panel.title,
          title: panel.title
        }
      }, [_c("a", _vm._b({
        on: {
          click: function click($event) {
            return _vm.panelClicked(panel.element, $event);
          }
        }
      }, "a", _vm.linkAttrs, false), [_vm._v(_vm._s(panel.title))])]) : _vm._e()];
    })], 2)]);
  }), 0);
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

/* style */
var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-1f2c2b68_0", { source: "\n\n/*# sourceMappingURL=TextNav.vue.map */", map: { "version": 3, "sources": ["TextNav.vue"], "names": [], "mappings": ";;AAEA,sCAAsC", "file": "TextNav.vue" }, media: undefined });
};
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({ render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, createInjector, undefined, undefined);

var OffsetMixin = {
    props: {
        offsetTop: {
            type: Number,
            default: 0
        },
        offsetBottom: {
            type: Number,
            default: 0
        }
    }
};

//
var script$2 = {
    mixins: [OffsetMixin],
    props: {
        sortIndex: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            require: true
        }
    },
    data: function data() {
        return {
            section: {
                active: false
            }
        };
    },

    watch: {
        title: function title(newTitle, oldTitle) {
            this.$updateSectionTitle(newTitle, this.$el.dataset.uuid);
        }
    },
    mounted: function mounted() {
        this.$el.dataset.uuid = this.$shortId();
        this.$el.dataset.title = this.title;
        this.section = this.$addSection(this.title, this.$el);
        scrollmonitor.update();
    },
    destroyed: function destroyed() {}
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: ["vp--section", { "vp--active": _vm.section.active }] }, [_vm._t("default")], 2);
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

/* style */
var __vue_inject_styles__$2 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3afddc58_0", { source: "\n\n/*# sourceMappingURL=Section.vue.map */", map: { "version": 3, "sources": ["Section.vue"], "names": [], "mappings": ";;AAEA,sCAAsC", "file": "Section.vue" }, media: undefined });
};
/* scoped */
var __vue_scope_id__$2 = "data-v-3afddc58";
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({ render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 }, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, createInjector, undefined, undefined);

//
var script$3 = {
  mixins: [OffsetMixin],
  props: {
    sortIndex: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      require: true
    },
    exclude: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      section: null,
      uuid: null,
      sectionUuid: "default"
    };
  },

  watch: {
    title: function title(newTitle, oldTitle) {
      this.$updatePanelTitle(newTitle, this.$el.dataset.uuid, this.getSectionUuid());
    },
    exclude: function exclude(value) {
      this.$setExcludeFromNav(this.uuid, this.getSectionUuid(), value);
    }
  },
  methods: {
    getSectionUuid: function getSectionUuid() {
      if (this.sectionUuid === "default" && this.section) {
        this.sectionUuid = this.section.dataset.uuid;
      }
      return this.sectionUuid;
    },
    makeActive: function makeActive() {
      this.$el.classList.add("vp--active");
      this.$setActivePanel(this.uuid, this.getSectionUuid());
      this.$setActiveSection(this.getSectionUuid());
    }
  },
  mounted: function mounted() {
    var _this = this;

    var baseOffset = scrollmonitor.viewportHeight / 3;
    this.$el.dataset.uuid = this.uuid = this.$shortId();
    this.$set(this, "section", this.$firstParent(".vp--section"));
    this.$el.dataset.title = this.title;
    this.$addPanel(this.title, this.sortIndex, this.$el, this.section, this.exclude);

    var watcher = this.watcher = scrollmonitor.create(this.$el, {
      top: this.offsetTop - baseOffset,
      bottom: this.offsetBottom - baseOffset
    });
    scrollmonitor.update();
    watcher.enterViewport(function () {
      _this.makeActive();
    });
    this.$nextTick(function () {
      if (watcher.isInViewport) {
        _this.makeActive();
      }
    });
  },
  destroyed: function destroyed() {
    this.watcher.destroy();
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "vp--panel" }, [_vm._t("default")], 2);
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

/* style */
var __vue_inject_styles__$3 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-24530a5d_0", { source: "\n\n/*# sourceMappingURL=Panel.vue.map */", map: { "version": 3, "sources": ["Panel.vue"], "names": [], "mappings": ";;AAEA,oCAAoC", "file": "Panel.vue" }, media: undefined });
};
/* scoped */
var __vue_scope_id__$3 = "data-v-24530a5d";
/* module identifier */
var __vue_module_identifier__$3 = undefined;
/* functional template */
var __vue_is_functional_template__$3 = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = /*#__PURE__*/normalizeComponent({ render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 }, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, createInjector, undefined, undefined);

//
var script$4 = {
    props: {
        buttonClasses: {
            type: [Array, String],
            default: function _default() {
                return ['vp--next'];
            }
        },
        text: {
            type: String,
            default: 'Next'
        },
        iconBeforeClass: {
            type: [Array, String]
        },
        iconAfterClass: {
            type: [Array, String]
        },
        hideOnLastPanel: {
            type: Boolean,
            default: true
        }
    },
    data: function data() {
        return {
            watcher: null
        };
    },
    mounted: function mounted() {
        if (this.hideOnLastPanel) {
            // find the last panel in the last section
            var vm = this;
            var interval = setInterval(function () {
                var lastPanel = document.querySelector('.vp--section:last-child .vp--panel:last-child');
                if (lastPanel) {
                    vm.watcher = scrollmonitor.create(lastPanel);
                    vm.watcher.enterViewport(function () {
                        vm.$el.classList.add('hidden');
                    });
                    vm.watcher.exitViewport(function () {
                        vm.$el.classList.remove('hidden');
                    });
                    clearInterval(interval);
                }
            }, 100);
        }
    },

    methods: {
        click: function click() {
            this.$scrollToNextPanel();
        }
    }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function __vue_render__() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("button", { class: _vm.buttonClasses, on: { click: _vm.click } }, [_vm.iconBeforeClass ? _c("i", { class: _vm.iconBeforeClass }) : _vm._e(), _vm._v("\n    " + _vm._s(_vm.text) + "\n    "), _vm.iconAfterClass ? _c("i", { class: _vm.iconAfterClass }) : _vm._e()]);
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

/* style */
var __vue_inject_styles__$4 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-7c6efee7_0", { source: ".hidden[data-v-7c6efee7] {\n  display: none;\n}\n\n/*# sourceMappingURL=NextButton.vue.map */", map: { "version": 3, "sources": ["/workspaces/vue-panel-navigation/src/components/NextButton.vue", "NextButton.vue"], "names": [], "mappings": "AA8DA;EACA,aAAA;AC7DA;;AAEA,yCAAyC", "file": "NextButton.vue", "sourcesContent": ["<template>\r\n    <button :class=\"buttonClasses\" @click=\"click\">\r\n        <i v-if=\"iconBeforeClass\" :class=\"iconBeforeClass\"></i>\r\n        {{text}}\r\n        <i v-if=\"iconAfterClass\" :class=\"iconAfterClass\"></i>\r\n    </button>\r\n</template>\r\n<script>\r\nimport scrollmonitor from 'scrollmonitor';\r\nexport default {\r\n    props: {\r\n        buttonClasses: {\r\n            type: [Array, String],\r\n            default: function() {return ['vp--next'];} \r\n        },\r\n        text: {\r\n            type: String,\r\n            default: 'Next'\r\n        },\r\n        iconBeforeClass: {\r\n            type: [Array, String]\r\n        },\r\n        iconAfterClass: {\r\n            type: [Array, String]\r\n        },\r\n        hideOnLastPanel: {\r\n            type: Boolean,\r\n            default: true\r\n        }\r\n    },\r\n    data() {\r\n        return {\r\n            watcher: null\r\n        }\r\n    },\r\n    mounted() {\r\n        if (this.hideOnLastPanel) {\r\n            // find the last panel in the last section\r\n            let vm = this;\r\n            const interval = setInterval(function () {\r\n                const lastPanel = document.querySelector('.vp--section:last-child .vp--panel:last-child');\r\n                if (lastPanel) {\r\n                    vm.watcher = scrollmonitor.create(lastPanel);\r\n                    vm.watcher.enterViewport(() => {\r\n                        vm.$el.classList.add('hidden');\r\n                    });\r\n                    vm.watcher.exitViewport(() => {\r\n                        vm.$el.classList.remove('hidden');\r\n                    });\r\n                    clearInterval(interval);\r\n                }\r\n            }, 100)\r\n        }\r\n    },\r\n    methods: {\r\n        click() {\r\n            this.$scrollToNextPanel();\r\n        }\r\n    }\r\n}\r\n</script>\r\n<style lang=\"scss\" scoped>\r\n    .hidden {\r\n        display: none;\r\n    }\r\n</style>\r\n", ".hidden {\n  display: none;\n}\n\n/*# sourceMappingURL=NextButton.vue.map */"] }, media: undefined });
};
/* scoped */
var __vue_scope_id__$4 = "data-v-7c6efee7";
/* module identifier */
var __vue_module_identifier__$4 = undefined;
/* functional template */
var __vue_is_functional_template__$4 = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = /*#__PURE__*/normalizeComponent({ render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 }, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, createInjector, undefined, undefined);

/**
 *
 * @param {Vue} Vue
 * @param {object} options
 * @returns
 */
function install(Vue, options) {
  var plugin = install;
  if (plugin.installed) {
    return;
  }
  plugin.installed = true;
  Vue.set(Vue, "vp", {});
  Vue.set(Vue.vp, "sections", []);
  Vue.set(Vue.vp, "panels", {});

  /**
   * @param {String} selector the dom selector to match parents against
   * @returns {Element|Null} the element if found, or null if not
   */
  Vue.prototype.$firstParent = function (selector) {
    // Element.matches() polyfill
    var elem = this.$el;
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
    }

    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }

    return null;
  };

  Vue.prototype.$shortId = function () {
    return shortid.generate();
  };

  // decide if the addPanel method should be prototypical, or global, the method should take the panel and an optional section
  // if the section does not exist, or is not passed, add to a default bucket, otherwise nest under the section
  Vue.prototype.$addPanel = function (title, sortIndex, panel, section, excludeFromNav) {
    var key = get(section, "dataset.uuid", "default");
    if (!Vue.vp.panels[key]) {
      Vue.set(Vue.vp.panels, key, []);
    }
    Vue.vp.panels[key].push({
      title: title,
      sortIndex: sortIndex,
      element: panel,
      section: section,
      uuid: panel.dataset.uuid,
      active: false,
      excludeFromNav: excludeFromNav
    });
  };

  Vue.prototype.$addSection = function (title, section) {
    var sectionData = {
      title: title,
      element: section,
      uuid: section.dataset.uuid,
      active: false
    };
    Vue.vp.sections.push(sectionData);
    Vue.set(Vue.vp.panels, section.dataset.uuid, []);
    for (var i = 0; i < Vue.vp.panels["default"].length; i++) {
      var panel = Vue.vp.panels.default[i];
      if (section.contains(panel.element)) {
        panel.section = section;
        Vue.vp.panels[section.dataset.uuid].push(panel);
        Vue.vp.panels.default.splice(i, 1);
        i--;
      }
    }
    return sectionData;
  };

  Vue.prototype.$updatePanelTitle = function (newTitle, uuid, sectionUuid) {
    var key = sectionUuid || "default";
    var panels = Vue.vp.panels[key];
    for (var i = 0; i < panels.length; i++) {
      var element = panels[i];
      if (element.uuid === uuid) {
        element.title = newTitle;
        break;
      }
    }
  };

  Vue.prototype.$updateSectionTitle = function (newTitle, uuid) {
    var sections = Vue.vp.sections;
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      if (section.uuid === uuid) {
        section.title = newTitle;
        break;
      }
    }
  };

  Vue.prototype.$setActiveSection = function (uuid) {
    Vue.vp.sections.forEach(function (item) {
      item.active = item.uuid === uuid;
      if (item.uuid !== uuid) {
        // make sure all the children of inactive sections are inactive
        Vue.vp.panels[item.uuid].forEach(function (item) {
          return item.active = false;
        });
      }
    });
  };

  Vue.prototype.$setActivePanel = function (uuid) {
    var sectionUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "default";

    var panel = Vue.vp.panels[sectionUuid].find(function (item) {
      return item.uuid === uuid;
    });
    if (panel && !panel.excludeFromNav) {
      Vue.vp.panels[sectionUuid].forEach(function (item) {
        return item.active = false;
      });
      panel.active = true;
    }
  };

  Vue.prototype.$setExcludeFromNav = function (uuid, sectionUuid, value) {
    var key = sectionUuid || "default";
    for (var i = 0; i < Vue.vp.panels[key].length; i++) {
      var item = Vue.vp.panels[key][i];
      if (item.uuid === uuid) {
        item.excludeFromNav = value;
        break;
      }
    }
  };

  Vue.scrollTo = Vue.prototype.$scrollTo = function (elem) {
    smoothscroll(elem);
  };

  Vue.prototype.$scrollToNextPanel = function () {
    // get the active section
    var index = Vue.vp.sections.findIndex(function (section) {
      return section.active;
    });
    var section = Vue.vp.sections[index];
    if (section) {
      // now find the index of the active panel
      var panelIndex = Vue.vp.panels[section.uuid].findIndex(function (panel) {
        return panel.active;
      });
      if (panelIndex >= 0 && panelIndex < Vue.vp.panels[section.uuid].length - 1) {
        Vue.scrollTo(Vue.vp.panels[section.uuid][panelIndex + 1].element);
      } else if (index + 1 < Vue.vp.sections.length) {
        section = Vue.vp.sections[index + 1];
        Vue.scrollTo(Vue.vp.panels[section.uuid][0].element);
      }
    }
  };

  Vue.prototype.$scrollToNexSection = function () {
    var index = Vue.vp.sections.findIndex(function (section) {
      return section.active;
    });
    if (index >= 0 && index + 1 < Vue.vp.sections.length) {
      Vue.scrollTo(Vue.vp.sections[index + 1].element);
    }
  };

  Vue.prototype.$getPanels = function () {
    return Vue.vp.panels;
  };

  Vue.prototype.$getSections = function () {
    return Vue.vp.sections;
  };

  Vue.component("VpDotsNav", __vue_component__);
  Vue.component("VpTextNav", __vue_component__$1);
  Vue.component("VpPanel", __vue_component__$3);
  Vue.component("VpSection", __vue_component__$2);
  Vue.component("VpNext", __vue_component__$4);
  Vue.use(Tooltip);
}

export default install;
