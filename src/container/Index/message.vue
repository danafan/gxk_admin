<template>
	<div>
		<el-card>
			<!-- <div class="tabTitle">
				<div class="line"></div>
				<div class="titleTxt">消息</div>
			</div> -->
			<el-table :data="tabelData.data" border style="width: 100%;margin-top: 16px" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="content" label="消息" align="center">
				</el-table-column>
				<el-table-column prop="add_time" label="时间" align="center">
				</el-table-column>
				<el-table-column prop="admin_name" label="操作人" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button v-if="scope.row.type == 2 && scope.row.status == 1" type="text" size="small" @click="downLoad(scope.row.down_url)">下载</el-button>
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
				:total="tabelData.total"
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
					pagesize:10
				},
				tabelData:{},			//列表
				
			}
		},
		created(){
			//获取列表
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
			//获取列表
			getList(){
				resource.messageList(this.req).then(res => {
					if(res.data.code == 1){
						this.tabelData = res.data.data;
					}else{
						this.$message.warning(this.data.msg);
					}
				})
			},
			//点击下载
			downLoad(downUrl){
				window.open(downUrl)
			}

		}

	}
</script>










