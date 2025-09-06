import { lazy } from 'react'
import type { AutoContainer } from '../../../minimal-container/auto-container'
import type { ServicesById } from '../../../types'

export default {
  identifier: 'page1',
  options: {
    provider: (_deps: unknown, ctx: AutoContainer<ServicesById>) => {
      return lazy(async () => {
        const {
          default: Component
        } = await import('../../../components/Page1')

        return {
          default: (props: any) => <Component
            globalContainer={ctx}
            {...props}
          />
        }
      })
    }
  }
} as const