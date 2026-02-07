import { describe, it, expect } from "vitest"
import { WorkerTask } from "./index"

class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null
  onerror: ((e: ErrorEvent) => void) | null = null

  constructor(_: string) {}

  postMessage(data: any) {
    // 즉시 "worker 내부 실행" 흉내
    setTimeout(() => {
      try {
        const result = mockWorkerCallback(data)
        this.onmessage?.({ data: result } as MessageEvent)
      } catch (err: any) {
        this.onmessage?.({
          data: { __error: err.message },
        } as MessageEvent)
      }
    })
  }

  terminate() {}
}

// 🔑 테스트마다 바꿔치기 할 콜백
let mockWorkerCallback: (data: any) => any = () => {}

window.Worker = MockWorker as any

window.URL.createObjectURL = vi.fn()
window.URL.revokeObjectURL = vi.fn()

export function setMockWorkerCallback(fn: (data: any) => any) {
  mockWorkerCallback = fn
}

describe("WorkerTask", () => {
  it("callback 결과를 resolve 한다", async () => {
    setMockWorkerCallback((data) => {
      return data.a + data.b
    })

    const { PostMessage } = WorkerTask((data) => data.a + data.b)

    const result = await PostMessage({ a: 1, b: 2 })

    expect(result).toBe(3)
  })

  it("에러 발생 시 reject 한다", async () => {
    setMockWorkerCallback(() => {
      throw new Error("boom")
    })

    const { PostMessage } = WorkerTask(() => {
      throw new Error("boom")
    })

    await expect(PostMessage(1)).rejects.toBe("boom")
  })

  it("여러 인자를 배열로 전달한다", async () => {
    setMockWorkerCallback((data) => data[0] + data[1])

    const { PostMessage } = WorkerTask((data) => data[0] + data[1])

    const result = await PostMessage(2, 3)

    expect(result).toBe(5)
  })
})