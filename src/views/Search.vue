<template>
  <div class="search">
    <div class="header">
      <div class="left">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <input
          type="text"
          placeholder="请输入搜索的关键字"
          v-model="key"
          @input="input"
        />
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right">搜索</div>
    </div>
    <div class="conten">
      <div class="history">
        <h3>历史记录</h3>
        <div class="list">
          <div class="item">美女</div>
        </div>
      </div>
      <div class="history">
        <h3>热门搜索</h3>
        <div class="list">
          <div class="item">啦啦啦</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash'
export default {
  data() {
    return {
      key: ''
    }
  },
  methods: {
    input: lodash.debounce(async function() {
      const res = await this.$axios.get(
        `/post_search_recommend?keyword=${this.key}`
      )
      console.log(res)
    }, 500)
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
    .item {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
