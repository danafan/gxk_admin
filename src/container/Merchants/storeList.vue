<template>
	<div>
		<el-card>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="商家名称：">
					<el-input v-model="req.store_name" placeholder="请输入商家名称"></el-input>
				</el-form-item>
				<el-form-item label="店铺名称：">
					<el-input v-model="req.shop_name" placeholder="请输入店铺名称"></el-input>
				</el-form-item>
				<el-form-item label="创建人：">
					<el-input v-model="req.add_name" placeholder="请输入创建人"></el-input>
				</el-form-item>
				<el-form-item label="创建时间：">
					<el-date-picker
					v-model="date"
					type="datetimerange"
					value-format="yyyy-MM-dd hh:mm:ss"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="but">
			<el-button type="primary" icon="el-icon-download" size="small">导出</el-button>
		</div>
		<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="shop_id" label="店铺ID" align="center">
			</el-table-column>
			<el-table-column prop="shop_name" label="店铺名称" align="center">
			</el-table-column>
			<el-table-column prop="add_name" label="创建人" align="center">
			</el-table-column>
			<el-table-column label="店铺状态" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.is_del === 1">关闭</p>
					<p v-if="scope.row.is_del === 0">开启</p>
				</template>
			</el-table-column>
			<el-table-column prop="add_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center" >
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edior(scope.row.shop_id)">编辑</el-button>
				</template>
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
<el-dialog title="编辑修改店铺" width="30%" :visible.sync="showDialog">
	<el-form size="small">
		<el-form-item label="店铺名称：" required>
			<el-input v-model="storeReq.shop_name" style="width: 200px" size="small" placeholder="请输入店铺名称"></el-input>
		</el-form-item>
		<el-form-item label="淘宝店铺名称：" required>
			<el-input v-model="storeReq.tao_shop_name" style="width: 200px" size="small" placeholder="请输入淘宝店铺名称"></el-input>
		</el-form-item>
		<el-form-item label="店铺ID（ERP系统）：" required>
			<el-input v-model="storeReq.erp_shop_id" style="width: 200px" size="small" placeholder="请输入店铺ID"></el-input>
		</el-form-item>
		<el-form-item label="是否验证淘宝客：">
			<el-radio-group v-model="storeReq.verify_tbk">
				<el-radio :label="1">验证</el-radio>
				<el-radio :label="0">不验证</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="下单任务限制（天/单）：" required>
			<el-input v-model="storeReq.task_interval" type="number" style="width: 200px" size="small" placeholder="请输入天数"></el-input>
		</el-form-item>
		<el-form-item label="收件人：" required>
			<el-input v-model="storeReq.receiver" style="width: 200px" size="small" placeholder="请输入收件人"></el-input>
		</el-form-item>
		<el-form-item label="收件人手机号：" required>
			<el-input v-model="storeReq.phone" type="number" style="width: 200px" size="small" placeholder="请输入收件人手机号"></el-input>
		</el-form-item>
		<el-form-item label="退货地址：" required>
			<el-input v-model="storeReq.back_address" type="textarea" :row="3" style="width: 200px" size="small" placeholder="请输入退货地址"></el-input>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showDialog = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitStore">确 定</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.dialogItem{
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	font-size: 14px;
	.itemLabel{
		width: 100px;
		font-weight: bold;
	}
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					store_name:"",
					shop_name:"",
					add_name:"",
					start_datetime:"",
					end_datetime:""
				},
				date:[],
				dataObj:{},					//获取到的信息
				showDialog:false,
				shop_id:"",
				storeReq:{
					shop_name:"",
					tao_shop_name:"",
					erp_shop_id:"",
					verify_tbk:1,
					task_interval:"",
					receiver:"",
					phone:"",
					back_address:""
				},
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		inject:['reload'],
		watch:{
			date:function(n){
				this.req.start_datetime = n?n[0]:"";
				this.req.end_datetime = n?n[1]:"";
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
				resource.shopList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//编辑
			edior(id){
				this.shop_id = id;
				resource.getShopInfo({shop_id:id}).then(res => {
					if(res.data.code == 1){
						var data = res.data.data;
						for(var key in this.storeReq){
							for(var k in data){
								if(key === k){
									this.storeReq[key] = data[k];
								}
							}
						}
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击店铺弹框的确定
			submitStore(){
				if(this.storeReq.shop_name == ""){
					this.$message.warning('请输入店铺名称');
				}else if(this.storeReq.tao_shop_name == ""){
					this.$message.warning('请输入淘宝店铺名称');
				}else if(this.storeReq.erp_shop_id == ""){
					this.$message.warning('请输入店铺ID');
				}else if(this.storeReq.task_interval == ""){
					this.$message.warning('请输入天数');
				}else if(this.storeReq.receiver == ""){
					this.$message.warning('请输入收件人');
				}else if(this.storeReq.phone == ""){
					this.$message.warning('请输入收件人手机号');
				}else if(this.storeReq.back_address == ""){
					this.$message.warning('请输入收货地址');
				}else{
					this.storeReq.shop_id = this.shop_id;
					resource.editShop(this.storeReq).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.showDialog = false;
							//获取列表
							this.getList()
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					
				}
			},
			
		}


	}
</script>








