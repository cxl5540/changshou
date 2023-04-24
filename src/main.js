// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import router from './router'
 import store from './store'
// import 'lib-flexible/flexible'
import 'babel-polyfill'
import 'classlist-polyfill'
Vue.config.productionTip = false
import Axios from 'axios'

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.prototype.testUrl = "http://zhyq.toommi.com/"

Vue.prototype.getstr=function(str,num){
	if(str!=undefined){
		var length=str.length;
		if(length>num){
			str=str.substring(0,num)+"..."
		}
		return str;
	}

}
Vue.prototype.initnowday=function(){
    var date=new Date();
    //年
    var year=date.getFullYear();
    //月
    var month=date.getMonth()+1;
    //日
    var day=date.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var ss=date.getSeconds();
    var rq=year+'-'+month+'-'+day
     var nowday='';
     return nowday=rq;
}

Vue.prototype.Datetime=function(){
 let dateTime
       let yy = new Date().getFullYear()
       let mm = new Date().getMonth() + 1
       let dd = new Date().getDate()
       let hh = new Date().getHours()
       let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
         :
         new Date().getMinutes()
       let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
         :
         new Date().getSeconds()
//     dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
       dateTime =  hh + ':' + mf + ':' + ss
       return dateTime;

}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	 store,
  components: { App },
  template: '<App/>'
})
