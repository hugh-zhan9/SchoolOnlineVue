import request from '@/utils/request'

export default {
    //查询前两条banner数据
  getListBanner() {
    return request({
      url: '/cms/banner/getAllBanner',
      method: 'get'
    })
  },
  // 获取热门课程和名师
  getTeacherAndCourse(){
    return request({
      url:'/edu/frontData/getData',
      method:'get'
    })
  },
  // 获取短信验证码
  getMobile(phoneNumber){
    return request({
      url:`/edu/msm/getMsm/${phoneNumber}`,
      method:'get',
    })
  },
  // 用户注册
  submitRegister(registerVo) {
    return request({
      url: `/api/ucenter/register`,
      method: 'post',
      data: registerVo
    })
  },
  // 用户登录
  submitLogin(member) {
    return request({
      url: `/api/ucenter/login`,
      method: 'post',
      data: member
    })
  },
  // 根据Token获取用户信息
  getLoginInfo() {
    return request({
      url: `/api/ucenter/getMemberInfo`,
      method: 'get',
    })
  },
  // 分页显示讲师列表
  getTeacherList(current,limit){
    return request({
      url:`/edu/frontData/getTeacher/${current}/${limit}`,
      method:'get'
    })
  },
  getTeacherAbout(id){
    return request({
      url:`/edu/frontData/getTeacher/${id}`,
      method:'get'
    })
  },
  getCourseAbout(id){
    return request({
      url:`/edu/frontData/getCourse/${id}`,
      method:'get'
    })
  },
  getCourseList(current,limit,courseFrontVo){
    return request({
      url:`/edu/frontData/getCourse/${current}/${limit}`,
      method:'post',
      data: courseFrontVo
    })
  },
  getAllSubject(){
    return request({
      url: `edu/subject/getAll`,
      method:'get'
    })
  },
  getVideoAuth(id){
    return request({
      url:`edu/vodControl/getPlayAuth/${id}`,
      method:'get'
    })
  },
  // ************************ 订单业务  **************************
  createOrder(courseId){
    return request({
      url:`edu/order/createOrder/${courseId}`,
      method:'post'
    })
  },
  getOrderInfo(orderNo){
    return request({
      url:`edu/order/getOrderInfo/${orderNo}`,
      method:'get'
    })
  },
  // *********************** 支付业务 **********************************
  createNative(orderNo){
    return request({
      url:`edu/pay-log/getNative/${orderNo}`,
      method:'get'
    })
  },
  getPayStatus(orderNo){
    return request({
      url:`edu/pay-log/getPayStatus/${orderNo}`,
      method:'get'
    })
  }

}