<template>
	<div>
		<el-card>
			<div class="tabTitle">
				<div class="line"></div>
				<div class="titleTxt">任务信息</div>
			</div>
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
				<el-form-item label="用户接任务间隔时间：">
					<el-input style="width: 100px;" v-model="time" placeholder="间隔时间"></el-input>
					<el-select v-model="timeType" style="width: 100px;">
						<el-option label="秒" :value="1"></el-option>
						<el-option label="分" :value="60"></el-option>
						<el-option label="小时" :value="3600"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="任务可见商家：">
					<el-select v-model="shop_template_ids" multiple placeholder="请选择">
						<el-option v-for="item in storeList" :key="item.store_id" :label="item.store_name" :value="item.store_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input style="width: 300px;" type="textarea"
					:rows="3" v-model="req.desc" placeholder="显示给商家的任务名称"></el-input>
				</el-form-item>
			</el-form>
			<div class="buts">
				<el-button type="primary" size="small" @click="next">下一步</el-button>
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
	display:flex;
	justify-content: center;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				storeList:[],						//商家列表
				req:{
					template_shop_name:"",
					template_user_name:"",
					charge:[],
					user_task_time:"",
					shop_template_ids:"",
					desc:"",
				},									//参数
				serviceMoney:[{
					charge_begin:"",
					charge_end:"",
					charge:""
				}],									//所有服务费条目（*）
				time:"",							//填写的时间
				timeType:1,							//间隔时间类型（默认秒）
				shop_template_ids:[],				//选中所有商家列表（*）
			}
		},
		created(){
			//获取商家列表
			this.getStoreList();
		},
		methods:{
			//获取商家列表
			getStoreList(){
				resource.taskStoreList().then(res => {
					if(res.data.code == 1){
						this.storeList = res.data.data;
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
			//点击下一步
			next(){
				if(this.req.template_shop_name == ""){
					this.$message.warning('请输入显示给商家的任务名称');
					return;
				}else if(this.req.template_user_name == ""){
					this.$message.warning('请输入显示给用户的任务名称');
					return;
				}
				//处理服务费
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
				//处理间隔时间
				if(time == ""){
					this.$message.warning("请输入接任务间隔时间");
					return;
				}else{
					this.req.user_task_time = parseInt(this.req.time)*this.timeType;
				}
				//处理商家id集合
				this.req.shop_template_ids = this.shop_template_ids.join(',');
				console.log(this.req)
			}
		}
	}
</script>




