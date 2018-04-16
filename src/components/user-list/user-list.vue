<template>
    <div class="user-list-wrap">
      <el-row>
        <el-col :span="24">
        <el-breadcrumb class="user-list-breadcrumb" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="user-list-search">
        <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select">
         <el-button
         slot="append"
         icon="el-icon-search"
         @click="handleSearch"></el-button>
        </el-input>
        </el-col>
        <el-col :span="2">
        <el-button
        type="success"
        plain
        @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="100">
        <template slot-scope="scope">
          <!--在这里通过scope.row拿到当前遍历的对象-->
        <el-switch
          v-model="scope.row.mg_state"
          @change="(val) => {handleStateChange(val, scope.row)}"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
        </el-table-column>
        <el-table-column
         label="操作"
         width='200'>
       <template slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
        <el-button size="mini" type="danger" icon="el-icon-edit"></el-button>
       </template>
       </el-table-column>
     </el-table>
        <!--分页组件：每页多大 ：page-size="[1,2,3,4]" 每页大小
        一个多少条记录：total="10"
        分页组件的页码发生改变的时候会自动调用handleCurrentChange
        当用户选择切换页码改变的时候，就会触发handleSizeChange方法
        -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5,8]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
    <!--添加用户对话框表单-->
    <el-dialog
    title="添加用户"
    :visible.sync="dialogFormVisible">
    <!--表单验证
    1.为el-form添加一个rules验证规则配置对象
    2.为el-from-item元素配置prop属性，值是验证对象中对应的字段名称
    用js来做表单验证，需要做：
    1.为el-from增加ref属性给ref起一个名字（类似于给元素起的id）-->
      <el-form
      :model="userForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="userForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="userForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="mobile">
          <el-input v-model="userForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddUser">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<script>
// import {getToken} from '@/assets/js/auth'
export default {
  async created () {
    // 第一次进来的请求分页数据：第1页，每页2条
    this.loadUsersByPage(1)
  },
  data () {
    return {
      searchText: '',
      tableData: [], // 表格列表数据
      totalSize: 0, // 总记录数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 当前每页大小
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false
    }
  },
  methods: {
    async handleSizeChange (pageSize) {
      // console.log('每页大小:', pageSize)
      // 将用户选择的页码大小存储起来
      // 用于页码改变之后，再次点击页码的时候获取最新用户选择的每页大小
      this.pageSize = pageSize
      // 页码发生改变
      // 重新请求列表数据
      // 用户改变每页大小之后，我们请求新的数据，以新的每页大小的第一页为准
      this.loadUsersByPage(1, pageSize)
      // 页码改变之后，不仅让数据到了第1页
      // 同时也要让页码高亮状态也跑到都一页
      this.currentPage = 1
    },
    // 分页组件的页码发生改变的时候会自动调用handleCurrentChange
    // 将currentPage更新为最新点击的页码
    // element插件页码发生改变的时候，不会修改我们的数据currentPage
    async handleCurrentChange (currentPage) {
      // console.log('页码', currentPage)
      this.loadUsersByPage(currentPage)
    },
    // 根据页码加载用户列表数据  // 完成用户列表搜索
    handleSearch () {
      this.loadUsersByPage(1)
    },
    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: { // 请求参数，对象会转换为k=v&k=v的格式，然后拼接到请求路劲? 后面发起请求
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText // 根据搜索文本框的内容来搜索
        }
      })
      console.log(res)
      // 结构赋值 获取data中的数据
      const {users, total} = res.data.data
      this.tableData = users
      // 请求数据成功，我们从服务器得到了总记录
      // 然后把总记录数据交给分页插件来使用
      this.totalSize = total
    },

    /*
    处理用户状态改变
    */

    async handleStateChange (state, user) {
      // 获取用户的id
      const {id: userId} = user
      // 获取Switch开关选中状态state
      const res = await this.$http.put(`users/${userId}/state/${state}`)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${state ? '启用' : '禁用'}成功`
        })
      }
    },

    /* 处理添加用户 */
    async handleAddUser () {
      // 1 获取表单数据
      // 2 表单验证
      // 3 发起请求添加用户
      // 4 根据响应做交互
      // 添加成功，给出提示
      // 关闭对话框
      // 重新加载当前列表数据

      // 表单验证
      this.$refs['addUserForm'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        // 验证通过则执行
        const res = await this.$http.post('/users', this.userForm)
        if (res.data.meta.status === 201) {
        // 添加成功提示信息
          this.$message({
            type: 'success',
            message: '添加用户成功'
          })
          // 关闭对话框
          this.dialogFormVisible = false
          // 重新加载用户列表数据
          this.loadUsersByPage(this.currentPage)
          // 清空表单内容
          for (let key in this.userForm) {
            this.userForm[key] = ''
          }
        }
      })
    }
  }
}
</script>
<style>
.user-list-breadcrumb{
  line-height: 3;
}
.user-list-search{
  margin-bottom: 10px;
}
</style>
