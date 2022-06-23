import Vue from 'vue';
import DotsNav from './components/DotsNav.vue';
import TextNav from './components/TextNav.vue';
import Section from './components/Section.vue';
import Panel from './components/Panel.vue';
import NextButton from './components/NextButton.vue';
import scrollmonitor from 'scrollmonitor';
import shortid from 'shortid';
import get from 'lodash.get';
import smoothscroll from 'smoothscroll';
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

export default function install(Vue, options) {
    let plugin = install;
    if (plugin.installed) {
        return;
    }
    plugin.installed = true;
    Vue.set(Vue, 'vp', {});
    Vue.set(Vue.vp, 'sections', []);
    Vue.set(Vue.vp, 'panels', {});

    /**
     * @param {String} selector the dom selector to match parents against
     * @returns {Element|Null} the element if found, or null if not
     */
    Vue.prototype.$firstParent = function (selector) {
        // Element.matches() polyfill
        let elem = this.$el;
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
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
        let key = get(section, 'dataset.uuid', 'default');
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
        let sectionData = {
            title: title,
            element: section,
            uuid: section.dataset.uuid,
            active: false
        };
        Vue.vp.sections.push(sectionData);
        Vue.set(Vue.vp.panels, section.dataset.uuid, []);
        for (let i = 0; i < Vue.vp.panels['default'].length; i++) {
            let panel = Vue.vp.panels.default[i];
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
        let key = sectionUuid || 'default';
        let panels = Vue.vp.panels[key];
        for (let i = 0; i < panels.length; i++) {
            const element = panels[i];
            if (element.uuid === uuid) {
                element.title = newTitle;
                break;
            }
        }
    };

    Vue.prototype.$updateSectionTitle = function (newTitle, uuid) {
        let sections = Vue.vp.sections;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
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
        Vue.vp.panels[item.uuid].forEach((item) => (item.active = false));
      }
    });
  };

  Vue.prototype.$setActivePanel = function (uuid, sectionUuid = "default") {
    const panel = Vue.vp.panels[sectionUuid].find((item) => item.uuid === uuid);
    if (panel) {
      Vue.vp.panels[sectionUuid].forEach((item) => (item.active = false));
      panel.active = true;
    }
  };

    Vue.prototype.$setExcludeFromNav = function (uuid, sectionUuid, value) {
        let key = sectionUuid || 'default';
        for (let i = 0; i < Vue.vp.panels[key].length; i++) {
            let item = Vue.vp.panels[key][i];
            if (item.uuid === uuid) {
                item.excludeFromNav = value;
                break;
            }
        }
    }

    Vue.scrollTo = Vue.prototype.$scrollTo = function (elem) {
        smoothscroll(elem);
    };

    Vue.prototype.$scrollToNextPanel = function () {
        // get the active section
        let index = Vue.vp.sections.findIndex(function (section) {
            return section.active;
        });
        let section = Vue.vp.sections[index];
        if (section) {
            // now find the index of the active panel
            let panelIndex = Vue.vp.panels[section.uuid].findIndex(function (panel) {
                return panel.active;
            });
            if (panelIndex >= 0 && panelIndex < Vue.vp.panels[section.uuid].length - 1) {
                Vue.scrollTo(Vue.vp.panels[section.uuid][panelIndex + 1].element);
            } else if (index + 1 < Vue.vp.sections.length) {
                section = Vue.vp.sections[index + 1];
                Vue.scrollTo(Vue.vp.panels[section.uuid][0].element);
            }
        }
    }

    Vue.prototype.$scrollToNexSection = function () {
        let index = Vue.vp.sections.findIndex(function (section) {
            return section.active;
        });
        if (index >= 0 && index + 1 < Vue.vp.sections.length) {
            Vue.scrollTo(Vue.vp.sections[index + 1].element);
        }
    }

    Vue.prototype.$getPanels = function () {
        return Vue.vp.panels;
    };

    Vue.prototype.$getSections = function () {
        return Vue.vp.sections;
    };

    Vue.component('VpDotsNav', DotsNav);
    Vue.component('VpTextNav', TextNav);
    Vue.component('VpPanel', Panel);
    Vue.component('VpSection', Section);
    Vue.component('VpNext', NextButton);
    Vue.use(Tooltip);
}
