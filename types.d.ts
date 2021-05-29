import {TemplModel} from 'templ-model/templ-model.js';
import {RefTo} from 'ref-to/ref-to.js';

export interface GroupedLightChildren{
    templModel?: TemplModel,
    slotKeys: {[key:string]: Element[]};
}