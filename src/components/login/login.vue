<template>
  <div class="login-wrap">
    <!--el-form 回生成form标签 -->
    <el-form  class="login-form"   label-position="top" label-width="80px" :model="userForm">
      <el-form-item label="用户名">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="login">立即登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {saveUserInfo} from '@/assets/js/auth'
export default {
  data () {
    return {
      userForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      // 1 用户登录成功，将token记录到本地存储中
      // 1.1 采集表单数据
      // 1.2 表单验证
      // 1.3 发请求执行登录操作
      // 1.4 根据响应做交互
      // const res = await axios.post('http://localhost:8888/api/private/v1/login', this.userForm)
      const res = await this.$http.post('/login', this.userForm)
      const data = res.data
      if (data.meta.status === 200) {
        // 登录成功，将服务器发给用户的token身份令牌记录到localStarge本地存储
        // window.localStorage.setItem('admin-token', JSON.stringify(data.data))
        // 用户登录成功，调用saveuserInfo()方法 将服务端响应的用户信息对象存储到本地存储
        saveUserInfo(data.data)
        // 导航到home组件
        this.$router.push({
          name: 'home'
        })
        // 给出登录成功的提示信息
        this.$message({
          type: 'success',
          message: '登录成功'
        })
      }
    }
  }
}
</script>
<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
