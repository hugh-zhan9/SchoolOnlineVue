<template>
  <div class="app-container">

    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="教师名称">
        <el-input v-model="teacherVo.name" placeholder="教师名称"></el-input>
      </el-form-item>
      <el-form-item label="教师头衔">
      <el-select v-model="teacherVo.level" clearable  placeholder="教师头衔">
        <el-option label="高级讲师" value="1"></el-option>
        <el-option label="首席讲师" value="2"></el-option>
      </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker v-model="teacherVo.begin" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="teacherVo.end" type="datetime" placeholder="请选择截止时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list"
      element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />
      
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      
      <el-table-column prop="intro" label="资历" />
      
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      
      <el-table-column prop="sort" label="排序" width="60" />
      
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">

          <!-- 使用路由的方式直接跳转到页面 -->
          <router-link :to="'/teacher/update/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
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
import teacher from '@/api/teacher/teacher'

export default {
  // 写核心代码
  data(){   // 定义变量初始值
    return{
      list:null,
      total:0,
      page:1,
      limit:4,
      teacherVo:{}
    }
  },
  created(){
    this.getList();
  },
  methods:{
    // 讲师列表的方法
    getList(page=1){    // 增加参数为了点下一页时出进入下一页
      this.page = page
      teacher.getTeacherListPage(this.page,this.limit,this.teacherVo)
      .then(response=>{  // 请求成功response返回的数据
        this.list = response.data.list
        this.total = response.data.total
        console.log(this.list)
        console.log(this.total)
      })
      .catch(error=>console.log(error))
    },
    resetData(){
    this.teacherVo={}
    this.getList()
    },
    // 删除讲师事件
    removeDataById(id){
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacher.removeDataById(id)
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