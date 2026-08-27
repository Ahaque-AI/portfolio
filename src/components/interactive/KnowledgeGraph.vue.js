import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { DOMAIN_NODES, useKnowledgeGraph } from '../../composables/useKnowledgeGraph';
const canvasRef = ref(null);
const hoveredId = ref(null);
const { mount, dispose, findNode } = useKnowledgeGraph();
const hoveredNode = computed(() => hoveredId.value ? (findNode(hoveredId.value) ?? null) : null);
const captionHint = computed(() => {
    const total = DOMAIN_NODES.length;
    const totalEdges = DOMAIN_NODES.reduce((sum, n) => sum + n.neighbors.length, 0) / 2;
    return `${total} domains · ${Math.round(totalEdges)} edges`;
});
function handleHover(id) {
    hoveredId.value = id;
}
function handleClick(id) {
    const node = findNode(id);
    if (!node)
        return;
    const target = document.querySelector(node.anchor);
    if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
onMounted(() => {
    if (canvasRef.value) {
        mount(canvasRef.value, { onHover: handleHover, onClick: handleClick });
    }
});
onBeforeUnmount(() => {
    dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['kg-canvas']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.figure, __VLS_intrinsicElements.figure)({
    ...{ class: "kg-figure" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas)({
    ref: "canvasRef",
    ...{ class: "kg-canvas" },
    'aria-label': "Interactive knowledge graph of Abdul's technical domains",
});
/** @type {typeof __VLS_ctx.canvasRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.figcaption, __VLS_intrinsicElements.figcaption)({
    ...{ class: "kg-caption" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "kg-caption-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "kg-caption-label" },
});
if (__VLS_ctx.hoveredNode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({
        ...{ class: "text-accent" },
    });
    (__VLS_ctx.hoveredNode.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-fg-faint" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-fg-subtle" },
    });
    (__VLS_ctx.hoveredNode.neighbors.length);
}
else {
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "kg-caption-meta" },
});
(__VLS_ctx.captionHint);
/** @type {__VLS_StyleScopedClasses['kg-figure']} */ ;
/** @type {__VLS_StyleScopedClasses['kg-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['kg-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['kg-caption-row']} */ ;
/** @type {__VLS_StyleScopedClasses['kg-caption-label']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['kg-caption-meta']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            canvasRef: canvasRef,
            hoveredNode: hoveredNode,
            captionHint: captionHint,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
