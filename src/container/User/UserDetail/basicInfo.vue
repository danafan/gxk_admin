<template>
	<div>
		<div class="infoTop">
			<img class="userImg" :src="part1.head_img">
			<div class="userInfoTab">
				<div class="row">
					<div class="tabLabel">用户ID</div>
					<div class="tabContent">{{part1.user_id}}</div>
					<div class="tabLabel">身份</div>
					<div class="tabContent">{{part1.job}}</div>
				</div>
				<div class="row">
					<div class="tabLabel">昵称</div>
					<div class="tabContent">{{part1.phone}}</div>
					<div class="tabLabel">生日</div>
					<div class="tabContent">{{part1.birthday}}</div>
				</div>
				<div class="row">
					<div class="tabLabel">上级昵称</div>
					<div class="tabContent">{{part1.inviter_id}}</div>
					<div class="tabLabel">标签</div>
					<div class="tabContent">{{part1.tag_id}}</div>
				</div>
				<div class="row">
					<div class="tabLabel">注册地址</div>
					<div class="tabContent">{{part1.registe_address}}</div>
					<div class="tabLabel">注册时间</div>
					<div class="tabContent">{{part1.reg_time}}</div>
				</div>
				<div class="row">
					<div class="tabLabel">最后登录时间</div>
					<div class="tabContent">{{part1.last_login_time}}</div>
					<div class="tabLabel">性别</div>
					<div class="tabContent">{{part1.sex}}</div>
				</div>
			</div>
		</div>
		<el-table :data="part2" size="small" border style="width: 100%;margin-top: 50px" align="center" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="real_name" label="真实姓名" align="center">
			</el-table-column>
			<el-table-column prop="id_card_no" label="身份证号码" align="center">
			</el-table-column>
			<el-table-column prop="id_card_address" label="身份证地址" width="300" align="center">
			</el-table-column>
			<el-table-column prop="job" label="身份证图片" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="showImg = true">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="job" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="check(scope.row.id,'2')">通过</el-button>
					<el-button type="text" size="small" @click="check(scope.row.id,'3')">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-table :data="part3" size="small" border style="width: 100%;margin-top: 50px" align="center" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="total_commission" label="累计获取佣金（元）" align="center">
			</el-table-column>
			<el-table-column prop="total_income" label="可提现佣金（元）" align="center">
			</el-table-column>
			<el-table-column prop="frozen_money" label="冻结金额（元）" align="center">
			</el-table-column>
			<el-table-column prop="doneNum" label="完成订单数量" align="center">
			</el-table-column>
			<el-table-column prop="extension_num" label="邀请码总数" align="center">
			</el-table-column>
			<el-table-column prop="invitation_code_num" label="已使用邀请码" align="center">
			</el-table-column>
			<el-table-column prop="login_times" label="登录次数" align="center">
			</el-table-column>
		</el-table>
		<el-table :data="part4" size="small" border style="width: 100%;margin-top: 50px" align="center" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="wangwang" label="旺旺号" align="center">
			</el-table-column>
			<el-table-column prop="user_id" label="手机号码" align="center">
			</el-table-column>
			<el-table-column prop="order_sn" label="淘宝订单号" align="center">
			</el-table-column>
			<el-table-column prop="address" label="详细地址" align="center">
			</el-table-column>
			<el-table-column prop="check_admin_name" label="审核人" align="center">
			</el-table-column>
			<el-table-column prop="done_order_num" label="完成订单数量" align="center">
			</el-table-column>
			<el-table-column prop="job" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="checkWang(scope.row.id,'1')">通过</el-button>
					<el-button type="text" size="small" @click="checkWang(scope.row.id,'2')">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 查看身份证图片 -->
		<el-dialog title="身份证图片" center :visible.sync="showImg">
			<el-carousel trigger="click" height="400px">
				<el-carousel-item v-for="item in cardImgList" :key="item">
					<img class="cardimg" :src="item">
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.infoTop{
	display: flex;
	.userImg{
		margin-right: 20px;
		width: 180px;
		height: 180px;
	}
	.userInfoTab{
		.row{
			display:flex;
			.tabLabel{
				border: 1px solid #ccc;
				background: #f4f4f4;
				width: 200px;
				text-align: center;
				height: 36px;
				line-height: 36px;
				font-weight: 700;
				font-size: 14px;
			}
			.tabContent{
				border: 1px solid #ccc;
				width: 300px;
				text-align: center;
				height: 36px;
				line-height: 36px;
				font-size: 14px;
			}
		}
	}
}
.cardimg{
	width: 100%;
	height: 400px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				part1:{},
				part2:[],
				part3:[],
				part4:[],
				cardImgList:[],			//图片列表
				showImg:false,			//默认图片弹框不显示
			}
		},
		props:{
			phone:{
				type:String,
				default:""
			}
		},
		created(){
			//获取信息
			this.getUserDetail()
		},
		methods:{
			//获取用户信息
			getUserDetail(){
				this.part1 = {},
				this.part2 = [],
				this.part3 = [],
				this.part4 = [],
				resource.getUserDetail({phone:this.phone}).then(res => {
					if(res.data.code == 1){
						this.part1 = res.data.data.part_1;
						this.part2.push(res.data.data.part_2);
						this.cardImgList.push(res.data.data.part_2.id_card_front_img);
						this.cardImgList.push(res.data.data.part_2.id_card_back_img);
						this.part3.push(res.data.data.part_3);
						this.part4 = res.data.data.part_4;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//审核
			check(id,status){
				this.$confirm(`确认${status == '2'?'通过':'拒绝'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.cardCheck({id:id,status:status}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取信息
							this.getUserDetail();
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
			//审核旺旺号
			checkWang(id,status){
				this.$confirm(`确认${status == '1'?'通过':'拒绝'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.wangCheck({id:id,status:status}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取信息
							this.getUserDetail();
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









