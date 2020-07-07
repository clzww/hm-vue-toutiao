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

    <!-- tab栏 -->
    <van-tabs v-model="active" sticky animated swipeable>
      <van-tab :title="item.name" v-for="item in tabList" :key="item.id">
        <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
        <!-- 此处的post为父传子v-bind绑定的属性 -->
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      // 存放栏目列表
      tabList: [],
      pageIndex: 1,
      pageSize: 10,
      // 文章列表
      postList: []
    }
  },
  created() {
    this.getTabList()
  },
  methods: {
    // 获取所有分类 栏目
    async getTabList() {
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
      if (statusCode === 200) {
        this.postList = data
        console.log(this.postList)
      }
    }
  },
  watch: {
    active(value) {
      console.log(value)
      this.getPostList(this.tabList[value].id)
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
