<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="用户名：">
					<el-input v-model="req.phone" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="上级用户：">
					<el-input v-model="req.inviter_id" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="身份：">
					<el-select v-model="req.job" filterable placeholder="请选择">
						<el-option v-for="item in jobList" :key="item.job_id" :label="item.job_name" :value="item.job_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="注册时间：">
					<el-date-picker
					v-model="date1"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="任务时间：">
				<el-date-picker
				v-model="date2"
				type="datetimerange"
				value-format="yyyy-MM-dd HH:mm:ss"
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
	<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column prop="phone" label="用户账号" align="center">
		</el-table-column>
		<el-table-column prop="realName" label="真实姓名" align="center">
		</el-table-column>
		<el-table-column prop="invite_name" label="上级用户" align="center">
		</el-table-column>
		<el-table-column prop="job" label="身份" align="center">
		</el-table-column>
		<el-table-column label="已邀人数/总邀人数" align="center">
			<template slot-scope="scope">
				<p>{{scope.row.inviteNum}}/{{scope.row.extension_num}}</p>
			</template>
		</el-table-column>
		<el-table-column prop="doneOrderNum" label="完成订单" align="center">
		</el-table-column>
		<el-table-column prop="total_commission" label="总收益（元）" align="center">
		</el-table-column>
		<el-table-column prop="reg_time" label="注册时间" align="center">
		</el-table-column>
		<el-table-column label="操作" align="center" >
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="setStatus(scope.row)">{{scope.row.user_status == 2?'启用':'禁用'}}</el-button>
				<el-button type="text" size="small" @click="setMoney(scope.row.phone,'1')">冻结</el-button>
				<el-button type="text" size="small" @click="setMoney(scope.row.phone,'2')">解冻</el-button>
				<el-button type="text" size="small" @click="setPeople(scope.row.phone)">邀请</el-button>
				<el-button type="text" size="small" @click="$router.push('/userDetail?phone=' + scope.row.phone)">查看</el-button>
				<el-button type="text" size="small" @click="userAndTag(scope.row.user_id)">标签</el-button>
				<el-button type="text" size="small" @click="updateWang(scope.row.user_id)">旺旺号</el-button>
				<el-button type="text" size="small" @click="getTemplate(scope.row.user_id)">任务</el-button>
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
<!-- 冻结或解冻金额弹框 -->
<el-dialog :title="setMoneyType == '1'?'冻结金额':'解冻金额'" center width="30%" :visible.sync="showMoney">
	<div class="dialogItem">
		<div class="itemLabel">用户名：</div>
		<div class="itemContent">{{moneyDetail.phone}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">可提现佣金：</div>
		<div class="itemContent">{{moneyDetail.total_income}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">已冻结佣金：</div>
		<div class="itemContent">{{moneyDetail.frozen_money}}</div>
	</div>
	<div class="dialogItem" v-if="setMoneyType == '1'">
		<div class="itemLabel">冻结金额：</div>
		<el-input type="number" size="small" style="width: 150px" v-model="setMoneyTxt">
			<template slot="append">元</template>
		</el-input>
	</div>
	<div class="dialogItem" v-if="setMoneyType == '2'">
		<div class="itemLabel">解冻金额：</div>
		<el-input type="number" size="small" style="width: 150px" v-model="setMoneyTxt">
			<template slot="append">元</template>
		</el-input>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showMoney = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitMoney">确 定</el-button>
	</span>
</el-dialog>
<!-- 调整邀请人 -->
<el-dialog title="调整邀请人" center width="30%" :visible.sync="showPeople">
	<div class="dialogItem">
		<div class="itemLabel">用户名：</div>
		<div class="itemContent">{{peopleDetail.phone}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">可邀请人数：</div>
		<div class="itemContent">{{peopleDetail.extension_num}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">已邀请人数：</div>
		<div class="itemContent">{{peopleDetail.invitation_code_num}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">调整人数：</div>
		<el-input type="number" size="small" style="width: 150px" v-model="showPeopleTxt">
			<template slot="append">人</template>
		</el-input>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showPeople = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitPeople">确 定</el-button>
	</span>
</el-dialog>
<!-- 设置标签 -->
<el-dialog title="修改标签" center width="30%" :visible.sync="showTag">
	<div>
		<el-checkbox-group v-model="userTagIds">
			<el-checkbox :label="item.tag_id" v-for="item in tags">{{item.tag_name}}</el-checkbox>
		</el-checkbox-group>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showTag = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitTag">确 定</el-button>
	</span>
</el-dialog>
<!-- 设置旺旺号 -->
<el-dialog title="旺旺号设置" center width="30%" :visible.sync="showWang">
	<div class="dialogItem">
		<div class="itemLabel">当前限定数量：</div>
		<div class="itemContent">{{wangObj.wangwang_num_limit}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">当前绑定数量：</div>
		<div class="itemContent">{{wangObj.num}}</div>
	</div>
	<div class="dialogItem">
		<div class="itemLabel">修改限定数量：</div>
		<el-input type="number" size="small" style="width: 150px" v-model="wangNum">
		</el-input>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showWang = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitWang">确 定</el-button>
	</span>
</el-dialog>
<!-- 设置模版 -->
<el-dialog title="修改用户可接任务模版" center width="30%" :visible.sync="showTemplate">
	<div>
		<el-checkbox-group v-model="userTemList">
			<el-checkbox :label="item.template_id" v-for="item in templateList">{{item.template_shop_name}}</el-checkbox>
		</el-checkbox-group>
	</div>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showTemplate = false">取消</el-button>
		<el-button size="small" type="primary" @click="updateTemplate">确 定</el-button>
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
				tagList:[],					//标签列表
				jobList:[],					//身份列表
				req:{
					page:1,
					size:10,
					phone:"",
					inviter_id:"",
					job:"",
					registeBeginTime:"",
					registeEndTime:"",
					jobBeginTime:"",
					jobEndTime:""
				},
				date1:[],
				date2:[],
				dataObj:{},					//获取到的信息、
				setMoneyTxt:"",				//冻结或解冻的金额
				setMoneyType:"1",			//弹框类型（1:冻结；2:解冻）
				showMoney:false,			//金额操作弹框默认不显示
				moneyDetail:{},				//佣金详情
				phone:"",					//点击的手机号
				showPeople:false,			//邀请人弹框不显示
				showPeopleTxt:"",			//输入的调整人数
				peopleDetail:{},			//获取的人数信息
				showTag:false,				//修改标签弹框
				tags:[],					//所有标签
				userTagIds:[],				//用户选中的标签id
				user_id:"",					//选中的userid
				showWang:false,				//默认修改旺旺号数量弹框不显示
				wangNum:"",					//填写的修改旺旺数量
				wangObj:{},					//某一个用户的旺旺号数量限制
				showTemplate:false,			//用户可见模版弹框
				templateList:[],			//可见模版列表
				userTemList:[],				///选中的模版列表
			}
		},
		created(){
			//获取身份列表
			this.getJobList();
			//获取列表
			this.getList();
		},
		watch:{
			date1:function(n){
				this.req.registeBeginTime = n?n[0]:"";
				this.req.registeEndTime = n?n[1]:"";
			},
			date2:function(n){
				this.req.jobBeginTime = n?n[0]:"";
				this.req.jobEndTime = n?n[1]:"";
			}
		},
		methods:{	
			//获取身份列表
			getJobList(){
				resource.jobList().then(res => {
					if(res.data.code == 1){
						this.jobList = res.data.data;
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
				resource.userList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设置启用或禁用
			setStatus(row){
				this.$confirm(`确认${row.user_status == 1?'禁用':'启用'}`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						phone:row.phone,
						status:row.user_status == 1?2:1
					}
					resource.userHandle(obj).then(res => {
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
			//冻结或解冻
			setMoney(phone,type){
				this.phone = phone;
				this.setMoneyType = type;
				if(this.setMoneyType == '1'){			//冻结
					resource.freezeInfo({phone:phone}).then(res => {
						if(res.data.code == 1){
							this.moneyDetail = res.data.data;
							this.showMoney = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{									//解冻
					resource.unFreeze({phone:phone}).then(res => {
						if(res.data.code == 1){
							this.moneyDetail = res.data.data;
							this.showMoney = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//金额操作确认提交
			submitMoney(){
				if(this.setMoneyType == '1'){			//冻结
					if(this.setMoneyTxt == ''){
						this.$message.warning('请输入冻结金额');
					}else{
						resource.freezeInfoPost({phone:this.phone,freezeMoney:this.setMoneyTxt}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showMoney = false;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}else{									//解冻
					if(this.setMoneyTxt == ''){
						this.$message.warning('请输入解冻金额');
					}else{
						resource.unFreezePost({phone:this.phone,unFreezeMoney:this.setMoneyTxt}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showMoney = false;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
			//点击调整邀请人
			setPeople(phone){
				this.phone = phone;
				resource.adJustinviter({phone:phone}).then(res => {
					if(res.data.code == 1){
						this.peopleDetail = res.data.data;
						this.showPeople = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//调整邀请人的提交
			submitPeople(){
				if(this.showPeopleTxt == ''){
					this.$message.warning('请输入调整人数');
				}else{
					resource.adJustinviterPost({phone:this.phone,inviteNum:this.showPeopleTxt}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.showPeople = false;
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击标签
			userAndTag(user_id){
				this.user_id = user_id;
				resource.userAndTag({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.showTag = true;
						this.tags = res.data.data.tags;
						this.userTagIds = res.data.data.userTagIds;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击修改标签的确定
			submitTag(){
				let req = {
					user_id:this.user_id,
					tags:JSON.stringify(this.userTagIds)
				}
				resource.setTag(req).then(res => {
					if(res.data.code == 1){
						this.showTag = false;
						this.$message.success("设置成功");
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击旺旺号
			updateWang(id){
				this.wangNum = "";
				this.user_id = id;
				resource.getWangNum({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.wangObj = res.data.data;
						this.showWang = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击提交
			submitWang(){
				if(this.wangNum == ''){
					this.$message.warning("请输入限定数量");
				}else if(parseInt(this.wangNum) < parseInt(this.wangObj.num)){
					this.$message.warning("限定数量不能少于当前绑定数量");
				}else{
					let req = {
						user_id:this.user_id,
						num:this.wangNum 
					}
					resource.postWangNum(req).then(res => {
						if(res.data.code == 1){
							this.showWang = false;
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击任务
			getTemplate(id){
				this.user_id = id;
				resource.getChooseTemplate({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.templateList = res.data.data.head;
						this.userTemList = res.data.data.tail;
						this.showTemplate = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交
			updateTemplate(){
				let req = {
					user_id:this.user_id,
					ids:this.userTemList.join(',')
				}
				resource.postChooseTemplate(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.showTemplate = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}



			
		}


	}
</script>








