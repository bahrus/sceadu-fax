# sceadu-fæx

## Shadow DOM Facsimile

There's a [promising](https://github.com/WICG/webcomponents/issues/909) proposal that recognizes that the slot mechanism ShadowDOM provides is useful even outside the confines of style encapsulation.

sceadu-fæx is a web component that provides limited support for slotting without using native ShadowDOM.  It also does it outside the confines of a traditional web component, where the ShadowDOM is kinda/sorta nested in a kind of parent/child relationship.

Perhaps it is best to explain sceadu-fæx with an example:

```html
<template id=my-field-category-holder>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot name=label></slot></legend>
  <slot name=field-container></slot>
</fieldset>
</template>

<sceadu-fæx copy from=./my-field-category-holder>
  <template>
    <h3 slot=label>My Legend</h3>
    <my-grid slot=field-container></my-grid>
    <my-chart slot=field-container></my-chart>
  </template>
</sceadu-fæx>
```

generates:

```html
<sceadu-fæx style=display:none copy from=./my-field-category-holder></sceadu-fæx>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><h3 slot=label>My Legend</h3></legend>
  <my-grid slot=field-container></my-grid>
  <my-chart slot=field-container></my-chart>
</fieldset>
```

**NB:**  This component might not play well with other rendering libraries. For a rendering library to be compatible with this component, it must use the following API:

1.  If the contents "owned" by xtal-fragment need to be moved to a new location in the DOM tree, this should be done via newDestination.appendChild($0.extractContents()) where $0 is the instance of xtal-fragment.
2.  The rendering library may need to skip over the owned siblings when updating the DOM, via $0.nextUnownedSibling, where $0 is the instance of xtal-fragment (unless the renderer is aware of the contents of the template xtal-fragment is copying from).