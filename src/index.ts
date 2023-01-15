import { defineLayout, useSync } from "@directus/extensions-sdk";
import BoardComponent from "./board.vue";
import OptionsComponent from "./options.vue";
import ActionsComponent from "./actions.vue";
import { LayoutOptions, LayoutQuery } from "./types";

export default defineLayout<LayoutOptions, LayoutQuery | null>({
  id: "board-layout",
  name: "Board",
  icon: "box",
  component: BoardComponent,
  slots: {
    options: OptionsComponent,
    sidebar: () => null,
    actions: ActionsComponent,
  },
  setup(props, { emit }) {
    const layoutOptions = useSync(props, "layoutOptions", emit);

    const groupByField = layoutOptions.value?.groupByField;
    const headerTemplate = layoutOptions.value?.headerTemplate;
    const cardContentTemplate = layoutOptions.value?.cardContentTemplate;

    return { groupByField, headerTemplate, cardContentTemplate };
  },
});
