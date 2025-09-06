import { useCallback, type ChangeEvent } from "react";

export const SearchInput = ({search}: {search: (value: string)=>Promise<any>})=>{
  const onChange = useCallback(async ({target}: ChangeEvent<HTMLInputElement>)=>{
    const { value } = target

    await search(value);
  }, [search])

  return <input onChange={onChange} />
}
