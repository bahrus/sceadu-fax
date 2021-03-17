# sceadu-fax (sceadu-fæx is the proper spelling)

## Slot emulation without shadow dom

I don't know how doable this is, but here's the plan.  There's a [promising](https://github.com/WICG/webcomponents/issues/909) proposal that would allow this web component to roam free in the wilderness.  In the meantime, the goal of sceadu-fax is to create a facsimile of the shadow from one web component into another


```html
<sceadu-fax template-target-prop=mainTemplate>
  <web-component-outline>
     ⏵ #shadow-root (open)
       <shadow-child-1>
        <slot name=slot1>
      </shadow-child-1>
       <shadow-child-2></shadow-child-2>
    <light-child-1 slot=slot1></light-child-1>
    <light-child-2 slot=slot2></light-child-2>
  </web-component-outline>
  <web-component-implementation></web-component-implementation>
</sceadu-fax> 

```

So the developer would create two web components -- one that accepts light children, and which has a ShadowDOM layer in which the light children get slotted based on native slot implementation.  That web component wouldn't implement any significant logic other than whatever is necessary to generate the desired UI outline.

sceadu-fax finds a way to "serialize" the resulting content projections into a template.  That template is passed to the next sibling.

sceadu-fax works best when working with a web component library that can accept a template as a property that can be passed in, and which is designed to work with templates (rather than JS based UI definitions).  [xtal-element](https://github.com/bahrus/xtal-element) is one such library.

https://stackoverflow.com/questions/37016564/how-to-serialize-an-html-dom-including-shadow-dom