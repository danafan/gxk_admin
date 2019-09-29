<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="代理账号：">
					<el-input v-model="req.name" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item label="代理名称：">
					<el-input v-model="req.account" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item label="时间范围：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd HH:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="代理类型：">
				<el-select v-model="req.agent_type" filterable placeholder="请选择">
					<el-option v-for="item in agentList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small" @click="exportUp">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}" :default-sort = "{prop: 'completeTime'}">
			<el-table-column prop="happen_time" label="时间" align="center">
			</el-table-column>
			<el-table-column prop="task_sn" label="任务编号" align="center">
			</el-table-column>
			<el-table-column prop="store_admin_name" label="商家账号" align="center">
			</el-table-column>
			<el-table-column prop="store_name" label="商家名称" align="center">
			</el-table-column>
			<el-table-column label="代理类型" align="center">
				<template slot-scope="scope">
					<p>{{scope.row.agent_type == '1'?'子代理':'总代理'}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="money" label="抽成（元）" align="center">
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
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
</el-card>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/resource.js'
	import exportUp from '../../api/export.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					name:"",
					account:"",
					start_time:"",
					end_time:"",
					agent_type:"-1"
				},
				agentList:[{
					id:"-1",
					name:"不限"
				},{
					id:'1',
					name:"子代理"
				},{
					id:'2',
					name:"总代理"
				}],
				date:[],
				dataObj:{},					//获取到的信息
				
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			date:function(n){
				this.req.start_time = n?n[0]:"";
				this.req.end_time = n?n[1]:"";
			}
		},
		methods:{
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
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
				resource.agentAmountRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//预约下载
			exportUp(){
				var arr = {};
				for(let a in this.req){
					if(a != 'page' && a != 'pagesize' && this.req[a] != ''){
						arr[a] = this.req[a];
					}
				}
				arr.index = 11;
				exportUp.exportUp(arr)
			},
			
		}


	}
</script>








