export default {
  props: {
    classes: {
      type: Object,
      default() {
        return {
          textSectionUl: ["vp--text-sections"],
          textSectionLi: ["vp--text", "vp--section"],
          textPanelUl: ["vp--text-panels"],
          textPanelLi: ["vp--text", "vp--panel"],
          dotSectionUl: ["vp--dot-sections"],
          dotSectionLi: ["vp--dot", "vp--section"],
          dotPanelUl: ["vp--dot-panels"],
          dotPanelLi: ["vp--dot", "vp--panel"],
        };
      },
    },
  },
  data() {
    return {
      sections: [],
      panels: {},
    };
  },
  methods: {
    scrollTo(elem) {
      this.$scrollTo(elem);
    },
    hasClass(elem, classToAdd) {
      return elem.classList.contains(classToAdd);
    },
    sectionClicked(section, $event) {
      if (!this.$listeners.sectionclicked) {
        // handle the click ourselves
        this.scrollTo(section);
      } else {
        this.$emit("sectionclicked", section, $event, () => {
          this.scrollTo(section);
        });
      }
    },
    panelClicked(panel, $event) {
      if (!this.$listeners.panelclicked) {
        // handle the click ourselves
        this.scrollTo(panel);
      } else {
        this.$emit("panelclicked", panel, $event, () => {
          this.scrollTo(panel);
        });
      }
    },
  },
  created() {
    this.sections = this.$getSections();
    this.panels = this.$getPanels();
  },
};
