<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <van-tabs>
      <van-tab :title="channel.name"
      v-for="channel in channels"
      :key="channel.id">
        <van-pull-refresh
        v-model="isloading"
        @refresh="onRefresh">
          <van-list v-model="loading"
          :finished="channle.finished"
          finished-text="没有更多了"
          @load="onLoad">
            <van-cell
            v-for="item in channel.articles"
            :key="item"
            :title="item" />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
export default {
  name: 'Home',
  components: {},
  props: {},
  data () {
    return {
      count: 0,
      isLoading: false,
      list: [],
      loading: false,
      finished: false,
      channels: [] // 频道列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserChannels()
  },
  methods: {
    onLoad () {
      const activeChannel = this.channels[this.active]
      const articles = activeChannel.articles
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          articles.push(articles.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 500)
    },
    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
      })
      this.channels = channels
    }
  }
}
</script>

<style scoped>
</style>
