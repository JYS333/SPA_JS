/*
能发送ajax请求的函数模块
函数的返回值是promise对象
 */

import axios from 'axios'

export default function ajax(url, data={}, type='GET') {
    if(type === 'GET') {

        // url?username=Tom&password=123
        let paramStr = '';
        Object.keys(data).forEach(key => { // Object的key方法，得到对象的数组形式,再对数组遍历
            paramStr += key + '=' + data[key] + '&'; // 最后会多出来一个 &
        });
        // 这里再截一下
        if(paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1);
        }
        // 最后拼出发送的请求url
        return axios.get(url+ '?' + paramStr);
    } else if(type === 'POST') {
        return axios.post(url, data);
    } else {
        console.log('ajax error');
    }

}

