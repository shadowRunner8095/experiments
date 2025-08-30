import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { MainSearchQuery } from './MainSearchQuery';
import { QueryProvider } from './QueryProvider';

const wait = (time = 1500) => new Promise(res => setTimeout(res, time));

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
  'query': createMockData('query'),
};

const fakeSearch = async (value: string, page = 0) => {
  await wait();
  
  const data = mockDataByValue[value.toLowerCase()];
  if (!data || !data[page]) {
    return [];
  }
  
  return data[page];
};

const meta: Meta<typeof MainSearchQuery> = {
  title: 'Example/MainSearchQuery',
  component: MainSearchQuery,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainSearchQuery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    search: fakeSearch,
  },
  decorators: [
    (Story) => (
      <QueryProvider>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Story />
        </div>
      </QueryProvider>
    ),
  ],
};
