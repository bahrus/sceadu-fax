import {XtalFragment, loadFragment} from 'xtal-fragment/xtal-fragment.js';
import {xc, PropAction, PropDefMap} from 'xtal-element/lib/XtalCore.js';
import {TemplModel} from 'templ-model/templ-model.js';
import {RefTo} from 'ref-to/ref-to.js';
import {GroupedLightChildren} from './types.d.js';
import {TemplateInstance} from '@github/template-parts/lib/index.js';
import { group } from 'node:console';

export class SceaduFæx extends XtalFragment{
    static is = 'sceadu-fæx';
    isVisual = true;
    cloneTemplate(templ: HTMLTemplateElement){
        const grouped = this.groupedLightChildren!;
        let clonedTemplate: DocumentFragment;
        if(grouped.templModel !== undefined){
            clonedTemplate = new TemplateInstance(templ, grouped.templModel.value) as DocumentFragment;
            grouped.templModel.templateInstance = clonedTemplate as TemplateInstance;
        }else{
            clonedTemplate = super.cloneTemplate(templ);
        }
        const slotKeys = grouped.slotKeys;
        for(const key in slotKeys){
            const slotEl = clonedTemplate.querySelector(`slot-nik[name="${key}"]`);
            if(slotEl === null) continue;
            (<any>slotEl).pipedChunk = slotKeys[key];
        }       
        return clonedTemplate as DocumentFragment;
    }

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
                    const slotnik = lightChild.getAttribute('slot-nik') || '';
                    if(sk[slotnik] === undefined){
                        sk[slotnik] = [];
                    }
                    sk[slotnik].push(lightChild.deref);
                }
            }
            this.groupedLightChildren = groupedLightChildren;
            this.copy = true;
        });
    }

}


xc.define(SceaduFæx);

