import { computed } from 'vue';
import { PROJECTS } from '../../data/projects';
const LINK_LABELS = {
    code: 'Source',
    paper: 'Paper',
    demo: 'Demo',
    other: 'Link',
};
const entries = computed(() => [...PROJECTS].sort((a, b) => a.order - b.order));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    id: "projects",
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.ol, __VLS_intrinsicElements.ol)({
    ...{ class: "space-y-14" },
    role: "list",
});
for (const [project] of __VLS_getVForSourceType((__VLS_ctx.entries))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
        key: (project.slug),
        ...{ class: "border-t border-border pt-8 first:border-t-0 first:pt-0" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "caption flex flex-wrap items-baseline gap-x-3 gap-y-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-mono text-fg" },
    });
    (project.period);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        'aria-hidden': "true",
        ...{ class: "text-fg-faint" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-serif italic text-fg-muted" },
    });
    (project.featured ? 'research, featured' : 'project');
    if (project.caseStudy) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            'aria-hidden': "true",
            ...{ class: "text-fg-faint" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-serif italic text-accent" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "display mt-3 text-2xl sm:text-3xl" },
    });
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: (`/projects/${project.slug}`),
        ...{ class: "hover:text-accent transition-colors" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/projects/${project.slug}`),
        ...{ class: "hover:text-accent transition-colors" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (project.title);
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "body-text mt-4 max-w-2xl text-fg-muted" },
    });
    (project.summary);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "caption mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-mono uppercase tracking-wider text-fg-subtle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (project.stack.join(' · '));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-6 font-serif text-base italic" },
    });
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        to: (`/projects/${project.slug}`),
        ...{ class: "text-accent hover:underline underline-offset-4" },
    }));
    const __VLS_6 = __VLS_5({
        to: (`/projects/${project.slug}`),
        ...{ class: "text-accent hover:underline underline-offset-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        'aria-hidden': "true",
    });
    var __VLS_7;
    if (project.links.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "mx-3 text-fg-faint" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            href: (project.links[0].href),
            target: "_blank",
            rel: "noopener noreferrer",
            ...{ class: "text-fg-muted hover:text-accent" },
        });
        (__VLS_ctx.LINK_LABELS[project.links[0].type ?? 'other'] ?? project.links[0].label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            'aria-hidden': "true",
        });
    }
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
/** @type {__VLS_StyleScopedClasses['space-y-14']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-border']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['first:border-t-0']} */ ;
/** @type {__VLS_StyleScopedClasses['first:pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['caption']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['display']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['body-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['caption']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-serif']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-accent']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['underline-offset-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-faint']} */ ;
/** @type {__VLS_StyleScopedClasses['text-fg-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-accent']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            LINK_LABELS: LINK_LABELS,
            entries: entries,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
