<template>
	<div>
		<el-card>
			<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="apply_time" label="提交时间" align="center">
				</el-table-column>
				<el-table-column prop="id" label="交易流水号" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="用户昵称" align="center">
				</el-table-column>
				<el-table-column prop="store_name" label="提现信息" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.withdrawal_method == 1">
							<p>提现方式：微信</p>
							<p>微信昵称：{{scope.row.name}}</p>
						</div>
						<div v-if="scope.row.withdrawal_method == 2">
							<p>提现方式：银行卡</p>
							<p>用户姓名：{{scope.row.name}}</p>
							<p>提现银行：{{scope.row.bank_name}}</p>
							<p>银行卡号：{{scope.row.bank_card}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="amount" label="提现金额（元）" align="center">
				</el-table-column>
				<el-table-column prop="service_charge" label="审核状态" align="center">
					<template slot-scope="scope">
						<p v-if="scope.row.check_status == 0">待审核</p>
						<p v-if="scope.row.check_status == 1">审核通过</p>
						<p v-if="scope.row.check_status == 2">审核失败</p>
					</template>
				</el-table-column>
				<el-table-column prop="check_time" label="审核时间" align="center">
				</el-table-column>
				<el-table-column prop="check_name" label="审核人" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" >
					<template slot-scope="scope">
						<el-button v-if="scope.row.check_status == 0" type="text" size="small" @click="check(scope.row.id,1)">审核</el-button>
						<el-button v-if="scope.row.check_status == 1" type="text" size="small" @click="check(scope.row.id,2)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="req.page"
				:pager-count="11"
				:page-sizes="[5, 10, 15, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="dataObj.count"
				>
			</el-pagination>
		</div>
	</el-card>
	<el-dialog :title="dialogType == 1?'审核':'查看'" center :visible.sync="showDialog">
		<div class="dialogItem">
			<div class="itemLabel">提交时间：</div>
			<div class="itemContent">{{detailObj.apply_time}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">交易流水号：</div>
			<div class="itemContent">{{detailObj.id}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">用户账号：</div>
			<div class="itemContent">{{detailObj.phone}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">用户姓名：</div>
			<div class="itemContent">{{detailObj.real_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">提现方式：</div>
			<div class="itemContent" v-if="detailObj.withdrawal_method == 1">微信</div>
			<div class="itemContent" v-if="detailObj.withdrawal_method == 2">银行卡</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">提现银行：</div>
			<div class="itemContent">{{detailObj.bank_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">银行卡号：</div>
			<div class="itemContent">{{detailObj.bank_card}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">银行卡实名：</div>
			<div class="itemContent">{{detailObj.name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">提现金额：</div>
			<div class="itemContent">{{detailObj.amount}}</div>
		</div>
		<!-- 查看 -->
		<div v-if="dialogType == 2">
			<div class="dialogItem">
				<div class="itemLabel">审核状态：</div>
				<div class="itemContent" v-if="detailObj.check_status == 1">审核通过</div>
				<div class="itemContent" v-if="detailObj.check_status == 0">审核通过</div>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">审核时间：</div>
				<div class="itemContent">{{detailObj.check_time}}</div>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">备注：</div>
				<div class="itemContent">{{detailObj.comment}}</div>
			</div>

		</div>
		<!-- 审核 -->
		<div v-if="dialogType == 1">
			<div class="dialogItem">
				<div class="itemLabel">审核操作：</div>
				<el-select v-model="checkReq.status" size="small" filterable placeholder="请选择">
					<el-option label="审核通过" value="1"></el-option>
					<el-option label="审核拒绝" value="0"></el-option>
				</el-select>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">备注：</div>
				<el-input type="textarea" size="small" :rows="3" style="width: 300px" placeholder="请输入备注" v-model="checkReq.comment">
				</el-input>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" v-if="dialogType == 2" @click="showDialog = false"> 返回</el-button>
			<el-button size="small" v-if="dialogType == 1" @click="showDialog = false">取消</el-button>
			<el-button size="small" v-if="dialogType == 1" type="primary" @click="submitCheck">确 定</el-button>
		</span>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.dialogItem{
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	font-size: 14px;
	.itemLabel{
		width: 100px;
		font-weight: bold;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					size:10
				},
				dataObj:{},					//获取到的信息
				statusList:[{
					id:"",
					name:"不限"
				},{
					id:0,
					name:"提现中"
				},{
					id:1,
					name:"提现成功"
				},{
					id:2,
					name:"提现失败"
				}],
				typeList:[{
					id:"",
					name:"不限"
				},{
					id:1,
					name:"微信"
				},{
					id:2,
					name:"银行卡"
				}],
				showDialog:false,
				dialogType:1,				//弹框类型
				checkReq:{
					id:"",
					status:"1",
					comment:""
				},							//审核提交的参数
				detailObj:{},				//提现详情
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		props:{
			phone:{
				type:String,
				default:""
			}
		},
		methods:{
			//分页
			handleSizeChange(val) {
				this.req.size = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				this.req.phone = this.phone;
				resource.cashRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//操作
			check(id,type){
				this.checkReq.id = id;
				this.showDialog = true;
				this.dialogType = type;
				resource.withdrawDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交审核
			submitCheck(){
				resource.withdrawCheck(this.checkReq).then(res => {
					if(res.data.code == 1){
						this.$message.warning(res.data.msg);
						this.showDialog = false;
						this.reload();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
			
		}


	}
</script>








