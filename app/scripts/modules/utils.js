module.exports = {
  // fast node list to array conversion, yes, the object lookup makes it slower
  // but, DRY
  // http://jsperf.com/nodelist-to-array/68
  toArray: function toArray(nl) {
    var arr = [];
    for (var i = 0, ref = arr.length = nl.length; i < ref; i++) {
      arr[i] = nl[i];
    }
    return arr;
  },

  // http://youmightnotneedjquery.com/
  addClass: function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  },

  // http://youmightnotneedjquery.com/
  removeClass: function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },

  hide: function hide(el) {
    el.style.display = 'none';
  },

  show: function show(el) {
    el.style.display = '';
  },

  //Returns true if it is a DOM node
  isNode: function isNode(o){
    return (
      typeof Node === 'object' ? o instanceof Node :
      o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
  },

  //Returns true if it is a DOM element
  isElement: function isElement(o){
    return (
      typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
      o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
    );
  }
};
