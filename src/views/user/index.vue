<template>
  <div>
      <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onShowFile">
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <input type="file" hidden ref="file" @change="onFileChange">
      <van-cell title="昵称" :value="user.name" is-link />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getProfile } from '@/api/user'
export default {
  name: 'UserIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {}
    }
  },
  computed: {
    file () {
      return this.$ref.file
    }
  },
  watch: {},
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const res = await getProfile()
      this.user = res.data.data
    },
    onShowFile () {
      this.file.click()
    },
    onFileChange () {
      this.user.photo = URL.createObjectURL(this.file.files[0])
    }
  }
}
</script>

<style scoped>
</style>
