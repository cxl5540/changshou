import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 const state={//要设置的全局访问的state对象
 	index_bg:true,
 	 view_all:false
   };
 const store = new Vuex.Store({
       state
    });

export default store;
