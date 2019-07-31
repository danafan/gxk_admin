<template>
	<div>
		<el-card>
			<el-tabs>
				<el-tab-pane label="基本信息"><BasicInfo :phone="phone"/></el-tab-pane>
				<el-tab-pane label="订单记录"><OrderRecord :phone="phone"/></el-tab-pane>
				<el-tab-pane label="提现记录"><CashRecord :phone="phone"/></el-tab-pane>
				<el-tab-pane label="日志"><log :phone="phone"/></el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import BasicInfo from './UserDetail/basicInfo.vue'
	import OrderRecord from './UserDetail/orderRecord.vue'
	import CashRecord from './UserDetail/cashRecord.vue'
	import log from './UserDetail/log.vue'
	export default{
		data(){
			return{
				phone:""
			}
		},
		created(){
			this.phone = this.$route.query.phone;
		},
		components:{
			BasicInfo,
			OrderRecord,
			CashRecord,
			log
		}
	}
</script>