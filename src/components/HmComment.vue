<template>
  <div class="hm-comment">
    <div class="title">
      <div class="left">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
      </div>
      <div class="center">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | fromNow}}</div>
      </div>
      <div class="right" @click="reply(comment.user.nickname,comment.id)">回复</div>
    </div>
    <HmFloor :num="getFloor(0,comment)" v-if="comment.parent" :comment="comment.parent"></HmFloor>
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
import HmFloor from './HmFloor'
export default {
  components: {
    HmFloor
  },
  props: {
    comment: {
      type: Object,
      required: true
      //   后台提醒父组件传值是，必须传值，如果不传，则会报错
    }
  },
  methods: {
    //   递归函数
    // 当第一组符合条件的数据进入函数之后，再次调用该函数，同时在页面中渲染第一组数据，以此类推，并且直到循环至出现不符合条件的数据时，跳出循环
    getFloor(num, comment) {
      if (comment.parent) {
        console.log(comment)
        return this.getFloor(num + 1, comment.parent)
      } else {
        return num
      }
    },
    reply(name, id) {
      // 评论组件中触发
      this.$bus.$emit('reply', name, id)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-comment {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
.title {
  display: flex;
  margin-bottom: 10px;
  .left {
    img {
      height: 35px;
      width: 35px;
      border-radius: 50%;
    }
  }
  .center {
    padding-left: 10px;
    flex: 1;
    font-size: 14px;
    .time {
      color: #999;
    }
  }
  .right {
    font-size: 14px;
    color: #999;
  }
}
.content {
  font-size: 14px;
  margin: 10px 0;
  word-break: break-word;
  // 如果写英文或者数字中间不写空格的话，默认会当成一个汉字来显示，则此时不会换行，需要有word-break样式来控制，就可以显示换行了
}
</style>
