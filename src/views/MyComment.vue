<template>
  <div class="mycomment">
    <hm-header>我的跟帖</hm-header>
    <div class="list">
      <!-- finished-text:没有更多数据的提示
          finished:是一个波尔值，指定是否还有更多数据，默认为false
          loading:是一个波尔值，指定当前list是否在加载数据false
          load事件：当滚动条滚动到底部，触发load事件
      :immediate-check="false":页面一加载，不触发load事件-->
      <van-list
        :finished="finished"
        v-model="loading"
        @load="onLoad"
        finished-text="没有更多了"
        :immediate-check="false"
        offset="10"
      >
        <!-- 滚动条与底部距离小于 offset 时触发load事件 -->
        <div class="item" v-for="item in list" :key="item.id">
          <p class="time">{{item.create_date}}</p>
          <div class="parent" v-if="item.parent">
            <p>回复：{{item.parent.user.nickname}}</p>
            <p>{{item.parent.content}}</p>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="link">
            <span class="one-txt-cut">原文：{{item.post.title}}</span>
            <span class="iconfont iconjiantou1"></span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 5,
      finished: false,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      // 发送get请求，数据需要放到params中
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    onLoad() {
      console.log('我需要加载数据了')
    }
  }
}
</script>

<style lang="less" scoped>
.mycomment {
  font-size: 14px;
  .item {
    border-bottom: 1px solid #ccc;
    padding: 10px;
    .time {
      color: #999;
      line-height: 40px;
    }
    .parent {
      background-color: #ddd;
      padding: 10px;
      color: #999;
      line-height: 30px;
    }
    .content {
      margin: 20px 0;
    }
    .link {
      color: #999;
      display: flex;
      justify-content: space-between;
      span:first-child {
        width: 85%;
      }
    }
  }
}
</style>
