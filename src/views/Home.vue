<template>
  <div class="home">
    <div class="header">
      <div class="logo">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="search">
        <div class="search-box" @click="$router.push('/search')">
          <span class="iconfont iconsearch"></span>
          <span>搜索新闻</span>
        </div>
      </div>
      <div class="user" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>
    <div class="manage">
      <span class="iconfont iconicon-test" @click="$router.push('/manage')"></span>
    </div>

    <!-- tab栏 -->
    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab :title="item.name" v-for="item in tabList" :key="item.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" pulling-text="下拉刷新！">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            :offset="10"
          >
            <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
          </van-list>
          <!-- 此处的post为父传子v-bind绑定的属性 -->
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 0,
      // 存放栏目列表
      tabList: [],
      pageIndex: 1,
      pageSize: 5,
      // 文章列表
      postList: [],
      finished: false,
      loading: false,
      refreshing: false
      // 如果为false,代表没有在下拉，如果为true,正在下拉，当我们下拉的时候，状态会自动变成true,下拉结束，需要把状态变成false

      // finished-text:没有更多数据的提示
      //     finished:是一个波尔值，指定是否还有更多数据，默认为false
      //     loading:是一个波尔值，指定当前list是否在加载数据false
      //     load事件：当滚动条滚动到底部，触发load事件
      // :immediate-check="false":页面一加载，不触发load事件
      // 滚动条与底部距离小于 offset 时触发load事件
    }
  },
  created() {
    this.getTabList()
  },
  methods: {
    // 获取所有分类 栏目
    async getTabList() {
      const active = JSON.parse(localStorage.getItem('active'))
      if (active) {
        this.tabList = active
        this.getPostList(this.tabList[0].id)
        return
      }

      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabList = data
        // 获取到栏目数据后，需要获取第一个栏目的文章
        this.getPostList(this.tabList[0].id)
      }
    },
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      // 如果是第一页，postList是不能有数据的，为了防止用户频繁点击标签栏而导致其他页面的数据渲染到当前页面中去，发送的请求可能没有用户点击响应的快
      if (this.pageIndex === 1) {
        this.postList = []
      }
      if (statusCode === 200) {
        this.postList = [...this.postList, ...data]
        // 把加载状态改成false
        this.loading = false
        // 把下拉状态改成false
        this.refreshing = false
        // 没有更多数据了
        if (data.length < this.pageSize) {
          this.finished = true
        }
        console.log(this.postList)
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        const id = this.tabList[this.active].id
        this.getPostList(id)
      }, 1000)
    },
    onRefresh() {
      // 下拉刷新的目的：重新加载数据
      this.pageIndex = 1
      this.postList = []
      this.finished = false
      this.loading = true
      setTimeout(() => {
        this.getPostList(this.tabList[this.active].id)
      }, 1000)
    }
  },
  // 使用watch来响应数据的变化
  watch: {
    active(value) {
      // tab切换，需要把之前所有的状态都清空
      // 只要切换tab栏，数据会叠加
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      // tab切换的时候，不需要触发load事件
      this.loading = true
      // 栏目发生改变，重新发送请求加载文章数据
      setTimeout(() => {
        this.getPostList(this.tabList[value].id)
      }, 1000)
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .header {
    height: 54px;
    line-height: 54px;
    background-color: #ff0000;
    display: flex;
    padding: 0 10px;
    text-align: center;
    color: #fff;
    .search {
      padding: 0 10px;
      flex: 1;
      .search-box {
        background-color: rgba(255, 255, 255, 0.5);
        height: 34px;
        line-height: 34px;
        margin-top: 10px;
        border-radius: 17px;
        font-size: 14px;
        span {
          margin-right: 5px;
        }
      }
    }
    .logo,
    .user {
      width: 50px;
    }
    .logo {
      span {
        font-size: 50px;
      }
    }
    .user {
      span {
        font-size: 24px;
      }
    }
  }
}
</style>
