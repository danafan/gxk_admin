<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="addAccess">添加权限</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="access_name" label="名称" align="center">
				</el-table-column>
				<el-table-column prop="menu_name" label="所属分组" align="center">
				</el-table-column>
				<el-table-column prop="access_codes" label="权限码" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="edior(scope.row.id)">编辑</el-button>
						<el-button type="text" size="small" @click="deleteIs(scope.row.id)">删除</el-button>
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
	<el-dialog :title="`${dislogType == 1?'添加':'编辑'}权限`" center width="50%" :visible.sync="showDialog">
		<el-form size="small" label-width="150px">
			<el-form-item label="权限资源名称：">
				<el-input v-model="accessReq.access_name" style='width: 300px;' placeholder="请输入权限资源名称"></el-input>
			</el-form-item>
			<el-form-item label="所属菜单：">
				<el-select v-model="accessReq.menu_id" style='width: 200px;' placeholder="请选择">
					<el-option v-for="item in menuList" :key="item.menu_id" :label="item.menu_name" :value="item.menu_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="添加权限码：">
				<el-select v-model="selController" placeholder="请选择">
					<el-option v-for="item in controller" :key="item" :label="item" :value="item">
					</el-option>
				</el-select> / 
				<el-select v-model="selMethod" placeholder="请选择">
					<el-option v-for="item in methodList" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<el-button style="margin-left: 20px" type="success" icon="el-icon-plus" circle @click="addAccessCode"></el-button>
				<div style="margin-top: 10px;">
					<el-tag style="margin-right: 20px;margin-bottom: 10px" closable v-for="(item,index) in accessCodes" :key="index" type="success" effect="dark" @close="handleClose(index)"> {{ item }}
					</el-tag>
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
				menuList:[],			//所有菜单列表
				controller:[],			//所有控制器列表
				methodList:[],				//控制器下所有方法
				req:{
					page:1,
					pagesize:10
				},
				dataObj:{},
				dislogType:1,			//添加权限
				showDialog:false,		//默认弹框不显示
				accessReq:{
					access_name:"",
					menu_id:"",
					access_codes:""
				},
				selController:"",		//当前选择的控制器名称
				selMethod:"",			//当前选择的方法名称
				accessCodes:[],			//选中的所有权限吗列表
				id:"",
			}
		},
		created(){
			//获取所有菜单列表
			this.getMneu();
			//获取所有控制器列表
			this.getController();
			//获取列表
			this.getList();
		},
		watch:{
			selController:function(n,o){
				if(n != o){
					//获取所有控制器列表
					this.getMethod();
					this.selMethod = "";
				}
			}
		},
		methods:{
			//获取所有菜单列表
			getMneu(){
				resource.getMenuList2().then(res => {
					if(res.data.code == 1){
						this.menuList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有控制器列表
			getController(){
				resource.controllers().then(res => {
					if(res.data.code == 1){
						this.controller = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有控制器列表
			getMethod(){
				resource.getMethods({controller_name:this.selController}).then(res => {
					if(res.data.code == 1){
						this.methodList = res.data.data;
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
				resource.getAccessList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加权限
			addAccess(){
				this.dislogType = 1;
				this.showDialog = true;
				this.accessReq = {
					access_name:"",
					menu_id:"",
					access_codes:""
				};
				this.accessCodes = [];
			},
			//点击某一个关闭
			handleClose(index){
				this.accessCodes.splice(index,1);
			},
			//点击编辑
			edior(id){
				this.id = id;
				this.dislogType = 2;
				resource.getAccessInfo({id:id}).then(res => {
					if(res.data.code == 1){
						this.showDialog = true;
						this.accessReq.access_name = res.data.data.access_name;
						this.accessReq.menu_id = res.data.data.menu_id;
						this.accessCodes = res.data.data.access_codes;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteIs(id){
				this.$confirm('确认删除该权限?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.deleteAccess({id:id}).then(res => {
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
			//点击弹框的添加权限码
			addAccessCode(){
				if(this.selController == "" || this.selMethod == ""){
					this.$message.warning("请完善当前权限码");
				}else{
					let str = this.selController + "/" + this.selMethod;
					for(var i = 0;i < this.accessCodes.length;i ++){
						if(this.accessCodes[i] == str){
							this.$message.warning('已存在该权限码');
							return;
						}
					}
					this.accessCodes.push(str);
				}
			},
			//点击弹框的确定
			submit(){
				if(this.accessReq.access_name == ''){
					this.$message.warning("请输入权限资源名称");
				}else if(this.accessReq.menu_id == ''){
					this.$message.warning("请选择所属菜单");
				}else if(this.accessCodes.length == 0){
					this.$message.warning("请选择权限码");
				}else{
					this.accessReq.access_codes = JSON.stringify(this.accessCodes);
					if(this.dislogType == 1){
						resource.addAccess(this.accessReq).then(res => {
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
						this.accessReq.id = this.id;
						resource.updateAccess(this.accessReq).then(res => {
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