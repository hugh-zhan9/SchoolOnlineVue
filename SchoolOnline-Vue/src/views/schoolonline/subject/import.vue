<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/edu/subject/upload'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data(){
        return{
            BASE_API:process.env.BASE_API,
            importBtnDisabled:false,
            OSS_PATH:'https://www.baidu.com',
            loading:false
        }
    },
    created:{

    },
    methods:{
        fileUploadSuccess(){
            if(response===true){
                this.fileUploadBtnText='上传成功'
                this.$message({
                    type:'success',
                    message:response.message
                })
                this.$router.push({path:'/subject/list'})
            }
        },
        fileUploadError(response){
            if(response===false){
                this.fileUploadBtnText='上传失败'
                this.$message({
                    type:'error',
                    message:response.message
                })
            }
        },
        submitUpload(){
            this.fileUploadBtnText="上传中";
            this.importBtnDisabled=true;
            // 原生js：document.getElementById("upload").submit();
            this.$refs.upload.submit()
        }

    }
}
</script>