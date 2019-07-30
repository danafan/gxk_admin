<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="add">创建</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="cate_id" label="序号" align="center">
				</el-table-column>
				<el-table-column prop="cate_name" label="类目名称" align="center">
				</el-table-column>
				<el-table-column label="时间限制" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.limit_num}}</span>单/<span>{{scope.row.limit_day}}</span>天
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edior(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="deletes(scope.row.cate_id)">删除</el-button>
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
	<el-dialog :title="dialogType == 1?'创建类目':'编辑类目'" center width="30%" :visible.sync="showDialog">
		<el-form size="small">
			<el-form-item label="类目名称：">
				<el-input v-model="objReq.cate_name" style="width: 200px" size="small" placeholder="请输入店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="同类目接任务时间间隔：">
				<el-input v-model="objReq.limit_day" style="width: 100px" size="small">
					<template slot="append">天</template>
				</el-input>
				<el-input v-model="objReq.limit_num" style="width: 100px" size="small">
					<template slot="append">单</template>
				</el-input>
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
					cate_name:"",
					limit_num:"",
					limit_day:""
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
				resource.getCategoryList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加
			add(){
				this.dialogType = 1;
				this.showDialog = true;
				this.objReq = {
					cate_name:"",
					limit_num:"",
					limit_day:""
				}
			},
			//点击编辑
			edior(row){
				this.id = row.cate_id;
				this.dialogType = 2;
				this.showDialog = true;
				this.objReq.cate_name = row.cate_name;
				this.objReq.limit_num = row.limit_num;
				this.objReq.limit_day = row.limit_day;
			},
			//点击提交或修改
			submit(){
				if(this.objReq.cate_name == ""){
					this.$message.warning('请输入类目名称');
				}else if(this.objReq.limit_num == ""){
					this.$message.warning('请输入单数');
				}else if(this.objReq.limit_day == ""){
					this.$message.warning('请输入天数');
				}else{
					if(this.dialogType == 1){
						resource.addCategory(this.objReq).then(res => {
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
						this.objReq.cate_id = this.id;
						resource.updateCategory(this.objReq).then(res => {
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
					resource.deleteCategory({cate_id:id}).then(res => {
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








