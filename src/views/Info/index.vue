<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="warp-content">
            <el-select
              v-model="data.cateValue"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in data.categorys"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-date-picker
              v-model="data.date"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%;"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="label-wrap key">
          <label for="">关键字：</label>
          <div class="warp-content">
            <el-select v-model="data.searchKey" style="width:100%;">
              <el-option
                v-for="item in searchOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="data.searchKeyWord"
          placeholder="请输入内容"
          style="width:100%;"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          @click="search"
          style="width:100%;padding: 12px 0;"
          >搜索</el-button
        >
      </el-col>

      <el-col :span="2">
        <el-button
          type="danger"
          style="width:100%; padding: 12px 0;"
          @click="data.dialogInfo = true"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <!--带框表格-->
    <el-table
      :data="data.tableData"
      border
      v-loading="data.loadingData"
      @selection-change="handleSelectionChange"
      style="width: 100%;margin:20px 0 30px 0;"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="480"> </el-table-column>
      <el-table-column
        prop="categoryId"
        label="类别"
        :formatter="showType"
        width="120"
      >
      </el-table-column>

      <el-table-column
        prop="createDate"
        label="日期"
        :formatter="showDate"
        width="160"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteForm(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="editNewInfo(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页-->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12"
        ><el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total,sizes,prev, pager, next"
          :total="data.total"
          class="pull-right"
        >
        </el-pagination
      ></el-col>
    </el-row>
    <!--修改弹窗-->

    <DialogInfo :flag.sync="data.dialogInfo" :categoryType="data.categorys" />

    <DialogEditInfo
      :flag.sync="data.dialogEditInfo"
      :id="data.newId"
      :categoryType="data.categorys"
      @myEditTest="myEditTest"
    />
  </div>
</template>
<script>
import { getinfoList, delInfo } from '@/api/news'
import DialogInfo from './dialog/info'
import DialogEditInfo from './dialog/edit'
import { global } from '@/utils/global3.0'
import { toDate } from '@/utils/common'
import { ref, reactive, computed, watch, onMounted } from '@vue/composition-api'
export default {
  name: 'info',
  components: { DialogInfo, DialogEditInfo },
  setup(props, { root }) {
    const { confirm } = global()

    const data = reactive({
      total: 0,
      searchKey: 'id',
      newId: '',
      searchKeyWord: '',
      date: '',
      cateValue: '',
      dialogInfo: false, //默认提示框状态
      dialogEditInfo: false,
      tableData: [],
      categorys: [],
      pages: {
        size: 10,
        current: 1
      },
      loadingData: false,
      deleteId: ''
    })

    const searchOption = reactive([
      { value: 'id', label: 'ID' },
      { value: 'title', label: '标题' }
    ])
    data.loadingData = true
    //页码
    const handleSizeChange = val => {
      data.pages.size = val
      getList()
    }
    const handleCurrentChange = val => {
      data.pages.current = val
      getList()
    }
    //获取分类
    const getCategory = () => {
      //两种方式 1：vue3.0 until文件夹 需要监听返回值
      // 2：vuex store文件夹
      root.$store.dispatch('common/GetCategory').then(response => {
        data.categorys = response
      })
    }
    //转换时间
    const showDate = row => {
      let date = toDate(row.createDate)
      return date
    }
    //转换类别
    const showType = row => {
      let catId = row.categoryId
      let type = data.categorys.filter(item => item.id == catId)[0]
      //每行数据拿去categorys中匹配得到的都是一个数组 所以取第一个

      return type.category_name
    }
    const deleteForm = id => {
      data.deleteId = [id]
      confirm({
        content: '确定删除吗?',
        type: 'warning',
        fn: confirmDelete //传成功删除的函数给子函数
      })
    }
    const deleteAll = () => {
      if (!data.deleteId || data.deleteId.length == 0) {
        root.$message({
          message: '请选择要删除的数据',
          type: 'error'
        })
        return false
      }
      confirm({
        content: '删除全部吗?',
        type: 'error',
        fn: confirmDelete //传成功删除的函数给子函数
      })
    }
    const confirmDelete = () => {
      //删除成功
      delInfo({ id: data.deleteId })
        .then(response => {
          let data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          getList()
        })
        .catch(error => {
          console.log(error)
        })
    }

    const handleSelectionChange = val => {
      //多选
      let id = val.map(item => item.id)
      data.deleteId = id
    }

    //搜索
    const search = () => {
      getList()
    }

    const formarData = () => {
      let requestData = {
        categoryId: '',
        startTiem: '',
        endTime: '',
        title: '',
        id: '',
        pageNumber: data.pages.current,
        pageSize: data.pages.size
      }

      if (data.cateValue) {
        requestData.categoryId = data.cateValue
      }
      if (data.date.length > 0) {
        requestData.startTiem = data.date[0]
        requestData.endTime = data.date[1]
      }
      if (data.searchKeyWord) {
        requestData[data.searchKey] = data.searchKeyWord
      }
      return requestData
    }

    //获取数据库新闻
    const getList = () => {
      let requestData = formarData()
      //获取数据

      getinfoList(requestData)
        .then(response => {
          let resData = response.data.data
          data.tableData = resData.data
          data.total = resData.total
          data.loadingData = false
        })
        .catch(error => {
          data.loadingData = false
        })
    }
    const closeDialog = () => {
      data.dialogInfo = false
    }

    //编辑
    const editNewInfo = id => {
      data.dialogEditInfo = true
      data.newId = id
      // console.log(id)
    }
    const myEditTest = tabData => {
      //手动修改数据
      let resData = tabData.resData
      let upData = data.tableData.filter(item => item.id == data.newId)[0]
      upData.title = resData.title
      upData.categoryId = resData.categoryId
      upData.content = resData.content
    }

    onMounted(() => {
      getCategory()
      getList()
    })
    return {
      data,
      searchOption,
      deleteForm,
      deleteAll,
      getList,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      showDate,
      showType,
      search,
      formarData,
      editNewInfo,
      myEditTest
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/config';
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(center, 50, 40);
  }
  &.key {
    @include labelDom(center, 69, 40);
  }
}
</style>
