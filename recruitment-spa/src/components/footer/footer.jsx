import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile';
import {withRouter} from "react-router-dom";

const Item = TabBar.Item;

// 再非路由组件中使用路由库api？
// withRouter()

class Footer extends Component {

    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }

    render () {
        let navList = this.props.navList;
        let unReadCount = this.props.unReadCount;
        // const path = this.props.location.pathname; // 直接写不对，因为Route路由组件才有location，所以要引入withRouter()
        const path = this.props.location.pathname;

        navList = navList.filter((nav) => !nav.hidden); // 只留下hidden为false的, 不能写===false，因为有的没有hidden属性，所以用!取一切不是true的情况

        return (
            <TabBar>
                {
                    navList.map((nav, index) => (
                        <Item key={nav.path}
                              badge={nav.path === '/message' ? unReadCount : 0}
                              title={nav.text}
                              icon={{uri: require(`./images/${nav.icon}.png`)}}
                              selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                              selected={path === nav.path}
                              onPress={() => this.props.history.replace(nav.path)}/>
                    ))
                }
            </TabBar>
        )
    }
}
// 向外暴露withRouter，使用他包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性：history/location/math
export default withRouter(Footer)