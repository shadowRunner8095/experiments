import type { AutoContainer } from "../../minimal-container/auto-container";
import type { ServicesById } from "../../types";
import pag1Options from './-bindings/page1'

import mainRegister from './-bindings/main'

import mainChildren from './-bindings/mainChildren'

export default function appendBindings(container: AutoContainer<ServicesById>, _meta?: any) {
  return container
    .bind(pag1Options.identifier, pag1Options.options)
    .bind(
      mainRegister.identifier,
      mainRegister.options
    )
    .bind(
      mainChildren.identifier,
      mainChildren.options
    )
}