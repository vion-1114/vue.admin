<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单 start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="passwords"
          class="item-form"
          v-if="model == 'register'"
        >
          <label for="pass1">重复密码</label>
          <el-input
            id="pass1"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>

          <el-row :gutter="10">
            <!-- 24分栏布局 span为权重 -->
            <el-col :span="15">
              <el-input
                id="code"
                v-model.number="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButton.status"
                >{{ codeButton.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            :disabled="SubbtnStatu"
            >{{ model === 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/**
 * 引入方式有无花括号的区别
 * 如果没有default就需要花括号 -- default只存在一个
 */
import { GetSms, Register, Login } from '@/api/login'
import { reactive, isRef, ref, toRefs, onMounted } from '@vue/composition-api'
import {
  stripscript,
  validateEmail,
  validatePassword,
  validateCheckcode
} from '@/utils/validate'

export default {
  name: 'login',
  setup(props, { refs, root }) {
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (validateEmail(value)) {
        callback(new Error('用户名格式有误'))
      } else {
        callback() //true
      }
    }

    let validatePass = (rule, value, callback) => {
      //过滤后的数据
      ruleForm.password = stripscript(value)
      value = ruleForm.password
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (validatePassword(value)) {
        callback(new Error('密码为6至20位的数字+字母!'))
      } else {
        callback()
      }
    }
    let validatePass1 = (rule, value, callback) => {
      //过滤后的数据
      ruleForm.password = stripscript(value)
      value = ruleForm.password
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value != ruleForm.password) {
        callback(new Error('重复密码不正确'))
      } else {
        callback()
      }
    }
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (validateCheckcode(value)) {
        return callback(new Error('验证码格式有误'))
      } else {
        callback()
      }
    }

    /**这里放data数据、生命周期、自定义的函数
     *
     * reactive 对象类型*/
    /***
     * 声明函数  *******************************************
     *
     **/
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' }
    ])
    const ruleForm = reactive({
      username: '1114303039@qq.com',
      password: 'lt1234',
      passwords: '',
      code: ''
    })
    const codeButton = reactive({
      status: false,
      text: '获取验证码'
    })

    /**
     * 保单验证
     */
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: 'blur' }],
      password: [{ validator: validatePass, trigger: 'blur' }],
      passwords: [{ validator: validatePass1, trigger: 'blur' }],
      code: [{ validator: checkCode, trigger: 'blur' }]
    })
    //模块值 基础类型
    const model = ref('login')
    const timer = ref('')

    const toggleMenu = data => {
      menuTab.forEach((elem, index) => {
        elem.current = false
      })
      data.current = true
      model.value = data.type
      refs['ruleForm'].resetFields()
    }
    /**
     * 按钮状态
     */
    const SubbtnStatu = ref(true)
    /**
     * 获取验证码
     */
    const getSms = () => {
      if (ruleForm.username == '') {
        root.$message.error('邮箱不能为空')
        return false
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error('邮箱格式错误')
        return false
      }
      let loginData = {
        username: ruleForm.username,
        module: model.value
      }

      // 修改获取验证按钮状态
      codeButton.status = true
      codeButton.text = '发送中'

      setTimeout(() => {
        GetSms(loginData)
          .then(response => {
            let data = response.data
            root.$message({
              message: data.message,
              type: 'success'
            })
            //启用注册按钮
            SubbtnStatu.value = false
            //调用定时器
            timerDown(5)
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
    }
    /**
     * 倒计时
     */
    const timerDown = number => {
      let time = number
      if (timer.value) {
        clearInterval(timer.value)
      }
      timer.value = setInterval(() => {
        // timer.value此处的疑问？
        time--
        if (time == 0) {
          clearInterval(timer.value)
          codeButton.status = false
          codeButton.text = '重新发送'
        } else {
          codeButton.text = `倒计时${time}秒`
        }
      }, 1000)
    }
    /**
     * 清除倒计时
     */
    const clearTimeDown = () => {
      clearInterval(timer.value)
      codeButton.status = false
      codeButton.text = '获取验证码'
    }

    /**
     * 提交表单
     */
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          model.value === 'login' ? login() : register()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    /**
     * 登录
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code
      }
      root.$store
        .dispatch('login/login', requestData)
        .then(response => {
          console.log(response)
          console.log('登陆成功')
          root.$router.push({ name: 'Backstage' }) //路由跳转
        })
        .catch(error => {
          console.log(error)
        })
      // Login(requestData)
      //   .then(response => {
      //     console.log(response)
      //     let data = response.data
      //     root.$message({
      //       message: data.message,
      //       type: 'success'
      //     })
      //     root.$router.push({ name: 'Backstage' }) //路由跳转
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    }
    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
        module: 'register'
      }
      Register(requestData)
        .then(response => {
          let data = response.data
          //提示框
          root.$message({
            message: data.message,
            type: 'success'
          })
          toggleMenu(menuTab[0])
          clearTimeDown()
        })
        .catch(error => {
          console.log(error)
        })
    }

    onMounted(() => {
      // console.log(process.env.VUE_APP_ABC)
    })

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms,
      SubbtnStatu,
      codeButton
    }
  }
}
</script>
// scoped 是否全局有效
<style lang="scss" scoped>
#login {
  height: 100vh; //vh基于可视区的100
  background: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
// var myAjax=function(url){ // Return new Promise(function(resolve,reject){ //
var xhr=new XMLHttpRequest(); // xhr.open("get",url); // xhr.send(data); //
xhr.onreadystatechange=function(){ // if(xhr.status==200 && xhr.readyState==4){
// var json=JSON.parse(xhr.responseText); // resolve(json) // }else
if(xhr.readyState==4 && xhr.status!=200){ // reject('error'); // } // } // }) //
}
