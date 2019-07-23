<template>
	<div class="box">
		<el-container style="height:100%">
			<el-header class="header">
				<div class="gxk">共享客</div>
				<div class="headerRight">
					<div class="service">消息中心：1</div>
					<div class="username">{{admin_name}}</div>
					<div class="line"></div>
					<div class="tui" @click="exit">退出</div>
				</div>
			</el-header>
			<el-container>
				<el-aside>
					<el-menu
					:default-active="activeIndex"
					class="el-menu-vertical-demo"
					active-text-color="#fff"
					:unique-opened="true"
					:router="true"
					@select="handleSelect"
					>
					<el-submenu :index="index.toString()" v-for="(item,index) in menuList">
						<template slot="title">
							<i :class="`el-icon-${item.icon}`"></i>
							<span>{{item.menu_name}}</span>
						</template>
						<el-menu-item-group>     
							<el-menu-item :index="`/${menu.web_url}`" v-for="menu in item.menu2">{{menu.menu_name}}</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<el-card>
					<el-breadcrumb separator="/">
						<el-breadcrumb-item v-for="item in levelList">{{item.name}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-card>
				
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</div>
</template>
<style lang="less" scoped>
.box{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	.header{
		width: 100%;
		height: 64px;
		background: #fff;
		display:flex;
		justify-content: space-between;
		align-items: center;
		.gxk{
			width: 256px;
			height: 64px;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			color: #000;
		}
		.headerRight{
			display:flex;
			align-items: center;
			.service{
				margin-right: 24px;
			}
			.username{
				font-size: 14px;
				color: #000;
			}
			.line{
				margin-right: 8px;
				margin-left: 8px;
				border-right: 1px solid #FF8608;
				height:13px;
			}
			.tui{
				font-size: 14px;
				color: #333;
			}
		}
	}
	.el-menu-item.is-active {
		background:#409EFF !important;
	}
	.el-aside{
		background:#fff !important;
	}
	.el-menu{
		border: none !important;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				activeIndex:"",
				admin_name:"",
				levelList:[],
				menuList:[]
			}
		},
		created(){
			this.admin_name = sessionStorage.getItem("admin_name");
			//获取我的菜单列表
			this.getMenuList();
		},	
		watch:{
			$route(n){
				sessionStorage.setItem("tab",n);
				this.handleSelect(this.activeIndex);
				this.levelList = this.$route.matched.filter(item=>item.name)
			}
		},
		methods:{
			handleSelect(index){
				sessionStorage.setItem("tab",index);
				this.activeIndex = index;
			},
			//获取我的菜单列表
			getMenuList(){
				resource.getMenuList().then(res => {
					if(res.data.code == 1){
						this.menuList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				}).then(() => {
					let tab = sessionStorage.getItem("tab");
					if(!tab){
						let page = `/${this.menuList[0].menu2[0].web_url}`;
						this.activeIndex = page;
						this.$router.push(page);
					}else{
						this.activeIndex = tab;
						this.$router.push(tab);
					}
					this.levelList = this.$route.matched.filter(item=>item.name)
				})
			},
			//获取客服信息
			// service(){
			// 	resource.service().then(res => {
			// 		if(res.data.code == '1'){
			// 			this.qq = res.data.qq;
			// 			this.wechat = res.data.wechat;
			// 		}else{
			// 			this.$message.warning(res.data.msg)
			// 		}
			// 	})
			// },
			//点击退出
			exit(){
				this.$confirm('确认退出当前账户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.loginOut().then(res => {
						if(res.data.code == 1){
							sessionStorage.clear();
							this.$message.warning(res.data.msg);
							this.$router.push('/login');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			}
		}
	}
</script>




















