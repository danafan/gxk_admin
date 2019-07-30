<template>
	<div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="commit_time" label="提交时间" align="center">
			</el-table-column>
			<el-table-column prop="id" label="交易流水号" align="center">
			</el-table-column>
			<el-table-column prop="store_admin_name" label="商家账号" align="center">
			</el-table-column>
			<el-table-column prop="open_account_name" label="开户名" align="center">
			</el-table-column>
			<el-table-column prop="bank_name" label="转账银行" align="center">
			</el-table-column>
			<el-table-column prop="money" label="转账金额" align="center">
			</el-table-column>
			<el-table-column prop="status_name" label="审核状态" align="center">
			</el-table-column>
			<el-table-column prop="check_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column prop="check_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button v-if="scope.row.status == 1" type="text" size="small" @click="look(scope.row.id)">查看</el-button>
					<el-button v-if="scope.row.status == 0" type="text" size="small" @click="check(scope.row.id)">审核</el-button>
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
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
	<el-dialog :title="dialogType == 1?'审核':'查看'" width="30%" center :visible.sync="showDialog">
		<div class="dialogItem">
			<div class="itemLabel">充值时间：</div>
			<div class="itemContent">{{rechangeObj.commit_time}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">充值商家：</div>
			<div class="itemContent">{{rechangeObj.store_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">交易流水号：</div>
			<div class="itemContent">{{rechangeObj.id}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">用户账号：</div>
			<div class="itemContent">{{rechangeObj.store_admin_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">汇款银行：</div>
			<div class="itemContent">{{rechangeObj.bank_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">汇款卡号：</div>
			<div class="itemContent">{{rechangeObj.bank_card_num}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">汇款人：</div>
			<div class="itemContent">{{rechangeObj.open_account_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">充值金额：</div>
			<div class="itemContent">{{rechangeObj.money}}</div>
		</div>
		<!-- 查看 -->
		<div v-if="dialogType == 2">
			<div class="dialogItem">
				<div class="itemLabel">审核人：</div>
				<div class="itemContent">{{rechangeObj.check_name}}</div>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">审核时间：</div>
				<div class="itemContent">{{rechangeObj.check_time}}</div>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">审核状态：</div>
				<div class="itemContent">{{rechangeObj.status}}</div>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">备注：</div>
				<div class="itemContent">{{rechangeObj.remark}}</div>
			</div>

		</div>
		<!-- 审核 -->
		<div v-if="dialogType == 1">
			<div class="dialogItem">
				<div class="itemLabel">审核操作：</div>
				<el-select v-model="checkReq.check_result" size="small" filterable placeholder="请选择">
					<el-option label="审核通过" value="1"></el-option>
					<el-option label="审核拒绝" value="0"></el-option>
				</el-select>
			</div>
			<div class="dialogItem">
				<div class="itemLabel">备注：</div>
				<el-input type="textarea" size="small" :rows="3" style="width: 300px" placeholder="请输入备注" v-model="checkReq.remark">
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
					pagesize:10,
				},
				dataObj:{},				//充值记录
				dialogType:1,
				showDialog:false,
				rechangeObj:{},			//充值记录详情
				checkReq:{
					check_result:"1",
					remark:""
				},						//审核参数
			}
		},
		props:{
			id:{
				type:String,
				default:""
			}
		},
		created(){
			//获取充值记录
			this.getList();
		},
		methods:{
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			},
			//获取充值记录
			getList(){
				this.req.store_id = this.id;
				resource.getRechangeList(this.req).then(res => {
					if(res.data.code = 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看
			look(id){
				this.dialogType = 2,
				resource.rechangeDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.rechangeObj = res.data.data;
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//审核
			check(id){
				this.dialogType = 1,
				resource.rechangeDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.rechangeObj = res.data.data;
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交审核
			submitCheck(){
				resource.rechargeCheck(this.checkReq).then(res => {
					if(res.data.code == 1){
						this.$message.warning(res.data.msg);
						this.showDialog = false;
						//获取充值记录
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
			
		}
	}
</script>











