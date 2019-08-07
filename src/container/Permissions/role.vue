<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="addAccess">创建角色</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="role_name" label="角色名称" align="center">
				</el-table-column>
				<el-table-column prop="role_desc" label="角色描述" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edior(scope.row.role_id)">编辑</el-button>
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
	<el-dialog :title="`${dislogType == 1?'添加':'编辑'}角色`" center width="50%" :visible.sync="showDialog">
		<el-form size="small" label-width="150px">
			<el-form-item label="角色名称：">
				<el-input v-model="roleReq.role_name" style='width: 300px;' placeholder="请输入角色名称"></el-input>
			</el-form-item>
			<el-form-item label="角色描述：">
				<el-input v-model="roleReq.role_desc" type="textarea"
				:rows="3" style='width: 300px;' placeholder="请输入角色描述"></el-input>
			</el-form-item>
			<el-form-item :label="`${item.menu_name}：`" v-for="(item,index) in accessList">
				<el-checkbox-group v-model="checkedCities">
					<el-checkbox :label="child.id" :key="child.id" :value="child.id" v-for="(child,index) in item.access">{{child.access_name}}</el-checkbox>
				</el-checkbox-group>
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
				accessList:[],			//所有权限列表
				req:{
					page:1,
					pagesize:10
				},
				dataObj:{},
				dislogType:1,			//添加权限
				showDialog:false,		//默认弹框不显示
				roleReq:{
					role_name:"",
					role_desc:"",
				},
				checkedCities:[],
				id:"",
			}
		},
		created(){
			//获取所有权限列表
			this.getAccessList();
			//获取列表
			this.getList();
		},
		methods:{
			//获取所有菜单列表
			getAccessList(){
				resource.accessList().then(res => {
					if(res.data.code == 1){
						var list = res.data.data;
						list.map(item => {
							item.access.map(i => {
								i.checked = false;
							})
							this.accessList.push(item);
						})
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
			//获取列表
			getList(){
				resource.roleList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加
			addAccess(){
				this.dislogType = 1;
				this.showDialog = true;
				this.checkedCities = [];
				this.roleReq = {
					role_name:"",
					role_desc:"",
				}
			},
			//点击编辑
			edior(id){
				this.id = id;
				this.dislogType = 2;
				resource.getRoleDetail({role_id:id}).then(res => {
					if(res.data.code == 1){
						this.showDialog = true;
						this.checkedCities = [];
						res.data.data.access_ids.map(item => {
							this.checkedCities.push(parseInt(item))
						})
						this.roleReq.role_desc = res.data.data.role_desc;
						this.roleReq.role_name = res.data.data.role_name;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击弹框的确定
			submit(){
				if(this.roleReq.role_name == ''){
					this.$message.warning("请输入角色名称");
				}else if(this.roleReq.role_desc == ''){
					this.$message.warning("请输入角色描述");
				}else{
					if(this.checkedCities.length == 0){
						this.$message.warning("请勾选权限分配");
						return;
					}
					this.roleReq.access_ids = this.checkedCities.join(',');
					if(this.dislogType == 1){
						resource.addRole(this.roleReq).then(res => {
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
						this.roleReq.role_id = this.id;
						resource.updateRole(this.roleReq).then(res => {
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
			}

			
		}
	}
</script>