<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="使用情况：">
					<el-select v-model="req.status" filterable placeholder="请选择">
						<el-option v-for="item in statusType" :key="item.status_id" :label="item.status_name" :value="item.status_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="but">
				<el-button type="primary" icon="el-icon-circle-plus-outline
				" size="small" @click="create">生成</el-button>
				<el-button type="primary" icon="el-icon-download" size="small" @click="exportUp">导出</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
				<el-table-column prop="invitation_code" label="邀请码" align="center">
				</el-table-column>
				<el-table-column label="使用情况" align="center">
					<template slot-scope="scope">
						<p v-if="scope.row.status == 1">已使用</p>
						<p v-if="scope.row.status == 0">未使用</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-clipboard="scope.row.invitation_code" @success="$message.success('复制成功')" v-if="scope.row.status == 0">复制</el-button>
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
	<el-dialog title="生成邀请码" center width="40%" :visible.sync="showDialog">
		<el-form size="small" label-width="150px">
			<el-form-item label="邀请码数量：">
				<el-input v-model="num" style='width: 200px;' placeholder="请输入生成邀请码数量"></el-input>
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
	import exportUp from '../../api/export.js'
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					admin_id:"",
					status:"-1",
					page:1,
					pagesize:10
				},
				statusType:[{
					status_name:'全部',
					status_id:'-1'
				},{
					status_name:'已使用',
					status_id:'1'
				},{
					status_name:'未使用',
					status_id:'0'
				}],
				dataObj:{},
				showDialog:false,
				num:'',						//输入的生成邀请码数量
			}
		},
		created(){
			this.req.admin_id = this.$route.query.id;
			//获取列表
			this.getList();
		},
		methods:{
			//搜索
			search(){
				this.req.page = 1;
				//获取列表
				this.getList();
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
				resource.inviteList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击创建
			create(){
				this.showDialog = true;
				this.num = "";
			},
			//确认创建
			submit(){
				if(this.num == ''){
					this.$message.warning('请输入生成邀请码数量');
					return;
				}
				resource.createInvite({admin_id:this.req.admin_id,num:this.num}).then(res => {
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
					if(a != 'page' && a != 'pagesize' && this.req[a] != ''){
						arr[a] = this.req[a];
					}
				}
				arr.index = 8;
				exportUp.exportUp(arr)
			}
			
			
		}


	}
</script>








