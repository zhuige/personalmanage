<template>
  <div class="container">
      <div style="display:flex">
    <el-button v-waves type="primary" size="medium" icon="el-icon-plus" @click="onAdd">新增备忘录</el-button>
    <div style="margin-left:10px;width:270px">
        <el-input placeholder="请输入标题" v-model="keyWord" @keydown.native.enter="getList"/>
      </div>
      <el-button
      @click="getList"
        v-waves
        type="primary"
        size="medium"
        icon="el-icon-search"
        style="margin-left:10px"
        
        >搜索</el-button>
         <el-select v-model="state" placeholder="请选择支付类型" style=" margin-left:10px" @change="getList" clearable>
        <el-option
          label='重要'
          value="1"
        />
        <el-option
          label='一般'
          value="2"
        />
        <el-option
          label='次要'
          value="3"
        />
      </el-select>
    </div>

    <div class="table-wrapper">
    <el-table :data="list" v-loading="loading">
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="时间"> 
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
      <el-table-column label="优先级"> 
        <template slot-scope="scope">
          <template v-if="scope.row.state ==='重要'">
          <el-tag type="danger">{{scope.row.state}}（高）</el-tag>
          </template>
           <template v-if="scope.row.state ==='一般'">
          <el-tag type="warning">{{scope.row.state}}（中）</el-tag>
          </template>
           <template v-if="scope.row.state ==='次要'">
          <el-tag type="info">{{scope.row.state}}（低）</el-tag>
          </template>
        </template>
      </el-table-column>
      <!-- show-overflow-tooltip  -->
       <el-table-column label="备注" > 
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px"> 
        <template slot-scope="scope">
           <el-button v-waves size="mini" type="info" @click="onEdit(scope.row)">编辑</el-button>
          <el-button v-waves size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-dialog ref="addDialog"/>
  </div>
</template>

<script>
import http from "@/utils/request";
import addDialog from './components/addDialog';
export default {
  name: "Dashboard",
  data() {
    return {
      list: [],
      loading:false,
      keyWord:'',
      state:''
    };
  },
  components:{
    addDialog
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      http({
        url: "remeber/list",
        params:{
            keyWord:this.keyWord,
            state:this.state
        }
      }).then(res => {
        this.list = res.data.data;
        let arr = ['重要','一般','次要'];
        this.list.map(item=>{
          item.state = arr[item.state-1];
        })
      }).finally(()=>{
        this.loading= false;
      });
    },
    onAdd() {
      this.$refs.addDialog.init('add');
    },
    onEdit(item) {
       this.$refs.addDialog.init('edit',item);
    },
    onDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        http({
          url: "remeber/delete",
          method: "delete",
          data:{
            id
          }
        }).then(res => {
            this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 1500
          });
        });
      }).catch(()=>{
       
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper{
  margin-top: 20px;
}
</style>
