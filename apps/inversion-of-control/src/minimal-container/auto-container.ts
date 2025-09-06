import { Container, type PlainObject, } from ".";

export interface BindOptions<Register extends PlainObject, T extends keyof Register, M extends Partial<Register> = Partial<Register>, Meta = any>{
  scope?: 'trasient' | 'singleton';
  resolveDependencies?: (ctx: AutoContainer<Register>, meta?: Meta)=> M
  provider: (resolvedDeps: M, ctx: AutoContainer<Register>, meta?: Meta)=>Register[T];
  meta?: Meta
}

export interface IAutoContainer<
  Register extends PlainObject
> extends Container<Register>{
  bind<
    T extends keyof Register, 
    M extends Partial<Register> = Partial<Register>,
    Meta = any
  >(identifier: T, options: BindOptions<Register, T, M, Meta>):this;
}

export class AutoContainer<
  Register extends PlainObject
> extends Container<Register> implements IAutoContainer<Register> {
  bind<
    T extends keyof Register, 
    M extends Partial<Register> = Partial<Register>,  
    Meta = any
  >(identifier: T, options: BindOptions<Register, T, M,Meta>){
    const {
      provider,
      resolveDependencies,
      scope = 'singleton',
      meta
    } = options

    return super.bindTo(identifier, (ctx)=>{
      const resolvedDependencies = resolveDependencies?.(
        ctx as this, 
        meta
      )!;

      return provider(
        resolvedDependencies, 
        ctx as this, 
      meta);
    }, scope)
  }
}

export const createAutoResolveDepsInOrder = <T extends PlainObject>(deps: ({identifier:keyof T, dontThrowIfNull?: boolean})[])=>(ctx:Container<T>)=>{
  return deps.map(({identifier, dontThrowIfNull}) => ctx.get(identifier, dontThrowIfNull))
}

export const createAutoResolver = <T extends PlainObject, Key extends keyof T>(deps: ({identifier:Key, dontThrowIfNull?: boolean})[])=>(
  ctx: Container<T>
):Pick<T, Key>=>{
  return Object
    .fromEntries(
      deps
        .map(({identifier, dontThrowIfNull}) =>[identifier, ctx.get(identifier, dontThrowIfNull)])
    ) as Pick<T, Key>;
}