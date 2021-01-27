import request from '@/utils/request'

// export function login(username, password) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }

export default{
    deleteCourseById(id){
        return request({
            url:`/edu/course/delete/${id}`,
            method:'delete'
        })
    },
    saveCourseById(id,courseVo){
        return request({
            url:`/edu/course/saveCourse/${id}`,
            method:'post',
            data:courseVo
        })
    },
    getCourseById(id){
        return request({
            url:`/edu/course/getCourse/${id}`,
            method:'get'
        })
    },
    // 讲师列表
    getTeacherListPage(current,limit,teacherVo){
        return request({
            url:`/edu/teacher/pageTeacherByCondition/${current}/${limit}`,
            //url: 'edu/teacher/pageTeacher/'+current+'/'+limit,
            method: 'post',
            // params 直接传递参数，data使用json格式传递参数
            data: teacherVo
        })
    },
    removeDataById(id){
        return request({
            url:`/edu/teacher/${id}`,
            method:"delete"
        })
    },
    saveTeacher(teacher){
        return request({
            url:"/edu/teacher/saveTeacher",
            method:"post",
            data:teacher
        })
    },
    getTeacherById(id){
        return request({
        url:`/edu/teacher/getTeacher/${id}`,
        method:'get'
        })
    },
    updateTeacher(teacher){
        return request({
            url:`/edu/teacher/updateTeacher`,
            method:'post',
            data:teacher
        })
    },
    getAllSubject(){
        return request({
            url:`/edu/subject/getAll`,
            method:'get',
        })
    },
    saveAndNext(courseInfo){
        return request({
            url:`/edu/course/save`,
            method:'post',
            data:courseInfo
        })
    },
    getAllTeacher(){
        return request({
            url:`/edu/teacher/findAll`,
            method:'get',
        })
    },
    getNestedTreeList(){
        return request({
            url:`/edu/subject/getAll`,
            method:'get',
        })
    },
    getChapterAndVideo(id){
        return request({
            url:`/edu/chapter/getChapters/${id}`,
            method:'get'
        })
    },
    saveChapter(id,chapter){
        return request({
            url:`/edu/chapter/saveChapter/${id}`,
            method:'post',
            data:chapter
        })
    },
    deleteChapterById(id){
        return request({
            url:`/edu/chapter/deleteChapter/${id}`,
            method:'delete'
        })
    },
    updateChpter(chapter){
        return request({
            url:`/edu/chapter/updateChapter`,
            method:'post',
            data:chapter
        })
    },
    getChapterById(id){
        return request({
            url:`/edu/chapter/getChapter/${id}`,
            method:'get'
        })
    },
    addVideo(video){
        return request({
            url:`/edu/video/addVideo`,
            method:'post',
            data:video
        })
    },
    deleteChapterVideoById(id){
        return request({
            url:`/edu/video/deleteVideo/${id}`,
            method:'delete',
        })
    },
    updateVideo(video){
        return request({
            url:`/edu/video/updateVideo`,
            method:'post',
            data:video
        })
    },
    getVideoById(id){
        return request({
            url:`/edu/video/getVideo/${id}`,
            method:'get'
        })
    },
    getCoursePublish(id){
        return request({
            url:`/edu/course/getPublish/${id}`,
            method:"get"
        })
    },
    publishCourse(id){
        return request({
            url:`/edu/course/updateState/${id}`,
            method:'post'
        })
    },
    getCourseListPage(current,limit,courseVo){
        return request({
            url:`/edu/course/pageCourse/${current}/${limit}`,
            method: 'post',
            data: courseVo
        })
    },
    deleteVideoById(id){
        return request({
            url:`/edu/vodControl/delete/${id}`,
            method:'delete',
        })
    }



}