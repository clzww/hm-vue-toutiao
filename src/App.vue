<template>
  <div id="app">
    <!-- keep-live用于组件的缓存
    如果路由发生跳转，原来的组件会销毁，新的组件会创建，如果希望原来的组件不被销毁，需要使用keep-live
    通过include或者exclude来指定需要缓存的组件-->
    <keep-alive include="home">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="less"></style>
