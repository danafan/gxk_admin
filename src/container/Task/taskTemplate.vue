<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="创建人：">
					<el-select v-model="req.admin_id" filterable placeholder="请选择">
						<el-option v-for="item in createrList" :key="item.admin_id" :label="item.admin_name" :value="item.admin_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.template_shop_name" placeholder="显示给商家的名称"></el-input>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.template_user_name" placeholder="显示给用户的名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="template_shop_name" label="模版名称" align="center">
				</el-table-column>
				<el-table-column prop="admin_name" label="创建人" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" align="center">
				</el-table-column>
				<el-table-column prop="use_times" label="模版使用次数" align="center">
				</el-table-column>
				<el-table-column prop="shop_use_num" label="商品使用数量" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" >
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="deletes(scope.row.template_id)">删除</el-button>
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
				createrList:[],				//创建人列表
				req:{
					page:1,
					size:10,
					admin_id:"",
					template_shop_name:"",
					template_user_name:""
				},
				date:[],
				dataObj:{},					//获取到的信息
			}
		},
		created(){
			//获取任务类型列表
			this.getCreaterList();
			//获取列表
			this.getList();
		},
		methods:{
			//获取创建人列表
			getCreaterList(){
				resource.createrList().then(res => {
					if(res.data.code == 1){
						this.createrList = res.data.data;
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
				resource.reqTemplateList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//操作
			deletes(id){
				this.$confirm('确认删除该模版?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.deleteTemp({id:id}).then(res => {
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








