import Vue from 'vue'
import Vuex from 'vuex'
import navigate from '@/nav.js'; 
Vue.use(Vuex);


const mainframe = {
  state: {
      navigate,
      tabs:[],
      defaultTab:'',
      menuPosition:'left',
      tabIndex:-1,
  },
  mutations: {
    init:function(state,payload){
      //初始化
      let {tabs,navigate} = state;
      if(navigate.menu.length > 0){
        let getFirst = navigate.menu[0].hasOwnProperty("children") && navigate.menu[0].children.length > 0;
        let item = (getFirst ? navigate.menu[0].children[0] : navigate.menu[0]);
        state.defaultTab = item.name;
        tabs.push({
          label:item.title,
          path:item.path,
          name:item.name
        });
      }
    },
    addTag:function(state,payload){
      let hasSame = false;
      let tabs = state.tabs;
      let {context,item} = payload;
      if(tabs.length > 20){
        context.$Message.info("太多标签了!");
        return false;
      }

      tabs.forEach((ele)=>{
        if(item.name == ele.name){
          hasSame = true;
        }
      });
      state.defaultTab = item.name; //新标签加入自动切换到新标签
      if(hasSame){
        return false;
      }     
      tabs.push({
        label:item.title,
        path:item.path,
        name:item.name,
      });
    },
    removeTag:function(state,payload){
      let {removeIndex} = payload;
      let tabs = state.tabs;
      tabs.splice(removeIndex,1);
    },
    setDefaultTab:function(state,payload){
      let {currentName} = payload;
      state.defaultTab = currentName;
    },
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
      context.commit({type:"init"});
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
