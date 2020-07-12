<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <h3>点击删除一下频道(至少保留4个...)</h3>
    <div class="list">
      <div
        class="item"
        @click="del(index)"
        v-for="(item,index) in active"
        :key="item.id"
      >{{item.name}}</div>
    </div>

    <h3>点击增加以下频道</h3>
    <div class="list">
      <div
        class="item"
        @click="add(index)"
        v-for="(item,index) in deactive"
        :key="item.id"
      >{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: [],
      deactive: []
    }
  },
  async created() {
    // 先从本地获取，如果本地有数据，直接使用本地的数据
    const active = JSON.parse(localStorage.getItem('active'))
    const deactive = JSON.parse(localStorage.getItem('deactive'))
    if (active) {
      this.active = active
      this.deactive = deactive
      return
    }
    // 获取所有栏目的数据
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.active = data
    }
  },
  methods: {
    del(index) {
      // 把active中的对应item删除
      // deactive就添加
      if (this.active.length <= 4) {
        return this.$toast('至少保留4个')
      }
      this.deactive.push(this.active[index])
      this.active.splice(index, 1)
    },
    add(index) {
      this.active.push(this.deactive[index])
      this.deactive.splice(index, 1)
    }
  },
  watch: {
    active: {
      // deep的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器
      // 任何修改obj里面任何一个属性都会触发这个监听器里的 handler
      deep: true,
      handler() {
        // 使用localStorage保存active和deactive
        localStorage.setItem('active', JSON.stringify(this.active))
        localStorage.setItem('deactive', JSON.stringify(this.deactive))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.manage {
  padding: 0 10px;
  h3 {
    font-size: 12px;
    color: #999;
    margin: 10px 0;
  }
  .list {
    overflow: hidden;
    .item {
      float: left;
      width: 70px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border: 1px solid #ccc;
      background-color: #ddd;
      margin-right: 13px;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
}
</style>
