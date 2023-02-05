<template>
  <div class="boards-layout">
    <paginate-group
      v-for="choice in groups"
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
import { useApi, useCollection } from "@directus/extensions-sdk";
import { Field, Filter } from "@directus/shared/types";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
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

    const api = useApi();

    const groups = ref<Record<"text", string>[]>([]);

    watch(
      field,
      (next) => {
        console.log(next);
        api
          .get(`items/${collectionKey.value}`, {
            params: {
              groupBy: [next?.field],
            },
          })
          .then(
            (res) =>
              (groups.value = (
                res.data.data as Record<string, string | number | boolean>[]
              )
                .map((element) => Object.values(element))
                .flat()
                .map((value) => ({ text: value.toString() })))
          );
      },
      { immediate: true }
    );

    const choices = computed<{ text: string }[]>(() => {
      switch (field.value?.meta?.display) {
        case "labels":
          return field.value?.meta?.options?.choices || [];
        case "rating":
          return [{ text: "0" }, { text: "1" }];
      }
      return [];
    });

    return { field, collectionKey, groups };
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
