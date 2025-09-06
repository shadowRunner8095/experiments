import { useMemo } from "react";
import { Container } from "../minimal-container";

export default function Page1({globalContainer}){
  const childContainer = useMemo(()=>{
    const container = new Container();
    container.bindTo('mainPage1', ()=><div>Hello</div>)
    return container;
  }, [])

  return <div>
    {childContainer.get('mainPage1')}
  </div>

}