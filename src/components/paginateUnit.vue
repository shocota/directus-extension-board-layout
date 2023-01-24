<template>
  <paginate-unit-load-observer
    v-model:is-in-viewport="isInViewPort"
    :collection="fieldValue"
  >
    <draggable
      class="paginate-unit"
      :list="items"
      item-key="id"
      :data-group="fieldValue"
      group="items"
      @end="handleDragEnd"
    >
      <template #item="{ element }">
        <section
          class="card drag-handle"
          :data-item-id="element.id"
          @click="() => handleCardClick(element)"
        >
          <header>
            <div v-if="layoutOptions?.iconTemplate" class="card-icon">
              <render-template
                class="card-icon-inner"
                :template="layoutOptions.iconTemplate"
                :collection="collectionKey"
                :item="element"
              />
            </div>

            <render-template
              v-if="layoutOptions?.headerTemplate"
              class="card-title"
              :template="layoutOptions.headerTemplate"
              :collection="collectionKey"
              :item="element"
            />
            <span v-else class="card-title muted">--</span>
          </header>
          <main v-if="layoutOptions?.cardContentTemplate">
            <render-template
              :template="layoutOptions.cardContentTemplate"
              :collection="collectionKey"
              :item="element"
            />
          </main>
        </section>
      </template>
    </draggable>
  </paginate-unit-load-observer>
</template>

<script lang="ts">
import { useApi, useCollection, useItems } from "@directus/extensions-sdk";
import Draggable from "vuedraggable";
import { Field, Filter, Item, LogicalFilterAND } from "@directus/shared/types";
import {
  computed,
  defineComponent,
  PropType,
  Ref,
  ref,
  toRefs,
  watch,
} from "vue";
import { LayoutOptions } from "../types";
import { useRouter } from "vue-router";
import PaginateUnitLoadObserver from "./paginateUnitLoadObserver.vue";

export default defineComponent({
  components: { Draggable, PaginateUnitLoadObserver },
  inheritAttrs: false,
  props: {
    collectionKey: {
      type: String,
      required: true,
    },
    field: {
      type: Object as PropType<Field>,
      required: true,
    },
    fieldValue: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    layoutOptions: {
      type: Object as PropType<LayoutOptions>,
      required: true,
    },

    filter: {
      type: Object as PropType<Filter | null>,
      default: null,
    },
    search: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  emits: ["hasNextPage"],
  setup(props, { emit }) {
    const {
      fieldValue,
      field,
      filter: originFilter,
      search,
      layoutOptions,
      page,
    } = toRefs(props);
    const isInViewPort = ref(false);
    const collectionKey: Ref<string | null> = ref(null);

    watch(isInViewPort, () => {
      collectionKey.value = props.collectionKey;
    });

    const collection = useCollection(collectionKey);

    const filter = computed<LogicalFilterAND>(() => ({
      _and: [
        { [field.value.field]: { _eq: fieldValue.value } },
        originFilter.value || {},
      ],
    }));

    const fields = computed<string[]>(() =>
      collection.fields.value.map((f) => f.field)
    );

    const sort = computed(() => layoutOptions.value?.sort);

    const { items, totalPages } = useItems(collectionKey, {
      limit: ref(25),
      sort,
      search,
      page,
      filter,
      fields,
    });

    watch(
      [items, page, totalPages],
      () => {
        if (page.value >= totalPages.value) {
          return;
        }

        emit("hasNextPage", page.value + 1);
      },
      { deep: true, immediate: true }
    );

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
      const diff = { id, [field.value.field]: newValue };
      api.patch(`items/${collectionKey.value}`, [diff]);
    }

    function handleCardClick(item: Item) {
      const { id } = item;
      router.push(`/content/${collectionKey.value}/${encodeURIComponent(id)}`);
    }

    return {
      items,
      handleDragEnd,
      handleCardClick,
      isInViewPort,
    };
  },
});
</script>

<style scoped>
.paginate-unit {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  gap: 8px;
  align-items: stretch;
}

.card {
  display: flex;
  flex-flow: column nowrap;
  gap: 8px;
  border-radius: 16px;
  box-shadow: 0px 1px 4px 0px rgba(var(--card-shadow-color), 0.05);
  background-color: var(--background-page);
}

.card > * {
  padding-left: 16px;
  padding-right: 16px;
}

.card > *:first-child {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-top: 16px;
}

.card > *:last-child {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding-bottom: 16px;
}

header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 16px;
  font-weight: 700;
}

header > .card-title {
  white-space: inherit;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

header > .card-title.muted {
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
