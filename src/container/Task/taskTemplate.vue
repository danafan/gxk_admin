<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="创建人：">
					<el-select v-model="req.admin_id" filterable placeholder="请选择">
						<el-option v-for="item in createrList" :key="item.admin_id" :label="item.admin_name" :value="item.admin_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.template_shop_name" placeholder="显示给商家的名称"></el-input>
				</el-form-item>
				<el-form-item label="任务名称：">
					<el-input v-model="req.template_user_name" placeholder="显示给用户的名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="template_shop_name" label="模版名称" align="center">
				</el-table-column>
				<el-table-column prop="admin_name" label="创建人" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" align="center">
				</el-table-column>
				<el-table-column prop="template_use_num" label="模版使用次数" align="center">
				</el-table-column>
				<el-table-column prop="shop_use_num" label="多少商家使用过该模板" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" >
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="updateStore(scope.row.template_id)">修改可见商家</el-button>
						<el-button type="text" size="small" @click="look(scope.row.template_id)">查看</el-button>
						<el-button type="text" v-if="scope.row.using == 0" size="small" @click="setting(scope.row.template_id,scope.row.using)">停用</el-button>
						<el-button type="text" v-if="scope.row.using == 1" size="small" @click="setting(scope.row.template_id,scope.row.using)">启用</el-button>
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
	<el-dialog title="修改可见商家" center width="50%" :visible.sync="updateShop">
		<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		<el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
			<el-checkbox :label="item.store_id" v-for="item in storeList">{{item.store_name}}</el-checkbox>
		</el-checkbox-group>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="updateShop = false">取消</el-button>
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
				createrList:[],				//创建人列表
				req:{
					page:1,
					size:10,
					admin_id:"",
					template_shop_name:"",
					template_user_name:""
				},
				date:[],
				dataObj:{},					//获取到的信息
				updateShop:false,			//修改可见商家弹框
				storeList:[],
				checkList:[],				//已选中的可见商家
				template_id:"",
				checkAll: false,
			}
		},
		created(){
			//获取任务类型列表
			this.getCreaterList();
			//获取列表
			this.getList();
		},
		methods:{
			//获取创建人列表
			getCreaterList(){
				resource.createrList().then(res => {
					if(res.data.code == 1){
						this.createrList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
				resource.reqTemplateList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击查看
			look(id){
				this.$router.push(`/templateDetail?id=${id}`);
			},
			//操作
			setting(id,using){
				this.$confirm(`确认${using == 0?'停用':'启用'}该模版?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						using:using == 0?1:0,
						id:id
					}
					resource.deleteTemp(obj).then(res => {
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
			},
			//点击修改可见商家
			updateStore(id){
				this.template_id = id;
				resource.getTaskShow({template_id:this.template_id}).then(res => {
					if(res.data.code == 1){
						this.storeList = res.data.data.all_store;
						var tail = res.data.data.choose_store;
						if(tail === 0){
							this.checkAll = true;
							this.storeList.map(item => {
								this.checkList.push(item.store_id);
							}) 
						}else if(tail.length === 0){
							this.checkAll = false;
							this.checkList = []; 
						}else{
							this.checkAll = false;
							this.checkList = tail;
						}
						this.updateShop = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			handleCheckAllChange(val) {
				if(val){
					this.storeList.map(item => {
						this.checkList.push(item.store_id);
					})
				}else{
					this.checkList = [];
				}
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.storeList.length;
			},
			//修改可见商家
			submit(){
				let obj = {
					template_id:this.template_id,
					store_ids:this.checkAll?0:this.checkList.length == 0?"-1":this.checkList.join(',')
				}
				resource.taskEdit(obj).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.updateShop = false;
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
			
		}


	}
</script>








