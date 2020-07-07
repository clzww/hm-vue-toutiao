<template>
  <div class="hm-post">
    <div class="singleImg" v-if="post.cover.length < 3">
      <div class="left">
        <div class="content">{{post.title}}</div>
        <div class="name">
          <span>{{post.user.nickname}}</span>
          <span>{{post.comment_length}}跟帖</span>
        </div>
      </div>
      <div class="right">
        <img :src="$url(post.cover[0].url)" alt />
      </div>
    </div>
    <div class="mutipleImg" v-else>
      <div class="content">{{post.title}}</div>
      <div class="imgs">
        <img :src="$url(post.cover[0].url)" alt />
        <img :src="$url(post.cover[1].url)" alt />
        <img :src="$url(post.cover[2].url)" alt />
      </div>
      <div class="name">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>

<style lang="less" scoped>
.name {
  font-size: 12px;
  color: #999;
  span {
    margin-right: 10px;
  }
}
.singleImg {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  .left {
    flex: 1;
    padding-right: 10px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .right {
    img {
      width: 121px;
      height: 75px;
      object-fit: cover;
    }
  }
}
.mutipleImg {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .content {
    font-size: 16px;
  }
  .imgs {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    img {
      width: 112px;
      height: 74px;
      object-fit: cover;
    }
  }
}
</style>
