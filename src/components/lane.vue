<template>
  <v-card class="swimlane" style="max-height: none">
    <v-card-title class="header">
      <component
        :is="`display-${field?.meta?.display}`"
        v-bind="field?.meta?.display_options"
        :type="field?.type"
        :value="fieldValue"
      />
    </v-card-title>
    <v-card-text class="main">
      <page-component
        v-for="page in pages"
        :key="page"
        :page="page"
        :collection-key="collectionKey"
        :field="field"
        :field-value="fieldValue"
        :layout-options="layoutOptions"
        :filter="filter"
        :search="search"
        @hasNextPage="hundleHasNextPage"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Field, Filter, LogicalFilterAND } from "@directus/shared/types";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
import { LayoutOptions } from "../types";
import LoadObserver from "./loadObserver.vue";
import PageComponent from "./page.vue";
export default defineComponent({
  components: { LoadObserver, PageComponent },
  inheritAttrs: false,
  props: {
    collection: { type: String, required: true },
    field: { type: Object as PropType<Field> },
    fieldValue: { type: String },
    layoutOptions: { type: Object as PropType<LayoutOptions> },
    filter: {
      type: Object as PropType<Filter | null>,
      default: null,
    },
    search: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  setup(props) {
    const {
      fieldValue,
      field,
      filter: originFilter,
      collection: collectionKey,
      search,
      layoutOptions,
    } = toRefs(props);
    const pages = ref([1])

    const filter = computed<LogicalFilterAND>(() => ({
      _and: [
        { [field.value!.field]: { _eq: fieldValue.value } },
        originFilter.value || {},
      ],
    }));

    const sort = computed(() => layoutOptions.value?.sort);

    watch([filter, sort, search], (after, before) => {
      if (JSON.stringify(after) != JSON.stringify(before)) {
        pages.value = [1];
      }
    });

    function hundleHasNextPage(page: number) {
      pages.value = [...new Set([...pages.value, page])];
    }

    return { pages, collectionKey, hundleHasNextPage };
  },
});
</script>

<style scoped>
.swimlane {
  background-color: var(--background-subdued);
  border-radius: var(--border-radius);
  flex: 0 0 320px;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
}

.header {
  display: flex;
  justify-content: space-between;
}
.header > .item-count {
  color: var(--foreground-subdued);
  font-size: 0.95rem;
}

.main {
  flex-grow: 1;
}
</style>
