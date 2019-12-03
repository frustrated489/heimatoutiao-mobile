<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="(article, index) in channel.articles"
              :key="index"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <span>{{article.aut_name}}</span>
                  <span>{{article.comm_count}}评论</span>
                  <span>{{article.pubdate | relativeTime}}</span>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <!-- 它默认会把你写的其他内容渲染到内容的底部 -->
      <div class="wap-nav" slot="nav-right" @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 频道管理弹窗 -->
    <!-- 弹窗组件
    v-model="show" 控制是否展示
    round 圆角
    position="bottom" 弹出位置
    :style="{height:'20%'}"弹出高度-->
    <van-popup
      v-model="isChannelShow"
      round
      position="bottom"
      closeable
      close-icon-position="top-left"
      :style="{ height: '95%' }"
    >
      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
          <van-botton type="danger" size="mini">编辑</van-botton>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="value in 8" :key="value" text="文字" />
        </van-grid>
        <van-cell title="推荐频道" :border="false" />
        <van-grid :gutter="10">
          <van-grid-item v-for="value in 8" :key="value" text="文字" />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      active: 0,
      loading: false,
      isLoading: false,
      channels: [], // 频道列表
      isChannelShow: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserChannels()
  },

  methods: {
    // List 列表组件初始化的时候会自动触发load事件
    async onLoad () {
      // 获取当前频道

      const activeChannel = this.channels[this.active]
      // 当前频道的文章列表
      const articles = activeChannel.articles

      // 1、 请求加载数据
      const res = await getArticles({
        channel_id: activeChannel.id, // 频道id
        timestamp: activeChannel.timestamp || Date.now(), // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
        with_top: 1
      })
      // 2、 将数据添加到当前频道的文章列表中
      // ... 数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
      articles.push(...res.data.data.results)

      // 3、 将loading设置为false
      // 加载状态结束
      // 关闭本次的loading 状态，它会判定当前数据是否够一屏，不够就继续自动 onLoad
      this.loading = false

      // 4、 判断如果没有数据了， 将finished设置为true
      // 数据全部加载完成
      const preTimestamp = res.data.data.pre_timestamp
      if (preTimestamp) {
        // 更新获取下一页数据的时间戳
        activeChannel.timestamp = preTimestamp
      } else {
        activeChannel.finished = true
      }
    },
    async onRefresh () {
      const activeChannel = this.channels[this.active]
      // 1. 请求获取最新数据
      const res = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 获取最新数据传递当前最新时间戳即可
        with_top: 1
      })
      // 2. 把数据放到列表的顶部
      const articles = res.data.data.results
      activeChannel.articles.unshift(...articles)

      // 3. 停止下拉刷新的转圈圈
      this.isLoading = false

      // 4. 提示用户刷新成功
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : '暂无数据更新'
      this.$toast(message)
    },
    async loadUserChannels () {
      const res = await getUserChannels()
      console.log(res)
      const channels = res.data.data.channels
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.finished = false // 频道的加载结束状态
        channel.timestamp = null // 用于获取频道下一页数据的事件戳
      })
      this.channels = channels
    }
  }
}
</script>

<style scoped lang="less">
.home .article-info span {
  margin-right: 10px;
}
.van-tabs /deep/ .van-tabs__wrap--scrollable {
  position: fixed;
  top: 46px;
  left: 0;
  right: 16px;
  z-index: 2;
}

.van-tabs /deep/ .van-tabs__content {
  margin-top: 90px;
}
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: .8;
  }
  .channel-container {
    padding-top: 30px;
  }
</style>
