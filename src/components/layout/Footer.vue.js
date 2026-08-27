import { SITE, SOCIAL } from '../../lib/site';
const year = new Date().getFullYear();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "mt-32" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.hr)({
    ...{ class: "rule" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mx-auto w-full max-w-7xl px-6 py-12 sm:px-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-4 body-text text-fg-muted" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    ...{ class: "text-accent underline-offset-4 hover:underline" },
    href: "https://vuejs.org",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    ...{ class: "text-accent underline-offset-4 hover:underline" },
    href: "https://vitejs.dev",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    ...{ class: "text-accent underline-offset-4 hover:underline" },
    href: "https://threejs.org",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-serif italic" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-3 body-text text-fg-muted" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
    ...{ class: "text-accent underline-offset-4 hover:underline" },
    href: (__VLS_ctx.SITE.cvPath),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-fg-subtle" },
    role: "list",
});
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.SOCIAL))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (link.href),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        href: (link.href),
        ...{ class: "hover:text-accent" },
        rel: "noopener noreferrer",
        target: (link.href.startsWith('http') ? '_blank' : undefined),
    });
    (link.label.toLowerCase());
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-12 font-mono text-xs text-fg-faint" },
});
(__VLS_ctx.year);
(__VLS_ctx.SITE.name);
/** @type {__VLS_StyleScopedClasses['mt-32']} */ ;
/** @type {__VLS_StyleScopedClasses['rule']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-x-6']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SITE: SITE,
            SOCIAL: SOCIAL,
            year: year,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
