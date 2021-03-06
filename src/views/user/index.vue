<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow right-text="保存" @click="onSave" />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onShowFile">
        <van-image round width="30" height="30" :src="user.photo" />
      </van-cell>
      <input type="file" hidden ref="file" @change="onFileChange" />
      <van-cell title="昵称" :value="user.name" is-link @click="isNameShow = true" />
      <van-cell
        title="性别"
        :value="user.gender === 0 ? '男' : '女'"
        is-link
        @click="isGenerShow = true"
      />
      <van-cell title="生日" :value="user.birthday" is-link @click="isBirthdayShow = true" />
    </van-cell-group>
    <!-- 编辑修改用户昵称弹窗 -->
    <van-dialog v-model="isNameShow" title="昵称修改" show-cancel-button @confirm="onNameConfirm">
      <!--
        v-model 是
          :value="user.name"
          @input="user.name = 事件参数"
      -->
      <van-field :value="user.name" placeholder="请输入用户名" @input="inputName = $event" />
    </van-dialog>
    <!-- 编辑修改用户昵称弹窗 -->
    <!-- 编辑用户性别上拉菜单 -->
    <van-action-sheet
      v-model="isGenerShow"
      :actions="actions"
      cancel-text="取消"
      @select="onGenerSelect"
    />
    <!-- 编辑用户性别上拉菜单 -->
    <!-- 修改生日 -->
    <van-popup v-model="isBirthdayShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="onBirthdayConfirm"
      />
    </van-popup>
    <!-- 修改生日 -->
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {},
      isNameShow: false,
      inputName: '',
      isGenerShow: false,
      actions: [
        {
          name: '男',
          value: 0
        },
        {
          name: '女',
          value: 1
        }
      ],
      isBirthdayShow: false,
      currentDate: new Date(),
      minDate: new Date(1970, 1, 1)
    }
  },
  computed: {
    file () {
      return this.$refs.file
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
      this.currentDate = new Date(this.user.birthday)
    },
    onShowFile () {
      this.file.click()
    },
    onFileChange () {
      this.user.photo = URL.createObjectURL(this.file.files[0])
    },
    async onSave () {
      // 如果 Content-Type 要求是application/json，则 data 传普通对象 {}
      // 如果 Content-Type 要求是multipart/form-data，则 data 传 FormData 对象
      // 纵观所有数据接口，你会发现大多数的接口都要求 Content-Type 要求是application/json
      // 一般只有涉及到文件上传的数据接口才要求Content-Type要求是multipart/form-data
      // 这个时候传递一个 FormData 对象
      this.$toast.loading({
        duration: 0, // 持续展示toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })

      try {
        // 保存头像
        const fileObj = this.file.files[0]
        // 如果用户选了新的头像才更新头像
        if (fileObj) {
          const fd = new FormData()
          fd.append('photo', fileObj)
          await updateUserPhoto(fd)
        }
        const { name, gender, birthday } = this.user
        await updateUserProfile({
          name,
          gender,
          birthday
        })
        this.$toast.success('保存成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('保存失败')
      }
    },
    onNameConfirm () {
      this.user.name = this.inputName
    },
    onGenerSelect (item) {
      // 更新数据
      this.user.gender = item.value

      // 关闭弹层
      this.isGenerShow = false
    },
    onBirthdayConfirm (value) {
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.isBirthdayShow = false
    }
  }
}
</script>

<style scoped>
</style>
