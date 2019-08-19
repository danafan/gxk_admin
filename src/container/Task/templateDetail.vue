<template>
	<div>
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
				<div class="temContent">{{req.user_task_time}}小时</div>
			</div>
			<div class="temRow">
				<div class="temLabel">任务可见商家</div>
				<div class="temContent">{{req.store_ids}}</div>
			</div>
			<div class="temRow">
				<div class="temLabel">备注</div>
				<div class="temContent">{{req.desc}}</div>
			</div>
			<div class="temRow">
				<div class="temLabel">服务费（元）</div>
				<div class="temContent">{{req.charge_str}}</div>
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
				<div class="con rowLabel">{{item.step}}</div>
				<div class="con">{{item.commission}}</div>
				<div class="con">{{item.shangji_commission}}</div>
				<div class="con">{{item.time}}小时</div>
				<div class="con">{{item.check_type}}</div>
				<div class="con">{{item.image}}</div>
			</div>
		</div>
		<div class="buts">
			<el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
		</div>
	</div>
</template>
<style scoped lang="less">
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
.buts{
	margin-top: 30px;
	display:flex;
	flex-direction: column;
	align-items: center;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				id:"",
				req:{},
				processedStep:[]
			}
		},
		created(){
			this.id = this.$route.query.id;
			this.tasklook()
		},
		methods:{
			//获取详情
			tasklook(){
				resource.tasklook({template_id:this.id}).then(res => {
					if(res.data.code == 1){
						this.req = res.data.data.head;
						this.processedStep = res.data.data.tail;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>





