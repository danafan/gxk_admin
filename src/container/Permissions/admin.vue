<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.admin_name" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="createAdmin">创建</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="admin_name" label="用户名" align="center">
				</el-table-column>
				<el-table-column prop="phone" label="手机号" align="center">
				</el-table-column>
				<el-table-column prop="role_name" label="角色" align="center">
				</el-table-column>
				<el-table-column prop="last_login_ip" label="IP" align="center">
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="scope">
						<p v-if="scope.row.is_disabled == 1">已禁用</p>
						<p v-if="scope.row.is_disabled == 0">已启用</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edior(scope.row.admin_id)">编辑</el-button>
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
	<el-dialog :title="`${dislogType == 1?'创建':'编辑'}管理员`" center width="40%" :visible.sync="showDialog">
		<el-form size="small" label-width="150px">
			<el-form-item label="用户名：" required>
				<el-input v-model="adminObj.admin_name" :disabled="dislogType == 2" style='width: 200px;' placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码：" required>
				<el-input v-model="adminObj.password" style='width: 200px;' placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-form-item label="手机号：">
				<el-input v-model="adminObj.phone" style='width: 200px;' placeholder="请输入手机号"></el-input>
			</el-form-item>
			<el-form-item label="所属角色：" required>
				<el-select v-model="adminObj.role_id" placeholder="请选择">
					<el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="关联查看：">
				<el-select v-model="admin_group" multiple placeholder="请选择">
					<el-option v-for="item in adminList" :key="item.admin_id" :label="item.admin_name" :value="item.admin_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否是系统管理员：">
				<el-radio-group v-model="adminObj.system_admin">
					<el-radio :label="0">否</el-radio>
					<el-radio :label="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否禁用：" v-if="dislogType == 2">
				<el-radio-group v-model="adminObj.is_disabled">
					<el-radio :label="0">否</el-radio>
					<el-radio :label="1">是</el-radio>
				</el-radio-group>
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
				roleList:[],				//角色列表
				adminList:[],				//管理员列表
				req:{
					page:1,
					pagesize:10,
					admin_name:""
				},
				dataObj:{},					//获取到的信息
				dislogType:1,				//弹框类型（1:创建；2:编辑）
				showDialog:false,			//默认弹框不显示
				adminObj:{
					admin_name:"",
					password:"",
					phone:"",
					role_id:"",
					admin_group:"",
					system_admin:0,
					is_disabled:0,
				},
				admin_group:[],				//选中的所有关联查看的管理员
				id:"",						//点击的管理员
			}
		},
		created(){
			//获取列表
			this.getList();
			//获取角色列表
			this.roleList2();
			//获取管理员列表
			this.adminList2();
		},
		methods:{
			//获取角色列表
			roleList2(){
				resource.roleList2().then(res => {
					if(res.data.code == 1){
						this.roleList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取管理员列表
			adminList2(){
				resource.adminList2().then(res => {
					if(res.data.code == 1){
						this.adminList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
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
				resource.adminList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击创建
			createAdmin(){
				this.dislogType = 1;
				this.showDialog = true;
			},
			//点击编辑
			edior(id){
				this.id = id;
				this.dislogType = 2;
				resource.getAdminDetail({admin_id:id}).then(res => {
					if(res.data.code == 1){
						this.adminObj.admin_name = res.data.data.admin_name;
						this.adminObj.password = "";
						this.adminObj.phone = res.data.data.phone;
						this.adminObj.role_id = res.data.data.role_id;
						let list = res.data.data.admin_group.split(',');
						this.admin_group = [];
						list.map(l => {
							this.admin_group.push(parseInt(l));
						})
						this.adminObj.system_admin = res.data.data.system_admin;
						this.adminObj.is_disabled = res.data.data.is_disabled;
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//创建或编辑管理员
			submit(){
				if(this.adminObj.admin_name == ""){
					this.$message.warning('请填写用户名');
				}else if(this.adminObj.password == "" && this.dislogType == 1){
					this.$message.warning('请填写密码');
				}else if(this.adminObj.role_id == ""){
					this.$message.warning('请选择所属角色');
				}else{
					this.adminObj.admin_group = this.admin_group.join(',');
					if(this.dislogType == 1){
						resource.addAdmin(this.adminObj).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						this.adminObj.admin_id = this.id;
						resource.updateAdmin(this.adminObj).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
			}
			
		}


	}
</script>








