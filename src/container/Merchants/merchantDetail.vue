<template>
	<div>
		<el-card>
			<el-tabs>
				<el-tab-pane label="基本信息"><BasicInfo :id="id"/></el-tab-pane>
				<el-tab-pane label="充值记录"><TopUpRecord :id="id"/></el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import BasicInfo from './MerchantDetail/basicInfo.vue'
	import TopUpRecord from './MerchantDetail/topUpRecord.vue'
	export default{
		data(){
			return{
				id:""
			}
		},
		created(){
			this.id = this.$route.query.id;
		},
		components:{
			BasicInfo,
			TopUpRecord
		}
	}
</script>