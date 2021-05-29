import {XtalFragment, loadFragment} from 'xtal-fragment/xtal-fragment.js';
import {xc, PropAction, PropDefMap} from 'xtal-element/lib/XtalCore.js';
import {TemplModel} from 'templ-model/templ-model.js';
import {RefTo} from 'ref-to/ref-to.js';
import {GroupedLightChildren} from './types.d.js';
import { group } from 'node:console';

export class SceaduFæx extends XtalFragment{
    static is = 'sceadu-fæx';
    isVisual = true;
    //propActions = propActions;
    clonedTemplateCallback(clonedTemplate: DocumentFragment){
        // super.clonedTemplateCallback(clonedTemplate);
        // const clonedLightTemplate = this.lightTemplate!.content.cloneNode(true) as DocumentFragment;
        // const slotKeys: {[key:string]: HTMLElement[]} = {};
        // clonedLightTemplate.querySelectorAll('[slot]').forEach(el => {
        //     const slot = el.getAttribute('slot')!;
        //     if(slotKeys[slot] === undefined){
        //         slotKeys[slot] = [];
        //     }
        //     slotKeys[slot].push(el as HTMLElement);
        // });
        // for(const key in slotKeys){
        //     const slotEl = clonedTemplate.querySelector(`slot-nik[name="${key}"]`);
        //     if(slotEl === null) continue;
        //     (<any>slotEl).pipedChunk = slotKeys[key];
        //     //slotEl?.append(...slotKeys[key]);
        // }

    };
    groupedLightChildren: GroupedLightChildren | undefined;
    connectedCallback(){
        super.connectedCallback();
        const sr = this.attachShadow({mode:'open'});
        sr.innerHTML = "<slot></slot>";
        const slot = sr.firstChild as HTMLSlotElement;
        sr.addEventListener('slotchange', e => {
            if(this.groupedLightChildren !== undefined){
                console.error('Change to light children ignored'); //TODO?
            }
            const assignedElements = slot.assignedElements();
            const groupedLightChildren = {
                slotKeys: {}
            } as GroupedLightChildren;
            const sk = groupedLightChildren.slotKeys;
            for(const lightChild of assignedElements){
                if(lightChild instanceof TemplModel){
                    groupedLightChildren.templModel = lightChild;
                }else if(lightChild instanceof RefTo){
                    const slot = lightChild.getAttribute('slot') || '';
                    if(sk[slot] === undefined){
                        sk[slot] = [];
                    }
                    sk[slot].push(lightChild);
                }
            }
            this.groupedLightChildren = groupedLightChildren;
            this.copy = true;
        });
    }

}
// export const loadFragmentWithSlots = ({copy, from, self}: SceaduFæx) => {
//     loadFragment(self);
// };
//const propActions = [loadFragmentWithSlots] as PropAction[];
const propDefMap: PropDefMap<SceaduFæx> = {
    groupedLightChildren: {
        type: Object,
        async: true,
        dry: true,
        stopReactionsIfFalsy: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(SceaduFæx, slicedPropDefs, 'onPropChange');
xc.define(SceaduFæx);

