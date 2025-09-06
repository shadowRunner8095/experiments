import type { LazyExoticComponent, ReactNode } from "react";
import type { AutoContainer, BindOptions } from "./minimal-container/auto-container";
import type { PlainObject } from "./minimal-container";

export interface ServicesById {
  'main': ReactNode,
  'mainChildren': ReactNode,
  'search': (value: string)=>Promise<any>,
  'analytics': (value: string)=>void;
  'page1': LazyExoticComponent<any>
}

export type BindingConfig<
  Services extends PlainObject,
  Key extends keyof Services
> = {
  identifier: keyof Services,
  options: BindOptions<Services, Key>
} | ((ctx: AutoContainer<Services>)=>{
  identifier: keyof Services,
  options: BindOptions<Services, Key>
})