<template>
    <ul :class="classes.dotSectionUl">
        <li
            v-for="(section, index) in sections"
            :key="index"
            :class="[classes.dotSectionLi, { active: section.active }]"
            :aria-label="section.title"
        >
            <a
                @click="sectionClicked(section.element, $event)"
                v-tooltip.right="section.title"
            ></a>
            <ul :class="classes.dotPanelUl">
                <template
                    v-for="(panel, index) in panels[
                        section.element.dataset.uuid
                    ]"
                >
                    <li
                        :key="index"
                        v-if="!panel.excludeFromNav"
                        :class="[classes.dotPanelLi, { active: panel.active }]"
                    >
                        <a
                            @click="panelClicked(panel.element, $event)"
                            :aria-label="panel.title"
                            v-tooltip.right="panel.title"
                        ></a>
                    </li>
                </template>
            </ul>
        </li>
    </ul>
</template>

<script>
import NavMixin from "./mixins/NavMixin";
export default {
    mixins: [NavMixin],
};
</script>

<style lang="sass"></style>
