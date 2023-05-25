import request from '@/utils/request'
import net from '@/utils/net'


export function login(data) {
  const newData = { phone: data.username, pwd: data.password }
  return net({
    url: '/sign_in',
    method: 'post',
    data: newData
  })
}


export function getInfo() {
  return net({
    url: '/profile',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
