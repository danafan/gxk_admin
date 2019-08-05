<template>
	<div>
		<el-card>
			<div class="but">
				<el-button type="primary" icon="el-icon-download" size="small" @click="add">创建</el-button>
			</div>
			<el-table :data="dataObj.data" border style="width: 100%" align="center" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="banner_id" label="编号" align="center">
				</el-table-column>
				<el-table-column prop="banner_name" label="名称" align="center">
				</el-table-column>
				<el-table-column label="广告图片" align="center">
					<template slot-scope="scope">
						<img class="imgbox" :src="scope.row.banner_img">
					</template>
				</el-table-column>
				<el-table-column label="时间" align="center">
					<template slot-scope="scope">
						<p>开始时间：{{scope.row.start_time}}</p>
						<p>结束时间：{{scope.row.end_time}}</p>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="setting(scope.row)">{{scope.row.status == 1?'下线':'上线'}}</el-button>
						<el-button type="text" size="small" @click="edior(scope.row.banner_id)">编辑</el-button>
						<el-button type="text" size="small" @click="deletes(scope.row.banner_id)">删除</el-button>
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
	<!-- 创建或修改店铺 -->
	<el-dialog :title="dialogType == 1?'创建banner':'编辑banner'" center width="30%" :visible.sync="showDialog">
		<el-form size="small">
			<el-form-item label="名称：" required>
				<div>
					<el-input v-model="objReq.banner_name" style="width: 200px" size="small" placeholder="输入名称"></el-input>
					<div style="font-size: 12px">名称只作为辨别多个条目之用</div>
				</div>
			</el-form-item>
			<el-form-item label="开始时间：" required>
				<el-date-picker v-model="objReq.start_datetime" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="选择开始时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间：" required>
				<el-date-picker v-model="objReq.end_datetime" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" placeholder="选择结束时间">
				</el-date-picker>
			</el-form-item>
			<div style="display:flex">
				<div class="label"><span style="color: red">*</span>广告图片：</div>
				<div class="showimg" v-if="objReq.banner_img != ''" @mouseenter="isDel = true" @mouseleave="isDel = false">
					<img class="img" :src="domain + objReq.banner_img">
					<div class="modal" v-if="isDel == true">
						<img src="../../assets/deleteImg.png" @click="detele">
					</div>
				</div>
				<upload-file @callbackFn="callbackFn" v-else></upload-file>
			</div>
			<el-form-item label="广告链接：">
				<el-input v-model="objReq.banner_url" style="width: 200px" size="small" placeholder="输入广告链接"></el-input>
			</el-form-item>
			<el-form-item label="广告备注：">
				<el-input v-model="objReq.banner_remark" type="textarea"
				:rows="3" style="width: 200px" size="small" placeholder="输入广告备注"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="showDialog = false">取消</el-button>
			<el-button size="small" type="primary" @click="submit">确 定</el-button>
		</span>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.imgbox{
	width: 200px;
	height: 80px;
}
.showimg{
	position: relative;
	width: 200px;
	height: 80px;
	.img{
		position: absolute;
		width: 100%;
		height: 100%;
	}
	.modal{
		background: rgba(0,0,0,.6);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		img{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			display:block;
			width: 30px;
			height: 30px;
		}
	}
}
</style>
<script>
	import uploadFile from '../../components/uploadFile.vue'
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
				},
				dataObj:{},					//获取到的信息
				dialogType:1,				//弹框类型
				showDialog:false,
				objReq:{
					banner_name:"",
					banner_url:"",
					banner_img:"",
					start_datetime:"",
					end_datetime:"",
					banner_remark:""
				},							//添加或编辑的对象
				isDel:false,
				domain:"",
				id:""
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		inject:['reload'],
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
				resource.getBannerList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加
			add(){
				this.dialogType = 1;
				this.showDialog = true;
				this.objReq = {
					banner_name:"",
					banner_url:"",
					banner_img:"",
					start_datetime:"",
					end_datetime:"",
					banner_remark:""
				}
			},
			//点击编辑
			edior(id){
				this.id = id;
				resource.bannerDetail({banner_id:id}).then(res => {
					if(res.data.code == 1){
						this.dialogType = 2;
						this.showDialog = true;
						this.objReq.banner_name = res.data.data.banner_name;
						this.objReq.banner_url = res.data.data.banner_url;
						this.objReq.start_datetime = res.data.data.start_time;
						this.objReq.end_datetime = res.data.data.end_time;
						this.objReq.banner_remark = res.data.data.banner_remark;
						this.objReq.banner_img = res.data.data.banner_img;
						this.domain = res.data.data.domain;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//上传文件
			callbackFn(obj){
				this.objReq.banner_img = obj.url;
				this.domain = obj.domain;
			},
			//删除图片
			detele(item){	
				resource.deleteFile({filename:this.objReq.banner_img}).then(res => {
					if(res.data.code == 1){
						this.objReq.banner_img = "";
						this.isDel = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击提交或修改
			submit(){
				if(this.objReq.banner_name == ""){
					this.$message.warning('请输入名称');
				}else if(new Date(this.objReq.start_datetime).getTime() > new Date(this.objReq.end_datetime).getTime()){
					this.$message.warning('开始时间不能大于结束时间');
				}else if(this.objReq.banner_img == ""){
					this.$message.warning('请上传广告图片');
				}else{
					if(this.dialogType == 1){
						resource.addBanner(this.objReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList()
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						this.objReq.banner_id = this.id;
						resource.updateBanner(this.objReq).then(res => {
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
					
				}
			},
			//点击删除
			deletes(id){
				this.$confirm('确认删除该公告?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.deleteBanner({banner_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList()
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
			},
			//设置状态
			setting(row){
				this.$confirm(`确认${row.status == 0?'上线':'下线'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						banner_id:row.banner_id,
						status:row.status == 0?1:0
					}
					resource.setBannerStatus(obj).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList()
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
			
		},
		components:{
			uploadFile
		}


	}
</script>








