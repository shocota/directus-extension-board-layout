<template>
  <div class="field">
    <div class="type-label">{{ "Group by" }}</div>
    <v-select
      v-model="groupByFieldWritable"
      :items="enumLikeFields"
      item-text="name"
      item-value="field"
    />
  </div>
  <div class="field">
    <div class="type-label">{{ "Header" }}</div>
    <v-field-template
      v-model="headerTemplateWritable"
      :collection="collection"
    />
  </div>
  <div class="field">
    <div class="type-label">{{ "Content" }}</div>
    <v-field-template
      v-model="cardContentTemplateWritable"
      :collection="collection"
    />
  </div>
  <div class="field">
    <div class="type-label">{{ "Icon" }}</div>
    <v-field-template v-model="iconTemplateWritable" :collection="collection" />
  </div>
</template>

<script lang="ts">
import { useCollection, useSync } from "@directus/extensions-sdk";
import { computed, defineComponent, PropType, toRefs } from "vue";
import { LayoutOptions } from "./types";
export default defineComponent({
  inheritAttrs: false,
  props: {
    collection: { type: String, required: true },
    layoutOptions: { type: Object as PropType<LayoutOptions>, required: true },
  },
  setup(props, { emit }) {
    const { collection: collectionKey } = toRefs(props);
    const collection = useCollection(collectionKey);

    const enumLikeFields = computed(() =>
      collection.fields.value.filter(
        (f) =>
          f.meta?.display === "labels" ||
          f.meta?.display === "rating" ||
          f.meta?.display === "icon" ||
          f.meta?.display === "color"
      )
    );

    const layoutOptions = useSync(props, "layoutOptions", emit);

    const groupByFieldWritable = computed({
      get() {
        return layoutOptions.value?.groupByField;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          groupByField: newValue,
        });
      },
    });

    const iconTemplateWritable = computed({
      get() {
        return layoutOptions.value?.iconTemplate;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          iconTemplate: newValue,
        });
      },
    });

    const headerTemplateWritable = computed({
      get() {
        return layoutOptions.value?.headerTemplate;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          headerTemplate: newValue,
        });
      },
    });

    const cardContentTemplateWritable = computed({
      get() {
        return layoutOptions.value?.cardContentTemplate;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          cardContentTemplate: newValue,
        });
      },
    });

    return {
      enumLikeFields,
      groupByFieldWritable,
      iconTemplateWritable,
      headerTemplateWritable,
      cardContentTemplateWritable,
    };
  },
});
</script>
