import { XtalFragment } from 'xtal-fragment/xtal-fragment.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
import { TemplModel } from 'templ-model/templ-model.js';
import { RefTo } from 'ref-to/ref-to.js';
import { TemplateInstance } from '@github/template-parts/lib/index.js';
export class SceaduFæx extends XtalFragment {
    constructor() {
        super(...arguments);
        this.isVisual = true;
    }
    cloneTemplate(templ) {
        const grouped = this.groupedLightChildren;
        let clonedTemplate;
        if (grouped.templModel !== undefined) {
            clonedTemplate = new TemplateInstance(templ, grouped.templModel.value);
            grouped.templModel.templateInstance = clonedTemplate;
        }
        else {
            clonedTemplate = super.cloneTemplate(templ);
        }
        const slotKeys = grouped.slotKeys;
        for (const key in slotKeys) {
            const slotEl = clonedTemplate.querySelector(`slot-nik[name="${key}"]`);
            if (slotEl === null)
                continue;
            slotEl.pipedChunk = slotKeys[key];
        }
        return clonedTemplate;
    }
    connectedCallback() {
        super.connectedCallback();
        const sr = this.attachShadow({ mode: 'open' });
        sr.innerHTML = "<slot></slot>";
        const slot = sr.firstChild;
        sr.addEventListener('slotchange', e => {
            if (this.groupedLightChildren !== undefined) {
                //console.error('Change to light children ignored'); //TODO?
                return;
            }
            const assignedElements = slot.assignedElements();
            const groupedLightChildren = {
                slotKeys: {}
            };
            const sk = groupedLightChildren.slotKeys;
            for (const lightChild of assignedElements) {
                if (lightChild instanceof TemplModel) {
                    groupedLightChildren.templModel = lightChild;
                }
                else if (lightChild instanceof RefTo) {
                    const slotnik = lightChild.getAttribute('slot-nik') || '';
                    if (sk[slotnik] === undefined) {
                        sk[slotnik] = [];
                    }
                    const ref = lightChild.deref;
                    if (ref !== undefined) {
                        sk[slotnik].push(ref);
                    }
                }
            }
            this.groupedLightChildren = groupedLightChildren;
            this.copy = true;
            slot.addEventListener('element-created', e => {
                const refTo = e.target;
                const slotnik = refTo.getAttribute('slot-nik') || '';
                //TODO:  figure out why this.groupedRange isn't working.
                let ns = this.nextElementSibling;
                while (ns !== null) {
                    let dest;
                    for (const slot of ns.querySelectorAll('slot-nik')) {
                        if (slotnik !== '') {
                            if (slot.getAttribute('name') !== slotnik)
                                continue;
                        }
                        else {
                            if (slot.hasAttribute('name'))
                                continue;
                        }
                        slot.pipedChunk = refTo.deref;
                    }
                    if (ns === this.lastGroupedSibling)
                        break;
                    ns = ns.nextElementSibling;
                }
            });
        });
    }
}
SceaduFæx.is = 'sceadu-fæx';
xc.define(SceaduFæx);
