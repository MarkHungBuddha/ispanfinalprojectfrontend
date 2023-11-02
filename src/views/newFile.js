import navbar from "@/components/navbar.vue";

export default (() => {
const __VLS_setup = async () => {
const __VLS_publicComponent = (await import('vue')).defineComponent({
setup() {
return {};
},

data() {
return {};
}
});

const __VLS_componentsOption = {};

let __VLS_name!: 'ProductPageBack';
function __VLS_template() {
let __VLS_ctx!: InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_publicComponent, new () => {}>> & InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_localComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption & typeof __VLS_ctx;
let __VLS_otherComponents!: typeof __VLS_localComponents & import('./__VLS_types.js').GlobalComponents;
let __VLS_own!: import('./__VLS_types.js').SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & typeof __VLS_publicComponent & (new () => { $slots: typeof __VLS_slots; }) >;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_templateComponents!: {} &
import('./__VLS_types.js').WithComponent<'VApp', typeof __VLS_components, 'VApp', 'vApp', 'v-app'> &
import('./__VLS_types.js').WithComponent<'VContainer', typeof __VLS_components, 'VContainer', 'vContainer', 'v-container'> &
import('./__VLS_types.js').WithComponent<'navbar', typeof __VLS_components, 'Navbar', 'navbar'>;
__VLS_components.VApp; __VLS_components.VApp; __VLS_components.vApp; __VLS_components.vApp; __VLS_components['v-app']; __VLS_components['v-app'];
// @ts-ignore
[VApp, VApp,];
__VLS_components.VContainer; __VLS_components.VContainer; __VLS_components.vContainer; __VLS_components.vContainer; __VLS_components['v-container']; __VLS_components['v-container'];
// @ts-ignore
[VContainer, VContainer,];
__VLS_components.Navbar; __VLS_components.navbar;
// @ts-ignore
[navbar,];
{
__VLS_templateComponents.VApp;
(__VLS_x as import('./__VLS_types.js').ComponentProps<typeof __VLS_templateComponents.VApp>) = {};
{
__VLS_templateComponents.VContainer;
(__VLS_x as import('./__VLS_types.js').ComponentProps<typeof __VLS_templateComponents.VContainer>) = {};
{
(__VLS_x as import('./__VLS_types.js').ComponentProps<typeof __VLS_templateComponents.navbar>) = {};
}
}
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
declare var __VLS_slots: {};
return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
setup() {
return {
navbar: navbar,
};
},
});
return {} as typeof __VLS_publicComponent;
};
return {} as typeof __VLS_setup extends () => Promise<infer T> ? T : never;
})({} as any);
