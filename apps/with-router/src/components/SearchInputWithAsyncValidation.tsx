
import { Suspense, use, useDeferredValue, useState, type ChangeEvent, type FC, type PropsWithChildren } from "react"

interface InputValidationResponse {
  error?: Error;
  data?: any;
}

interface InputLayoutProps {
  deferedValue: Promise<InputValidationResponse>;
}

export function IncorrectInputLayout({deferedValue, ...props}: PropsWithChildren<InputLayoutProps>){
  const data = use(deferedValue)

  return <div
    style={{
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor:  data.error ? 'red' : 'black',
      display: 'flex'
    }}
    {...props}
  />
}

function InputLayout({ deferedValue, ...props }: PropsWithChildren<InputLayoutProps>) {
  const promise = useDeferredValue(deferedValue)
  const data = use(promise)

  return <div
    style={{
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor:  data.error ? 'red' : 'black',
      display: 'flex'
    }}
    {...props}
  />


}

function IconWrapper({ query }: { query: Promise<InputValidationResponse> }) {
  const { error } = use(query)

  return error ? "Bad" : "Ok"
}

function ErrorText({ query }: { query: Promise<InputValidationResponse> }) {
  const { error } = use(query)
  if (error)
    return error.message
}

interface SearchInputWithAsyncValidation {
  validate(value: string): Promise<
    InputValidationResponse
  >;
  InputLayoutComponent?: FC<PropsWithChildren<InputLayoutProps>>
}

const defaultValue = Promise.resolve({})


export default function SearchInputWithPromiseValidation(
  { 
    validate,
    InputLayoutComponent = InputLayout
  }: SearchInputWithAsyncValidation
) {
  const [query, setQuery] = useState<
    Promise<InputValidationResponse>
  >(defaultValue)


  const onChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setQuery(validate(event.target.value))
  }



  return <Suspense fallback={'outer loading'} ><div>
    <InputLayoutComponent
      deferedValue={query}
    >
      <input style={{
        border: 'none',
        outline: 'none'
      }} onChange={onChange} />
      <Suspense 
        fallback={<div>Loading</div>}
      >
        <IconWrapper query={query} />
      </Suspense>
    </InputLayoutComponent>
    <Suspense>
      <ErrorText query={query} />
    </Suspense>
  </div>
  </Suspense>
} 