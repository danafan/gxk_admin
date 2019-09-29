<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="审核状态：">
					<el-select v-model="req.status">
						<el-option v-for="item in checkStatus" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="绑定时间：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="上级用户：">
				<el-input v-model="req.invite_phone" placeholder="上级手机号"></el-input>
			</el-form-item>
			<el-form-item label="用户名：">
				<el-input v-model="req.user_name" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="旺旺号：">
				<el-input v-model="req.wangwang" placeholder="请输入旺旺号"></el-input>
			</el-form-item>
			<el-form-item label="审核人：">
				<el-input v-model="req.check_name" placeholder="请输入审核人"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small" @click="exportUp">导出</el-button>
		</div>
		<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="user_name" label="用户名" align="center">
			</el-table-column>
			<el-table-column prop="wangwang" label="旺旺号" align="center">
			</el-table-column>
			<el-table-column prop="order_sn" label="淘宝订单号" align="center">
			</el-table-column>
			<el-table-column label="审核状态" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.status == 0">待审核</p>
					<p v-if="scope.row.status == 1">审核通过</p>
					<p v-if="scope.row.status == 2">审核未通过</p>
					<p v-if="scope.row.status == 3">禁用</p>
				</template>
			</el-table-column>
			<el-table-column prop="check_admin_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column prop="check_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button v-if="scope.row.status == 1" type="text" size="small" @click="updateNum(scope.row.wangwang,scope.row.id)">修改接单数</el-button>
					<el-button v-if="scope.row.status == 0" type="text" size="small" @click="check(scope.row.id,'1')">通过</el-button>
					<el-button v-if="scope.row.status == 0" type="text" size="small" @click="check(scope.row.id,'2')">拒绝</el-button>
					<el-button v-if="scope.row.status == 1" type="text" size="small" @click="setting(scope.row.id,'3')">禁用</el-button>
					<el-button v-if="scope.row.status == 3" type="text" size="small" @click="setting(scope.row.id,'1')">启用</el-button>
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
<el-dialog title="修改接单数" width="30%" center :visible.sync="showDialog">
	<el-form size="small">
		<el-form-item label="今日可接单：">
			<el-input v-model="numObj.day_order_limit" style="width: 150px">
				<template slot="append">单</template>
			</el-input>
		</el-form-item>
		<el-form-item label="本周可接单：">
			<el-input v-model="numObj.week_order_limit" style="width: 150px">
				<template slot="append">单</template>
			</el-input>
		</el-form-item>
		<el-form-item label="本月可接单：">
			<el-input v-model="numObj.month_order_limit" style="width: 150px">
				<template slot="append">单</template>
			</el-input>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" type="primary" @click="save">保存</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/resource.js'
	import exportUp from '../../api/export.js'
	export default{
		data(){
			return{
				checkStatus:[{
					id:"",
					name:"不限"
				},{
					id:0,
					name:"待审核"
				},{
					id:1,
					name:"审核通过"
				},{
					id:2,
					name:"审核未通过"
				},{
					id:3,
					name:"禁用"
				},],						//审核状态列表
				req:{
					page:1,
					size:10,
					status:"",
					invite_phone:"",
					bind_begin_time:"",
					bind_end_time:"",
					user_name:"",
					wangwang:"",
					check_name:""
				},
				date:[],
				dataObj:{},					//获取到的信息
				showDialog:false,			//默认弹框不显示
				wang:"",					//点击的旺旺号
				id:"",
				numObj:{
					day_order_limit:0,
					month_order_limit:0,
					week_order_limit:0
				},					//接单数详情
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			date:function(n){
				this.req.bind_begin_time = n?n[0]:"";
				this.req.bind_end_time = n?n[1]:"";
			}
		},
		methods:{
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
				resource.wangRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击修改接单数
			updateNum(wang,id){
				this.wang = wang;
				this.id = id;
				resource.updateWang({wangwang:wang}).then(res => {
					if(res.data.code == 1){
						this.numObj = res.data.data;
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击修改的保存
			save(){
				this.numObj.wangwang = this.wang;
				this.numObj.id = this.id;
				resource.updateWangPost(this.numObj).then(res => {
					if(res.data.code == 1){
						this.showDialog = false;
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
				arr.index = 14;
				exportUp.exportUp(arr)
			},
			//审核
			check(id,status){
				if(status == '1'){
					this.$confirm('确认通过?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.checkWang({id:id,check_status:status}).then(res => {
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
				}else{
					this.$prompt('拒绝原因', '确认拒绝？', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						if(value){

							resource.checkWang({id:id,check_status:status,reject_reason:value}).then(res => {
								if(res.data.code == 1){
									this.$message.success(res.data.msg);
									//获取列表
									this.getList();
								}else{
									this.$message.warning(res.data.msg);
								}
							})
						}else{
							this.$message.warning("请输入拒绝原因");
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消'
						});       
					});
				}
			},
			//启、禁用
			setting(id,status){
				this.$confirm(`确认${status == '1'?'启用':'禁用'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.wangwangForbid({id:id,status:status}).then(res => {
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








