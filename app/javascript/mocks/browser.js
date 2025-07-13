import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// handlers.jsで定義したAPIの定義を読み込んで、MSWをセットアップ
export const worker = setupWorker(...handlers)
