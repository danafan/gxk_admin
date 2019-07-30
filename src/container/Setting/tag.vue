<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="add">创建</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="tag_name" label="标签" align="center">
				</el-table-column>
				<el-table-column prop="tag_desc" label="标签含义" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edior(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="deletes(scope.row.tag_id)">删除</el-button>
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
	<!-- 创建或修改店铺 -->
	<el-dialog :title="dialogType == 1?'创建标签':'编辑标签'" center width="30%" :visible.sync="showDialog">
		<el-form size="small">
			<el-form-item label="标签名称：">
				<el-input v-model="objReq.tag_name" style="width: 200px" size="small" placeholder="请输入店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="标签含义：">
				<el-input v-model="objReq.tag_desc" style="width: 200px" size="small" placeholder="请输入淘宝店铺名称"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="showDialog = false">取消</el-button>
			<el-button size="small" type="primary" @click="submit">确 定</el-button>
		</span>
	</el-dialog>
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
				},
				dataObj:{},					//获取到的信息
				dialogType:1,				//弹框类型
				showDialog:false,
				objReq:{
					tag_name:"",
					tag_desc:""
				},							//添加或编辑的对象
				id:""
			}
		},
		created(){
			//获取列表
			this.getList();
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
				resource.tagList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加店铺
			add(){
				this.dialogType = 1;
				this.showDialog = true;
				this.objReq = {
					tag_name:"",
					tag_desc:""
				}
			},
			//点击编辑
			edior(row){
				this.id = row.tag_id;
				this.dialogType = 2;
				this.showDialog = true;
				this.objReq.tag_name = row.tag_name;
				this.objReq.tag_desc = row.tag_desc;
			},
			//点击提交或修改
			submit(){
				if(this.objReq.tag_name == ""){
					this.$message.warning('请输入标签名称');
				}else if(this.objReq.tag_desc == ""){
					this.$message.warning('请输入标签含义');
				}else{
					if(this.dialogType == 1){
						resource.addTag(this.objReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList()
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						this.objReq.tag_id = this.id;
						resource.updateTag(this.objReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList()
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
			},
			//点击删除
			deletes(id){
				this.$confirm('确认删除该标签?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.deleteTag({tag_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList()
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			}
			
		}


	}
</script>








