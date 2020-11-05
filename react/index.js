import Component from '../component'

function createElement(tag, attrs, ...childrens){
  let newattrs = attrs || {}
  return {
    tag,
    attrs,
    childrens,
    key: newattrs.key || undefined
  }
}

export default {
  createElement,
  Component
}