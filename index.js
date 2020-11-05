
import React from './react'
import ReactDom from './react-dom'
const ele = (
  <div className="active" title="123">hello, <span>react</span></div>
)

// ReactDom.render('react', document.querySelector('#app'))
// ReactDom.render(ele, document.querySelector('#app'))
// 两个问题
// 1. 为什么ReactDom.render必须引入React
// 2. 组件：类组件和函数组件

// function Home(){
//   return (
//     <div className="active" title="123">hello, <span>react</span></div>
//   )
// }

class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      num: 0
    }
  }

  componentWillMount(){
    console.log('组件将要加载');
  }

  componentWillReceiveProps(props){
    console.log('props');
  }

  componentDidMount(){
    console.log('组件加载完成');
    for(let i = 0; i < 10; i++){
      this.setState({
        num: i
      })
      console.log(this.state.num);
    }
  }

  componentWillUpdate(){
    console.log('组件将要更新');
  }

  componentDidUpdate(){
    console.log('组件更新完成');
  }

  componentWillUnMount(){
    console.log('组件卸载完成');
  }
  
  handleClick(){
    this.setState({
      num: this.state.num + 1
    })
  }

  render(){
    let { num } = this.state
    return (
      <div className="active" title="123">
        <span>{num}</span>
        <button onClick={this.handleClick.bind(this)}>摸我</button>
      </div>
    )
  }
}
ReactDom.render(<Home name="title"/>, document.querySelector('#app'))