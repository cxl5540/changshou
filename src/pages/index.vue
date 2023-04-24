<template>
  <div class="index">
  	<div class="lt"  v-show="!$store.state.view_all">
  			<div class="lt_num1">
  				<div v-for="item,index in lt_1" :key="index">
  					<p>{{item.title}}</p>
  				  <p><span :style="{color:item.color}">{{item.num}}</span>{{index=='0'?'家':index=='3'?'辆':'次'}}</p>
  				</div>
  			</div>
  			<div class="lt_num2">
  				<p class="title"><span>园区月报警趋势</span><span>{{bj_num}}辆</span></p>
  				<div id="allcars" ref="allcars" style="width:100%;height: 25vh;"></div>
  			</div>
  			<div class="lt_num3">
  				<p class="title"><span>园区车辆运单计数</span><span>{{yd_num}}次</span></p>
  				<div id="yqxz" ref="yqxz" style="width:100%;height: 25vh;"></div>
  			</div>
  	</div>
  	<div class="main">
  		<div :style="{width:'100%',height:'98vh'}">
					<iframe src="./static/map_video/index.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>
			</div>
			<div id="bg" style="width: 100%;height: 100vh;z-index: 9;" v-show="$store.state.index_bg">
	  		<img src="../assets/bg.gif" alt="" />
	  		<div class="show" @click="close()">
	  			<img src="../assets/show.png"/>
	  		</div>
	  	</div>
  	</div>
  	<div class="rt"  v-show="!$store.state.view_all">
  		 	<div class="rt_num1">
  		 		<p class="title"><span>危险源检测</span><span></span></p>
  		 		<div class="top_one">
							<div>
								<img src="../assets/zl_qyzy_h.png" alt="">
								<div>
									<p>{{lt_1[0].num}}</p>
									<span>企业危险源数</span>
								</div>
							</div>
							<div>
								<img src="../assets/zl_ydzy_r.png" alt="">
								<div style="background-color: #A40000;">
									<p>{{lt_1[3].num}}</p>
									<span>移动危险源数</span>
								</div>
					</div>
				</div>
  		 	</div>
  			<div class="rt_num2">
  				<p class="title"><span>昨日报警时间点</span><span style="opacity: 0;"></span></p>
  				<div id="point_time" ref="point_time" style="width:100%;height: 25vh;"></div>
  			</div>
  			<div class="rt_num3">
  				<p class="title"><span>综合区域车辆数量</span><span></span></p>
  				<div id="car_num" ref="car_num" style="width:100%;height: 25vh;"></div>
  			</div>
  	</div>

  </div>
</template>

<script>
  export default {
    name: 'index',
    components: {
    },
    data() {
      return {
      	yd_num:'',
      	bj_num:'',
      	map_s:true,
      	myChart1: '',
      	myChart2: '',
      	myChart3: '',
      	myChart4: '',
      	lt_1:[
      	 {title:'企业总数',num:'0',color:'#B7E8FF'},
      	 {title:'隐患报警总数',num:'0',color:'#E1B7FF'},
      	 {title:'发运作业总数',num:'0',color:'#B7FFE0'},
      	 {title:'当前危险源数',num:'0',color:'#FACD89'},
      	],
      	timer:null
      }
    },
    created() {
    	this.getdata();

    },
    mounted() {
    	let _this=this;
    		this.timer =setInterval(function(){
    			_this.getdata();
    	},20000)

    	this.getmyChart4()//区域综合车辆
    	window.addEventListener('resize', ()=> {
					this.myChart1.resize();
					this.myChart2.resize();
					this.myChart3.resize();
					this.myChart4.resize();
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
							action:'Screen/overview',
						},
						success: function(res) {
							if (res.code == 200) {
								_this.lt_1[0].num=res.data.info.enterprise_count;
								_this.lt_1[1].num=res.data.info.police_count;
								_this.lt_1[3].num=res.data.info.vehicle_count;
								_this.lt_1[2].num=res.data.info.waybill_count;
								var waybill_arr=res.data.waybill_arr;//运单次数
								var ydname_attr=[];
								for(var i=0;i<waybill_arr.length;i++){
									ydname_attr.push(waybill_arr[i].name);
									_this.yd_num=Number(waybill_arr[i].value)+Number(_this.yd_num);
								}
								_this.getmyChart2(ydname_attr,waybill_arr);
								var month_alarm_trend=res.data.month_alarm_trend; //趋势
								var m_attr=[];
								for(var j=0;j<month_alarm_trend.length;j++){
									var attr=[];
									attr[0]=month_alarm_trend[j].month;
									attr[1]=month_alarm_trend[j].count;
									_this.bj_num=Number(month_alarm_trend[j].count)+Number(_this.bj_num);
									m_attr.push(attr)
								}
								_this.getmyChart1(m_attr);
								var police_arr=res.data.police_arr;//报警次数
								var time_n=[]
								for(var i=0;i<police_arr.length;i++){
									time_n.push(police_arr[i].name);
								}
								_this.getmyChart3(time_n,police_arr);
							}
						},
						error: function(res) {},
					});
    	},
    	close(){
    		this.$store.state.index_bg=false;
    	},
    	getmyChart1(m_attr){ //园区总车辆趋势
				var 	option = {
						tooltip: {
							trigger: 'axis',
							  formatter:function(params) {
							  	 var relVal = params[0].value;
							  	 return relVal[0]+'月'+'<br/>'+relVal[1]+'辆';
							  },
							axisPointer: {
								type: 'cross',
								label: {
									backgroundColor: '#000000'
								}
							}
						},
					    xAxis: {
					        type: 'category',
					        boundaryGap: false,
					        axisLine: {
									lineStyle: {
										color: '#D2F1FF',
										width: 1, //这里是为了突出显示加上的
									}
								},
								splitLine: {
									show: false,
								},
					    },
					    yAxis: {
					        type: 'value',
					        boundaryGap: [0, '30%'],
					        axisLine: {
									lineStyle: {
										color: '#D2F1FF',
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
					    },
					    visualMap: {
					        type: 'piecewise',
					        show: false,
					        dimension: 0,
					        seriesIndex: 0,
					    },
					    series: [
					        {
					            type: 'line',
					            smooth: 0.6,
					            symbol: 'none',
					            lineStyle: {
					                color: '#B7FFE0',
					                width:1
					            },
					            markLine: {
					                symbol: ['none', 'none'],
					                label: {show: false},
					            },
					            areaStyle: {
												normal: {
													color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
															offset: 0,
															color: '#B7FFE0'
														},
														{
															offset: 0.5,
															color: ' rgba(183, 255, 224, 0.5)'
														},
														{
															offset: 1,
															color: 'rgba(183, 255, 224, 0)'
														}
													])
												},

											},
					            data: m_attr
					        }
					    ]
					};
					this.myChart1 = echarts.init(this.$refs.allcars);
					this.myChart1.setOption(option);
    	},
    getmyChart2(nameattr,dataattr){ //园区卸载次数
    	 var	option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: '{a} <br/>{b}: {c} ({d}%)'
			    },
			    legend: {
			        orient: 'vertical',
			        left: 10,
			        textStyle: {
							color: '#ffffff'
							},
							data:nameattr,
			    },
			    color: ['#8486F4','#F077B3', '#FFBD27', '#89DE79', '#64B9EA'],
			    series: [
			        {
			            name: '运单计数（次）',
			            type: 'pie',
			            radius: ['50%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                show: false,
			                position: 'center'
			            },
			            emphasis: {
			                label: {
			                    show: false,
			                    fontSize: '30',
			                    fontWeight: 'bold'
			                }
			            },
			            labelLine: {
			                show: false
			            },
			            data:dataattr
			        }
			    ]
			};

    		this.myChart2 = echarts.init(this.$refs.yqxz);
			  this.myChart2.setOption(option);
    	},
    	getmyChart3(time_n,police_arr) {  //昨日事件
				var option = {
					tooltip: {
						trigger: 'item',
						// formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					color: ['#29ABE2', '#5678FF', '#E68059', '#9F65F5', '#EE677B', '#29ABE2', '#EBAE47', '#6FD7B0', '#5678FF'],
					series: [{
						name: '昨日报警（次）',
						type: 'pie',
						radius: ['50%', '70%'],
						center:['50%','55%'],
						avoidLabelOverlap: true,
						label: {
							show: false,
							position: 'center'
						},
						emphasis: {
							label: {
								show: true,
								fontSize: '30',
								fontWeight: 'bold'
							}
						},
						data: police_arr,
						roseType: '',
						label: {
							color: 'rgba(255, 255, 255, 1)'
						},
						labelLine: {
							lineStyle: {
								color: 'rgba(255, 255, 255, 0.3)'
							},
							smooth: 0.2,
							length: 10,
							length2: 20
						},
					}, ]
				};
				this.myChart3 = echarts.init(this.$refs.point_time);
				this.myChart3.setOption(option);

			},
			getmyChart4() {
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
								type: 'dashed',
								color: 'rgba(255,255,255,0.3)',
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
				this.myChart4 = echarts.init(this.$refs.car_num);
				this.myChart4.setOption(option);
			}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.index{
	height: 100vh;
	overflow: hidden;
	>div{
		height: 100vh;
		width: 24%;
		>div{
		/*	background: rgba(14,27,82,.6);*/
			height: 30%;
			width: 100%;
			border: 1px solid rgba(126,206,244,.1);
			margin: .1rem 0;
		}
	}
	>.lt{
		position: absolute;
		top: .5rem;
		left: 0rem;
		z-index: 2;
		background: linear-gradient(90deg, rgba(14, 27, 82, 1) 0%, rgba(14, 27, 82, 0.2) 100%);
		>.lt_num1{
			display: flex;
			border: none;
			flex-wrap: wrap;
			justify-content: space-around;
			background: url('../assets/date_xk_img.png') /*rgba(14,27,82,.6)*/;
			background-size: 100%;
   	 background-repeat: no-repeat;
    	background-position-y: bottom;
			>div{
				width: 1.98rem;
				height: 0.88rem;
				background: url('../assets/date_xk.png');
				background-size: cover;
				background-repeat: no-repeat;
				>p:nth-child(1){
					margin-top: 0.15rem;
				}
				>p:nth-child(2){
					margin-top: 0.05rem;
					>span{
						font-size: 0.3rem;
						font-weight: bold;
						margin-right: .1rem;
					}
				}
			}
			>div:nth-child(1),div:nth-child(2){
				position: relative;
				top: .3rem;
			}
		}
		>div{
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
	}
	>.rt{
		position: absolute;
		top: .5rem;
		right: 0rem;
		z-index: 2;
		background: linear-gradient(-90deg, rgba(14, 27, 82, 1) 0%, rgba(14, 27, 82, 0.2) 100%);
		>div{
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
		>.rt_num1{
			>.top_one{
				>div{
					display: inline-block;
					width: 38%;
					margin: 0.45rem 0.1rem 0;
					>img{
						height: 10vh;
						margin-bottom: 0.1rem;
					}
					>div{
						width: 100%;
						height: 0.74rem;
						background-color: #D98F00;
						border-radius: 0.06rem;
						>p{
							font-weight: bold;
							padding: 0.03rem 0;
							font-size: .3rem;
						}
						>span{
							font-weight: bold;
							font-size: .18rem;
						}
					}
				}
			}
		}
	}
	.main{
		position: absolute;
		width: 100vw;
		top:0.5rem;
		left: 0%;
		z-index: 1;
		/*margin-left: -24vw;*/
		height: 100vh;
		>#bg{
			width: 100%;
			height: 100%;
			z-index: 3;
			position: absolute;
			left: 0;
			top: 0rem;
			>img{
				width: 100%;
				height: 100%;
			}
			>.show{
				width: 1.7rem;
				height: 1.8rem;
				position: absolute;
				bottom: 1rem;
				right: 26%;
				>img{
					max-width: 100%;
					cursor: pointer;
				}
			}
		}
	}
}
</style>
