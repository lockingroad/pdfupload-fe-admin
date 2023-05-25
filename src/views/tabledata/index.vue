<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="报告"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="150px" align="center">
        <template slot-scope="{ row }">
          <span class="link-type" >{{
            row.pdf_number
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.pdf_name }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="上传文件名" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.pdf_origin_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getPDFList"
    />

    <el-dialog title="报告提交" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="submitModel"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="编号" prop="numbler">
          <el-input v-model="submitModel.numbler" />
        </el-form-item>

        <el-form-item label="附件：" prop="file">
          <el-upload
            class="upload-demo"
            ref="upload"
            multiple
            action="111"
            :on-change="fileChange"
            :on-remove="removeFile"
            :file-list="pdfFileList"
            :limit="1"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="saveFile()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDoc } from "@/api/doc";
import { uploadPDFFile } from "@/api/doc";
import { delPDFFile } from "@/api/doc";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "综合类" },
  { key: "US", display_name: "财经类" },
  { key: "JP", display_name: "师范类" },
  { key: "EU", display_name: "理工类" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "TableData",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        importance: undefined,
        name: undefined,
        type: undefined,
        sort: "+id",
      
      },
      pdfFileList: [],

      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      submitModel: {
        numbler: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      pvData: [],
      rules: {
        numbler: [
          { required: true, message: "编号是必填", trigger: "change" },
        ]
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getPDFList();
  },
  methods: {
    fileChange(file, fileList) {
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name); //如果文件名重复
      if (existFile) {
        this.$message.error("当前文件已经存在!");
        fileList.pop();
      }
      this.pdfFileList = fileList;
    },
    removeFile(file, fileList) {
      this.pdfFileList = fileList; //此处fileList为删除文件后，剩余的文件
    },


    saveFile() {
      let param = new FormData(); //创建form对象
      if(this.pdfFileList.length == 1) {
         param.append("file", this.pdfFileList[0].raw)
      }
      param.append("number", this.submitModel.numbler)
      // 此时所有的钩子已经执行完了fileData 中存的是通过校验的数据
      // 此时再调用接口上传该数据
      uploadPDFFile(param)
        .then(() => {
          this.dialogFormVisible = false;
          this.pdfFileList = []; //清空
          this.getPDFList();
        })
        .catch(() => {
          this.dialogFormVisible = false;
          this.pdfFileList = []; //清空
        });
    },

    getPDFList() {
      this.listLoading = true;
      fetchDoc(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.pagination.totalElements;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    // getList() {
    //   this.listLoading = true;
    //   fetchList(this.listQuery).then((response) => {
    //     console.log("netManager res:" + JSON.stringify(response.data));
    //     // this.list = response.data.items;
    //     this.total = response.data.total;

    //     // Just to simulate the time of the request
    //     setTimeout(() => {
    //       this.listLoading = false;
    //     }, 1.5 * 1000);
    //   });
    // },
    handleFilter() {
      this.listQuery.page = 1;
      this.getPDFList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    resetTemp() {
      this.submitModel = {
        numbler: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      var name = row.pdf_name;
      window.location.href =  process.env.VUE_APP_SERVER_COS_HOST + name;
    },
    handleDelete(row, index) {
      delPDFFile(row).then((response) => {
        console.log(response)
      })
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
  },
};
</script>
