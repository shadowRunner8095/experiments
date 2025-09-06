import { SearchInput } from "../../../components/SearchInput";
import { createAutoResolver, type AutoContainer } from "../../../minimal-container/auto-container";
import type { ServicesById } from "../../../types";
import { Route, Router } from "../../../components/Router";


const config: {
  identifier: keyof ServicesById,
  options: Parameters<AutoContainer<ServicesById>['bind']>[1]
} = {
  identifier: 'mainChildren',
  options: {
    resolveDependencies: createAutoResolver([
      {
        identifier: 'search'
      },
      {
        identifier: 'page1'
      }
    ]),
    provider: (resolvedDependencies) => {
      return <>
        <SearchInput
          search={resolvedDependencies.search!}
        />
        <button onClick={() => {
          window.history.pushState({}, '', 'page1')
        }} >Navigate to</button>
        <Router>
          <Route LazyElement={resolvedDependencies.page1!} />
        </Router>
      </>

    }
  }
}

export default config;