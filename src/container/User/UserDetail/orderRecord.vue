<template>
	<div>
		<el-table :data="dataObj.data" size="small" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="end_time" label="结束时间" align="center">
			</el-table-column>
			<el-table-column prop="phone" label="用户" align="center">
			</el-table-column>
			<el-table-column prop="order_id" label="订单编号" align="center">
			</el-table-column>
			<el-table-column prop="store_name" label="发布商家" align="center">
			</el-table-column>
			<el-table-column label="订单金额" align="center">
				<template slot-scope="scope">
					<p>商品价格：{{scope.row.goods_price}}</p>
					<p>付款金额：{{scope.row.pay_amount}}</p>
					<p>获得佣金：{{scope.row.commission}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="order_status" label="订单状态" align="center">
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
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				dataObj:{},
				req:{
					page:1,
					size:10
				}
			}
		},
		props:{
			phone:{
				type:String,
				default:""
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
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
			//获取列表
			getList(){
				this.req.phone = this.phone;
				resource.orderRecord(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		}
	}
</script>




