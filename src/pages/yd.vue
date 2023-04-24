<template>
  <div  class="clm">
		<div class="lt"  v-show="!$store.state.view_all">
				<div>
					<p>园内有运单车辆</p>
					<p style="color: #00FFFF;"><span>{{info.yes_waybill_count}}</span>辆</p>
				</div>
				<div>
					<p>园内无运单车辆</p>
					<p style="color: #5DCAFE;"><span>{{info.no_waybill_count}}</span>辆</p>
				</div>
		</div>
		<div class="main">
  		<div :style="{width:'100%',height:'98vh'}">
				<iframe src="./static/map_car_dd/index.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>
			</div>
  	</div>
		<div class="rt"  v-show="!$store.state.view_all">
  			<div class="rt_item rt_item2">
  				<p class="title"><span>当月发运车次排行</span><span><span style="color: #FACD89;margin-right: .1rem;">统计时间12:00-1:00</span></span></p>
  				<div id="clms" ref="clms" style="width:100%;height: 25vh;"></div>
  			</div>
  			<div class="rt_item rt_item2">
  				<p class="title"><span>当月货物排行</span>  <span><span style="color: #FACD89;margin-right: .1rem;">统计时间12:00-1:00</span></span></p>
  				<div id="zhcl" ref="zhcl" style="width:100%;height: 25vh;"></div>
  			</div>
		</div>
  </div>
</template>

<script>
  export default {
    name: 'clm',
    components: {
    },
    data() {
      return {
      		myChart1: '',
      		myChart3: '',
      		info:'',
      		timer:null
      }
    },
    created() {
    	this.getdata();
    },
    computed: {
			initOption() {
				return {
					hoverStop: true, //鼠标移入时是否停止滚动
					singleHeight: 0,
					waitTime: 0,
					step: 0.2, // 滚动速度，越大越快
				}
			}
		},
    mounted() {
    		let _this=this;
    		this.timer =setInterval(function(){
    			_this.getdata();
    	},20000)
    	this.getmyChart1()//当日进出园区车辆数
    	this.getmyChart3()//当月货物排行
    	window.addEventListener('resize', ()=> {
					this.myChart1.resize();
					this.myChart3.resize();
			});
    },
    beforeDestroy() {
    clearInterval(this.timer);        
    this.timer = null;
		},
    methods: {
    	 getdata(){ // 获取基础数据
    		let _this=this;
    		 $.ajax({
						dataType: "json",
						type: "POST",
						url: this.testUrl+'api/Index/apppost',
						data: {
							action:'Screen/waybill_trend',
						},
						success: function(res) {
							if (res.code == 200) {
								_this.info=res.data.info;
							}
						}
					})
    		}, 
    	getmyChart1(){
      	var	option = {
			    title: {
			        text: '',
			        subtext: ''
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'value',
			        boundaryGap: [0, 0.01],
			        axisLine: {
							lineStyle: {
								color: '#ffffff',
								width: 1, //这里是为了突出显示加上的  
							}
						},
			        splitLine: {
							show: false,
							lineStyle: {
								type: 'dashed',
								color: 'rgba(255,255,255,0.3)',
							}
						},
			    },
			    yAxis: {
			        type: 'category',
			        data: ['化中大道区域', '重钢片区', '巴斯夫片区', '转盘片区', '转盘片区'],
			        axisLabel:{
//								formatter: function(val) {
//									var strs = val.split(''); //字符串数组
//									var str = ''
//									for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
//									str += s;
//									if(!(i % 4)) str += '\n'; //按需要求余
//									}
//									return str
//									}
			        },
			        axisLine: {
							lineStyle: {
								color: '#ffffff',
								width: 1, //这里是为了突出显示加上的  
							}
						},
						splitLine: {
							show: false,
							lineStyle: {
								type: 'dashed',
								color: 'rgba(255,255,255,0.3)',
							}
						},
			    },
			    series: [
			        {
			            name: '发运车次',
			            type: 'bar',
			            barWidth: '20%',
			            data: [1000, 2000, 3000, 4000,5000],
			            itemStyle: {
										normal:{
											 color: new echarts.graphic.LinearGradient(
			                    0, 0, 1, 0,
			                    [
			                        {offset: 0, color: '#5DCAFE'},
			                        {offset: 1, color: '#FACD89'}
			                    ]
			                )
										}
									},
			        }
			    ]
			};
				this.myChart1 = echarts.init(this.$refs.clms);
				this.myChart1.setOption(option);
    	},
    	getmyChart3() {
				var option = {
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: ['化中大道区域', '重钢片区', '巴斯夫片区', '转盘片区', '转盘片区', '梅塞尔片区', '晏家路口片区'],
						axisLabel: {
							interval: 0, //强制文字产生间隔
							rotate: 45, //文字逆时针旋转45°
							textStyle: { //文字样式
								color: "#ffffff",
								fontSize: '',
								fontFamily: 'Microsoft YaHei'
							}
						},
						axisTick: {
							alignWithLabel: true
						},
						axisLine: {
							lineStyle: {
								color: '#ffffff',
								width: 1, //这里是为了突出显示加上的  
							}
						},

					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ffffff',
								width: 1, //这里是为了突出显示加上的  
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: 'solid',
								color: 'rgba(255,255,255,0.1)',
							}
						},
					}],
					series: [{
						name: '区域车辆',
						type: 'bar',
						barWidth: '20%',
						  data: [120, 200, 150, 80, 70, 110, 130],
						itemStyle: {
							normal:{
								 color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#0082DC'},
//                      {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#00FFD8'}
                    ]
                )
							}
						}
					}]
				};
				this.myChart3 = echarts.init(this.$refs.zhcl);
				this.myChart3.setOption(option);
			}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
	
<style scoped lang="less">
.clm{
	height: 100vh;
	overflow: hidden;
	>div{
			height: 100vh;
		  width: 24%;
	}
	>.lt{
		position: absolute;
		top: .5rem;
		left: 0rem;
		z-index: 2;
		background: linear-gradient(90deg, rgba(14, 27, 82, 1) 0%, rgba(14, 27, 82, 0.2) 50%, rgba(14, 27, 82, 0) 100%);
		>div{
			width: 2.78rem;
			height: 0.9rem;
			margin: 0.2rem 0.2rem 0.6rem;
			>p{
				position: relative;
				top: .2rem;
				width: 1.4rem;
				text-align: left;
				margin-left: 1.2rem;
			}
			>p:nth-child(2){
				>span{
					font-weight: bold;
					font-size: 0.32rem;
					margin-right: 0.05rem;
				}
			}
		}
		>div:nth-child(2){
			background: url('../assets/yd_wu_img.png');
			background-size: cover;
			background-repeat: no-repeat;
		}
		>div:nth-child(1){
			background: url('../assets/yd_you_img.png');
			background-size: cover;
			background-repeat: no-repeat;
		}
	}
	>.rt{
		position: absolute;
		top: .5rem;
		right: 0rem;
		z-index: 2;
		background: linear-gradient(-90deg, rgba(14, 27, 82, 1) 0%, rgba(14, 27, 82, 0.2) 100%);
		>.rt_item{
			width: 100%;
			>.title{
				width: 100%;
				height: 0.32rem;
				background: linear-gradient(90deg, #3A6AA5 0%, rgba(58, 106, 165, 0) 100%, rgba(255, 255, 255, 0) 100%);
				line-height: 0.32rem;
				font-size: 0.18rem;
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 0 0.2rem;
				border-left: 3px solid #7ECEF4;
				>span:nth-child(2){
					font-size: 0.14rem;
					color: rgba(255,255,255,.5);
				}
			}
		}
		>.rt_item2{
				height: 30%;
				border: 1px solid rgba(126,206,244,.1);
			  margin: .1rem 0;
		}
	}
	>.main{
		position: absolute;
		width: 100vw;
		top:0.6rem;
		left: 0%;
		z-index: 1;
		height: 100vh;
	}	
}
</style>
