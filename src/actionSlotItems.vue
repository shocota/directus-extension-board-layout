<template>
  <v-menu>
    <template #activator="{ toggle }">
      <div v-tooltip.top="'sort_field'" class="sort-selector" @click="toggle">
        {{ sortKey ? fields[sortKey]?.name : "--" }}
      </div>
    </template>
    <v-list>
      <v-list-item
        v-for="field in fields"
        :key="field.field"
        :disabled="field['disabled']"
        :active="sortWritable ? field.field === sortKey : false"
        clickable
        @click="sortWritable = [field.field]"
      >
        <v-list-item-content>{{ field.name }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import { useCollection, useSync } from "@directus/extensions-sdk";
import { Field } from "@directus/shared/types";
import { LayoutOptions } from "./types";
export default defineComponent({
  inheritAttrs: false,
  props: {
    layoutOptions: { type: Object as PropType<LayoutOptions>, required: true },
    collection: { type: String, required: true },
  },
  setup(props, { emit }) {
    const { collection: collectionKey } = toRefs(props);
    const collection = useCollection(collectionKey);

    const layoutOptions = useSync(props, "layoutOptions", emit);
    const sortWritable = computed({
      get() {
        return layoutOptions.value?.sort;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          sort: newValue,
        });
      },
    });

    const sortKey = computed(() =>
      sortWritable.value ? sortWritable.value["0"] : null
    );

    const fields = computed<Record<string, Field>>(() =>
      Object.fromEntries(collection.fields.value.map((f) => [f.field, f]))
    );

    return { fields, sortWritable, sortKey };
  },
});
</script>

<style>
.sort-selector {
  margin-right: 8px;
  transition: color var(--fast) var(--transition);
}
.sort-selector:hover {
  color: var(--foreground-normal);
  cursor: pointer;
}
</style>
