<template>
	<div>
		<div class="infoTab">
			<div class="infoRow">
				<div class="label">商家名称</div>
				<div class="infoContent">{{infoObj.store_name}}</div>
				<div class="label">创建时间</div>
				<div class="infoContent">{{infoObj.add_time}}</div>
			</div>
			<div class="infoRow">
				<div class="label">联系人姓名</div>
				<div class="infoContent">{{infoObj.linkman}}</div>
				<div class="label">联系人手机</div>
				<div class="infoContent">{{infoObj.linkman_phone}}</div>
			</div>
			<div class="infoRow">
				<div class="label">联系人QQ</div>
				<div class="infoContent">{{infoObj.linkman_qq}}</div>
				<div class="label">联系人微信</div>
				<div class="infoContent">{{infoObj.linkman_wx}}</div>
			</div>
			<div class="infoRow">
				<div class="label">可用余额（元）</div>
				<div class="infoContent">{{infoObj.balance_usable}}</div>
				<div class="label">冻结资金（元）</div>
				<div class="infoContent">{{infoObj.balance_freeze}}</div>
			</div>
			<div class="infoRow">
				<div class="label">店铺数</div>
				<div class="infoContent">{{infoObj.shop_num}}</div>
				<div class="label">订单量</div>
				<div class="infoContent">{{infoObj.order_num}}</div>
			</div>
		</div>
		<div class="tabTitle">
			<div class="line"></div>
			<div class="titleTxt">商家账号</div>
		</div>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small" @click="createAccount = true">添加</el-button>
		</div>
		<el-table :data="infoObj.store_admin" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="admin_name" label="商家账号" align="center">
			</el-table-column>
			<el-table-column prop="check_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="审核时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="setting(scope.row.admin_id)">禁用</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="tabTitle">
			<div class="line"></div>
			<div class="titleTxt">店铺</div>
		</div>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small">添加</el-button>
		</div>
		<el-table :data="infoObj.store_shop" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="shop_name" label="店铺名称" align="center">
			</el-table-column>
			<el-table-column prop="tao_shop_name" label="淘宝店铺名" align="center">
			</el-table-column>
			<el-table-column prop="shop_url" label="店铺链接" align="center">
			</el-table-column>
			<el-table-column prop="add_name" label="创建人" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edior(scope.row.shop_id)">编辑</el-button>
					<el-button type="text" size="small" @click="deletes(scope.row.shop_id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 创建商家账号 -->
		<el-dialog title="创建商家账号" width="30%" :visible.sync="createAccount">
			<el-form size="small">
				<el-form-item label="商家账号：">
					<el-input v-model="accountReq.admin_name" style="width: 200px" size="small" placeholder="请输入商家账号账号"></el-input>
				</el-form-item>
				<el-form-item label="商家密码：">
					<el-input v-model="accountReq.password" style="width: 200px" size="small" placeholder="请输入密码"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="showDialog = false">取消</el-button>
				<el-button size="small" type="primary" @click="submitAccount">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.infoTab{
	margin-bottom: 30px;
	.infoRow{
		display: flex;
		.label{
			border: 1px solid #ccc;
			background: #f4f4f4;
			width: 200px;
			text-align: center;
			height: 36px;
			line-height: 36px;
			font-weight: 700;
		}
		.infoContent{
			border: 1px solid #ccc;
			width: 300px;
			text-align: center;
			height: 36px;
			line-height: 36px;
		}
	}
}
.tabTitle{
	margin-bottom: 30px;
	font-size: 16px;
	font-weight: bold;
	display: flex;
	align-items: center;
	.line{
		margin-right: 10px;
		width: 5px;
		height: 16px;
		background: #4DA1FF;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				infoObj:{},					//商家基本信息
				createAccount:false,		//默认添加账号弹框不显示
				accountReq:{
					admin_name:"",
					password:""
				},							//添加商家账号
			}
		},
		props:{
			id:{
				type:String,
				default:""
			}
		},
		created(){
			//获取商家详情
			this.getStoreInfo()
		},
		methods:{
			//获取商家详情
			getStoreInfo(){
				resource.getStoreInfo({store_id:this.id}).then(res => {
					if(res.data.code == 1){
						this.infoObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//商家账号设置禁用
			setting(id){
				this.$confirm('确认禁用该账号?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.stopStoreAdmin({admin_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取商家详情
							this.getStoreInfo();
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
				console.log(id)
			},
			//点击编辑
			edior(id){
				console.log(id)
			},
			//点击删除
			deletes(id){
				console.log(id)
			},
			//点击创建商家账号的确定
			submitAccount(){
				if(this.accountReq.admin_name == ""){
					this.$message.warning('请输入商家账号');
				}else if(this.accountReq.password == ""){
					this.$message.warning('请输入密码');
				}else{
					this.accountReq.store_id = this.id;
					resource.addStoreAdmin(this.accountReq).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取商家详情
							this.getStoreInfo();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}



		}
	}
</script>