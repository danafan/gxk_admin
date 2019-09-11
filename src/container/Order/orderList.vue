<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="任务类型：">
					<el-select v-model="req.template_id" filterable placeholder="请选择">
						<el-option v-for="item in taskType" :key="item.template_id" :label="item.template_shop_name" :value="item.template_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单类型：">
					<el-select v-model="req.order_status" filterable placeholder="请选择">
						<el-option v-for="item in orderType" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.task_name" placeholder="请输入任务名称"></el-input>
				</el-form-item>
				<el-form-item label="网店订单号：">
					<el-input v-model="req.tao_order_sn" placeholder="请输入网店订单号"></el-input>
				</el-form-item>
				<el-form-item label="订单编号：">
					<el-input v-model="req.order_id" placeholder="请输入网店订单号"></el-input>
				</el-form-item>
				<el-form-item label="接单账号：">
					<el-input v-model="req.phone" placeholder="请输入网店订单号"></el-input>
				</el-form-item>
				<el-form-item label="接单时间：">
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
			<el-button type="primary" icon="el-icon-download" size="small" @click="exportUp">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="add_time" label="接单时间" align="center">
			</el-table-column>
			<el-table-column prop="phone" label="用户" align="center">
			</el-table-column>
			<el-table-column prop="order_id" label="订单编号" align="center">
			</el-table-column>
			<el-table-column prop="store_name" label="发布商家" align="center">
			</el-table-column>
			<el-table-column label="订单金额（元）" align="center">
				<template slot-scope="scope">
					<span>商品价格：{{scope.row.goods_price}}</span>
					<span>付款金额：{{scope.row.pay_amount}}</span>
					<span>获得佣金：{{scope.row.commission}}</span>
				</template>
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
	import exportUp from '../../api/export.js'
	export default{
		data(){
			return{
				taskType:[],				//任务类型列表
				orderType:[{
					id:"",
					name:"不限"
				},{
					id:0,
					name:"待操作"
				},{
					id:1,
					name:"待审核"
				},{
					id:2,
					name:"已完成"
				},{
					id:3,
					name:"已放弃"
				},{
					id:4,
					name:"系统结束"
				},],						//订单类型列表
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
			//获取任务类型列表
			this.getTaskList();
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
			//获取任务类型列表
			getTaskList(){
				resource.templateList().then(res => {
					if(res.data.code == 1){
						this.taskType = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},	
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
			},
			//预约下载
			exportUp(){
				var arr = {};
				for(let a in this.req){
					if(a != 'page' && a != 'pagesize' && this.req[a] != ''){
						arr[a] = this.req[a];
					}
				}
				arr.index = 5;
				exportUp.exportUp(arr)
			}
			
		}


	}
</script>








