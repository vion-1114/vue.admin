<template>
  <el-dialog
    title="新增"
    :visible.sync="dialogFormVisible"
    @close="close"
    @opened="openDialog"
  >
    <el-form :model="form">
      <el-form-item label="类型：" :label-width="formLabelWidth">
        <el-select v-model="form.category" placeholder="请选择">
          <el-option
            v-for="item in categoryItem.items"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.content"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="danger" @click="submitNew" @load="loadingState"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { ref, reactive, watch } from '@vue/composition-api'
import { addCategory } from '@/api/news'
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
    }
  },
  setup(props, { emit, root }) {
    const dialogFormVisible = ref(false)
    const loadingState = ref(false)

    // 接收父组件
    /**
     * 遇到的错误，父组件传值flag，子组件无法直接修改该值，需要定义dialogFormVisible变量来监听
     */

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
    }

    //添加新闻
    const submitNew = () => {
      if (validate()) {
        loadingState.value = true
        addCategory(form)
          .then(response => {
            let data = response.data
            root.$message({
              message: data.message,
              type: 'success'
            })
            loadingState.value = false
            form.category = ''
            form.title = ''
            form.content = ''
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

    return {
      form,
      dialogFormVisible,
      formLabelWidth,
      close,
      openDialog,
      categoryItem,
      loadingState,
      validate,
      submitNew
    }
  }
}
</script>
<style></style>
