<template>
  <div>
    <hm-floor :num="num-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
    <div class="hm-floor">
      <div class="title">
        <div class="left">{{num}}楼:{{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | fromNow}}</div>
        <div class="right" @click="reply(comment.user.nickname,comment.id)">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hm-floor',
  props: {
    comment: Object,
    num: Number
  },
  methods: {
    reply(name, id) {
      this.$bus.$emit('reply', name, id)
    }
  }
}
</script>

<style lang="less" scoped>
.bt {
  border-top: 1px solid #000 !important;
}
.hm-floor {
  margin-top: -1px;
  border: 1px solid #000;
  padding: 10px;
  .title {
    display: flex;
    font-size: 14px;
    .center {
      flex: 1;
      padding-left: 10px;
      color: #999;
    }
    .right {
      color: #999;
    }
  }
  .content {
    font-size: 14px;
    margin: 10px 0;
    word-break: break-word;
    // 如果写英文或者数字中间不写空格的话，默认会当成一个汉字来显示，则此时不会换行，需要有word-break样式来控制，就可以显示换行了
  }
}
</style>
