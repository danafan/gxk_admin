<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="审核状态：">
					<el-select v-model="req.check_status">
						<el-option v-for="item in checkStatus" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户信息：">
					<el-input v-model="req.user_info" placeholder="请输入用户手机号、姓名、身份证皆可查询"></el-input>
				</el-form-item>
				<el-form-item label="创建时间：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd hh:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
		</div>
		<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="user_phone" label="用户名" align="center">
			</el-table-column>
			<el-table-column prop="name" label="真实姓名" align="center">
			</el-table-column>
			<el-table-column prop="bank_card" label="银行卡号" align="center">
			</el-table-column>
			<el-table-column label="银行卡图片" align="center">
				<template slot-scope="scope">
					<p v-if="!scope.row.bank_card_img">暂无</p>
					<el-button v-else type="text" size="small" @click="look(scope.row)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="bank_name" label="开户行" align="center">
			</el-table-column>
			<el-table-column prop="status" label="审核状态" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.check_status == 0">待审核</p>
					<p v-if="scope.row.check_status == 1">审核通过</p>
					<p v-if="scope.row.check_status == 2">审核拒绝</p>
				</template>
			</el-table-column>
			<el-table-column prop="check_admin_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column prop="check_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="check(scope.row.id,'1')">通过</el-button>
					<el-button type="text" size="small" @click="check(scope.row.id,'2')">拒绝</el-button>
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
<el-dialog title="银行卡图片" center :visible.sync="showDialog">
	<el-carousel trigger="click" height="400px">
		<el-carousel-item v-for="item in cardImgList" :key="item">
			<img class="cardimg" :src="item">
		</el-carousel-item>
	</el-carousel>
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
					name:"审核拒绝"
				},],				//审核状态列表
				req:{
					page:1,
					size:10,
					check_status:"",
					user_info:"",
					upload_begin_time:"",
					upload_end_time:""
				},
				date:[],
				dataObj:{},					//获取到的信息
				showDialog:false,			//默认弹框不显示
				cardImgList:[],				//银行卡图片
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			date:function(n){
				this.req.upload_begin_time = n?n[0]:"";
				this.req.upload_end_time = n?n[1]:"";
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
				resource.bankList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击查看某一个银行卡
			look(row){
				this.cardImgList = [];
				this.showDialog = true;
				this.cardImgList.push(row.bank_card_img);
			},
			//审核
			check(id,status){
				this.$confirm(`确认${status == '1'?'通过':'拒绝'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.checkBank({id:id,check_status:status}).then(res => {
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








