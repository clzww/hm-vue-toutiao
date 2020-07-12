<template>
  <div>
    <hm-floor :num="num-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
    <div class="hm-floor">
      <div class="title">
        <div class="left">{{num}}楼:{{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | fromNow}}</div>
        <div class="right">回复</div>
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
  }
}
</style>
