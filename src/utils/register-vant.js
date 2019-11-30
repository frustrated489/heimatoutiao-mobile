import Vue from 'vue'
import 'amfe-flexible/index.js'
// 按需注册 Vant 组件
import {
  Button,
  Cell,
  CellGroup
} from 'vant'

Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
