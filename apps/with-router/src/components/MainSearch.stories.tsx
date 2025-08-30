import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { MainSearch } from './MainSearch';
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { wait } from '../utils';


const createMockData = (value: string) => Array
  .from({ length: 10 }, (_, outerIndex) => 
    Array.from({ length: 10 }, (_, index) => {
      const id = `${outerIndex}-${index}-${value}`;
      return { id, text: `Hello from ${id} with value ${value}` };
    })
  );

const mockDataByValue: Record<string, Array<Array<{ id: string; text: string }>>> = {
  'test1': createMockData('test1'),
  'test2': createMockData('test2'),
  'react': createMockData('react'),
  'javascript': createMockData('javascript'),
  'typescript': createMockData('typescript'),
};

const fakeSearch = fn(async (value: string, page = 0) => {
  await wait();
  
  const data = mockDataByValue[value.toLowerCase()];
  if (!data || !data[page]) {
    return [];
  }
  
  return data[page];
});

const meta: Meta<typeof MainSearch> = {
  title: 'Example/MainSearch',
  component: MainSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    search: { action: 'search' },
  },
} satisfies Meta<typeof MainSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    search: fakeSearch,
  },
  async play({canvas, args}){
    const searchBox = await canvas.findByRole('textbox');

    await userEvent.type(searchBox, 'test1', {
      delay: 50
    });

    await waitFor(() => {
        const results = canvas.queryAllByText('Loading');
        expect(results.length).toBe(0);
    });

    await waitFor(()=> expect(args.search).toBeCalled());
  }
};

export const WithInitAction: Story = {
  args: {
    search: fakeSearch,
    withInitialAction: true
  }
}

export const WithError: Story = {
  args: {
    search: async ()=>{
      await wait()

      throw new Error("could not load data")
    }
  },
}

