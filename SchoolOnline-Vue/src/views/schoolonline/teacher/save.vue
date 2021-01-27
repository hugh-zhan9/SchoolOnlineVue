<template>
  <div class="app-container">
      <el-form ref="form" :model="teacher" label-width="120px">
  <el-form-item label="讲师名称">
    <el-input v-model="teacher.name"></el-input>
  </el-form-item>
  <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
  <el-form-item label="讲师资历">
    <el-input v-model="teacher.career"></el-input>
  </el-form-item>
  <el-form-item label="讲师头衔">
    <el-select v-model="teacher.level" placeholder="请选择讲师头衔">
      <el-option label="高级讲师" value="1"></el-option>
      <el-option label="首席讲师" value="2"></el-option>
    </el-select>
  </el-form-item>

  <!-- todo 讲师头像 -->
  <!-- 讲师头像 -->
  <el-form-item label="讲师头像">
    <!-- 头衔缩略图 -->
    <pan-thumb :image="teacher.avatar"/>
    <!-- 文件上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
    </el-button>
    <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 -->
    <image-cropper v-show="imagecropperShow"
      :width="300"
      :height="300"
      :key="imagecropperKey"
      :url="BASE_API+'/edu/fileOss/upload'"
      field="file" @close="close()"
      @crop-upload-success="cropSuccess"/>
</el-form-item>



  <el-form-item label="讲师简介">
    <el-input type="textarea" v-model="teacher.intro" :rows="10"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保 存</el-button>
    <el-button>取 消</el-button>
  </el-form-item>
</el-form>
  </div>
</template>


<script>

import teacher from '@/api/teacher/teacher';
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

  export default {
    components: { ImageCropper, PanThumb },   // 组件申明
    data() {
      return {
        teacher: {
          level:'1',
          sort:'0'
        },
        saveBtnDisabled: false, // 保存按钮是否禁用
        imagecropperShow:false,
        imagecropperKey:0,
        BASE_API:process.env.BASE_API
      }
    },
    created(){
      this.init();
    },
    watch:{   //使用监听来解决路由切换问题（页面切换了之前页面的数据依然存在）
      $route(to,from){
        this.init()
      }
    },
    methods: {
      init(){
        if(this.$route.params && this.$route.params.id){
          const id = this.$route.params.id
          console.log(id)
          this.getInfo(id)
        }else{
          this.teacher = {}
        }
      },
      saveOrUpdate() {
        this.saveBtnDisabled = true
        if(this.teacher.id){
          this.update();
        }else{
          this.save();
        }
      },
      save(){
        teacher.saveTeacher(this.teacher)
        .then(response =>{
          this.$message({
            type:'success',
            message:'保存成功！'
          })
        this.$router.push({path:'/teacher/table'})
        })
        .catch(error=>{
          this.$message({
            type:'error',
            message:'保存失败'
          })
          this.saveBtnDisabled=false;
        })
      },
      update(){
        teacher.updateTeacher(this.teacher)
        .then(response=>{
          this.$message({
            type:'success',
            message:'更新成功！'
        })
      this.$router.push({path:'/teacher/table'})
        })
        .catch(error=>{
          this.$message({
            type:'error',
            message:'更新失败'
          })
        })
      },
      getInfo(id){
        teacher.getTeacherById(id)
        .then(response=>{
          this.teacher = response.data.teacher
        })
      },
      cropSuccess(data){
        this.imagecropperShow=false
        this.teacher.avatar=data.url
        this.imagecropperKey + 1
      },
      close(){
        this.imagecropperShow=false
        this.imagecropperKey + 1
      }

    }
  }
</script>