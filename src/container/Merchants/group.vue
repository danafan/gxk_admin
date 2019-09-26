<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input style="width: 300px;" v-model="req.store_name" placeholder="输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="分组：">
					<el-select v-model="req.store_group_id" placeholder="请选择" clearable>
						<el-option v-for="item in groupList" :key="item.id" :label="item.store_group_name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" icon="el-icon-circle-plus-outline
				" size="small" @click="create">创建分组</el-button>
				<el-button type="primary" icon="el-icon-download" size="small" @click="exportUp">导出</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="store_group_name" label="分组名称" align="center">
				</el-table-column>
				<el-table-column prop="store_num" label="商家数量" align="center">
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center">
				</el-table-column>
				<el-table-column prop="store_group_status" label="分组状态" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="editor(scope.row.id)">编辑</el-button>
						<el-button type="text" size="small" v-if="scope.row.store_group_status_code == 1" @click="setting(scope.row.id,0)">关闭</el-button>
						<el-button type="text" size="small" v-if="scope.row.store_group_status_code == 0" @click="setting(scope.row.id,1)">开启</el-button>
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
	<!-- 创建弹框 -->
	<el-dialog title="创建分组" center width="40%" :visible.sync="showDialog">
		<el-form size="small" label-width="150px">
			<el-form-item label="分组名称：">
				<el-input v-model="createReq.store_group_name" style='width: 200px;' placeholder="请输入分组名称"></el-input>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input v-model="createReq.remark" type="textarea"
				:rows="3" style='width: 200px;' placeholder="请输入备注"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="showDialog = false">取消</el-button>
			<el-button size="small" type="primary" @click="submit">确 定</el-button>
		</span>
	</el-dialog>
	<!-- 编辑弹框 -->
	<el-dialog title="创建分组" center width="40%" :visible.sync="editDialog">
		<el-form size="small" label-width="150px">
			<el-checkbox-group v-model="choosed">
				<el-checkbox :label="item.id" v-for="item in storeList">{{item.name}}</el-checkbox>
			</el-checkbox-group>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="editDialog = false">取消</el-button>
			<el-button size="small" type="primary" @click="edirSave">确 定</el-button>
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
	import exportUp from '../../api/export.js'
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					size:10,
					store_name:"",
					store_group_id:""
				},
				groupList:[],				//分组列表
				dataObj:{},
				showDialog:false,			//创建弹框默认不显示
				createReq:{
					store_group_name:"",
					remark:""
				},							//创建商家参数
				editDialog:false,			//编辑弹框默认不显示
				choosed:[],					//已选中的商家id
				storeList:[],				//所有商家列表
				id:"",						//点击的某个分组id
			}
		},
		created(){
			//获取分组列表
			this.getStoreList();
			//获取列表
			this.getList();
		},
		methods:{
			//获取分组列表
			getStoreList(){
				resource.storeGroup().then(res => {
					if(res.data.code == 1){
						this.groupList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			search(){
				this.req.page = 1;
				//获取列表
				this.getList();
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
				resource.getGroupList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击创建
			create(){
				this.showDialog = true;
				this.createReq = {
					store_group_name:"",
					remark:""
				};
			},
			//确认创建
			submit(){
				if(this.createReq.store_group_name == ''){
					this.$message.warning('请输入分组名称');
					return;
				}
				resource.createGroup(this.createReq).then(res => {
					if(res.data.code == 1){
						this.showDialog = false;
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
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
				arr.index = 5;
				exportUp.exportUp(arr)
			},
			//点击编辑
			editor(id){
				this.id = id;
				resource.getGroupDetail({store_group_id:this.id}).then(res => {
					if(res.data.code == 1){
						this.editDialog = true;
						this.choosed = res.data.data.choosed;
						this.storeList = res.data.data.store;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑的确定
			edirSave(){
				let req = {
					store_group_id:this.id,
					store_ids:this.choosed.join(',')
				}
				resource.groupCommit(req).then(res => {
					if(res.data.code == 1){
						this.editDialog = false;
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//操作
			setting(id,type){
				this.$confirm(`确认${type == 0?'关闭':'开启'}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						store_group_id:id,
						status:type
					}
					resource.storeHandle(obj).then(res => {
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








