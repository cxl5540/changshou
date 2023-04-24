<template>
  <div class="header">
     <div class="lt">
     	<div class="logo" @click="goindex()">
     		<span>封闭管理运营中心</span>
     	</div>
       <div class="title">
         <img v-for="item,index in titleimg" :key='index' :src="active==index?item.acurl:item.url" @click="gopage(index,item.pageurl)">
       </div> 
     </div>
     <div class="rt">
     	 <div>
     	 	<span class="view" @click="viewall()" :style="{color:($store.state.view_all?'#FACD89':'#fff')}" >{{$store.state.view_all?'打开侧边栏':'收起侧边栏'}}</span>
       	 <span>当前日期： {{this.nowTime}}</span>
       	<!-- <span>DATE: {{this.initnowday()}}</span>-->
       	 <span>天气：{{lowest}}~{{highest}}</span>
       </div>
     </div>
  </div>
</template>

<script>
  export default {
    name: 'newslist',
    components: {},
    data() {
      return {
      	lowest:'',
      	highest:'',
      	nowTime: new Date(),
      	setTime:'',
      	active:0,
      	titleimg:[
      	 {url:require('../assets/title_zl_n.png'),acurl:require('../assets/title_zl_p.png'),pageurl:'/'},
         {url:require('../assets/title_clm_n.png'),acurl:require('../assets/title_clm_p.png'),pageurl:'/clm'},
         {url:require('../assets/title_cldt_n.png'),acurl:require('../assets/title_cldt_p.png'),pageurl:'/cldt'},
         {url:require('../assets/title_yddt_n.png'),acurl:require('../assets/title_yddt_p.png'),pageurl:'/yddt'},
      	]
      }
    },
     computed:{
      },
    created() {
    	var this_ = this; //声明一个变量代表this，保证this的指向正确
		   this.setTime = setInterval(function() {  //使用定时器，每一秒执行一次
		     this_.nowTime = //将获取的时间戳转换成日常的时间格式
		       new Date().getFullYear() + "-" +
		       this_.appendZero((new Date().getMonth() + 1)) + "-" +
		       this_.appendZero(new Date().getDate()) + " " +
		       this_.appendZero(new Date().getHours()) + ":" +
		       this_.appendZero(new Date().getMinutes()) + ": " +
		       this_.appendZero(new Date().getSeconds());
		   }, 1000);
    	for(var i=0;i<this.titleimg.length;i++){
    		if(this.$route.path==this.titleimg[i].pageurl){
    				this.active=i;
    		}
    	}
    },
    mounted() {
    	this.gettianqi();
    },
    beforeDestroy: function() {
    if (this.setTime) {
      clearInterval(this.setTime);
    }
    },
    methods: {
    	goindex(){
    		this.$store.state.index_bg=true;
    		this.$router.push('/');
    		this.active=0;
    	},
			gopage(index,url){
				this.active=index;
				this.$router.push(url)
			},
			appendZero(time){
	      if (time < 10) {
	        return "0" + time;
	      }else {
	        return time;
	      }
	    },
	    gettianqi(){
	    	let _this = this;
		      $.ajax({
		      	dataType: "json",
		      	type: "GET",
		        url:"http://api.tianapi.com/txapi/tianqi/index?key=7775f2561e7a0edb5e7f5b9c4edbff28&city=重庆市",
		      	data: {},
		      	success: function(res) {
		      		if (res.code == 200) {
		      			_this.lowest=res.newslist[0].lowest;
		      			_this.highest=res.newslist[0].highest;
		      		} else {
		      			
		      		}
//		
		      	},
		      });
	    },
	    viewall(){
	    	this.$store.state.view_all=!this.$store.state.view_all;
	    }
    }
  }
</script>

<style scoped lang="less">
.header{
	width: 100%;
	height: 0.6rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	line-height: .55rem;
	/*margin-top: .1rem;*/
	z-index: 3;
	background: #000000;
background: linear-gradient(180deg, #0E1B52 0%, #12377C 100%);
	>.lt{
		display: flex;
		align-items: center;
		justify-content: space-between;
		>.logo{
			width: 3.13rem;
			height: 0.6rem;
			background: url('../assets/title_img.png');
			background-size: 100%;
			background-repeat: no-repeat;
			margin-right: 0.5rem;
			cursor: pointer;
			position: relative;
			top: .1rem;
			>span{
				font-size: 0.28rem;
				font-weight: bold;
				display: inline-block;
				margin-left: 0.3rem;
				line-height: .4rem;
			}
		}
		.title{
			display: flex;
			align-items: center;
			>img{
				margin: 0 0.1rem;
				cursor: pointer;
			}
		}
	}
	>.rt{
		>div{
			display: flex;
			align-items: center;
			>span{
				display: inline-block;
				/*border-left: 1px solid #333;
				border-right: 1px solid #333333;*/
				padding: 0 0.2rem;
			/*	margin: 0 0.18rem;*/
			}
			>.view{
				cursor: pointer;
			}
		}
	}
}
</style>
