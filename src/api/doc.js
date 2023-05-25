import net from '@/utils/net'

export function fetchDoc(query) {
  return net({
    url: '/upload/list',
    method: 'get',
    params: query
  })
}

export function uploadPDFFile(data) {
  return net({
    url: '/upload',
    method: 'post',
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export function delPDFFile(data) {
  return net({
    url: '/delpdf/' + data.id,
    method: 'put',
  })
}



