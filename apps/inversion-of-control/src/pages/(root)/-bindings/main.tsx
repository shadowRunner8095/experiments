import { AutoContainer, createAutoResolver } from '../../../minimal-container/auto-container'
import type { ServicesById } from '../../../types'
import App from '../../../App'

const config: {
  identifier: keyof ServicesById,
  options: Parameters<AutoContainer<ServicesById>['bind']>[1]
} = {
  identifier: 'main',
  options: {
      resolveDependencies: createAutoResolver([
        {
          identifier: 'mainChildren'
        },
      ]),
      provider: (resolvedDependencies) => {
        return <App>
          {resolvedDependencies.mainChildren}
        </App>
      },
    },
}

export default config;