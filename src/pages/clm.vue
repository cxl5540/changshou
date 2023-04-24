<template>
  <div  class="clm">
		<div class="lt" v-show="!$store.state.view_all">
				<div>
					<p>绿码车辆</p>
					<p style="color: #00FF00;"><span>{{info.green_code_count}}</span>辆</p>
				</div>
				<div>
					<p>黄码车辆</p>
					<p style="color: #FFFF00;"><span>{{info.yellow_code_count}}</span>辆</p>
				</div>
				<div>
					<p>红码车辆</p>
					<p style="color:#FF0000;"><span>{{info.red_code_count}}</span>辆</p>
				</div>
		</div>
		<div class="main">
  		<div :style="{width:'100%',height:'98vh'}">
					<iframe src="./static/map_car_clm/index.html" frameborder="0" style="width: 100%;height: 100%;"></iframe>
			</div>
  	</div>
		<div class="rt" v-show="!$store.state.view_all">
			 <div class="lt_num1">
  				<div>
  					<p>当日入园上报数</p>
  				  <p><span style="color: #B7E8FF;">{{info.report_count}}</span>次</p>
  				</div>
  				<div>
  					<p>当日入园未上报数</p>
  				  <p><span style="color: #B7E8FF;">{{info.no_report_count}}</span>次</p>
  				</div>
  			</div>
  			<div class="rt_item rt_item2">
  				<p class="title"><span>车辆码当月入园次数统计</span><span></span></p>
  				<div id="clms" ref="clms" style="width:100%;height: 25vh;"></div>
  			</div>
  			<div class="rt_item rt_item3">
  				<p class="title"><span>滚动报警</span><span style="color: #FACD89;">当前报警数{{police_list.count}}条</span></p>
  				<div>
  					<ul class="li_ti">
  						<li>车牌号</li>
  						<li>报警行为</li>
  						<li>事件触发</li>
  						<li>报警时间</li>
  					</ul>
  					<vue-seamless-scroll :data="police_list.list" class="seamless-warp"  :class-option="initOption" style="height: 100%;padding: 0 0.2rem; box-sizing: border-box;overflow: hidden;" >
				        <ul class="item"  v-for="item in police_list.list">
							   <li>{{item.license}}</li>
							   <li>{{item.name}}</li>
							   <li>{{item.trigger_type==1?'自动':'手动'}}</li>
							   <li>{{item.create_time}}</li>
				        </ul>
					 </vue-seamless-scroll>
  				</div>
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
      		list:[
      		 {license:'渝E1231',xw:'禁停路段行驶',cf:'自动',time:'2020-02-01 14:22:00'},
      		 {license:'渝E1231',xw:'禁停路段行驶',cf:'自动',time:'2020-02-01 14:22:00'},
      		 {license:'渝E1231',xw:'禁停路段行驶',cf:'自动',time:'2020-02-01 14:22:00'},
      		 {license:'渝E1231',xw:'禁停路段行驶',cf:'自动',time:'2020-02-01 14:22:00'},
      		],
      		info:'',
      		police_list:'',
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
//  	this.getmyChart1()//车辆码
    	window.addEventListener('resize', ()=> {
					this.myChart1.resize();
			});
    },
   beforeDestroy() {
		    clearInterval(this.timer);        
		    this.timer = null;
		},
    methods: {
    	getdata(){
    		let _this=this;
    		 $.ajax({
						dataType: "json",
						type: "POST",
						url: this.testUrl+'api/Index/apppost',
						data: {
							action:'Screen/vehicle_code',
						},
						success: function(res) {
							if (res.code == 200) {
								_this.info=res.data.info;
								_this.police_list=res.data.police_list;
								var month_arr=res.data.month_arr;var r_attr=[],g_attr=[],y_attr=[],m_attr=[];
								for(var i=0;i<month_arr.length;i++){
									 r_attr.push(month_arr[i].red_count);
									 g_attr.push(month_arr[i].green_count);
									 y_attr.push(month_arr[i].yellow_count);
									 m_attr.push(month_arr[i].month);
								}
								_this.getmyChart1(m_attr,r_attr,y_attr,g_attr);
							}
						}
					})	
    	},
    	getmyChart1(m_attr,r_attr,y_attr,g_attr){
    	var	option = {
				    color: ['#00FF00', '#FFFF00', '#FF0000'],
				    title: {
				        text: ''
				    },
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        }
				    },
				    legend: {
					        data: ['绿码', '黄码', '红码'],
					        textStyle: {
									fontSize: 12,
									color: '#fff'
								}
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis: [
				        {
				            type: 'category',
				            boundaryGap: false,
				            data: m_attr,
				            axisLine: {
											lineStyle: {
												color: '#D2F1FF',
												width: 1, //这里是为了突出显示加上的  
											}
										},
										splitLine: {
											show: false,
										},
				        }
				    ],
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
				    series: [
				        {
				            name: '绿码',
				            type: 'line',
				            stack: '总量',
				            smooth: true,
				            lineStyle: {
				                width: 0
				            },
				            showSymbol: false,
				            areaStyle: {
				                opacity: 0.8,
				                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                    offset: 0,
				                    color: 'rgba(10, 255, 0, .8)'
				                }, {
				                    offset: 1,
				                    color: 'rgba(0, 255, 0, 0.1)'
				                }])
				            },
				            emphasis: {
				                focus: 'series'
				            },
				            data: g_attr
				        },
				        {
				            name: '黄码',
				            type: 'line',
				            stack: '总量',
				            smooth: true,
				            lineStyle: {
				                width: 0
				            },
				            showSymbol: false,
				            areaStyle: {
				                opacity: 0.8,
				                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                    offset: 0,
				                    color: 'rgba(255,255,0,.8)'
				                }, {
				                    offset: 1,
				                    color: 'rgba(255,255,0,0.1)'
				                }])
				            },
				            emphasis: {
				                focus: 'series'
				            },
				            data:y_attr
				        },
				        {
				            name: '红码',
				            type: 'line',
				            stack: '总量',
				            smooth: true,
				            lineStyle: {
				                width: 0
				            },
				            showSymbol: false,
				            areaStyle: {
				                opacity: 0.8,
				                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                    offset: 0,
				                    color: 'rgba(255,0,0,.8)'
				                }, {
				                    offset: 1,
				                    color: 'rgba(255,0,0,.1)'
				                }])
				            },
				            emphasis: {
				                focus: 'series'
				            },
				            data: r_attr
				        },
				    ]
				};
				this.myChart1 = echarts.init(this.$refs.clms);
				this.myChart1.setOption(option);
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
				width: 1rem;
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
		>div:nth-child(3){
			background: url('../assets/ma_img_red.png');
			background-size: cover;
			background-repeat: no-repeat;
		}
		>div:nth-child(2){
			background: url('../assets/ma_img_yellow.png');
			background-size: cover;
			background-repeat: no-repeat;
		}
		>div:nth-child(1){
			background: url('../assets/ma_img_green.png');
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
		
		>.lt_num1{
			margin-top: .2rem;
			display: flex;
			justify-content: space-between;
			>div{
				display: inline-block;
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
		}
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
		>.rt_item3{
			  height: 60%;
				border: 1px solid rgba(126,206,244,.1);
			  margin: .1rem 0;
			  >div{
			  	text-align: left;
			  	li:nth-child(1){
			  		width: 18%;
			  	}
			  	li:nth-child(2){
			  		width: 25%;
			  	}
			  	li:nth-child(3){
			  		width: 15%;
			  	}
			  	li:nth-child(4){
			  		width: 35%;
			  	}
			  	>ul{
			  		width:90%;
						height: 0.39rem;
			  		background: url('../assets/date_dkwbt_img.png');
			  		background-size: 100%;
			  		margin: .1rem auto;
			  		padding: 0 .12rem;
			  		>li{
			  			display: inline-block;
			  			font-size: 0.14rem;
			  			line-height: .39rem;
			  		}
			  	}
			  	.item{
			  		margin: 0.1rem 0;
			  		>li{
			  			display: inline-block;
			  			font-size: 0.14rem;
			  			padding: .05rem 0;
			  		}
			  	}
			  	.item:nth-child(2n){
			  			background: rgba(126,206,244,.1);
			  	}
			  }
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
