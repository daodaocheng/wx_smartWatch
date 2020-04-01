// template/template.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
});
//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": ".. /pages/safeArea/safeArea",
      // "iconPath": "../assets/home.png",
      // "selectedIconPath": "../assets/home_on.png",
      "text": "出入记录"
    },
    {
      "current": 0,
      "pagePath": "../pages/myInfo/myInfo",
      // "iconPath": "../assets/message.png",
      // "selectedIconPath": "../assets/message_on.png",
      "text": "添加安全区"

    }
  ];
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}

module.exports = {
  tabbar: tabbarmain
}