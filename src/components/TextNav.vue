<template>
  <ul :class="classes.textSectionUl">
    <li
      v-for="(section, index) in sections"
      :key="index"
      :class="[classes.textSectionLi, { active: section.active }]"
      :aria-label="section.title"
      :title="section.title"
    >
      <a @click="sectionClicked(section.element, $event)"
        >{{ section.title }} <i v-if="showExpander" :class="expanderClass"></i
      ></a>
      <ul :class="classes.textPanelUl">
        <template
          v-for="(panel, index) in panels[section.element.dataset.uuid]"
        >
          <li
            v-if="!panel.excludeFromNav"
            :key="`vp_text_nav_li_${index}`"
            :aria-label="panel.title"
            :title="panel.title"
            :class="[classes.textPanelLi, { active: panel.active }]"
          >
            <a
              @click="panelClicked(panel.element, $event)"
              v-bind="linkAttrs"
              >{{ panel.title }}</a
            >
          </li>
        </template>
      </ul>
    </li>
  </ul>
</template>

<script>
import NavMixin from "./mixins/NavMixin";
export default {
  props: {
    showExpander: {
      type: Boolean,
      default: false,
    },
    expanderClass: {
      type: String,
      default: "fa fa-angle-down",
    },
    linkAttrs: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [NavMixin],
};
</script>

<style lang="sass"></style>
