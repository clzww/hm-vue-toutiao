<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader :after-read="afterRead" />
    </div>
    <div class="nav">
      <hm-navbar @click="showNickname">
        <template>昵称</template>
        <template #content>{{ info.nickname }}</template>
      </hm-navbar>
      <hm-navbar @click="showPassword">
        <template>密码</template>
        <template #content>******</template>
      </hm-navbar>
      <hm-navbar @click="showGenderFn">
        <template>性别</template>
        <template #content>{{ info.gender === 1 ? '男' : '女' }}</template>
      </hm-navbar>
    </div>

    <!-- v-model:show控制模态框的显示和隐藏 -->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="editNickname">
      <van-field v-model="nickname" placeholder="请输入用户新昵称"></van-field>
    </van-dialog>

    <van-dialog v-model="showPwd" title="修改密码" show-cancel-button @confirm="editPassword">
      <van-field v-model="password" placeholder="请输入用户新密码"></van-field>
    </van-dialog>

    <van-dialog v-model="showGender" title="修改性别" show-cancel-button @confirm="editGender">
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <div class="mask" v-show="isShowMask">
      <van-button type="primary" @click="crop">裁剪</van-button>
      <van-button type="danger" @click="cancel">取消</van-button>
      <VueCropper
        ref="cropper"
        :img="img"
        :autoCrop="true"
        autoCropWidth="150"
        autoCropHeight="150"
        :fixed="true"
        :fixedNumber="[1, 1]"
      >
        <!-- ref可以给一个DOM对象或者组件添加引用 -->
        <!-- 裁剪图片的地址 -->
        <!-- 是否默认生成截图框 -->
        <!-- 默认生成截图框宽度 -->
        <!-- 默认生成截图框高度 -->
        <!-- 是否开启截图框宽高固定比例 -->
        <!-- 截图框的宽高比例 -->
      </VueCropper>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      info: {},
      show: false,
      nickname: '',
      showPwd: false,
      password: '',
      showGender: false,
      gender: 1,
      isShowMask: false,
      img: ''
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.info = data
      }
    },
    showNickname() {
      this.show = true
      // 回显nickname
      this.nickname = this.info.nickname
    },
    async editUser(data) {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      } else {
        this.$toast.fail(message)
      }
    },
    editNickname() {
      this.editUser({ nickname: this.nickname })
    },
    showPassword() {
      this.showPwd = true
      this.password = this.info.password
    },
    editPassword() {
      this.editUser({ password: this.password })
    },
    showGenderFn() {
      this.showGender = true
      this.gender = this.info.gender
    },
    editGender() {
      this.editUser({
        gender: this.gender
      })
    },
    // 文件上传完毕后会触发after-read回调函数，获取到对应文件的临时地址
    async afterRead(file) {
      this.isShowMask = true
      // img必须指定为url地址，要么base64
      this.img = file.content
      console.log(file)
      // 是否超出范围
      // const isLimit = file.file.size / 1024 >= 20
      // if (isLimit) {
      //   this.$toast.fail('上传的图片不能超过20kb！')
      //   return
      // }
      // 限制图片的格式
      // const isGif = file.file.type === 'image/gif'
      // const isPng = file.file.type === 'image/png'
      // const isJpg = file.file.type === 'image/jpeg'
      // if (!isGif && !isPng && !isJpg) {
      //   this.$toast.fail('上传的图片只能是gif|png|jpg格式')
      //   return
      // }
      // 第一个file是服务器所要的参数，第二个三个是真正的file文件信息
      // append() - 在被选元素的结尾插入内容
    },
    crop() {
      this.$refs.cropper.getCropBlob(async blob => {
        console.log(blob)
        const fd = new FormData()
        // 这里只传一个blob参数，里边包括图片大小和格式，由于是插件，所以按照插件要求来传
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.editUser({
            head_img: data.url
          })
          this.isShowMask = false
        }
      })
    },
    cancel() {
      this.isShowMask = false
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  padding: 30px 0;
  text-align: center;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
.nav {
  padding-left: 20px;
}
.van-field {
  border: 1px solid #ccc;
}
// 原理：在/deep/ 下的选择器 不会添加上 属性选择器
/deep/ .van-dialog__content {
  padding: 10px !important;
}
.van-uploader {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  // 透明度为0
}
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  .van-button {
    position: absolute;
    top: 0;
    z-index: 999;
  }
  .van-button:nth-child(1) {
    left: 0;
  }
  .van-button:nth-child(2) {
    right: 0;
  }
}
</style>
