import Vue from 'vue'
import Vuex from 'vuex'
import navigate from '@/nav.js'; 
Vue.use(Vuex);


const mainframe = {
  state: {
      navigate,
      tabs:[],
      defaultTab:'',
      menuPosition:'left'
  },
  mutations: {
    init:function(state,payload){
      //初始化
      let {tabs,navigate} = state;
      if(navigate.menu.length > 0){
        let getFirst = navigate.menu[0].hasOwnProperty("children") && navigate.menu[0].children.length > 0;
        let item = (getFirst ? navigate.menu[0].children[0] : navigate.menu[0]);
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
        console.log(ele)
        if(item.name == ele.name){
          hasSame = true;
        }
      });
      state.defaultTab = item.name;
      if(hasSame){
        return false;
      }     
      tabs.push({
        label:item.title,
        path:item.path,
        name:item.name,
      });
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
    init:function(context,payload){
      context.commit({type:"init"});
    }
  } 
}

export default new Vuex.Store({
  modules:{
    mainframe
  }
})
