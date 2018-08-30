import localStorage from '@/localStorage.js';

Array.prototype.in_array = function(key){
    let array = this;
    let has = false;
    array.forEach(value=>{
        if(value == key){
            has = true;
        }
    });
    return has;
}


//添加标签到缓存
export function addTagToStorage(item){
    let saveItem = localStorage.get("sysMenu");
    if(saveItem == null ){
        saveItem = [];  
    }
    let tmp = getTag(item.name);
    if(tmp != null){
        return false;
    }
    saveItem.push({
        label:item.title || item.label,
        name:item.name,
        path:item.path
    });
    localStorage.clear("sysMenu");
    localStorage.add("sysMenu",saveItem);
    return true;
}
//从缓存中获取所有标签
export function getTagFromStorage(){
    let saveItem = localStorage.get("sysMenu");
    if(saveItem == null){
        return [];
    }
    return saveItem;
}
//根据name获取标签
export function getTag(name){
    let saveItem = localStorage.get("sysMenu");
    if(saveItem == null){
        return null;
    }
    let value = null;
    saveItem.forEach((ele)=>{
        if(ele.name == name){
            value = ele;
        }
    });

    return value;
}
//从缓存中删除菜单
export function removeTagFromStorage(name){
    let saveItem = getTagFromStorage();

    if(saveItem == undefined || saveItem == null){
        return false;
    }
    saveItem.forEach((ele,index)=>{
        if(ele.name == name){
            saveItem.splice(index,1);
            localStorage.clear("sysMenu");
            localStorage.add("sysMenu",saveItem);
        }
    });

    return true;
}
//删除所有标签
export function removeAllTagFromStorage(){
    return localStorage.clear("sysMenu");
}
//获取匹配的名字
export function getMatchedName(menu,name){
    let matchItem = null;
    menu.forEach((ele)=>{   
        if(ele.hasOwnProperty("children")){
            ele.children.forEach((child)=>{
                if(name == child.name){
                    matchItem = {};
                    matchItem['label'] = child.title;
                    matchItem['name'] = child.name;
                    matchItem['path'] = child.path;
                }
            });
        }else if(ele.name == name){
            matchItem = {};
            matchItem['label'] = ele.title;
            matchItem['name'] = ele.name;
            matchItem['path'] = ele.path;
        }
    });

    return matchItem;
}

//检测navicate对象是否存在重复的name属性的对象
export function checkNavicate(menu){
    let hasKey = false;
    let keyArray = [];
    menu.forEach(ele=>{

        if(ele.hasOwnProperty("children")){
            ele.children.forEach(child=>{
                if(hasKey){
                    return true;
                }
                if(keyArray.in_array(child.name)){
                    hasKey = true;
                }else{
                    keyArray.push(child.name);
                }
            });
        }else{
            if(hasKey){
                return true;
            }
            if(keyArray.in_array(ele.name)){
                hasKey = true;
            }else{
                keyArray.push(ele.name);
            }
        }
    });
   
    return hasKey;
}