<template>
  <div class="container">
    <el-button v-waves type="primary" size="medium" @click="onAdd">记一笔</el-button>
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
      <el-table-column label="类型"> 
        <template slot-scope="scope">
          {{scope.row.state}}
        </template>
      </el-table-column>
      <el-table-column label="金额"> 
        <template slot-scope="scope">
          ¥ {{scope.row.money}}
        </template>
      </el-table-column>
      <!-- show-overflow-tooltip  -->
       <el-table-column label="备注" > 
        <template slot-scope="scope">
          {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column label="操作"> 
        <template slot-scope="scope">
           <el-button size="mini" type="info" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
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
      loading:false
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
        url: "expenses/list"
      }).then(res => {
        this.list = res.data.data;
        this.list.map(item => {
          item.state = item.state === '1' ? "收入" : "支出";
        });
      }).finally(()=>{
        this.loading= false;
      });
    },
    onAdd() {
      this.$refs.addDialog.init('add');
    },
    onEdit(item) {
       this.$refs.addDialog.init('edit',item);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper{
  margin-top: 20px;
}
</style>
