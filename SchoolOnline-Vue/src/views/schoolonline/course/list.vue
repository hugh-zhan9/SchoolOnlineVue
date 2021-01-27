<template>
  <div class="app-container">

    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseVo.name" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item label="课程分类">
      <el-select v-model="courseVo.level" clearable  placeholder="教师头衔">
        <el-option label="高级讲师" value="1"></el-option>
        <el-option label="首席讲师" value="2"></el-option>
      </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker v-model="courseVo.begin" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="courseVo.end" type="datetime" placeholder="请选择截止时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table  :data="list"
      element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column prop="name" label="教师名称" width="80" />
      
      <el-table-column label="课程父类" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column label="课程子类" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      
      <el-table-column prop="description" label="课程描述" />

      <el-table-column prop="lessonNum" label="课时数" width="70" />

      <el-table-column prop="status" label="状态" width="70" />

      <el-table-column prop="price" label="价格" width="60" />
      
      <el-table-column prop="viewCount" label="浏览数" width="70" />

      <el-table-column prop="buyCount" label="购买数" width="70" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

          <!-- 使用路由的方式直接跳转到页面 -->
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改基本信息</el-button>
          </router-link>
          <router-link :to="'/course/update/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination 
      :current-page="page" 
      :page-size="limit" 
      :total="total" 
      style="padding:30px 0; text-align: center;" 
      layout="total, prev, pager, next, jumper" 
      @current-change="getList"
      />

  </div>
</template>

<script>
import course from '@/api/teacher/teacher'

export default {
  // 写核心代码
  data(){   // 定义变量初始值
    return{
      list:null,
      total:0,
      page:1,
      limit:8,
      courseVo:{}
    }
  },
  created(){
    this.getList();
  },
  methods:{
    // 讲师列表的方法
    getList(page=1){    // 增加参数为了点下一页时出进入下一页
      this.page = page
      course.getCourseListPage(this.page,this.limit,this.courseVo)
      .then(response=>{  // 请求成功response返回的数据
        this.list = response.data.courses
        this.total = response.data.total
      })
      .catch(error=>console.log(error))
    },
    resetData(){
    this.courseVo={}
    this.getList()
    },
    // 删除讲师事件
    removeDataById(id){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          course.deleteCourseById(id)
          .then(response =>{
            this.getList()
            this.$message({
            type: 'success',
            message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
    }

  }
}
</script>