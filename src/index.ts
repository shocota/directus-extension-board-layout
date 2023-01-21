import { defineLayout, useSync } from "@directus/extensions-sdk";
import BoardLayout from "./boardLayout.vue";
import OptionSlotItems from "./optionSlotItems.vue";
import ActionSlotItems from "./actionSlotItems.vue";
import { LayoutOptions, LayoutQuery } from "./types";

export default defineLayout<LayoutOptions, LayoutQuery | null>({
  id: "board-layout",
  name: "Board",
  icon: "box",
  component: BoardLayout,
  slots: {
    options: OptionSlotItems,
    sidebar: () => null,
    actions: ActionSlotItems,
  },
  setup(props, { emit }) {
    const layoutOptions = useSync(props, "layoutOptions", emit);

    const groupByField = layoutOptions.value?.groupByField;
    const headerTemplate = layoutOptions.value?.headerTemplate;
    const cardContentTemplate = layoutOptions.value?.cardContentTemplate;

    return { groupByField, headerTemplate, cardContentTemplate };
  },
});
