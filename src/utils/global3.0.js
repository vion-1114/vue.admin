import { MessageBox } from 'element-ui';
import { ref } from '@vue/composition-api'
export function global() {
    const str = ref('');
    const confirm = (data) => {
        MessageBox
            .confirm(data.content, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: data.type
            })
            .then(() => {
                data.fn && data.fn() //如果fn有值 跑fn()函数
            })
            .catch(() => {
                data.catchFn && data.catchFn();
            })
    }
    return {
        confirm,
        str
    }
}