<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家账号：">
					<el-input v-model="req.admin_name" placeholder="请输入商家账号"></el-input>
				</el-form-item>
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="时间范围：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="req.status" filterable placeholder="请选择">
					<el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="commit_time" label="提交时间" align="center">
			</el-table-column>
			<el-table-column prop="id" label="交易流水号" align="center">
			</el-table-column>
			<el-table-column label="商家账号/名称" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.store_admin_name}}</span>/<span>{{scope.row.store_name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="open_account_name" label="开户名" align="center">
			</el-table-column>
			<el-table-column prop="bank_name" label="转账银行" align="center">
			</el-table-column>
			<el-table-column prop="money" label="转账金额（元）" align="center">
			</el-table-column>
			<el-table-column prop="status_name" label="审核状态" align="center">
			</el-table-column>
			<el-table-column prop="check_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column prop="check_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button v-if="scope.row.status == 0" type="text" size="small" @click="check(scope.row.id,1)">审核</el-button>
					<el-button v-else type="text" size="small" @click="check(scope.row.id,2)">查看</el-button>
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
</el-card>
<el-dialog :title="dialogType == 1?'审核':'查看'" width="30%" center :visible.sync="showDialog">
	<div class="dialogItem">
		<div class="itemLabel">充值时间：</div>
		<div class="itemContent">{{detailObj.commit_time}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">充值商家：</div>
		<div class="itemContent">{{detailObj.store_name}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">交易流水号：</div>
		<div class="itemContent">{{detailObj.id}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">用户账号：</div>
		<div class="itemContent">{{detailObj.store_admin_name}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">汇款银行：</div>
		<div class="itemContent">{{detailObj.bank_name}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">汇款卡号：</div>
		<div class="itemContent">{{detailObj.bank_card_num}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">汇款人：</div>
		<div class="itemContent">{{detailObj.open_account_name}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">充值金额：</div>
		<div class="itemContent">{{detailObj.money}}</div>
	</div>
	<!-- 查看 -->
	<div v-if="dialogType == 2">
		<div class="dialogItem">
			<div class="itemLabel">审核人：</div>
			<div class="itemContent">{{detailObj.check_name}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">审核状态：</div>
			<div class="itemContent">{{detailObj.status}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">审核时间：</div>
			<div class="itemContent">{{detailObj.check_time}}</div>
		</div>
		<div class="dialogItem">
			<div class="itemLabel">备注：</div>
			<div class="itemContent">{{detailObj.remark}}</div>
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
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					admin_name:"",
					store_name:"",
					start_datetime:"",
					end_datetime:"",
					status:"",
				},
				date:[],
				dataObj:{},					//获取到的信息
				statusList:[{
					id:"",
					name:"不限"
				},{
					id:0,
					name:"待审核"
				},{
					id:1,
					name:"审核通过"
				},{
					id:2,
					name:"审核拒绝"
				}],
				showDialog:false,
				dialogType:1,				//弹框类型
				checkReq:{
					id:"",
					check_result:"1",
					remark:""
				},							//审核提交的参数
				detailObj:{},				//提现详情
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		inject:['reload'],
		watch:{
			date:function(n){
				this.req.start_datetime = n?n[0]:"";
				this.req.end_datetime = n?n[1]:"";
			}
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
			//搜索
			search(){
				this.req.page = 1;
				//获取计划列表
				this.getList();
			},
			//获取列表
			getList(){
				resource.getRechangeList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
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
				resource.rechangeDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交审核
			submitCheck(){
				resource.rechargeCheck(this.checkReq).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
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








