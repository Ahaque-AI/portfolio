import { onBeforeUnmount, onMounted, ref } from 'vue';
import chatbotData from '../../data/chatbot.json';
const data = chatbotData;
const searchRef = ref(null);
const listRef = ref(null);
const topMatchRef = ref(null);
const topMatchQRef = ref(null);
const topMatchARef = ref(null);
const expandedId = ref(null);
let searchTimer = null;
function toggle(id) {
    expandedId.value = expandedId.value === id ? null : id;
}
function findTopMatch(query) {
    const normalized = query.toLowerCase().trim();
    if (normalized.length < 2)
        return null;
    let best = null;
    for (const item of data.qa) {
        let hits = 0;
        for (const p of item.patterns)
            if (normalized.includes(p))
                hits += 1;
        if (hits === 0)
            continue;
        const score = hits / Math.sqrt(item.patterns.length);
        if (!best || score > best.score)
            best = { score, item };
    }
    return best;
}
function onSearchInput(value) {
    const query = value;
    if (searchTimer)
        window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
        const items = listRef.value?.querySelectorAll('.faq-item') ?? [];
        items.forEach((it) => (it.hidden = false));
        if (query.trim().length === 0) {
            if (topMatchRef.value)
                topMatchRef.value.hidden = true;
            return;
        }
        const normalized = query.toLowerCase().trim();
        let anyVisible = 0;
        items.forEach((it) => {
            const patterns = (it.dataset.patterns ?? '').split(' ');
            const hit = patterns.some((p) => normalized.includes(p));
            it.hidden = !hit;
            if (hit)
                anyVisible += 1;
        });
        if (anyVisible === 0)
            items.forEach((it) => (it.hidden = false));
        const top = findTopMatch(query);
        if (top && top.score >= 0.45) {
            if (topMatchRef.value)
                topMatchRef.value.hidden = false;
            if (topMatchQRef.value)
                topMatchQRef.value.textContent = top.item.question;
            if (topMatchARef.value)
                topMatchARef.value.textContent = top.item.answer;
            expandedId.value = top.item.id;
        }
        else if (topMatchRef.value) {
            topMatchRef.value.hidden = true;
        }
    }, 120);
}
onMounted(() => {
    searchRef.value?.addEventListener('input', (e) => onSearchInput(e.target.value));
});
onBeforeUnmount(() => {
    if (searchTimer)
        window.clearTimeout(searchTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    id: "questions",
    ...{ class: "scroll-mt-24 py-16 sm:py-20" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "mb-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-serif text-base italic text-fg-subtle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "display mt-2 text-3xl sm:text-4xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "body-text max-w-2xl text-fg-muted" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-10 max-w-2xl" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "faq-search",
    ...{ class: "sr-only" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-baseline gap-3 border-b-2 border-fg pb-2 focus-within:border-accent transition-colors" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'aria-hidden': "true",
    ...{ class: "font-serif text-lg italic text-fg-subtle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "faq-search",
    ref: "searchRef",
    type: "text",
    placeholder: "Search questions…",
    autocomplete: "off",
    spellcheck: "false",
    ...{ class: "flex-1 bg-transparent font-serif text-lg italic text-fg placeholder:text-fg-subtle focus:outline-none" },
});
/** @type {typeof __VLS_ctx.searchRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "topMatchRef",
    hidden: true,
    ...{ class: "mt-8 max-w-2xl border-l-2 border-accent pl-5" },
});
/** @type {typeof __VLS_ctx.topMatchRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ref: "topMatchQRef",
    ...{ class: "display mt-2 text-xl text-fg" },
});
/** @type {typeof __VLS_ctx.topMatchQRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ref: "topMatchARef",
    ...{ class: "body-text mt-3 text-fg" },
});
/** @type {typeof __VLS_ctx.topMatchARef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.ol, __VLS_intrinsicElements.ol)({
    ref: "listRef",
    ...{ class: "mt-12 max-w-2xl" },
    role: "list",
});
/** @type {typeof __VLS_ctx.listRef} */ ;
for (const [item, i] of __VLS_getVForSourceType((__VLS_ctx.data.qa))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (item.id),
        ...{ class: "faq-item border-t border-border py-5" },
        'data-patterns': (item.patterns.join(' ')),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.toggle(item.id);
            } },
        type: "button",
        ...{ class: "faq-toggle flex w-full items-baseline justify-between gap-4 text-left" },
        'aria-expanded': (__VLS_ctx.expandedId === item.id),
        'aria-controls': (`faq-panel-${item.id}`),
        id: (`faq-trigger-${item.id}`),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-serif text-lg sm:text-xl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-fg-faint font-mono text-xs mr-3" },
    });
    (String(i + 1).padStart(2, '0'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.question);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        'aria-hidden': "true",
        ...{ class: "faq-icon font-serif text-2xl text-fg-subtle transition-transform" },
        ...{ class: ({ 'rotate-45': __VLS_ctx.expandedId === item.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        id: (`faq-panel-${item.id}`),
        role: "region",
        'aria-labelledby': (`faq-trigger-${item.id}`),
        ...{ class: "faq-panel mt-4 pl-7 body-text text-fg" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.expandedId === item.id) }, null, null);
    (item.answer);
}
/** @type {__VLS_StyleScopedClasses['scroll-mt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['py-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:py-20']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['display']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-10']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-fg']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:border-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder:text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-5']} */ ;
/** @type {__VLS_StyleScopedClasses['kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['display']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['faq-item']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['py-5']} */ ;
/** @type {__VLS_StyleScopedClasses['faq-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['faq-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['faq-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-7']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            data: data,
            searchRef: searchRef,
            listRef: listRef,
            topMatchRef: topMatchRef,
            topMatchQRef: topMatchQRef,
            topMatchARef: topMatchARef,
            expandedId: expandedId,
            toggle: toggle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
