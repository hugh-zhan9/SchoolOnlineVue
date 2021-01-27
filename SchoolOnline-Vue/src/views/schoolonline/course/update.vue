<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- 章节 --> 
    <ul class="chanpterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <p>
          {{ chapter.label }}
          <span class="acts">
            <el-button type="text" @click="addVideo(chapter.id)">添加小节</el-button>
            <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>{{ video.label }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="delteVideoById(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

          
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/edu/vodControl/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
    </div>
    </el-form>
  </div>
</template>


<script>

import chapter from '@/api/teacher/teacher';

export default {
  data() {
    return {
      saveVideoBtnDisabled:false,
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterList:{},
      id:"",
      dialogChapterFormVisible:false,
      dialogVideoFormVisible:false,
      chapter:{
        id:'',
        title:'',
        sort:'',
      },
      video:{
        isFree:'',
        videoSourceId:'',
        chapterId:'',
        courseId:'',
      },
      BASE_API:process.env.BASE_API,
      fileList: [],

    }
  },
  created() {
    if(this.$route.params && this.$route.params.id){
        this.id = this.$route.params.id
        this.getChapterAndVideo()
      }
    
  },
  methods: {
    // ===============视频上传==========
    // 视频上传成功执行操作
    handleVodUploadSuccess(response,file,fileList){
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    // 视频删除按钮操作
    handleVodRemove(){
      chapter.deleteVideoById(this.video.videoSourceId).then(response=>{
        this.$message({
          type:'success',
          message:"删除成功"
        })
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
      })
    },
    // 视频删除之前执行操作
    beforeVodRemove(file, fileList){
      return this.$confirm(`确定移除${file.name}？`)
    },
    // 视频上传之后
    handleUploadExceed(){
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },


    // 新增小节
    addVideo(chapterId){
      this.dialogVideoFormVisible = true;
      this.video.chapterId = chapterId
    },
    // 删除小节
    delteVideoById(id){
      this.$confirm('此操作将删除该小节，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(response=>{
        chapter.deleteChapterVideoById(id)
        .then(response=>{
          // 刷新列表
          this.getChapterAndVideo()
          // 返回消息
          this.$message({
            type:"success",
            message:response.message
          })
        })
      })
    },
    // 修改小节
    editVideo(id){
      chapter.getVideoById(id).then(response=>{this.video = response.data.video})
      this.dialogVideoFormVisible = true;
    },
    // 保存
    saveOrUpdateVideo(){
      if(this.video.id==null){
        this.video.courseId=this.$route.params.id
        console.log(this.video)
        chapter.addVideo(this.video)
          .then(response=>{
            this.getChapterAndVideo(); 
            this.dialogVideoFormVisible = false
            this.$message({
              type:'success',
              message:'新增小节成功'
            })
            this.video={},
            this.fileList=[]
          })
      }else{
        // 修改小节
        chapter.updateVideo(this.video)
          .then(response=>{
            this.getChapterAndVideo(); 
            this.dialogVideoFormVisible = false
            this.$message({
              type:'success',
              message:'修改小节成功'
            })
            this.video=''
          })
      }
      
    },
    
    

    //  =============================================章节操作===================================

    // 修改章节按钮
    editChapter(id){
      chapter.getChapterById(id)
      .then(response=>{
        this.chapter=response.data.chapter
        // 打开编辑区
        this.dialogChapterFormVisible = true
      })
    },
    // 删除章节
    deleteChapter(id){
      this.$confirm('此操作将删除该章节，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(response=>{
        chapter.deleteChapterById(id)
        .then(response=>{
          // 刷新列表
          this.getChapterAndVideo()
          // 返回消息
          this.$message({
            type:"success",
            message:response.message
          })
        })
      })
    },
    // 删除小节
    deleteVideo(){},
    // 刷新页面，获取所有章节和小节
    getChapterAndVideo(){
      chapter.getChapterAndVideo(this.id)
      .then(response =>{
        this.chapterList = response.data.chapter
      })
    },
    // 上一步按钮
    previous() {
      this.$router.push({ path: '/course/info/'+this.id })
    },
    // 下一步按钮
    next() {
      this.$router.push({ path: '/course/publish/'+this.id })
    },
    // 新建和保存修改按钮
    saveOrUpdate(){
      console.log(this.chapter.id)
      if(this.chapter.id==''){ // save
        chapter.saveChapter(this.$route.params.id,this.chapter)
      .then(response=>{
        // 关闭弹窗
        this.dialogChapterFormVisible=false;
        // 清空
        this.chapter=""
        // 显示提示信息
        this.$message({
          type:"success",
          message:"添加章节成功"
        })
        // 刷新列表
        this.getChapterAndVideo();        
      })
      } else { //update
        chapter.updateChpter(this.chapter).then(response=>{
          // 刷新列表
        this.getChapterAndVideo();
        // 关闭弹窗
        this.dialogChapterFormVisible=false;
        // 清空
        this.chapter=""
        // 显示提示信息
        this.$message({
          type:"success",
          message:"修改章节成功"
        })
        })
      }
    },
  }
}
</script>


<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>

