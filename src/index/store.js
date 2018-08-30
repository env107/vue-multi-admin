import Vue from 'vue'
import Vuex from 'vuex'
import navigate from '@/nav.js';
import { getTagFromStorage,addTagToStorage,getMatchedName,checkNavicate } from '@/util.js';
Vue.use(Vuex);

const mainframe = {
  state: {
      website:{
        title:'Vue-admin 后台管理系统',
        maxTagCount:20
      },
      navigate, //导航菜单
      tabs:[], //标签数组
      defaultTab:'', //标注当前用户选择的标签
      menuPosition:'left', //菜单位置
      // tabIndex:-1,
  },
  mutations: {
    //初始化
    init:function(state,payload){
      let {tabs,navigate} = state;
      if(checkNavicate(navigate.menu)){
        console.error("导航菜单NAME属性冲突!");
        return false;
    }
      let {current} = payload;
      let cacheMenu = getTagFromStorage();
      let selectItem = null;
      //缓存中如果存在标签则加载标签
      if(cacheMenu.length > 0){
        cacheMenu.forEach((item)=>{
          if(item.name == current.name){
           selectItem = item;
          }
           tabs.push({...item});
        });
        if(current.path == '/'){
          selectItem = tabs[0];
        }
        //如果当前路由加载的name不在标签中则在标签后加入
        if(selectItem == null){    
          selectItem = getMatchedName(navigate.menu,current.name); 
          tabs.push({...selectItem});
        }
        state.defaultTab = selectItem.name;
        addTagToStorage(selectItem);
       
      }else if(navigate.menu.length > 0){
        //加载当前路由标签
        selectItem = getMatchedName(navigate.menu,current.name);
        tabs.push({...selectItem});
        state.defaultTab = selectItem.name;
        addTagToStorage(selectItem);
      }
      
    },
    //为页面增加标签
    addTag:function(state,payload){
      let hasSame = false;
      let tabs = state.tabs;
      let {context,item} = payload;
      if(tabs.length > state.website.maxTagCount){
        context.$Message.info("太多标签了!");
        return false;
      }
      tabs.forEach((ele)=>{
        if(item.name == ele.name){
          hasSame = true;
        }
      });
      state.defaultTab = item.name; 
      if(!hasSame){
        tabs.push({
          label:item.title,
          path:item.path,
          name:item.name,
        });
      }     
    },
    //删除当前标签
    removeTag:function(state,payload){
      let {removeIndex} = payload;
      let tabs = state.tabs;
      tabs.splice(removeIndex,1);
    },
    //更改当前标签名称
    setDefaultTab:function(state,payload){
      let {currentName} = payload;
      state.defaultTab = currentName;
    },
    //删除所有标签
    removeAllTag:function(state,payload){
      state.tabs = [];
      state.tabs.length = 0;
    }
  },
  actions: {
    addTag:function(context,payload){
      context.commit({
        type:"addTag",
        context,
        item:payload.item
      });
    },
    removeTag:function(context,payload){
      context.commit({
        type:"removeTag",
        ...payload
      });
    },
    init:function(context,payload){
      context.commit({type:"init",...payload});
    },
    setDefaultTab:function(context,payload){
      context.commit({type:"setDefaultTab",...payload});
    },
    removeAllTag:function(context,payload){
      context.commit({type:"removeAllTag"});
    }
  } 
}

export default new Vuex.Store({
  modules:{
    mainframe
  }
})
