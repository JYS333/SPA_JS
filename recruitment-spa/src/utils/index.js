/*
包含n个工具函数
 */

// 用户主路由界面路由：
/*
  /boss
  /employee
 */
// 用户信息完善界面路由：
/*
  /bossInfo
  /employeeInfo
 */

// 如何判断是否已经完善信息？ 即判断user.header是否有值
// 如何判断用户类型？ 即看user.uerType的值

export function getDirectTo(userType, header) {
    let path;
    if(userType === 'Employee') {
        path = '/employee';
    } else {
        path = '/boss';
    }

    if(!header) { // 没有header说明是新用户，则跳到完善信息界面
        path += 'Info';
    }

    return path;
}