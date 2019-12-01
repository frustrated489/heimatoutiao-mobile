import Vue from 'vue'
import 'amfe-flexible/index.js'
// 按需注册 Vant 组件
import {
  Button,
  Cell,
  CellGroup,
  Field,
  NavBar,
  Toast,
  Tabbar,
  TabbarItem
} from 'vant'

Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(NavBar)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
