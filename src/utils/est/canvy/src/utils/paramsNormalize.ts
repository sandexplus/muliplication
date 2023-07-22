export const paramsNormalize = (params?: object | object[]) => {
  return Array.isArray(params) ? params : [params]
}
