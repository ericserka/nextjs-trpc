export const encode = (data: string) =>
  Buffer.from(data, 'utf-8').toString('base64')

export const decode = (data: string) =>
  Buffer.from(data, 'base64').toString('utf-8')
