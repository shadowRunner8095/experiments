import { createAutoResolver } from "../../../minimal-container/auto-container"
import type { BindingConfig, ServicesById } from "../../../types"

const config: BindingConfig<ServicesById, 'search'> = {
  identifier: 'search',
  options: {
    resolveDependencies: createAutoResolver([
      {
        identifier: 'analytics',
        dontThrowIfNull: true
      }
    ]),
    provider: (deps) => {
      return async (value) => {
        deps.analytics?.(value)
        console.log(value)
      }
    }
  }
}

export default config