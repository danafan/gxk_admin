<template>
	<div>
		<el-card>
			<div>
				<div style="margin-bottom: 20px" v-for="(items,index) in list">
					<div class="tabTitle">
						<div class="line">{{items.group_name}}</div>
					</div>
					<div class="setItem" v-for="(i,index2) in items.item">
						<div class="label">{{i.name}}</div>
						<div class="val">
							<el-input type="number" v-if="i.label_type == 1" v-model="i.value" style="width: 200px" size="small"></el-input>
							<el-radio v-if="i.label_type == 2" v-model="i.value" label="1">是</el-radio>
							<el-radio v-if="i.label_type == 2" v-model="i.value" label="0">否</el-radio>
						</div>
						<el-button size="small" type="primary" @click="save(index,index2)">保存</el-button>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.tabTitle{
	margin-bottom: 20px;
	font-weight: bold;
	font-size: 18px;
}
.setItem{
	font-size: 16px;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.label{
		width: 400px;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				list:[]
			}
		},
		created(){
			//获取系统配置
			this.getSystemInfo();
		},
		methods:{
			//获取系统配置
			getSystemInfo(){
				resource.getSystemInfo().then(res => {
					if(res.data.code == 1){
						this.list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击某一个保存
			save(index,index2){
				let obj = this.list[index].item[index2];
				let req = {};
				req[obj.key] = obj.value;
				resource.setSystem(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取系统配置
						this.getSystemInfo();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>