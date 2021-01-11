/*
选择用户头像的UI组件
 */
import React, {Component} from 'react'
import {List, Grid} from "antd-mobile";
import PropTypes from 'prop-types'


export default class HeaderSelector extends Component {

    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        icon: null
    }

    constructor(props) {
        super(props);
        this.headerList = [];
        for(let i = 0; i < 20; i ++) { // 为了让Grid显示出这个图片数组，要求的格式是text+icon，分别对应文本和路径
            this.headerList.push({
                text: 'Icon'+ (i+1),
                icon: require(`../../assets/imgs/Icon${i+1}.png`)  // 存放路径，不能使用import
            })
        }
    }

    handleClick = (el) => { // 或者写{text, icon}，也就是el，el是个对象,当前点击的那个
        this.setState({
            icon: el.icon
        });
        // 调用函数更新父组件状态
        this.props.setHeader(el.text); // 这个方法是写在父组件里的
    }

    render() {

        const listHeader = this.state.icon ?
            (<div>
                <img src={this.state.icon} />
            </div>)
         : (<div style={{height:'51px'}}><span style={{lineHeight:'51px',verticalAlign:'middle',fontSize:'20px'}}>Selector your icon.</span></div>)
        {/*jsx里写style，所有带-的，都改成驼峰式写法，上面通过line-height改成lineHeight，用老将span标签拉到和div一样大，方便居中*/}

        return (
        <List style={{textAlign:'center'}} renderHeader={() => listHeader}> {/*renderHeader是List组件的方法*/}
            <Grid onClick={this.handleClick} data={this.headerList} columnNum={5}/>
        </List>
        )
    }
}