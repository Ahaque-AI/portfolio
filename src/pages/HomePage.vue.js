import Hero from '../components/sections/Hero.vue';
import Experience from '../components/sections/Experience.vue';
import Projects from '../components/sections/Projects.vue';
import Skills from '../components/sections/Skills.vue';
import Faq from '../components/sections/Faq.vue';
import Contact from '../components/sections/Contact.vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof Hero, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Hero, new Hero({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof Experience, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Experience, new Experience({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof Projects, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(Projects, new Projects({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof Skills, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(Skills, new Skills({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof Faq, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(Faq, new Faq({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {[typeof Contact, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(Contact, new Contact({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Hero: Hero,
            Experience: Experience,
            Projects: Projects,
            Skills: Skills,
            Faq: Faq,
            Contact: Contact,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
