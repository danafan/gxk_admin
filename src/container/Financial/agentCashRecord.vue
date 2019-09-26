<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="代理账号：">
					<el-input v-model="req.account" placeholder="请输入代理账号"></el-input>
				</el-form-item>
				<el-form-item label="代理名称：">
					<el-input v-model="req.name" placeholder="请输入代理账号"></el-input>
				</el-form-item>
				<el-form-item label="状态：">
					<el-select v-model="req.status" filterable placeholder="请选择">
						<el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提交时间：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small" @click="dao">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="apply_time" label="提交时间" align="center">
			</el-table-column>
			<el-table-column prop="agent_name" label="代理名称" align="center">
			</el-table-column>
			<el-table-column prop="agent_account" label="代理账号" align="center">
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
			:total="dataObj.total"
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
		<div class="itemLabel">代理账号：</div>
		<div class="itemContent">{{detailObj.agent_account}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">提现银行：</div>
		<div class="itemContent">{{detailObj.bank_name}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">支行</div>
		<div class="itemContent">{{detailObj.open_account_bank}}</div>
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
			<div class="itemContent">{{detailObj.remark}}</div>
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
	import exportup from '../../api/export.js'
	export default{
		data(){
			return{
				req:{
					type:2,
					page:1,
					pagesize:10,
					account:"",
					name:"",
					start_time:"",
					end_time:"",
					status:"-1"
				},
				date:[],
				dataObj:{},					//获取到的信息
				statusList:[{
					id:"-1",
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
					status:"1",
					remark:"",
					type:'2'
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
				this.req.start_time = n?n[0]:"";
				this.req.end_time = n?n[1]:"";
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
				resource.agentWithdrawRecord(this.req).then(res => {
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
				resource.getaGentwithdRawdetail({id:id,type:2}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交审核
			submitCheck(){
				resource.agentwithdrawcheck(this.checkReq).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.showDialog = false;
						this.reload();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//预约下载
			dao(){
				var arr = {};
				for(let a in this.req){
					if(a != 'page' && a != 'pagesize' && this.req[a] != ''){
						arr[a] = this.req[a];
					}
				}
				arr.index = 1;
				exportup.exportUp(arr)
			}
			
		}


	}
</script>








