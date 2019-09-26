<template>
	<div>
		<el-card style="padding:0 30px">
			<div class="indexInfo">
				<div class="infoItem">
					<img class="infoIcon" src="../../assets/money1.png">
					<div class="infoText">
						<div class="title">今日充值金额</div>
						<div class="money">{{indexData.rechargeTotal}}</div>
					</div>
				</div>
				<div class="infoItem">
					<img class="infoIcon" src="../../assets/money2.png">
					<div class="infoText">
						<div class="title">今日提现金额</div>
						<div class="money">{{indexData.withdrawTotal}}</div>
					</div>
				</div>
				<div class="infoItem">
					<img class="infoIcon" src="../../assets/zhishu.png">
					<div class="infoText">
						<div class="title">商家数</div>
						<div class="money">{{indexData.storeNum}}</div>
					</div>
				</div>
				<div class="infoItem">
					<img class="infoIcon" src="../../assets/order_num.png">
					<div class="infoText">
						<div class="title">订单量</div>
						<div class="money">{{indexData.orderTotal}}</div>
					</div>
				</div>
				<div class="infoItem">
					<img class="infoIcon" src="../../assets/ico-jrcwss.png">
					<div class="infoText">
						<div class="title">本月收入</div>
						<div class="money">{{indexData.thisMonthIncome}}</div>
					</div>
				</div>
			</div>
			<div class="processed">
				<div class="processedTitle">待处理事务</div>
				<div class="processCon">
					<div class="processRow">
						<div class="rowItem" @click="$router.push('/merchantTopup')">商家充值待审（<span>{{indexData.rechargeWaitCheck}}</span>）</div>
						<div class="rowItem" @click="$router.push('/identity')">用户身份待审（<span>{{indexData.identityCardWaitCheck}}</span>）</div>
						<div class="rowItem">任务订单待审（<span>{{indexData.orderWaitCheck}}</span>）</div>
					</div>
					<div class="processRow">
						<div class="rowItem" @click="$router.push('/withdrawal')">提现待审（<span>{{indexData.withdrawWaitCheck}}</span>）</div>
						<div class="rowItem" @click="$router.push('/wangwang')">旺旺号待审（<span>{{indexData.wwWaitCheck}}</span>）</div>
						<div class="rowItem" @click="$router.push('/bankCard')">银行卡待审（<span>{{indexData.bankCardWaitCheck}}</span>）</div>
					</div>
					<div class="processRow">
						<div class="rowItem" @click="$router.push('/withdrawal')">总代理提现待审（<span>{{indexData.AgentAdminWithdrawWaitCheck}}</span>）</div>
						<div class="rowItem" @click="$router.push('/wangwang')">代理提现待审<span>{{indexData.AgentWithdrawWaitCheck}}</span>）</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.indexInfo{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.infoItem{
		display:flex;
		align-items: center;
		border: 1px solid #ccc;
		justify-content: center;
		width: 210px;
		height: 100px;
		.infoIcon{
			margin-right: 20px;
			width: 42px;
			height: 44px;
		}
		.infoText{
			font-size: 18px;
			color: #8a8a8a;
		}
		.money{
			font-size: 18px;
			color: #333;
		}
	}
}
.processed{
	margin-top: 30px;
	border: 1px solid #ccc;
	.processedTitle{
		padding-left: 20px;
		border-bottom: 1px solid #ccc;
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		font-weight: bold;
	}
	.processCon{
		padding: 20px 20px 10px 20px;
		font-size: 14px;
		.processRow{
			margin-bottom: 10px;
			display:flex;
			.rowItem{
				width: 30%;
				span{
					color: red;
				}
			}
			.rowItem:hover{
				color: red;
			}
		}
	}
}
.storeInfo{
	width: 100%;
	display:flex;
	flex-direction: column;
	align-items: center;
	.storeItem{
		font-size: 14px;
		margin-bottom: 24px;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				indexData:{},				//首页信息
				
			}
		},
		created(){
			//获取首页信息
			this.getIndex();
		},
		inject:['reload'],
		methods:{
			//获取首页信息
			getIndex(){
				resource.getIndex().then(res => {
					if(res.data.code == 1){
						this.indexData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>



