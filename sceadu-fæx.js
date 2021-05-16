import { XtalFragment, loadFragment } from './xtal-fragment.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
export class SceaduFæx extends XtalFragment {
    constructor() {
        super(...arguments);
        this.isVisual = true;
        this.propActions = propActions;
    }
    clonedTemplateCallback(clonedTemplate) {
        const clonedLightTemplate = this.lightTemplate.content.cloneNode(true);
        const slotKeys = {};
        clonedLightTemplate.querySelectorAll('[slot]').forEach(el => {
            const slot = el.getAttribute('slot');
            if (slotKeys[slot] === undefined) {
                slotKeys[slot] = [];
            }
            slotKeys[slot].push(el);
        });
        for (const key in slotKeys) {
            const slotEl = clonedTemplate.querySelector(`slot[name="${key}"]`);
            slotEl?.append(...slotKeys[key]);
        }
    }
    ;
    connectedCallback() {
        super.connectedCallback();
        const sr = this.attachShadow({ mode: 'open' });
        sr.innerHTML = "<slot></slot>";
        const slot = sr.firstChild;
        sr.addEventListener('slotchange', e => {
            const assignedElements = slot.assignedElements();
            if (assignedElements.length === 0)
                return;
            const templ = assignedElements[0];
            if (templ.localName !== 'template')
                return;
            this.lightTemplate = templ;
            templ.remove();
        });
    }
}
SceaduFæx.is = 'sceadu-fæx';
export const loadFragmentWithSlots = ({ copy, from, self, lightTemplate }) => {
    loadFragment(self);
};
const propActions = [loadFragmentWithSlots];
const propDefMap = {
    lightTemplate: {
        type: Object,
        async: true,
        dry: true,
        stopReactionsIfFalsy: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(SceaduFæx, slicedPropDefs, 'onPropChange');
xc.define(SceaduFæx);
