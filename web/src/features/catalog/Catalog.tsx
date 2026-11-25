import { useEffect, useState } from 'react'
import { listComics, type ComicSummary } from '../../api/comics'
import styles from './Catalog.module.css'

type CatalogState =
  | { status: 'loading' }
  | { status: 'success'; comics: ComicSummary[] }
  | { status: 'error' }

export default function Catalog() {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    listComics(signal).then(
      comics => {
        if (!signal.aborted) setState({ status: 'success', comics })
      },
      () => {
        if (!signal.aborted) setState({ status: 'error' })
      },
    )
    return () => controller.abort()
  }, [])

  return (
    <section className={styles.catalog} aria-labelledby="catalog-heading">
      <h2 id="catalog-heading" className={styles.heading}>漫画目录</h2>
      {state.status === 'loading' && (
        <p className={styles.message} role="status">正在加载漫画目录…</p>
      )}
      {state.status === 'error' && (
        <p className={styles.message} role="alert">无法加载漫画目录，请稍后刷新重试。</p>
      )}
      {state.status === 'success' && (state.comics.length === 0 ? (
        <p className={styles.message} role="status">暂无漫画。</p>
      ) : (
        <ul className={styles.list}>
          {state.comics.map(comic => <li key={comic.id}>{comic.title}</li>)}
        </ul>
      ))}
    </section>
  )
}
