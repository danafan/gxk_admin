<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="任务类型：">
					<el-select v-model="req.task_type" filterable placeholder="请选择">
						<el-option v-for="item in taskType" :key="item.template_id" :label="item.template_shop_name" :value="item.template_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务状态：">
					<el-select v-model="req.task_status" filterable placeholder="请选择">
						<el-option label="不限" value=""></el-option>
						<el-option label="进行中" value="1"></el-option>
						<el-option label="手动结束" value="2"></el-option>
						<el-option label="任务终止" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务完成情况：">
					<el-select v-model="req.task_finish_status" filterable placeholder="请选择">
						<el-option label="不限" value=""></el-option>
						<el-option label="未完成" value="0"></el-option>
						<el-option label="已完成" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务时间：">
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
			<el-table-column prop="commit_time" label="商家/店铺" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.store_name}}/{{scope.row.shop_name}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="task_name" label="任务名称" align="center">
			</el-table-column>
			<el-table-column label="任务时间" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.start_time}}/{{scope.row.end_time}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="task_user_name" label="任务类型" align="center">
			</el-table-column>
			<el-table-column prop="goods_name" label="商品名称" align="center">
			</el-table-column>
			<el-table-column label="佣金/服务费（元）" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.commission}}/{{scope.row.service_charge}}</p>
				</template>
			</el-table-column>
			<el-table-column label="任务总数/剩余数量" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.task_num}}/{{scope.row.surplus_num}}</p>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.task_status == 1">进行中</p>
					<p v-if="scope.row.task_status == 2">手动结束</p>
					<p v-if="scope.row.task_status == 3">任务终止</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button v-if="scope.row.task_status == 1" type="text" size="small" @click="stop(scope.row.task_id)">停止</el-button>
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
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				taskType:[],				//任务类型
				req:{
					page:1,
					size:10,
					store_name:"",
					task_type:"",
					task_status:"",
					task_finish_status:"",
					task_begin_time:"",
					task_end_time:"",
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
				this.req.task_begin_time = n?n[0]:"";
				this.req.task_end_time = n?n[1]:"";
			}
		},
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
				this.req.size = val;
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
				resource.taskList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//操作
			stop(id){
				this.$confirm('确认停止该任务?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.stopTask({task_id:id,status:2}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			}
			
		}


	}
</script>








