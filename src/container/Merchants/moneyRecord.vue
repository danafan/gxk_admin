<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家账号：">
					<el-input v-model="req.admin_name" placeholder="请输入商家账号"></el-input>
				</el-form-item>
				<el-form-item label="时间范围：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd hh:mm:ss"
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
			<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="happen_time" label="时间" align="center">
			</el-table-column>
			<el-table-column prop="id" label="交易流水号" align="center">
			</el-table-column>
			<el-table-column prop="store_admin_name" label="商家账号" align="center">
			</el-table-column>
			<el-table-column prop="statement_type" label="交易类型" align="center">
			</el-table-column>
			<el-table-column prop="income_outgoing" label="金额（元）" align="center">
			</el-table-column>
			<el-table-column prop="residue_balance_usable" label="余额（元）" align="center">
			</el-table-column>
			<el-table-column prop="remark" label="备注" align="center">
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
</div>
</template>
<style lang="less" scoped>

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
					start_datetime:"",
					end_datetime:""
				},
				date:[],
				dataObj:{},					//获取到的信息
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			date:function(n){
				this.req.start_datetime = n?n[0]:"";
				this.req.end_datetime = n?n[1]:"";
			}
		},
		inject:['reload'],
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
				resource.storeAccount(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
			
		}


	}
</script>








