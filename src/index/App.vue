<template>
  <div id="app">
      <div class="layout">
        <Layout >
          <!-- 头部内容 -->
          <Header :style="{background: '#3b4150'}">
            <div class="sys-container">
              <div class="sys-container-title">xxx 后台管理系统</div>
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
                <Tabs type="card"  closable :value="defaultTab" @on-click="(name)=>redirectTo(name)">             
                    <TabPane  :name="tab.name" :label="tab.label" v-for="(tab,index) in tabs" :key="index" ></TabPane>
                    <div class="nav-tab-func-group" slot="extra">
                      <Button size="small" type="primary" shape="circle" :style="{marginRight:'10px'}">标签管理</Button>
                    </div>
                </Tabs>  
              </div>  
              <!-- 菜单内容  -->
              <div class="router-view-container">
                <div class="router-view-carema">
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
export default {
  name:"app",
  data:function(){
    this.$store.dispatch({type:"init"});
    let state = this.$store.state.mainframe;   
    return state;
  },
  methods:{
    hasChildrenMenu:function(item){
      return item.hasOwnProperty('children') && item.children.length > 0;
    },
    hasItemIcon:function(item){
      return item.hasOwnProperty('icon') && item.icon != null && item.icon != '';
    },
    addTabsTag:function(item){
      this.$store.dispatch({
        type:"addTag",
        item
      })
    },
    redirectTo:function(name){ 
      let {currentName} = this.$router.history.current;
      if(currentName != name){
        this.$router.push({name});
      }
      
    }
  },

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
