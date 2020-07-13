<template>
  <div class="search">
    <div class="header">
      <div class="left">
        <span class="iconfont iconjiantou2" @click="back"></span>
      </div>
      <div class="center">
        <input
          type="text"
          placeholder="请输入搜索的关键字"
          v-model="key"
          @keyup.enter="search"
          @input="input"
        />
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <!-- 推荐列表 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <div
        class="item one-txt-cut"
        @click="recommend_search(item)"
        v-for="item in recommendList"
        :key="item.id"
      >{{item.title}}</div>
    </div>

    <div class="post-list" v-else-if="list.length>0">
      <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
    </div>

    <div class="content" v-else>
      <div class="history">
        <h3>历史记录</h3>
        <div class="list">
          <div
            class="item one-txt-cut"
            v-for="item in history"
            :key="item"
            @click="history_search(item)"
          >{{item}}</div>
        </div>
      </div>
      <div class="history">
        <h3>热门搜索</h3>
        <div class="list">
          <div class="item" v-for="item in hot" :key="item" @click="history_search(item)">{{item}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      key: '',
      list: [],
      history: [],
      hot: ['情火', '姑娘', '关晓彤', '华为'],
      recommendList: []
    }
  },
  created() {
    this.history = JSON.parse(localStorage.getItem('history')) || []
  },
  methods: {
    input: _.debounce(async function() {
      if (!this.key) {
        return
      }
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.recommendList = data
      }
      console.log(this.recommendList)
    }, 500),
    async search() {
      this.recommendList = []
      // 把搜索的关键字保存到history中
      // 去除重复的key
      this.history = this.history.filter(item => item !== this.key)
      this.history.unshift(this.key)
      // 把history保存到localStorage中
      localStorage.setItem('history', JSON.stringify(this.history))

      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    back() {
      if (this.key) {
        this.key = ''
      } else {
        this.$router.back()
      }
    },
    history_search(item) {
      this.key = item
      this.search()
    },
    recommend_search(item) {
      this.recommendList = []
      this.key = item.title
      this.search()
    }
  },
  watch: {
    key(value) {
      if (!value) {
        this.list = []
        this.recommendList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  font-size: 14px;
  .left {
    line-height: 50px;
  }
  .center {
    width: 258px;
    position: relative;
    input {
      width: 100%;
      height: 30px;
      margin-top: 10px;
      border-radius: 15px;
      border: none;
      border: 1px solid #ccc;
      font-size: 14px;
      padding-left: 30px;
    }
    span {
      position: absolute;
      top: 17px;
      left: 10px;
    }
  }
  .right {
    line-height: 50px;
  }
}
.content {
  padding: 10px;
  h3 {
    font-size: 16px;
  }
  .list {
    font-size: 14px;
    overflow: hidden;
    padding: 20px 0;
    .item {
      float: left;
      width: 60px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      background-color: #ddd;
      text-align: center;
      margin-right: 15px;
      margin-bottom: 15px;
    }
  }
}
.recommend {
  position: absolute;
  z-index: 999;
  background-color: #fff;
  width: 100%;
  .item {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
}
</style>
