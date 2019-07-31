<template>
	<div>
		<el-card>
			<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="create_time" label="操作时间" align="center">
				</el-table-column>
				<el-table-column prop="operater" label="操作人" align="center">
				</el-table-column>
				<el-table-column prop="desc" label="操作描述" align="center">
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
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					size:10
				},
				dataObj:{},					//获取到的信息
			}
		},
		created(){
			//获取列表
			this.getList();
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
				resource.logList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
			
		}


	}
</script>








