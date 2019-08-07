<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="add">创建</el-button>
			</div>
			<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="notice_id" label="编号" align="center">
				</el-table-column>
				<el-table-column prop="notice_name" label="公告名称" align="center">
				</el-table-column>
				<el-table-column prop="notice_title" label="公告标题" align="center">
				</el-table-column>
				<el-table-column label="时间" align="center">
					<template slot-scope="scope">
						<p>开始时间：{{scope.row.start_time}}</p>
						<p>结束时间：{{scope.row.end_time}}</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="setting(scope.row)">{{scope.row.status == 1?'下线':'上线'}}</el-button>
						<el-button type="text" size="small" @click="edior(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="deletes(scope.row.notice_id)">删除</el-button>
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
	<el-dialog :title="dialogType == 1?'创建公告':'编辑公告'" center width="30%" :visible.sync="showDialog">
		<el-form size="small">
			<el-form-item label="名称：" required>
				<div>
					<el-input v-model="objReq.name" style="width: 200px" size="small" placeholder="输入名称"></el-input>
					<div style="font-size: 12px">名称只作为辨别多个条目之用</div>
				</div>
			</el-form-item>
			<el-form-item label="开始时间：">
				<el-date-picker v-model="objReq.start_datetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间：">
				<el-date-picker v-model="objReq.end_datetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="公告标题：" required>
				<div>
					<el-input v-model="objReq.title" style="width: 200px" size="small" placeholder="输入公告标题"></el-input>
				</div>
			</el-form-item>
			<el-form-item label="公告内容：">
				<div>
					<el-input v-model="objReq.content" type="textarea"
					:rows="3" style="width: 200px" size="small" placeholder="输入公告内容"></el-input>
				</div>
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
					name:"",
					title:"",
					start_datetime:"",
					end_datetime:"",
					content:""
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
				resource.noticeList(this.req).then(res => {
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
					name:"",
					title:"",
					start_datetime:"",
					end_datetime:"",
					content:""
				}
			},
			//点击编辑
			edior(row){
				this.id = row.notice_id;
				this.dialogType = 2;
				this.showDialog = true;
				this.objReq.name = row.notice_name;
				this.objReq.title = row.notice_title;
				this.objReq.start_datetime = row.start_time;
				this.objReq.end_datetime = row.end_time;
				this.objReq.content = row.notice_content;
			},
			//点击提交或修改
			submit(){
				if(this.objReq.name == ""){
					this.$message.warning('请输入公告名称');
				}else if(new Date(this.objReq.start_datetime).getTime() > new Date(this.objReq.end_datetime).getTime()){
					this.$message.warning('开始时间不能大于结束时间');
				}else if(this.objReq.title == ""){
					this.$message.warning('请输入公告标题');
				}else{
					if(this.dialogType == 1){
						resource.addNotice(this.objReq).then(res => {
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
						this.objReq.notice_id = this.id;
						resource.updateNotice(this.objReq).then(res => {
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
				this.$confirm('确认删除该公告?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.deleteNotice({notice_id:id}).then(res => {
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
			},
			//设置公告状态
			setting(row){
				this.$confirm(`确认${row.status == 0?'上线':'下线'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						notice_id:row.notice_id,
						status:row.status == 0?1:0
					}
					resource.setNoticeStatus(obj).then(res => {
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








