# sceadu-fæx

## Shadow DOM Facsimile [TODO]

There's a [promising](https://github.com/WICG/webcomponents/issues/909) proposal that recognizes that the slot mechanism ShadowDOM provides is useful even outside the confines of style encapsulation.

sceadu-fæx is a web component that provides limited support for slotting without using native ShadowDOM -- sticking to light children.  It also does it outside the confines of a traditional web component, where the ShadowDOM is kinda/sorta nested in a kind of parent/child relationship.  So this implementation is definitely not a drop-in "ShadowDOM slotting without ShadowDOM" replacement, as there are significant differences in behavior.

sceadu-fæx extends [xtal-fragment](https://github.com/bahrus/xtal-fragment), and thus inherits its basic syntax.  xtal-fragment lacks ShadowDOM-lite slotting emulation, which is the value-add proposition sceadu-fæx provides.

Perhaps it is best to describe what sceadu-fæx does with an example:

```html
<template id=my-field-category-holder>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot-nik name=label>My {{nameOfCategory}}</slot-nik></legend>
  <slot-nik name=field-container></slot-nik>
</fieldset>
</template>

<sceadu-fæx copy from=my-field-category-holder>
    <templ-model name-of-category="First Category"></templ-model>
    <ref-to element=h3 slot=label></ref-to>
    <ref-to element=my-grid slot=field-container></ref-to>
    <ref-to element=my-chart slot=field-container></ref-to>
</sceadu-fæx>
```

generates:

```html
<template id=my-field-category-holder>
...
</template>

<sceadu-fæx style=display:none copy from=my-field-category-holder>
    <templ-model name-of-category="First Category"></templ-model>
    <ref-to element=h3 slot=label></ref-to>
    <ref-to element=my-grid slot=field-container></ref-to>
    <ref-to element=my-chart slot=field-container></ref-to>
</sceadu-fæx>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend>
      <slot-nik name=label style=display:none></slot-nik>
      <h3 slot=label>My First Category</h3>
  </legend>
  <slot-nik name=field-container style=display:none></slot-nik>
  <my-grid slot=field-container></my-grid>
  <my-chart slot=field-container></my-chart>
</fieldset>
```

As we can see, sceadu-fæx works best in conjunction with web component [slot-nik](https://github.com/bahrus/slot-nik).

**NB:**  This component might not play well with other rendering libraries. For a rendering library to be compatible with this component, it must use the following API:

1.  If the contents "grouped" by sceadu-fæx need to be moved to a new location in the DOM tree, this should be done via newDestination.appendChild($0.extractContents()) where $0 is the instance of sceadu-fæx.
2.  The rendering library may need to skip over the owned siblings when updating the DOM, via $0.nextUngroupedSibling, where $0 is the instance of sceadu-fæx (unless the renderer is aware of the contents of the template sceadu-fæx is copying from).

## What happens when the light children change?

1.  If ref-to removed, the element it created is removed.
2.  If ref-to added with a slot attribute, it is appended to the grouped sibling managed for that slot.
3.  Changes to the actual element must be done via refToElement.myElement, if it exists.


