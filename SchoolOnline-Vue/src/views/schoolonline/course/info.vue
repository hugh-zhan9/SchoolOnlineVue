<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">
    <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>
  <!-- 所属分类 TODO -->
  <!-- 所属分类：级联下拉列表 -->
  <!-- 一级分类 -->
  <el-form-item label="课程类别">
    <el-select
      v-model="courseInfo.subjectParentId"
      placeholder="请选择" @change="subjectLevelOneChanged">
      <el-option
        v-for="subject in subjectNestedList"
        :key="subject.value"
        :label="subject.label"
        :value="subject.id"/>
      </el-select>
      <!-- 二级分类 -->
      <el-select v-model="courseInfo.subjectId" placeholder="请选择">
        <el-option
        v-for="subject in subSubjectList"
        :key="subject.value"
        :label="subject.label"
        :value="subject.id"/>
      </el-select>
  </el-form-item>
  
  <!-- 课程讲师 TODO -->
  <el-form-item label="课程讲师">
    <el-select
      v-model="courseInfo.teacherId"
      placeholder="请选择" >
      <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
      </el-select>
  </el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>
  <!-- 课程简介-->
  <el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
  </el-form-item>
  <!-- 课程封面-->
  <el-form-item label="课程封面">
    <el-upload
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :action="BASE_API+'/edu/fileOss/upload'"
      class="avatar-uploader">
      <img :src="courseInfo.cover">
    </el-upload>
  </el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>
</el-form>

    <el-form label-width="120px">

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped>
.tinymce-container {
  line-height:29px;
}
</style>


<script>

import course from '@/api/teacher/teacher';
import Tinymce from '@/components/Tinymce';   //引入组件


export default {
  components: { Tinymce },  // 申明组件
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo:{  // 这里最好还是给出初始值
        title: '',
        subjectId: '',//二级分类id
        subjectParentId:'',//一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/01.jpg',
        price: 0
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      subjectNestedList:[],
      subSubjectList:[],
      teacherList:[]
    }
  },
  created() {
    this.init()
  },
  watch:{   //使用监听来解决路由切换问题（页面切换了之前页面的数据依然存在）
    $route(to,from){
      this.init()
    }
  },
  methods: {
    // 根据课程获取二级分类
    getCourseById(){
      this.id = this.$route.params.id
      course.getCourseById(this.id)
      .then(response=>{
        this.courseInfo = response.data.course
        // 解决不显示二级分类问题
        for(var i =0; i<this.subjectNestedList.length; i++){
          var oneSubject = this.subjectNestedList[i]
          if(this.courseInfo.subjectParentId==oneSubject.id){
            this.subSubjectList=oneSubject.children;
          }
        }
      })
    },
    // 整体初始化操作
    init(){
      this.initSubjectList()
      this.initTeacherList()
      if(this.$route.params.id===':id'){
        this.initCourseInfo()
      }else{
        this.getCourseById()
      }
    },
    // 初始化课程信息
    initCourseInfo(){
      this.courseInfo.title= '',
      this.courseInfo.subjectId= '',
      this.courseInfo.subjectParentId='',
      this.courseInfo.teacherId= '',
      this.courseInfo.lessonNum= 0,
      // 不知道为什么这里清不掉
      this.courseInfo.description= '',
      this.courseInfo.cover= '/static/01.jpg',
      this.courseInfo.price=0
      this.subSubjectList=''
    },
    // 初始化分类列表
    initSubjectList(){
      course.getNestedTreeList()
      .then(response=>{
        this.subjectNestedList=response.data.subject
      })
    },
    // 初始化教师下拉列表
    initTeacherList(){
      course.getAllTeacher().then(response=>{
        this.teacherList=response.data.items
      })
    },
    // 保存并下一步
    next(){
      if(this.$route.params.id===':id'){
        course.saveAndNext(this.courseInfo)
        .then(response=>{
          this.$router.push({path: '/course/update/'+response.data.id
        })
        this.$message({
          type:'success',
          message:'保存成功',
        })
      })
      }else{
        // 执行修改操作
        course.saveCourseById(this.$route.params.id,this.courseInfo)
        .then(response=>{
          this.$router.push({path: '/course/update/'+this.$route.params.id
          })
          this.$message({
            type:'success',
            message:'修改成功',
          })
        })
      }
    },
    // 一级标题更改
    subjectLevelOneChanged(value){
      this.courseInfo.subjectId='';
      for(let i = 0; i<this.subjectNestedList.length;i++) {
        if(this.subjectNestedList[i].id==value){
          this.subSubjectList = this.subjectNestedList[i].children
          this.courseInfo.subjectId='';
        }
      }
    },
    // 图片上传成功之后赋值url
    handleAvatarSuccess(response, file){
      this.courseInfo.cover = response.data.url
    },
    // 页面上传之前执行的检验操作
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  
  },
}
</script>