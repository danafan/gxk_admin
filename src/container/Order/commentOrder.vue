<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="接单账号：">
					<el-input v-model="req.phone" placeholder="请输入用户账号"></el-input>
				</el-form-item>
				<el-form-item label="接单账号：">
					<el-input v-model="req.phone" placeholder="请输入用户接单旺旺号"></el-input>
				</el-form-item>
				<el-form-item label="订单编号：">
					<el-input v-model="req.order_id" placeholder="请输入网店订单号"></el-input>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.task_name" placeholder="请输入任务名称"></el-input>
				</el-form-item>
				<el-form-item label="任务编号：">
					<el-input v-model="req.order_id" placeholder="请输入网店订单号"></el-input>
				</el-form-item>
				<el-form-item label="接单时间：">
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
			<el-button type="primary" icon="el-icon-download" size="small">修改佣金</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="add_time" label="接单时间" align="center">
			</el-table-column>
			<el-table-column prop="phone" label="任务编号" align="center">
			</el-table-column>
			<el-table-column prop="order_id" label="订单编号" align="center">
			</el-table-column>
			<el-table-column prop="store_name" label="任务店铺" align="center">
			</el-table-column>
			<el-table-column label="佣金（元）" align="center">
			</el-table-column>
			<el-table-column prop="status_desc" label="订单状态" align="center">
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
					store_name:"",
					template_id:"",
					order_status:"",
					task_name:"",
					tao_order_sn:"",
					order_id:"",
					phone:"",
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
				resource.orderList(this.req).then(res => {
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








