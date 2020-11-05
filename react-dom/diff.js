import { setAttribute, setComponentProps, createComponent } from './index'

export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode);
  if (container) {
    container.appendChild(ret)
  }
  return ret
}


export function diffNode(dom, vnode) {
  let out = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return

  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  if (typeof vnode === 'string') {
    if(dom && dom.nodeType === 3){
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode
      }
    } else {
      // 创建文本节点
      out = document.createTextNode(vnode)
      if(dom && dom.parentNode){
        dom.parentNode.replaceNode(out, dom);
      }
    }
    return out
  }

  if(typeof vnode.tag == 'function'){
    return diffComponent(out, vnode)
  }

  // 非文本 dom 节点
  if(!dom){
    out = document.createElement(vnode.tag)
  }

  if(vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes.length > 0)){
    // 对比组件 或者子节点
    diffChildren(out, vnode.childrens)
  }
  diffAttribute(out, vnode)
  return out
}

function diffChildren(dom, vchildren){
  const domChildren = dom.childNodes
  const children = []
  const keyed = {}
  // 将有key的节点（用对象保存）和 没有key的节点（用数组保存）分开
  if (domChildren.length > 0) {
		domChildren.forEach((c) => {
			if (c.attributes && "key" in c.attributes) keyed[c.attributes["key"]] = c;
			else children.push(c);
		});
  }
  
  if(vchildren && vchildren.length > 0){
    let min = 0;
    let childrenLen = children.length;
    [...vchildren].forEach((vchild, i) => {
      // 获取虚拟DOM中所有的key
      const key = vchild.key
      let child;
      if(key){
        // 如果有key，找到对应key值的节点
        if(keyed[key]){
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if(childrenLen > min){

        // 如果没有key，则优先找类型相同的节点
        for(let j = min; j < childrenLen; j++){
          let c = children[j];
          if(c){
            child = c;
            children[j] = undefined;
            if(j === childrenLen - 1) childrenLen--;
            if(j === min) min++;
            break;
          }
        }
      }

      // 对比
      child = diffNode(child, vchild)
      // 更新dom
      const f = domChildren[i];

      if(child && child !== dom && child !== f){
        // 如果更新前的对应位置为空，是说明此节点是新增的
        if(!f){
          dom.appendChild(child);
          // 如果更新后的节点和更新前对应位置的下一个节点一样
        } else if(child === f.nextSibling){
          removeNode(f)
          // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore用法
          dom.insertBefore(child, f)
        }
      }
    })
  }
}

function diffComponent(dom, vnode){
  let comp = dom
  // 如果组件没有变化，重新设置props
  if(comp && comp.constructor === vnode.tag){
    // 重新设置props
    setComponentProps(comp, vnode.attrs)
    // 复制
    dom = comp.base
  } else {
    // 组件类型发生变化
    if(comp){
      // 移除旧的组件
      unmountComponent(comp)
      comp = null
    }

    // 创建新组件
    comp = createComponent(vnode.tag, vnode.attts) 
    // 设置组件属性
    setComponentProps(comp, vnode.attrs)
    // 给当前组件挂载base
    dom = comp.base
  }
  return dom
}

function unmountComponent(comp){
  removeNode()
}

function removeNode(dom){
  if(dom && dom.parentNode){
    dom.parentNode.removeNode(dom)
  }
}

function diffAttribute(dom, vnode){
  // 保存之前的dom所有的属性
  const oldAttrs = {}
  const newAttrs = vnode.attrs
  // dom 是原有的节点对象 vnode 虚拟DOM
  const domAttrs = [...dom.attributes]
  domAttrs.forEach((item) => {
    oldAttrs[item.name] = item.value
  })
  // 比较
  // 如果原来的属性和新的属性对比，不在新的属性中，则将其移除掉（属性值为undefined）
  for(let key in oldAttrs){
    if(!(key in newAttrs)){
      setAttribute(dom, key, undefined)
    }
  }

  // 更新 class='active'
  for(let key in newAttrs){
    if(oldAttrs[key] !== newAttrs[key]){
      // 值不同，更新值
      setAttribute(dom, key, newAttrs[key])
    }
  }
}