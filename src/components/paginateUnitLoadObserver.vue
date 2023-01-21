<template>
  <div ref="loader"></div>
</template>

<script lang="ts">
import { useSync } from "@directus/extensions-sdk";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
export default defineComponent({
  inheritAttrs: false,
  props: {
    isInViewport: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, { emit }) {
    const isInViewport = useSync(props, "isInViewport", emit);
    const loader = ref(document.createElement("div"));
    const intersectionObserver = ref(
      new IntersectionObserver(handleObserve, {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      })
    );

    function handleObserve(entries: IntersectionObserverEntry[]): void {
      isInViewport.value = entries[0].intersectionRatio > 0;
    }

    onMounted(() => {
      intersectionObserver.value.observe(loader.value);
    });

    onUnmounted(() => {
      intersectionObserver.value?.disconnect();
    });

    return { loader };
  },
});
</script>
