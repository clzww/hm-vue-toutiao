<template>
  <div class="login">
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>

    <van-form @submit="onSubmit">
      <van-field v-model="username" label="用户名" placeholder="请输入用户名/手机号" :rules="rules.username" />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <div style="margin:16px">
        <!-- 原生 button 标签的 type 属性 -->
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

    <p class="tips">
      没有账号？去
      <router-link to="/register">注册</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          {
            pattern: /^\d{5,11}$/,
            message: '用户名只能是5-11位数字',
            trigger: 'onChange'
          }
        ],
        password: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'onChange'
          },
          {
            pattern: /^\w{3,9}$/,
            message: '用户，密码只能是3-9位',
            trigger: 'onChange'
          }
        ]
      }
    }
  },
  created() {
    // 如果是params传参，就不能使用path，需要使用name
    const { username, password } = this.$route.params
    this.username = username
    this.password = password
  },
  methods: {
    async onSubmit() {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        // 调用消息提示组件
        this.$toast.success(message)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
        if (this.$route.query.back) {
          this.$router.back()
        } else {
          this.$router.push('/user')
        }
        // 如果需要回跳，登录执行back(),如果不需要回跳，登录成功跳转到个人中心，因为注册成功跳到登录页，执行back()之后，又会跳到注册页面
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .tips {
    font-size: 14px;
    text-align: right;
    padding-right: 20px;
    a {
      color: orange;
    }
  }
}
</style>
