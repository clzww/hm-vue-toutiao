<template>
  <div class="post-detail">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <span v-if="post.has_follow" class="followed" @click="unfollow">已关注</span>
        <span v-else class="follow" @click="follow">关注</span>
      </div>
    </div>
    <div class="content">
      <div class="title">{{post.title}}</div>
      <div class="user">
        <span>{{post.user.nickname}}</span>
        <span>{{post.create_date | time}}</span>
      </div>
      <div v-if="post.type === 1" class="info" v-html="post.content"></div>
      <video v-else :src="post.content" controls loop></video>
      <div class="btns">
        <div class="good" :class="{active:post.has_like}" @click="like">
          <span class="iconfont icondianzan"></span>
          <span>{{post.like_length}}</span>
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>
    <div class="comment">
      <h3>精彩跟帖</h3>
      <div class="list">
        <hm-comment v-for="item in list" :key="item.id" :comment="item"></hm-comment>
        <!-- postdetail父组件传评论值到hmcomment组件中 -->
      </div>
    </div>
    <div class="footer">
      <div class="input" v-if="!isShowTextArea">
        <input type="text" placeholder="写跟帖" @focus="focus" />
        <span class="iconfont iconpinglun-">
          <div class="badge">{{post.comment_length}}</div>
        </span>
        <span class="iconfont iconshoucang" :class="{active:post.has_star}" @click="star"></span>
        <span class="iconfont iconfenxiang"></span>
      </div>
      <div v-else class="textarea">
        <textarea :placeholder="'回复：'+replyName" ref="textarea" @blur="blur" v-model="content"></textarea>
        <span @click="send">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data() {
    return {
      post: {
        user: {}
      },
      // //   {{post.user.nickname}}
      // 获取到请求的数据之前，页面已经渲染好了，此时post为空，获取到的数据为undifined，但是如果在输出其中的属性，则会报错，需要事先给一个空对象，则不会报错
      list: [],
      // 是否显示textArea
      isShowTextArea: false,
      // 评论的内容
      content: '',
      replyName: '',
      replyId: ''
    }
  },
  created() {
    this.getPostInfo()
    this.getCommentList()

    // 给bus注册事件
    // 使用bus实现多级组件通讯
    // 评论组件或者楼层组件中触发
    this.$bus.$on('reply', (name, id) => {
      this.replyName = name
      this.replyId = id
      this.isShowTextArea = true
      this.$nextTick(() => {
        this.$refs.textarea.focus()
      })
    })
  },
  methods: {
    async getPostInfo() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        console.log(this.post)
      }
    },
    async follow() {
      // 判断该用户是否登录
      // 如果没有登录，跳转到登录页面
      // 如果登录了，发送ajax请求关注即可

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          await this.$dialog.confirm({
            title: '温馨提示',
            message: '只有登录的用户才能关注，是否登录？'
          })
          localStorage.setItem('backUrl', this.$route.path)
          this.$router.push({
            path: '/login'
          })
          return
        }
        // 发送ajax请求
        const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          // 重新渲染
          this.getPostInfo()
        }
      } catch {
        this.$toast('继续浏览')
      }
    },
    async unfollow() {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostInfo()
      }
    },
    async like() {
      const token = localStorage.getItem('token')
      if (!token) {
        localStorage.setItem('backUrl', this.$route.path)
        this.$router.push({
          path: '/login'
        })
        return
      }
      // 登录了,点赞功能
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostInfo()
      }
    },
    async star() {
      const token = localStorage.getItem('token')
      if (!token) {
        localStorage.setItem('backUrl', this.$route.path)
        this.$router.push({
          path: '/login'
        })
        return
      }
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getPostInfo()
      }
    },
    async getCommentList() {
      const res = await this.$axios.get(
        `/post_comment/${this.$route.params.id}`
      )
      console.log(this.$route.params)

      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    async focus() {
      this.isShowTextArea = true
      // 让textarea自动获取焦点
      // 修改完数据，等待DOM更新
      await this.$nextTick()
      // ref: 引用  ref可以给一个DOM元素或者一个组件添加 <div ref="aa">123</div> <demo ref="bb"></demo>
      // 可以通过 this.$refs可以获取到当前组件中所有的引用
      this.$refs.textarea.focus()
    },
    blur() {
      if (!this.content) {
        this.isShowTextArea = false
      }
    },
    async send() {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.getCommentList()
        this.getPostInfo()
        // 此时刷新文章信息方法，是为了防止服务器上的文章信息有更新，所以需要重新调用一次
        this.isShowTextArea = false
        this.$toast.success('添加评论成功')

        // 清空原来的评论的内容
        this.content = ''
        this.replyId = ''
        this.replyName = ''
      }
    },
    async reply(name, id) {
      this.isShowTextArea = true
      // 修改完数据，等待DOM更新
      await this.$nextTick()
      this.$refs.textarea.focus()
    }
  }
}
</script>

<style lang="less" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
  height: 40px;
  line-height: 40px;
  display: flex;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
  .left {
    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 60px;
    }
  }
  .right {
    font-size: 12px;
    span {
      display: inline-block;
      line-height: 20px;
      height: 20px;
      padding: 0 15px;
      border-radius: 15px;
    }
    .follow {
      background-color: red;
      color: #fff;
    }
    .followed {
      color: #333;
      border: 1px solid #ccc;
    }
  }
}
.content {
  border-bottom: 3px solid #ccc;
  padding: 10px;
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .user {
    font-size: 12px;
    color: #999;
    margin-top: 10px;
    margin-bottom: 10px;
    span {
      margin-right: 10px;
    }
  }
  .info {
    font-size: 12px;
    /deep/ img {
      width: 100%;
    }
  }
  video {
    width: 100%;
  }
  .btns {
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    .good,
    .share {
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      width: 80px;
      border: 1px solid #ccc;
      text-align: center;
      font-size: 14px;
      span {
        margin-right: 5px;
      }
    }
    .active {
      border: 1px solid red;
      color: red;
    }
    .iconweixin {
      color: rab(0, 200, 0);
    }
  }
}
.footer {
  .input {
    border-top: 1px solid #ccc;
    background-color: #fff;
    height: 50px;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
    input {
      height: 30px;
      background-color: #ddd;
      width: 180px;
      border: none;
      border-radius: 15px;
      font-size: 14px;
      padding-left: 10px;
    }
    .iconfont {
      font-size: 28px;
    }
    .active {
      color: red;
    }
    .iconpinglun- {
      position: relative;
      .badge {
        position: absolute;
        background-color: red;
        color: #fff;
        font-size: 12px;
        top: -3px;
        right: -16px;
        padding: 0 5px;
        border-radius: 5px;
      }
    }
  }
  .textarea {
    border-top: 1px solid #ccc;
    background-color: #fff;
    height: 120px;
    padding: 15px 15px;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    textarea {
      width: 260px;
      height: 90px;
      background-color: #ddd;
      border: none;
      border-radius: 5px;
      padding: 10px;
      font-size: 14px;
    }
    span {
      background-color: red;
      color: #fff;
      width: 60px;
      height: 26px;
      line-height: 26px;
      border-radius: 13px;
      font-size: 14px;
      text-align: center;
    }
  }
}
.comment {
  h3 {
    font-size: 26px;
    text-align: center;
    padding: 20px 0;
    font-weight: 400;
  }
}
</style>
