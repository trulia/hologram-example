/*doc
---
title: Scrolly
category: Javascript
name: scrolly
author: August (based on previous work by JD Cantrell and Derek Reynolds)
---

Trigger an event when an element hits the top of the page (+/- an optional offset)


```js_example
$(document).ready(function () {
  $('foo').scrolly();
});
```

## jQuery Plugin: Scrolly

options              | description
---------------------|----------
`offset`             | vertical offset that will determine where on the page the element is (in relation to top of the window) when `scrolly:atSetPoint` event is fired. (default is 0)
**events**           |
 `scrolly:atSetPoint`| Triggered when the element hits top of the window (+/- the offset that was passed in). Listeners will recieve the event and a boolean flag representing the direction the user was scrolling in `true` == scrolling down the page.

*/

(function ($) {

  var scrollData = {};

  var methods = {
    init : function(options) {
      return this.each(function () {
        options = $.extend({
          offset: 0,
        }, options);

        if ($(this).data('scrollyInit') !== true) {
            //Prevent multiple initializations
            $(this).data('scrollyInit', true);

          scrollData.$el = $(this);
          scrollData.position = scrollData.$el.position();
          scrollData.$container = $(window);
          scrollData.offset = options.offset;

          // set callback function for scroll event
          scrollData.$container.on('scroll', methods.scrolly);

          // fire it once to get the page in the right state
          scrollData.$container.triggerHandler('scroll');
        }
      });
    },

    scrolly : function(event) {
      // the element is below the top of the screen (or top - an offset)
      var elBelowScrollPoint = (scrollData.position.top >= scrollData.$container.scrollTop() - scrollData.offset);

      // the element hit our scroll point (scrolling from bottom of page to top)
      // trigger event and set scrolly as having been deactivated
      if (elBelowScrollPoint && scrollData.$el.data('scrolly')) {
        scrollData.$el.data('scrolly', false);
        scrollData.$el.triggerHandler('scrolly:atSetPoint', [false]);
      }
      // the element has moved above the scroll point and we have not yet registered it
      // trigger event and set scrolly as having been activated
      else if (!elBelowScrollPoint && !scrollData.$el.data('scrolly')) {
        console.log('at point');
        scrollData.$el.data('scrolly', true);
        scrollData.$el.triggerHandler('scrolly:atSetPoint', [true]);
      }

    },
  };


  $.fn.scrolly = function (method) {
    if (typeof method === 'string' && typeof methods[method] === 'function')
    {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || ! method)
    {
      return methods.init.apply(this, arguments);
    }
    else
    {
      $.error('Method ' +  method + ' does not exist on jQuery.scrolly');
    }
  }
}(jQuery));

/*doc
---
title: Sticky
category: Javascript
name: sticky
author: August
tested: no where
---

Make an element stick in place on a page. The menu on this page is an example of this.

*Note that this will:*

1. take an element out of the document flow and
2. mess with any inline styles you might have on the element, but you don't do that right? RIGHT?

```js_example
$(document).ready(function () {
  $('.componentMenu').sticky({css: {top: '10px'}, toggleClass: 'foo'});
});
```

## jQuery Plugin: Sticky

options          | description
-----------------|----------
`scrollyOffset`  | An offset parameter that will be passed to the internal call of `$.scrolly()`
`css`            | Any css that you want applied to the element when it is becomes "sticky". Passing a `top` value is a great way to get custom positioning.
`targetEl`       | You can make another element "sticky" when a user scrolls to the element that `$.sticky()` is called on.
`toggleClass`    | Pass a class that will be applied to the element when it becomes sticky. (great for toggling visibility, etc)
*/

(function ($) {
  $.fn.sticky = function (options) {
    options = $.extend({
      scrollyOffset: 0,
      css: {},
      targetEl: null,
      toggleClass: ''
    }, options);

    if ($(this).data('stickyInit') !== true) {
      //Prevent multiple initializations
      $(this).data('stickyInit', true);

      var $targetEl = $(options.targetEl).length ? $(options.targetEl) : $(this);
      var targetElTop = $targetEl.position().top;

      $targetEl.on('scrolly:atSetPoint', function (event, scrollDown) {
        var $el = $(this);
        // apply css when going down the page
        if (scrollDown) {
          $el.css(options.css);
        }
        else {
          $el.removeAttr("style");
        }
        $el.toggleClass('sticky').toggleClass(options.toggleClass);
      });

      // bind scrolly to this element
      $(this).scrolly({offset: options.scrollyOffset});

    }
  };
}(jQuery));
