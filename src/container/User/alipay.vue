<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="审核状态：">
					<el-select clearable v-model="req.status" filterable placeholder="请选择">
						<el-option v-for="item in checkStatus" :key="item.check_id" :label="item.check_name" :value="item.check_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="绑定时间：">
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
			<el-table-column prop="phone" label="用户名" align="center">
			</el-table-column>
			<el-table-column prop="real_name" label="真实姓名" align="center">
			</el-table-column>
			<el-table-column prop="account" label="支付宝账号" align="center">
			</el-table-column>
			<el-table-column prop="status" label="审核状态" align="center">
			</el-table-column>
			<el-table-column prop="check_user" label="审核人" align="center">
			</el-table-column>
			<el-table-column prop="check_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" v-if="scope.row.status_id == 0" size="small" @click="check(scope.row.id,'1')">通过</el-button>
					<el-button type="text" v-if="scope.row.status_id == 0" size="small" @click="check(scope.row.id,'2')">拒绝</el-button>
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
	import exportUp from '../../api/export.js'
	export default{
		data(){
			return{
				checkStatus:[{
					check_name:"申请中",
					check_id:0
				},{
					check_name:"审核通过",
					check_id:1
				},{
					check_name:"审核拒绝",
					check_id:2
				}],
				req:{
					page:1,
					size:10,
					status:"",
					bind_start_time:"",
					bind_end_time:""
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
				this.req.bind_start_time = n?n[0]:"";
				this.req.bind_end_time = n?n[1]:"";
			}
		},
		inject:['reload'],
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
			//搜索
			search(){
				this.req.page = 1;
				//获取计划列表
				this.getList();
			},
			//获取列表
			getList(){
				resource.alipayCheck(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//预约下载
			exportUp(){
				var arr = {};
				for(let a in this.req){
					if(a != 'page' && a != 'size' && this.req[a] != ''){
						arr[a] = this.req[a];
					}
				}
				arr.index = 6;
				exportUp.exportUp(arr)
			},
			//审核
			check(id,status){
				if(status == '1'){
					this.$confirm('确认通过?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.checkAlipay({id:id,status:status}).then(res => {
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
				}else{
					this.$prompt('拒绝原因', '确认拒绝？', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						if(value){
							resource.checkAlipay({id:id,status:status,reject_reason:value}).then(res => {
								if(res.data.code == 1){
									this.$message.success(res.data.msg);
									//获取列表
									this.getList();
								}else{
									this.$message.warning(res.data.msg);
								}
							})
						}else{
							this.$message.warning("请输入拒绝原因");
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消'
						});       
					});
				}
			}
			
		}


	}
</script>








