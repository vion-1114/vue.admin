<template>
  <el-dialog
    title="修改"
    :visible.sync="dialogFormVisible"
    @close="close"
    @open="openDialog"
  >
    <el-form :model="form" ref="ruleForm">
      <el-form-item
        label="类型："
        :label-width="formLabelWidth"
        prop="category"
      >
        <el-select v-model="form.category" placeholder="请选择">
          <el-option
            v-for="item in categoryItem.items"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
        <el-input
          type="textarea"
          v-model="form.content"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="danger" @click="submitNew" @load="loadingState"
        >修改</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { ref, reactive, watch, onMounted } from '@vue/composition-api'
import { editNewInfo, getinfoList } from '@/api/news'
export default {
  name: 'dialogInfo',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    categoryType: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit, root, refs }) {
    const dialogFormVisible = ref(false)
    const loadingState = ref(false)

    const form = reactive({
      category: '',
      title: '',
      content: ''
    })
    const categoryItem = reactive({
      items: []
    })
    const formLabelWidth = ref('70px')

    const close = () => {
      dialogFormVisible.value = false
      emit('update:flag', false) //修改父组件的visible值
    }
    //获取父组件的category 减少api请求
    const openDialog = () => {
      categoryItem.items = props.categoryType
      showNewInfo()
    }

    //修改新闻
    const submitNew = () => {
      if (validate()) {
        loadingState.value = true

        let requestData = reactive({
          id: props.id,
          categoryId: form.category,
          title: form.title,
          content: form.content
        })
        editNewInfo(requestData)
          .then(response => {
            let data = response.data
            root.$message({
              message: data.message,
              type: 'success'
            })
            loadingState.value = false
            refs.ruleForm.resetFields()
            // emit('getList') //暴力型

            // 可以尝试根据id去修改 index中的值
            emit('myEditTest', {
              resData: requestData
            })
            close()
          })
          .catch(error => {
            loadingState.value = false
          })
      }
    }
    //验证输入框
    const validate = () => {
      if (!form.category) {
        root.$message({
          message: '请选中分类',
          type: 'error'
        })
        return false
      }
      if (!form.title) {
        root.$message({
          message: '请输入标题',
          type: 'error'
        })
        return false
      }
      if (!form.content) {
        root.$message({
          message: '请输入概况',
          type: 'error'
        })
        return false
      }
      return true
    }

    watch(() => {
      //监听父组件传过来的flag值
      dialogFormVisible.value = props.flag
    })

    const showNewInfo = () => {
      let requestData = reactive({
        id: props.id,
        pageNumber: 1,
        pageSize: 1
      })
      //获取数据

      getinfoList(requestData)
        .then(response => {
          let resData = response.data.data.data[0]
          form.category = resData.categoryId
          form.title = resData.title
          form.content = resData.content
        })
        .catch(error => {
          data.loadingData = false
        })
    }

    return {
      form,
      dialogFormVisible,
      formLabelWidth,
      close,
      openDialog,
      categoryItem,
      loadingState,
      validate,
      submitNew,
      showNewInfo
    }
  }
}
</script>
<style></style>
