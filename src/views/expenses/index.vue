<template>
  <div class="container">
    <el-button v-waves type="primary" icon="el-icon-plus" size="medium" @click="onAdd"
      >记一笔</el-button
    >
    <div class="table-wrapper">
      <el-table :data="list" v-loading="loading">
        <el-table-column label="标题" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
              <el-tag type="success" v-if=" scope.row.state==='收入'"> {{ scope.row.state }}</el-tag>
                <el-tag type="danger" v-else> {{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope"> ¥ {{ scope.row.money }} </template>
        </el-table-column>
        <!-- show-overflow-tooltip  -->
        <el-table-column label="备注" show-overflow-tooltip >
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button  v-waves size="mini" type="info" @click="onEdit(scope.row)"
              >编辑</el-button
            >
            <el-button v-waves  size="mini" type="danger" @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-dialog ref="addDialog" />
  </div>
</template>

<script>
import http from "@/utils/request";
import addDialog from "./components/addDialog";
export default {
  name: "Dashboard",
  data() {
    return {
      list: [],
      loading: false
    };
  },
  components: {
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
      })
        .then(res => {
          this.list = res.data.data;
          this.list.map(item => {
            item.state = item.state === "1" ? "收入" : "支出";
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onAdd() {
      this.$refs.addDialog.init("add");
    },
    onEdit(item) {
      this.$refs.addDialog.init("edit", item);
    },
    onDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        http({
          url: "expenses/delete",
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
       
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  margin-top: 20px;
}

</style>
<style lang="scss">
.el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
}
</style>