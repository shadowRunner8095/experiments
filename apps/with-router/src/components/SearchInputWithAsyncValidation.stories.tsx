import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import SearchInputWithPromiseValidation, { IncorrectInputLayout } from './SearchInputWithAsyncValidation';
import { fn} from 'storybook/test'
import { wait } from '../utils';
import { Suspense } from 'react';


// Mock validation functions
const successValidation = fn(async (value: string) => {
  await wait();
  return { data: `Validation passed for: ${value}` };
});


const valdiateOnlyNumbers = fn(async (value: string)=>{
  await wait();
  if (/^\d+$/.test(value))
    return {}
  return {
    error: new Error('only numbers are allowed')
  }
})

const meta: Meta<typeof SearchInputWithPromiseValidation> = {
  title: 'Example/SearchInputWithAsyncValidation',
  component: SearchInputWithPromiseValidation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [Story => <Suspense fallback={'outer loading'} ><Story /></Suspense>]

} satisfies Meta<typeof SearchInputWithPromiseValidation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    validate: successValidation,
  },
};


export const OnlyNumbersAllowed: Story = {
  args: {
    validate: valdiateOnlyNumbers,
  },
};

export const WrongInput: Story = {
  args: {
    validate: valdiateOnlyNumbers,
    InputLayoutComponent: IncorrectInputLayout
  }
}

