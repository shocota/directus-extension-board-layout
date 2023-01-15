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
      <draggable
        :list="items"
        item-key="id"
        :data-group="fieldValue"
        style="height: 100%"
        group="kanban"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <v-card
            class="drag-handle card"
            :data-item-id="element.id"
            @click="() => handleCardClick(element)"
          >
            <div class="card-header">
              <div class="card-icon" v-if="layoutOptions?.iconTemplate">
                <render-template
                  class="card-icon-inner"
                  :template="layoutOptions.iconTemplate"
                  :collection="collection"
                  :item="element"
                />
              </div>

              <render-template
                class="card-title"
                v-if="layoutOptions?.headerTemplate"
                :template="layoutOptions.headerTemplate"
                :collection="collection"
                :item="element"
              /><span v-else class="card-title muted">--</span>
            </div>
            <v-card-text v-if="layoutOptions?.cardContentTemplate">
              <render-template
                :template="layoutOptions.cardContentTemplate"
                :collection="collection"
                :item="element"
              />
            </v-card-text>
          </v-card>
        </template>
      </draggable>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useApi, useCollection, useItems } from "@directus/extensions-sdk";
import Draggable from "vuedraggable";
import { Field, Filter, Item, LogicalFilterAND } from "@directus/shared/types";
import { computed, defineComponent, PropType, ref, toRefs } from "vue";
import { LayoutOptions } from "../types";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { Draggable },
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
      collection: collectionKey,
      fieldValue,
      field,
      filter: originFilter,
      search,
      layoutOptions,
    } = toRefs(props);
    const collection = useCollection(collectionKey);

    const filter = computed<LogicalFilterAND>(() => ({
      _and: [
        { [field.value!.field]: { _eq: fieldValue.value } },
        originFilter.value || {},
      ],
    }));
    const fields = computed<string[]>(() =>
      collection.fields.value.map((f) => f.field)
    );

    const sort = computed(() => layoutOptions.value?.sort);

    const { items } = useItems(collectionKey, {
      limit: ref(25),
      sort,
      search,
      page: ref(1),
      filter,
      fields,
    });

    interface EndEvent extends CustomEvent {
      oldIndex: number;
      newIndex: number;
      from: HTMLElement;
      to: HTMLElement;
      item: HTMLElement;
    }

    const api = useApi();
    const router = useRouter();
    function handleDragEnd(event: EndEvent) {
      const id = event.item.dataset["itemId"];
      const newValue = event.to.dataset["group"];
      const diff = { id, [field.value!.field]: newValue };
      api.patch(`items/${collectionKey.value}`, [diff]);
    }

    function handleCardClick(item: Item) {
      const { id } = item;

      router.push(`/content/${collectionKey.value}/${encodeURIComponent(id)}`);
    }

    return { items, handleDragEnd, handleCardClick };
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
.v-card.card {
  background-color: var(--background-page);
}

.card-header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 4px;
  padding: 16px;
  gap: 16px;
  font-weight: 700;
}

.card-header > .card-title {
  white-space: inherit;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.card-header > .card-title.muted {
  color: var(--foreground-subdued);
}

.card-icon {
  width: 48px;
  height: 48px;
  background-color: var(--background-subdued);
  border-radius: var(--border-radius);
  font-size: 32px;
  flex: 0 0 48px;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}

.card-icon > .card-icon-inner {
  padding: 0;
  flex-grow: 1;
  text-align: center;
}
</style>
