/*
redux最核心的管理对象模块
    写法固定
 */
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

import reducers from "./reducers";

// 向外暴露store对象，把异步中间件也写了
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));