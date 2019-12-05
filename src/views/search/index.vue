<template>
  <div class="search">
    <!-- 搜索框 -->
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @input="onSearchInput"
    >
      <div slot="action" @click="onSearch(searchText)">搜索</div>
    </van-search>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group v-show="searchText">
      <van-cell icon="search" :key="item" v-for="item in suggestions" @click="onSearch(item)">
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-show="!searchText">
      <van-cell title="历史记录">
        <div v-show="isDeleteShow">
          <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon v-show="!isDeleteShow" name="delete" @click="isDeleteShow = true" />
      </van-cell>
      <van-cell :title="item" :key="item" v-for="(item, index) in searchHistories" @click="onSearch(item)">
        <van-icon v-show="isDeleteShow" @click.stop="searchHistories.splice(index, 1)" name="close" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import { getSuggestions } from '@/api/search'
export default {
  name: 'SearchPage',
  components: {},
  props: {},
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      str: 'hello <span style="color:red">world</span>',
      suggestions: [], // 搜索联想建议数据列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false // 控制删除历史记录的显示状态
    }
  },
  computed: {},
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {},
  methods: {
    // 搜索处理函数
    onSearch (q) {
      if (!q.trim()) {
        return
      }

      // 在跳转之前将搜索的关键字记录到搜索历史记录中
      const index = this.searchHistories.indexOf(q)
      if (index !== -1) {
        // 不要重复的
        this.searchHistories.splice(index, 1)
      }
      // 最新的在最前面
      this.searchHistories.unshift(q)

      // 将搜索历史记录放到本地存储，以便持久化
      setItem('search-histories', this.searchHistories)

      this.$router.push(`/search/${q}`)
    },
    async onSearchInput () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const res = await getSuggestions(this.searchText)
      this.suggestions = res.data.data.options
    },
    highlight (str) {
      const reg = new RegExp(this.searchText, 'ig')
      return str.replace(
        reg,
        `<span style="color: red">${this.searchText}</span>`
      )
    }
  }
}
</script>

<style scoped>
</style>
