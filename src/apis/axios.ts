import axios, { type AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL:"http://121.43.236.83:8080",
  timeout: 10000,
})

const request = <ResponseType = unknown>(
  url: string,
  options?: AxiosRequestConfig<unknown>,
): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      ...options,
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => reject(err))
  })
}
export { axiosInstance, request }
