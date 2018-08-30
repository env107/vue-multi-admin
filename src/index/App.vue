<template>
  <div id="app">
      <div class="layout">
        <Layout >
          <!-- 头部内容 -->
          <Header :style="{background: '#3b4150'}">
            <div class="sys-container">
              <div class="sys-container-title">{{ website.title }}</div>
              <div class="sys-header-menu">
                <Menu v-if="menuPosition == 'top'" mode="horizontal" :style="{background:'#3b4150'}" :active-name="navigate.defaultPosition" theme="dark" width="auto" height="100" >
                  <MenuItem :name="item.id" @click.native="addTabsTag(item)"  v-for="(item,index) in navigate.menu" v-if="!hasChildrenMenu(item)"  :key="index" >
                    <Icon :type="item.icon" v-if="hasItemIcon(item)" />
                    {{ item.title }}
                  </MenuItem>
                  <Submenu :name="item.id" v-for="(item,index) in navigate.menu" v-if="hasChildrenMenu(item)" :key="index">
                    <template slot="title">
                      <Icon :type="item.icon" v-if="hasItemIcon(item)" />
                      <span class="menuitem-title-top" >{{ item.title }}</span>
                    </template>
                    <MenuItem @click.native="addTabsTag(subItem)" :name="item.id + '-' +subItem.id" :to="{name:subItem.path}" v-for="(subItem,subIndex) in item.children" :key="subIndex" >
                      <Icon :type="subItem.icon" v-if="hasItemIcon(subItem)" />
                      <span class="menuitem-title-top" >{{ subItem.title }}</span>
                    </MenuItem>
                  </Submenu>
                </Menu>
              </div>
              <div class="sys-user-panel">
                <Icon type="ios-person" color="white" size="22"/>
                <div class="sys-user-title">超级管理员</div>
              </div>
            </div>
          </Header>
        </Layout>
        <Layout :style="{height:'100%'}">
          <Sider hide-trigger v-if="menuPosition == '' || menuPosition == 'left'">
            <Menu  :active-name="navigate.defaultPosition" theme="dark" width="auto" height="100" >
              <MenuItem :name="item.id" @click.native="addTabsTag(item)"  v-for="(item,index) in navigate.menu" v-if="!hasChildrenMenu(item)"  :key="index" >
                <Icon :type="item.icon" v-if="hasItemIcon(item)" />
                {{ item.title }}
              </MenuItem>
              <Submenu :name="item.id" v-for="(item,index) in navigate.menu" v-if="hasChildrenMenu(item)" :key="index">
                <template slot="title">
                  <Icon :type="item.icon" v-if="hasItemIcon(item)" />
                  <span class="menuitem-title" >{{ item.title }}</span>
                </template>
                <MenuItem @click.native="addTabsTag(subItem)" :name="item.id + '-' +subItem.id" :to="{name:subItem.path}" v-for="(subItem,subIndex) in item.children" :key="subIndex" >
                  <Icon :type="subItem.icon" v-if="hasItemIcon(subItem)" />
                  <span class="menuitem-title" >{{ subItem.title }}</span>
                </MenuItem>
              </Submenu>
            </Menu>
          </Sider>
          <Layout :style="{width:'100%',height:'100%'}">
            <div class="nav-tab-container">
              <div class="nav-tab-tag" >
                <Tabs :style="{flex:1}" type="card" @on-tab-remove="(name)=>removeTag(name,true)"  closable :value="defaultTab" @on-click="(name)=>redirectTo(name)">             
                    <TabPane  :name="tab.name" :label="tab.label" v-for="(tab,index) in tabs" :key="index" ></TabPane>
                </Tabs> 
                <div class="nav-tab-func-group" >
                      <Dropdown :style="{marginRight:'10px'}">
                        <Button type="primary" shape="circle" size="small">标签管理</Button>
                        <DropdownMenu slot="list" trigger="click">
                          <DropdownItem name="current" @click.native="removeTag('current')">关闭当前标签</DropdownItem>
                          <DropdownItem name="all" @click.native="removeTag('all')">关闭所有标签</DropdownItem>
                      </DropdownMenu>
                      </Dropdown>
                    </div> 
              </div>  
              <!-- 菜单内容  -->
              <div class="router-view-container">
                <div class="router-view-carema" v-if="hasRouterView">
                    <keep-alive>
                        <router-view ></router-view>
                    </keep-alive>
                </div>   
              </div>
            </div>   
          </Layout>
        </Layout>
      </div> 
    </div>
</template>
<script>
import navigate from '@/nav.js';
import { addTagToStorage,removeTagFromStorage,removeAllTagFromStorage } from '@/util.js';
export default {
  name:"app",
  data:function(){
    let current = this.$router.history.current;
    this.$store.dispatch({type:"init",current});
    let state = this.$store.state.mainframe;   
    return state;
  },
  methods:{
    //是否有子菜单
    hasChildrenMenu:function(item){
      return item.hasOwnProperty('children') && item.children.length > 0;
    },
    //是否有图标
    hasItemIcon:function(item){
      return item.hasOwnProperty('icon') && item.icon != null && item.icon != '';
    },
    //添加页面标签
    addTabsTag:function(item){
      this.$router.push({name:item.name});
      this.$store.dispatch({
        type:"addTag",
        item
      });
      addTagToStorage(item);
    },
    //跳转到新的路由
    redirectTo:function(name){ 
      let { currentName } = this.$router.history.current;
      if(currentName != name){
        this.$router.push({name});
      }
      this.$store.dispatch({
        type:'setDefaultTab',
        currentName:name
      });
    },
    //删除标签
    removeTag:function(type,fromTag = false){
      let {tabs,defaultTab} = this.$store.state.mainframe;
      let router = this.$router;
      let removeIndex = -1;
      let removeTab = null;
      //是否在标签点击删除
      if(fromTag){
        removeTab = type;
      }else{
        removeTab = defaultTab;
      }

      if(type == 'current' || fromTag){
        //删除当前标签
        tabs.forEach((ele,index)=>{
          if(ele.name == removeTab ){
            let currentName = null;        
            //选择当前标签
            removeIndex = index;
            if(tabs[index + 1] != undefined){
              currentName = tabs[index + 1].name;
            }else if(tabs[index-1] != undefined){
              currentName = tabs[index-1].name;
            }
     
            if(currentName != null){
              removeTagFromStorage(ele.name);
              this.$router.push({name:currentName});
              this.$store.dispatch({
                type:'setDefaultTab',
                currentName:currentName
              });
            }  
          }
      });
      //如果来自非标签删除则手动删除
      if(!fromTag){
        this.$store.dispatch({
          type:"removeTag",
          removeIndex
        });
      }
       
      }else if(type == 'all'){
        //删除所有标签
        removeAllTagFromStorage();
        this.$store.dispatch({
          type:"removeAllTag"
        });
      }
    },
    
  },
  computed:{
    hasRouterView(){
      let state = this.$store.state.mainframe;
      return state.tabs.length > 0;
    }
  }

}
</script>
>
<style>
html,body,.layout{
  width: 100%;
  height: 100%;
}
#app{
  list-style-type: none;
  margin:0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    
}
.sys-container-title{
  color:#f5f7f9;
  font-size:16px;
  width: 160px;
  
}
.sys-container{
  display: flex;
  height: 100%;
  width: 100%;
  
}
.sys-user-panel{
  flex:1;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
}
.sys-user-title{
  color:#f5f7f9;
  margin-left: 8px;
}
.menuitem-title{
  color:#f5f7f9;
}

.nav-tab-container{
  padding-top: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.nav-tab-tag{
  display: flex;
}
.nav-tab-func-group{
  width: 80px;
}
.ivu-tabs-nav-scroll{
  margin: 0 15px;
}
.router-view-container{
  height:100%;
  display: flex;
  justify-content: center;
}
.router-view-carema{
  width: 98%;
  height:100%;
  background: #fff;
}

</style>
