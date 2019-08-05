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
				</div>
			</div>
		</el-card>
		<el-card style="width: 300px;margin-top: 24px;">
			<div class="storeInfo">
				<div>
					<div class="storeItem">收款银行：{{bankObj.bank_name}}</div>
					<div class="storeItem">银行卡号：{{bankObj.bank_card_num}}</div>
					<div class="storeItem">户名：{{bankObj.open_account_name}}</div>
					<div class="storeItem">支行：{{bankObj.open_account_bank}}</div>
				</div>
				<el-button type="primary" size="small" @click="edior">编辑信息</el-button>
			</div>
		</el-card>
		<el-dialog width="40%" title="编辑信息" :visible.sync="isEdior">
			<el-form>
				<el-form-item label="收款银行：" label-width="120px">
					<el-input style="width: 300px" v-model="req.bank_name" size="small" placeholder="输入收款银行"></el-input>
				</el-form-item>
				<el-form-item label="银行卡号：" label-width="120px">
					<el-input style="width: 300px" type="number" v-model="req.bank_card_num" size="small" placeholder="输入银行卡号"></el-input>
				</el-form-item>
				<el-form-item label="户名：" label-width="120px">
					<el-input style="width: 300px" v-model="req.open_account_name" size="small" placeholder="输入户名"></el-input>
				</el-form-item>
				<el-form-item label="支行：" label-width="120px">
					<el-input style="width: 300px" v-model="req.open_account_bank" size="small" placeholder="输入支行"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="save">保存</el-button>
			</div>
		</el-dialog>
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
				isEdior:false,
				bankObj:{},
				req:{
					bank_name:"",
					bank_card_num:"",
					open_account_name:"",
					open_account_bank:""
				},
				indexData:{},				//首页信息
				
			}
		},
		created(){
			//获取首页信息
			this.getIndex();
			//获取银行卡信息
			this.getBank();
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
			},
			//获取银行卡信息
			getBank(){
				resource.getBankInfo().then(res => {
					if(res.data.code == 1){
						this.bankObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			edior(){
				let bank_name = this.bankObj.bank_name;
				let bank_card_num = this.bankObj.bank_card_num;
				let open_account_name = this.bankObj.open_account_name;
				let open_account_bank = this.bankObj.open_account_bank;
				this.isEdior = true;
				this.req.bank_name = bank_name;
				this.req.bank_card_num = bank_card_num;
				this.req.open_account_name = open_account_name;
				this.req.open_account_bank = open_account_bank;
			},
			//保存
			save(){
				if(this.req.bank_name == ''){
					this.$message.warning('请输入银行卡名称');
				}else if(this.req.bank_card_num == ''){
					this.$message.warning('请输入银行卡号');
				}else if(this.req.open_account_name == ''){
					this.$message.warning('请输入开户姓名');
				}else if(this.req.open_account_bank == ''){
					this.$message.warning('请输入支行名称');
				}else{
					resource.updateBank(this.req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.isEdior = false;
							this.reload();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
		}
	}
</script>



