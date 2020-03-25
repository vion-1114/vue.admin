<template>
  <div id="category">
    <el-button type="danger" @click="addCategory({ type: 'firstAdd' })"
      >添加一级分类</el-button
    >
    <hr class="hr-ee" />
    <el-row :gutter="30">
      <el-col :span="9">
        <div class="category-wrap">
          <div
            class="category"
            v-for="categoryItem in category.item"
            :key="categoryItem.id"
          >
            <h4>
              <svg-icon icon-class="jian"></svg-icon>
              {{ categoryItem.category_name }}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  @click="editFirst({ data: categoryItem, type: 'firstEdit' })"
                  round
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  @click="addChild({ data: categoryItem, type: 'childAdd' })"
                  round
                  >添加</el-button
                >
                <el-button
                  size="mini"
                  round
                  @click="deleteCategory({ type: '1', id: categoryItem.id })"
                  >删除</el-button
                >
              </div>
            </h4>
            <ul v-if="categoryItem.children">
              <li
                v-for="childrenItem in categoryItem.children"
                :key="childrenItem.id"
              >
                {{ childrenItem.category_name }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="
                      editChild({
                        data: { categoryItem, childrenItem },
                        type: 'childEdit'
                      })
                    "
                    round
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    round
                    @click="deleteCategory({ type: '2', id: childrenItem.id })"
                    >删除</el-button
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="15">
        <h4 class="menu-title">{{ subType.content }}</h4>
        <el-form
          label-width="140px"
          :model="form"
          ref="cateforyForm"
          class="form-wrap"
        >
          <el-form-item label="一级分类名称" v-if="firstVisible">
            <el-input
              v-model="form.firstCategoryName"
              :disabled="firstDisabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称" v-if="secondVisible">
            <el-input
              v-model="form.secCategoryName"
              :disabled="secondDisabled"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              @click="submit"
              :loading="subLoad"
              :disabled="disabledBtn"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { reactive, ref, onMounted } from '@vue/composition-api'

import { global } from '@/utils/global3.0'
import {
  AddFirstCategory,
  delCategory,
  updateCategory,
  addChildCategory
} from '@/api/news'
export default {
  name: 'category',
  setup(props, { root, refs }) {
    const { confirm } = global()
    const firstVisible = ref(true)
    const secondVisible = ref(true)
    const subLoad = ref(false)
    const firstDisabled = ref(true)
    const secondDisabled = ref(true)
    const disabledBtn = ref(true)
    const deleteId = ref('')
    const deleteType = ref('')
    const subType = reactive({
      type: '',
      content: '添加一级分类'
    })
    const category = reactive({
      item: []
    })
    const form = reactive({
      firstCategoryName: '',
      secCategoryName: ''
    })

    const submit = () => {
      //需要向后台带token请求头过去
      if (subType.type == 'firstAdd') {
        AddFirst()
      }
      if (subType.type == 'childAdd') {
        AddChildCate()
      }
      if (subType.type == 'firstEdit') {
        EditFirstCategory()
      }
      if (subType.type == 'childEdit') {
        EditChildCategory()
      }
    }
    const AddFirst = () => {
      if (!form.firstCategoryName) {
        root.$message({
          message: '分类名称不能为空',
          type: 'error'
        })
        return false
      }
      subLoad.value = true
      AddFirstCategory({ categoryName: form.firstCategoryName })
        .then(response => {
          let data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          subLoad.value = false
          // refs['cateforyForm'].resetFields()
          form.firstCategoryName = ''
          form.secondCategoryName = ''
          category.item.push(data.data)
        })
        .catch(error => {
          subLoad.value = false
        })
    }

    const AddChildCate = () => {
      if (!form.secCategoryName) {
        root.$message({
          message: '分类名称不能为空',
          type: 'error'
        })
        return false
      }
      subLoad.value = true
      let requestData = reactive({
        categoryName: form.secCategoryName,
        parentId: category.current.id
      })
      addChildCategory(requestData)
        .then(response => {
          let resData = response.data
          root.$message({
            message: resData.message,
            type: 'success'
          })
          subLoad.value = false
          form.secCategoryName = ''
          getCategory()
        })
        .catch(error => {})
    }

    const addChild = item => {
      firstVisible.value = true
      firstDisabled.value = true
      secondDisabled.value = false
      secondVisible.value = true
      disabledBtn.value = false
      form.firstCategoryName = item.data.category_name
      subType.type = item.type
      category.current = item.data
      subType.content = '添加二级分类'
    }
    const addCategory = params => {
      form.firstCategoryName = ''
      subType.type = params.type
      subType.content = '添加一级分类'
      firstVisible.value = true
      secondVisible.value = false
      firstDisabled.value = false
      secondDisabled.value = false
      disabledBtn.value = false
    }
    const getCategory = () => {
      root.$store.dispatch('common/GetCategoryAll').then(response => {
        category.item = response
      })
    }
    // 删除
    const deleteCategory = params => {
      deleteId.value = params.id
      deleteType.value = params.type
      let content = ref('')
      if (params.type == '1') {
        content = '确定删除一级分类吗?'
      } else {
        content = '确定删除二级分类吗?'
      }
      confirm({
        content: content,
        type: 'warning',
        fn: confirmDel, //传成功删除的函数给子函数
        catchFn: () => {
          deleteId.value = ''
        }
      })
    }

    const confirmDel = () => {
      delCategory({ categoryId: deleteId.value })
        .then(response => {
          let data = response.data
          //findIndex 找到 指定数据的下标
          console.log(category.item)
          if (deleteType.value == '1') {
            let index = category.item.findIndex(
              item => item.id == deleteId.value
            )
            category.item.splice(index, 1)
          } else {
            getCategory()
          }

          //删除

          //另一种方法 filter 过滤 item => item.id ！= deleteId.value 生成新的数组 不合适
          root.$message({
            message: data.message,
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    }

    //修改
    const editFirst = params => {
      subType.type = params.type
      subType.content = '修改一级分类名称'
      secondVisible.value = false
      firstDisabled.value = false
      disabledBtn.value = false
      form.firstCategoryName = params.data.category_name
      category.current = params.data
    }
    const editChild = params => {
      subType.type = params.type
      subType.content = '修改二级分类名称'
      secondVisible.value = true
      secondDisabled.value = false
      firstDisabled.value = true
      disabledBtn.value = false
      form.firstCategoryName = params.data.categoryItem.category_name
      form.secCategoryName = params.data.childrenItem.category_name
      category.current = params.data.childrenItem
    }
    const EditFirstCategory = () => {
      //携带修改的数据
      if (form.firstCategoryName) {
        let requestData = reactive({
          id: category.current.id,
          categoryName: form.firstCategoryName
        })
        updateCategory(requestData)
          .then(response => {
            console.log(response)
            let responseData = response.data
            //更新当前所修改分类名 深拷贝 category.current指向category.item中当前所选择的数据，修改后会影响原数据
            category.current.category_name = responseData.data.data.categoryName
            root.$message({
              message: '修改成功',
              type: 'success'
            })
          })
          .catch(error => {})
      } else {
        root.$message({
          message: '分类名称不能为空',
          type: 'error'
        })
      }
    }
    const EditChildCategory = () => {
      if (form.secCategoryName) {
        let requestData = reactive({
          id: category.current.id,
          categoryName: form.secCategoryName
        })
        updateCategory(requestData)
          .then(response => {
            console.log(response)
            let responseData = response.data
            //更新当前所修改分类名 深拷贝 category.current指向category.item中当前所选择的数据，修改后会影响原数据
            category.current.category_name = responseData.data.data.categoryName
            root.$message({
              message: '修改成功',
              type: 'success'
            })
          })
          .catch(error => {})
      } else {
        root.$message({
          message: '分类名称不能为空',
          type: 'error'
        })
      }
    }

    //dom元素挂载完成以后的事件
    onMounted(() => {
      getCategory()
    })

    return {
      form,
      submit,
      firstVisible,
      secondVisible,
      subLoad,
      addCategory,
      category,
      firstDisabled,
      secondDisabled,
      disabledBtn,
      deleteCategory,
      confirmDel,
      deleteId,
      AddFirst,
      editFirst,
      subType,
      addChild,
      editChild
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/config.scss';

.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: '';
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 15px;
    top: 15px;
    font-size: 15px;
    background-color: white;
  }
  li {
    position: relative;
    padding-left: 40px;
    margin-left: 24px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  z-index: 1;
  position: absolute;
  right: 11px;
  top: 0;
  button {
    font-size: 12px;
  }
}
.menu-title {
  background: #f3f3f3;
  line-height: 44px;
  padding-left: 22px;
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-ee {
  width: calc(100% + 60px); //计算cals的计算符号左右需要空格
  margin-left: -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
