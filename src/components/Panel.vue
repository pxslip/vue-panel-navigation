<template>
  <div class="vp--panel">
    <slot></slot>
  </div>
</template>

<script>
import scrollmonitor from "scrollmonitor";
import OffsetMixin from "./mixins/OffsetMixin";
export default {
  mixins: [OffsetMixin],
  props: {
    sortIndex: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      require: true,
    },
    exclude: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      section: null,
      uuid: null,
      sectionUuid: "default",
    };
  },
  watch: {
    title(newTitle, oldTitle) {
      this.$updatePanelTitle(
        newTitle,
        this.$el.dataset.uuid,
        this.getSectionUuid()
      );
    },
    exclude(value) {
      this.$setExcludeFromNav(this.uuid, this.getSectionUuid(), value);
    },
  },
  methods: {
    getSectionUuid() {
      if (this.sectionUuid === "default" && this.section) {
        this.sectionUuid = this.section.dataset.uuid;
      }
      return this.sectionUuid;
    },
    makeActive() {
      this.$el.classList.add("vp--active");
      this.$setActivePanel(this.uuid, this.getSectionUuid());
      this.$setActiveSection(this.getSectionUuid());
    },
  },
  mounted() {
    let baseOffset = scrollmonitor.viewportHeight / 3;
    this.$el.dataset.uuid = this.uuid = this.$shortId();
    this.$set(this, "section", this.$firstParent(".vp--section"));
    this.$el.dataset.title = this.title;
    this.$addPanel(
      this.title,
      this.sortIndex,
      this.$el,
      this.section,
      this.exclude
    );

    let watcher = (this.watcher = scrollmonitor.create(this.$el, {
      top: this.offsetTop - baseOffset,
      bottom: this.offsetBottom - baseOffset,
    }));
    scrollmonitor.update();
    watcher.enterViewport(() => {
      this.makeActive();
    });
    this.$nextTick(() => {
      if (watcher.isInViewport) {
        this.makeActive();
      }
    });
  },
  destroyed() {
    this.watcher.destroy();
  },
};
</script>

<style lang="scss" scoped></style>
