<template>
  <div id="app">
      <Header></Header>
 			<router-view/>
  </div>
</template>

<script>
  import Header from './components/header';
export default {

  name: 'App',
    components:{
      Header
      },
  data(){
    return {
    }
  },
  created(){
		 this.fontsize();
		 let _this=this;
  	$(window).resize(function () {
		   _this.fontsize();
		});
  },
  watch:{

  },
  methods:{
		fontsize(){
			var size;
			var winW = $(window).width();
			if (winW <= 1750 && winW > 1250) {
			    size = Math.round(winW / 17.5);
			} else if(winW <= 1250 && winW > 800){
			    size = Math.round(winW / 14.5);
			}
			 else if (winW <= 800) {
			    size = Math.round(winW / 7.5);
			    if (size > 65) {
			        size = 65;
			    }
			} else {
			    size = 100;
			}
			$('html').css({
			    'font-size': size + 'px'
			})
		}
  }
}
</script>

<style>
#app {
  font-family: 'MicrosoftYaHei', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #FFFFFF;
  font-size: 0.16rem;
  margin: 0px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /*	background: rgba(14,27,82,.6);*/
  background: #05153d;
}
body{
	height: 100vh;
	overflow: hidden;
}
body,p,h1,h2,h3,h4,h5,ul,li{
	margin: 0;
	padding: 0;
}
li{
	list-style: none;
}
button{
  border: none;
}
input:focus,select:focus,textarea:focus{
  border: 1px solid #0082dc !important;
  outline: none;
}
button:focus{
	outline: none;
}



</style>
