<template>
	<div>
		<el-card>
			<div class="tabTitle">
				<div class="line"></div>
				<div class="titleTxt">任务信息</div>
			</div>
			<div v-if="currentStep == 1">
				<el-form size="small">
					<el-form-item label="任务名称：">
						<el-input style="width: 300px;" v-model="req.template_shop_name" placeholder="显示给商家的任务名称"></el-input>
					</el-form-item>
					<el-form-item label="任务名称：">
						<el-input style="width: 300px;" v-model="req.template_user_name" placeholder="显示给用户的任务名称"></el-input>
					</el-form-item>
					<el-form-item label="服务费：" v-for="(item,index) in serviceMoney">
						<div style="display:flex;align-items: center">
							<el-input style="width: 100px;" type="number" v-model="item.charge_begin" placeholder="输入价格"></el-input>&nbsp～&nbsp
							<el-input style="width: 100px;" type="number" v-model="item.charge_end" placeholder="输入价格"></el-input>&nbsp收取服务费&nbsp 
							<el-input style="width: 120px;" type="number" v-model="item.charge">
								<template slot="append">元</template>
							</el-input>
							&nbsp&nbsp
							<img class="fu" v-if="index == serviceMoney.length-1" src="../../assets/add.png" @click="add(index)">
							<img class="fu" v-if="serviceMoney.length > 1" src="../../assets/jian.png" @click="jian(index)">
						</div>
					</el-form-item>
					<el-form-item label="推广佣金：">
						<el-input style="width: 200px;" type="number" v-model="req.tuiguang_commission">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="用户接任务间隔时间：">
						<el-input style="width: 100px;" v-model="time" placeholder="间隔时间"></el-input>
						<el-select v-model="timeType" style="width: 100px;">
							<el-option label="秒" :value="1"></el-option>
							<el-option label="分" :value="60"></el-option>
							<el-option label="小时" :value="3600"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="用户接任务后：">
						<el-input style="width: 100px;" v-model="time1" placeholder="间隔时间"></el-input>
						<el-select v-model="timeType1" style="width: 100px;">
							<el-option label="秒" :value="1"></el-option>
							<el-option label="分" :value="60"></el-option>
							<el-option label="小时" :value="3600"></el-option>
						</el-select>
						内未完成任务自动取消
					</el-form-item>

					<el-form-item label="总代理抽成：">
						<el-input style="width: 200px;" type="number" v-model="req.general_agency_money">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="代理抽成：">
						<el-input style="width: 200px;" type="number" v-model="req.agency_money">
							<template slot="append">元</template>
						</el-input>
					</el-form-item>
					<el-form-item label="模版可接用户：">
						<el-radio-group v-model="req.template_users">
							<el-radio label="1">全部用户可接</el-radio>
							<el-radio label="0">全部用户不可接</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="任务可见分组：">
						<el-select v-model="shop_template_ids" multiple placeholder="请选择">
							<el-option v-for="item in storeList" :key="item.id" :label="item.store_group_name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input style="width: 300px;" type="textarea"
						:rows="3" v-model="req.desc" placeholder="显示给商家的任务名称"></el-input>
					</el-form-item>
				</el-form>
				<div class="tabTitle">
					<div class="line"></div>
					<div class="titleTxt">选择步骤</div>
				</div>
				<div>
					<el-button type="success" round v-for="item in stepList" @click="getStep(item)">{{item.step_name}}</el-button>
				</div>
				<div class="stepList">
					<div class="stepItem" v-for="(step,index) in processedStep">
						<div class="title">{{step.title}}</div>
						<div class="itemInfo">
							<el-form size="small" label-width="150px">
								<el-form-item :label="`${stepDetail.item_desc}：`" v-for="stepDetail in step.stepInfo">
									<el-input v-if="stepDetail.item_type == 1" style="width: 120px;" type="number" v-model="stepDetail.value">
										<template slot="append">元</template>
									</el-input>
									<el-select v-if="stepDetail.item_type == 2" v-model="stepDetail.value">
										<el-option v-for="item in stepDetail.list" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
									<el-input v-if="stepDetail.item_type == 7" style="width: 120px;" type="number" v-model="stepDetail.shi">
									</el-input>
									<el-select v-if="stepDetail.item_type == 7" style="width: 80px" v-model="stepDetail.time">
										<el-option v-for="item in stepDetail.list" :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
									<el-radio-group v-if="stepDetail.item_type == 3" v-model="stepDetail.value">
										<el-radio :label="item.id" v-for="item in stepDetail.list">{{item.name}}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-form>
							<img class="close" src="../../assets/close.png" @click="deleteStep(index)">
						</div>
					</div>
				</div>
				<div class="buts">
					<el-button type="primary" size="small" @click="next">下一步</el-button>
				</div>
			</div>
			<div v-if="currentStep == 2">
				<div class="temlist">
					<div class="temRow">
						<div class="temLabel">任务名称（商家）</div>
						<div class="temContent">{{req.template_shop_name}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">任务名称（用户）</div>
						<div class="temContent">{{req.template_user_name}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">用户接任务间隔时间</div>
						<div class="temContent" v-if="timeType == 1">{{req.user_task_time}}秒</div>
						<div class="temContent" v-if="timeType == 60">{{req.user_task_time/60}}分钟</div>
						<div class="temContent" v-if="timeType == 3600">{{req.user_task_time/3600}}小时</div>
					</div>
					<div class="temRow">
						<div class="temLabel">自动取消时间</div>
						<div class="temContent" v-if="timeType1 == 1">{{req.auto_cancel}}秒</div>
						<div class="temContent" v-if="timeType1 == 60">{{req.auto_cancel/60}}分钟</div>
						<div class="temContent" v-if="timeType1 == 3600">{{req.auto_cancel/3600}}小时</div>
					</div>
					<div class="temRow">
						<div class="temLabel">任务可见分组</div>
						<div class="temContent">{{detailStoreList.join(',')}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">备注</div>
						<div class="temContent">{{req.desc}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">代理抽成（元）</div>
						<div class="temContent">{{req.agency_money}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">总代理抽成（元）</div>
						<div class="temContent">{{req.general_agency_money}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">模版可接用户</div>
						<div class="temContent">{{req.template_users == '1'?'全部用户可接':'全部用户不可接'}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">服务费（元）</div>
						<div class="temContent">{{detailServiceList.join(',')}}</div>
					</div>
					<div class="temRow">
						<div class="temLabel">推广佣金（元）</div>
						<div class="temContent">{{req.tuiguang_commission}}</div>
					</div>
				</div>
				<div class="tabList">
					<div class="tabTitle1">
						<div class="title">步骤名称</div>
						<div class="title">佣金（元）</div>
						<div class="title">上级分佣（元）</div>
						<div class="title">显示下一步骤时间</div>
						<div class="title">审核方式</div>
						<div class="title">截图</div>
					</div>
					<div class="tabRow" v-for="item in processedStep">
						<div class="con rowLabel">{{item.title}}</div>
						<div class="con">{{item.stepInfo[0].value}}</div>
						<div class="con">{{item.title == '搜索下单'?item.stepInfo[6].value:item.stepInfo[4].value}}</div>
						<div class="con">{{item.stepInfo[2].value/item.stepInfo[2].time}}{{item.stepInfo[2].time == 1?'秒':item.stepInfo[2].time == 60?'分钟':'小时'}}</div>
						<div class="con">{{item.stepInfo[1].list[parseInt(item.stepInfo[1].value)].name}}</div>
						<div class="con">{{item.stepInfo[3].list[parseInt(item.stepInfo[3].value)].name}}</div>
					</div>
				</div>
				<div class="buts">
					<el-button type="primary" size="small" @click="currentStep = 1">上一步</el-button>
					<el-button type="primary" size="small" @click="ok">确认</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.tabTitle{
	margin-top: 30px;
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
.fu{
	width: 20px;
}
.buts{
	margin-top: 20px;
	display:flex;
	justify-content: center;
}
.stepList{
	margin-top: 20px;
	width: 100%;
	.stepItem{
		margin-bottom: 20px;
		width: 100%;
		display:flex;
		.title{
			margin-right: 10px;
			border-radius: 5px;
			width: 120px;
			height: 40px;
			background: #F56C6C;
			color: #fff;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
		}
		.itemInfo{
			position: relative;
			padding: 10px;
			flex:1;
			border: 1px solid #ccc;
			.close{
				width: 20px;
				height: 20px;
				position: absolute;
				top: -10px;
				right: -10px;
			}
		}
	}
}
.temlist{
	border-top: 1px solid #ccc;
	border-right: 1px solid #ccc;
	border-left: 1px solid #ccc;
	.temRow{
		display:flex;
		border-bottom: 1px solid #ccc;
		.temLabel{
			border-right: 1px solid #ccc;
			width: 180px;
			height: 34px;
			background: #f5f5f5;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-weight: bold;
		}
		.temContent{
			flex:1;
			height: 34px;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
		}
	}
}
.tabList{
	margin-top: 20px;
	border-left: 1px solid #ccc;
	.tabTitle1{
		display:flex;
		.title{
			border-bottom: 1px solid #ccc;
			border-top: 1px solid #ccc;
			border-right: 1px solid #ccc;
			width: 180px;
			height: 34px;
			background: #f5f5f5;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-weight: bold;
		}
	}
	.tabRow{
		display:flex;
		.con{
			border-bottom: 1px solid #ccc;
			border-top: 1px solid #ccc;
			border-right: 1px solid #ccc;
			width: 180px;
			height: 34px;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
		}
		.rowLabel{
			background: #f5f5f5;
		}
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				currentStep:1,						//默认当前第一步
				storeList:[],						//商家列表
				stepList:[],						//步骤按钮列表
				req:{
					template_shop_name:"",
					template_user_name:"",
					step_ids:"",
					charge:[],
					user_task_time:"",
					general_agency_money:"",
					agency_money:"",
					shop_template_ids:"",
					template_users:'1',
					desc:"",
					step:{},
					tuiguang_commission:""
				},									//参数
				serviceMoney:[{
					charge_begin:"",
					charge_end:"",
					charge:""
				}],									//所有服务费条目（*）
				time:"",							//填写的时间
				time1:"",
				timeType:1,							//间隔时间类型（默认秒）
				timeType1:1,
				shop_template_ids:[],				//选中所有分组列表（*）
				processedStep:[],					//待处理的步骤列表
				detailStoreList:[],					//第二步显示选中商家
				detailServiceList:[],				//第二步显示选中商家
			}
		},
		created(){
			//获取商家列表
			this.getStoreList();
			//获取步骤列表
			this.getStepList();
		},
		inject:['reload'],
		methods:{
			//获取分组列表
			getStoreList(){
				resource.storeGroup().then(res => {
					if(res.data.code == 1){
						this.storeList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取步骤列表
			getStepList(){
				resource.getStep().then(res => {
					if(res.data.code == 1){
						this.stepList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//加服务费
			add(i){
				if(this.serviceMoney[i].charge_begin == "" || this.serviceMoney[i].charge_end == "" || this.serviceMoney[i].charge == ""){
					this.$message.warning("请完善服务费条目");
				}else if(parseFloat(this.serviceMoney[i].charge_begin) > parseFloat(this.serviceMoney[i].charge_end)){
					this.$message.warning("起始价格不能大于最终价格");
				}else{
					let obj = {
						charge_begin:"",
						charge_end:"",
						charge:""
					}
					this.serviceMoney.push(obj);
				}
			},
			//减服务费
			jian(i){
				this.serviceMoney.splice(i,1);
			},
			//点击某一个步骤
			getStep(obj){
				if(obj.step_name == '下单'){
					for(let i = 0;i < this.processedStep.length;i ++){
						if(this.processedStep[i].title == '下单'){
							this.$message.warning("【下单】只能选择一次");
							return;
						}else if(this.processedStep[i].title == '搜索下单'){
							this.$message.warning("【下单】和【搜索下单】只能选择一个");
							return;
						}
					}
				}
				if(obj.step_name == '搜索下单'){
					for(let i = 0;i < this.processedStep.length;i ++){
						if(this.processedStep[i].title == '搜索下单'){
							this.$message.warning("【搜索下单】只能选择一次");
							return;
						}else if(this.processedStep[i].title == '下单'){
							this.$message.warning("【下单】和【搜索下单】只能选择一个");
							return;
						}
					}
				}
				resource.getStepPost({id:obj.step_id}).then(res => {
					if(res.data.code == 1){
						let list = res.data.data;
						list.map(item => {
							if(item.item_type == 2 || item.item_type == 3){
								item.value = item.list[0].id;
							}else if(item.item_id == 3){
								item.value = "";
								item.shi = "0";
								item.time = 1;
								item.list = [{
									id:1,
									name:"秒"
								},{
									id:60,
									name:"分钟"
								},{
									id:3600,
									name:"小时"
								}]
							}else{
								item.value = "";
							}
							item.step_id = obj.step_id;
						})
						let stepItem = {
							title:obj.step_name
						};
						stepItem.stepInfo = list;
						this.processedStep.push(stepItem);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除某一个步骤
			deleteStep(index){
				this.processedStep.splice(index,1);
			},
			//点击下一步
			next(){
				if(this.req.template_shop_name == ""){
					this.$message.warning('请输入显示给商家的任务名称');
					return;
				}else if(this.req.template_user_name == ""){
					this.$message.warning('请输入显示给用户的任务名称');
					return;
				}
				// 处理服务费
				for(var i = 0;i < this.serviceMoney.length;i ++){
					if(this.serviceMoney[i].charge_begin == "" || this.serviceMoney[i].charge_end == "" || this.serviceMoney[i].charge == ""){
						this.$message.warning("请完善服务费条目");
						return;
					}else if(parseFloat(this.serviceMoney[i].charge_begin) > parseFloat(this.serviceMoney[i].charge_end)){
						this.$message.warning("起始价格不能大于最终价格");
						return;
					}
				}
				this.req.charge = this.serviceMoney;
				// 处理推广佣金
				if(this.req.tuiguang_commission == ""){
					this.$message.warning("请输入推广佣金");
					return;
				}
				// 处理间隔时间
				if(this.time == ""){
					this.$message.warning("请输入接任务间隔时间");
					return;
				}else{
					this.req.user_task_time = parseInt(this.time)*this.timeType;
				}
				// 处理自动取消时间时间
				if(this.time1 == ""){
					this.$message.warning("请输入自动取消时间");
					return;
				}else{
					this.req.auto_cancel = parseInt(this.time1)*this.timeType1;
				}
				// 处理总代理抽成
				if(this.req.general_agency_money == ""){
					this.$message.warning("请输入总代理抽成");
					return;
				}
				// 处理代理抽成
				if(this.req.agency_money == ""){
					this.$message.warning("请输入代理抽成");
					return;
				}
				// 处理分组id集合
				this.req.shop_template_ids = this.shop_template_ids.join(',');
				//处理选择的任务步骤
				if(this.processedStep.length == 0){
					this.$message.warning('请选择任务步骤');
					return;
				}
				var step_ids = [];		//所有选中的步骤id集合
				for(var i = 0;i < this.processedStep.length;i ++){
					var arr = [];
					for(var j = 0;j < this.processedStep[i].stepInfo.length;j ++){
						if(this.processedStep[i].stepInfo[j].time){
							this.processedStep[i].stepInfo[j].value = parseInt(this.processedStep[i].stepInfo[j].shi?this.processedStep[i].stepInfo[j].shi:0)*this.processedStep[i].stepInfo[j].time;
						}
						if(this.processedStep[i].stepInfo[j].value === ""){
							this.$message.warning('请完善任务步骤');
							return;
						}else{
							let reqObj = {
								step_id:this.processedStep[i].stepInfo[j].step_id,
								item_id:this.processedStep[i].stepInfo[j].item_id,
								value:this.processedStep[i].stepInfo[j].value,
							}
							arr.push(reqObj);
						}
					}
					let sid = this.processedStep[i].stepInfo[0].step_id;
					step_ids.push(sid);
					this.req.step[i+1] = arr;
				}
				this.req.step_ids = step_ids.join(',');
				//处理第二页的可见分组
				this.detailStoreList = [];
				for(var s = 0;s < this.shop_template_ids.length;s ++){
					for(var m = 0;m < this.storeList.length;m ++){
						if(this.shop_template_ids[s] == this.storeList[m].id){
							this.detailStoreList.push(this.storeList[m].store_group_name);
						}
					}
				}
				//处理第二页的服务费
				this.detailServiceList = [];
				this.serviceMoney.map(item => {
					let str = `${item.charge_begin}-${item.charge_end}之间收取${item.charge}元服务费`;
					this.detailServiceList.push(str);
				})
				this.currentStep = 2;
			},
			//点击确认创建
			ok(){
				this.$confirm('确认发布任务?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj1 = {
						template_shop_name:this.req.template_shop_name,
						template_user_name:this.req.template_user_name,
						step_ids:this.req.step_ids,
						user_task_time:this.req.user_task_time,
						auto_cancel:this.req.auto_cancel,
						shop_template_ids:this.req.shop_template_ids,
						general_agency_money:this.req.general_agency_money,
						agency_money:this.req.agency_money,
						template_users:this.req.template_users,
						charge:this.req.charge,
						desc:this.req.desc,
						tuiguang_commission:this.req.tuiguang_commission
					}
					let req = {
						template_info:JSON.stringify(obj1),
						step:JSON.stringify(this.req.step)
					}
					resource.createTemp(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.reload();
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




