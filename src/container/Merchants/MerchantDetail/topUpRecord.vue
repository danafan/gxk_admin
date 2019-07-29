<template>
	<div>充值记录</div>
</template>
<style lang="less" scoped>
	
</style>
<script>
	export default{
		props:{
			id:{
				type:String,
				default:""
			}
		},
		created(){
			console.log(this.id);
		}
	}
</script>