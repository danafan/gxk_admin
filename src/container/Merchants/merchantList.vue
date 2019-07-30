<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item label="创建人：">
					<el-input v-model="req.add_name" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item label="创建时间：">
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
			<el-button type="primary" icon="el-icon-download" size="small" @click="showDialog = true">创建商家</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="store_id" label="商家ID" align="center">
			</el-table-column>
			<el-table-column prop="store_name" label="商家名称" align="center">
			</el-table-column>
			<el-table-column prop="balance_usable" label="余额（元）" align="center">
			</el-table-column>
			<el-table-column prop="balance_freeze" label="冻结（元）" align="center">
			</el-table-column>
			<el-table-column prop="add_name" label="创建人" align="center">
			</el-table-column>
			<el-table-column prop="status_name" label="商家状态" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="$router.push('/merchantDetail?id=' + scope.row.store_id)">编辑</el-button>
					<el-button v-if="scope.row.status == 0" type="text" size="small" @click="setting(scope.row.store_id,'开启')">开启</el-button>
					<el-button v-if="scope.row.status == 1" type="text" size="small" @click="setting(scope.row.store_id,'关闭')">关闭</el-button>
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
<el-dialog title="创建商家" width="30%" :visible.sync="showDialog">
	<div class="dialogItem">
		<div class="itemLabel">商家名称：</div>
		<el-input type="text" size="small" style="width: 300px" placeholder="请输入商家名称" v-model="store_name">
		</el-input>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showDialog = false">取消</el-button>
		<el-button size="small" type="primary" @click="submit">确 定</el-button>
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
					store_name:"",
					add_name:"",
					start_datetime:"",
					end_datetime:""
				},
				date:[],
				dataObj:{},					//获取到的信息
				showDialog:false,			//默认弹框不显示
				store_name:"",				//创建的商家名称
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
				resource.getStoreList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设置状态
			setting(id,type){
				this.$confirm(`确认${type}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.setStatus({store_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.reload();
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
			},
			//创建商家
			submit(){
				if(this.store_name == ""){
					this.$message.warning('请输入商家名称');
				}else{
					resource.addStoreNow({store_name:this.store_name}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.reload();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
			
		}


	}
</script>








