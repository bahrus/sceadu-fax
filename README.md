# sceadu-fæx

## Shadow DOM Facsimile

There's a [promising](https://github.com/WICG/webcomponents/issues/909) proposal that recognizes that the slot mechanism ShadowDOM provides is useful even outside the confines of style encapsulation.

sceadu-fæx is a web component that provides limited support for slotting without using native ShadowDOM -- sticking to light children.  It also does it outside the confines of a traditional web component, where the ShadowDOM is kinda/sorta nested in a kind of parent/child relationship.  So this implementation is definitely not a drop-in "ShadowDOM slotting without ShadowDOM" replacement, as there are significant differences in behavior.

sceadu-fæx extends [xtal-fragment](https://github.com/bahrus/xtal-fragment), and thus inherits its basic syntax.  xtal-fragment lacks ShadowDOM-lite slotting emulation, which is the value-add proposition sceadu-fæx provides.

Perhaps it is best to describe what sceadu-fæx does with an example:

```html
<template id=my-field-category-holder>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot name=label></slot></legend>
  <slot name=field-container></slot>
</fieldset>
</template>

<sceadu-fæx copy from=my-field-category-holder><template>
    <h3 slot=label>My Legend</h3>
    <my-grid slot=field-container></my-grid>
    <my-chart slot=field-container></my-chart>
</template></sceadu-fæx>
```

generates:

```html
<template id=my-field-category-holder>
...
</template>

<sceadu-fæx style=display:none copy from=my-field-category-holder></sceadu-fæx>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot name=label><h3 slot=label>My Legend</h3></slot></legend>
  <slot name=field-container>
    <my-grid slot=field-container></my-grid>
    <my-chart slot=field-container></my-chart>
  </slot>
</fieldset>
```

**NB:**  This component might not play well with other rendering libraries. For a rendering library to be compatible with this component, it must use the following API:

1.  If the contents "owned" by xtal-fragment need to be moved to a new location in the DOM tree, this should be done via newDestination.appendChild($0.extractContents()) where $0 is the instance of xtal-fragment.
2.  The rendering library may need to skip over the owned siblings when updating the DOM, via $0.nextUnownedSibling, where $0 is the instance of xtal-fragment (unless the renderer is aware of the contents of the template xtal-fragment is copying from).

## What happens when the template child of sceadu-fæx gets replaced? [TODO]

If a new template child of sceadu-fæx appears, replacing the old one, it is cloned and the previously slotted content replaced.  This means state/event handlers can be lost.

However, if the tagName matches, and if the method "mergeState" exists on the new element, the old element it is replacing is passed into the method mergeState.  The new element can use this method to transfer state and eventHandlers (well, state anyway). 

## Customizing how slot elements are rendered, Part I [TODO].

The markup:

```html
<sceadu-fæx style=display:none copy from=./my-field-category-holder></sceadu-fæx>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot name=label><h3 slot=label>My Legend</h3></slot></legend>
  <slot name=field-container>
    <my-grid slot=field-container></my-grid>
    <my-chart slot=field-container></my-chart>
  </slot>
</fieldset>
```

Has extra nested components because of the slot elements.  To eliminate that, use "flatten" attribute:

```html
<template id=my-field-category-holder>
<make-fieldset-expandable></make-fieldset-expandable>
<fieldset>
  <legend><slot name=label></slot></legend>
  <slot name=field-container></slot>
</fieldset>
</template>

<sceadu-fæx copy from=./my-field-category-holder flatten>
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

To specify which slots to flatten, use flatten='["field-container"]'

## Customizing how slot elements are rendered, Part II [TODO].

There may be scenarios where we want the slot tag to be converted to some other element (like template).  Use slotMap/slot-map for this.