export class IpcResponse<T> {
  data?: T
  error?

  constructor(data: T | undefined = undefined, error = null) {
    if (data) {
      this.data = data
    }
    this.error = error
  }
}
