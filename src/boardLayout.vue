<template>
  <div class="boards-layout">
    <paginate-group
      v-for="choice in choices"
      :key="choice.text"
      :field="field"
      :field-value="choice.text"
      :collection="collectionKey"
      :layout-options="layoutOptions"
      :filter="filter"
      :search="search"
    />
  </div>
</template>

<script lang="ts">
import { useCollection } from "@directus/extensions-sdk";
import { Field, Filter } from "@directus/shared/types";
import { computed, defineComponent, PropType, toRefs } from "vue";
import paginateGroup from "./components/paginateGroup.vue";
import { LayoutOptions } from "./types";
export default defineComponent({
  components: { paginateGroup },
  inheritAttrs: false,
  props: {
    layoutOptions: { type: Object as PropType<LayoutOptions>, required: true },
    collection: { type: String, required: true },
    filter: { type: Object as PropType<Filter | null>, default: null },
    search: { type: String as PropType<string | null>, default: null },
  },
  setup(props) {
    const { collection: collectionKey, layoutOptions } = toRefs(props);
    const collection = useCollection(collectionKey);

    const field = computed<Field | undefined>(() =>
      collection.fields.value.find(
        (f) => f.field == layoutOptions.value?.groupByField
      )
    );
    const choices = computed<{ text: string }[]>(
      () => field.value?.meta?.options?.choices || []
    );

    return { choices, field, collectionKey };
  },
});
</script>

<style scoped>
.boards-layout {
  padding: var(--content-padding);
  padding-top: 0;
  display: flex;
  align-items: stretch;
  gap: var(--content-padding);
}
</style>
