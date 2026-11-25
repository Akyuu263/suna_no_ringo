import { act, cleanup, render, screen, within } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Catalog from './Catalog'

const fetchComics = vi.fn<typeof fetch>()

function deferredResponse() {
  let resolve!: (response: Response) => void
  let reject!: (error: Error) => void
  const promise = new Promise<Response>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  return { promise, resolve, reject }
}

beforeEach(() => {
  fetchComics.mockReset()
  vi.stubGlobal('fetch', fetchComics)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('请求期间显示加载提示，卸载时取消请求', () => {
  fetchComics.mockImplementation(() => new Promise(() => {}))
  const { unmount } = render(<Catalog />)
  expect(screen.getByRole('status').textContent).toBe('正在加载漫画目录…')
  expect(fetchComics).toHaveBeenCalledWith('/api/v1/comics', { signal: expect.any(AbortSignal) })
  const signal = fetchComics.mock.calls[0][1]?.signal
  expect(signal?.aborted).toBe(false)
  unmount()
  expect(signal?.aborted).toBe(true)
})

it.each(['成功', '失败'] as const)('StrictMode 下旧请求迟到%s时保留新目录', async outcome => {
  const previous = deferredResponse()
  const current = deferredResponse()
  // 故意忽略取消信号，让旧请求在清理后仍能返回结果。
  fetchComics.mockReturnValueOnce(previous.promise).mockReturnValueOnce(current.promise)
  render(<StrictMode><Catalog /></StrictMode>)

  expect(fetchComics).toHaveBeenCalledTimes(2)
  expect(fetchComics.mock.calls[0][1]?.signal?.aborted).toBe(true)
  expect(fetchComics.mock.calls[1][1]?.signal?.aborted).toBe(false)

  await act(async () => {
    current.resolve(Response.json({ items: [{ id: 'new', title: '山间来信' }] }))
  })
  expect(screen.getByRole('listitem').textContent).toBe('山间来信')

  await act(async () => {
    if (outcome === '成功') {
      previous.resolve(Response.json({ items: [{ id: 'old', title: '雨天书店' }] }))
    } else {
      previous.reject(new TypeError('Failed to fetch'))
    }
  })
  expect(screen.queryByRole('alert')).toBeNull()
  expect(screen.getByRole('listitem').textContent).toBe('山间来信')
})

it('按接口返回顺序显示漫画标题', async () => {
  fetchComics.mockResolvedValue(Response.json({ items: [
    { id: 'b', title: '雨天书店' },
    { id: 'a', title: '山间来信' },
  ] }))
  render(<Catalog />)
  const list = await screen.findByRole('list')
  expect(within(list).getAllByRole('listitem').map(item => item.textContent))
    .toEqual(['雨天书店', '山间来信'])
  expect(screen.queryByRole('status')).toBeNull()
})

it('目录为空时显示空状态', async () => {
  fetchComics.mockResolvedValue(Response.json({ items: [] }))
  render(<Catalog />)
  await screen.findByText('暂无漫画。')
  expect(screen.queryByRole('list')).toBeNull()
})

it('HTTP 非成功响应即使没有 JSON 错误体也显示错误提示', async () => {
  fetchComics.mockResolvedValue(new Response('Bad Gateway', { status: 502 }))
  render(<Catalog />)
  expect((await screen.findByRole('alert')).textContent).toContain('无法加载漫画目录')
})

it('HTTP 非成功响应即使携带目录数据也显示错误提示', async () => {
  fetchComics.mockResolvedValue(Response.json({ items: [] }, { status: 500 }))
  render(<Catalog />)
  await screen.findByRole('alert')
})

it('网络中断时显示错误提示', async () => {
  fetchComics.mockRejectedValue(new TypeError('Failed to fetch'))
  render(<Catalog />)
  await screen.findByRole('alert')
})

it('无法解析响应时显示错误提示', async () => {
  fetchComics.mockResolvedValue(new Response('<html>'))
  render(<Catalog />)
  await screen.findByRole('alert')
})

it.each([
  ['缺少 items', {}],
  ['items 不是数组', { items: null }],
  ['漫画记录为 null', { items: [null] }],
  ['标识为空', { items: [{ id: '', title: '雨天书店' }] }],
  ['标识不是字符串', { items: [{ id: 1, title: '雨天书店' }] }],
  ['标题缺失', { items: [{ id: 'a' }] }],
  ['标题只有空白', { items: [{ id: 'a', title: '  ' }] }],
  ['标识重复', { items: [{ id: 'a', title: '甲' }, { id: 'a', title: '乙' }] }],
])('响应不符合契约时显示错误提示（%s）', async (_, data) => {
  fetchComics.mockResolvedValue(Response.json(data))
  render(<Catalog />)
  await screen.findByRole('alert')
  expect(screen.queryByRole('list')).toBeNull()
})
