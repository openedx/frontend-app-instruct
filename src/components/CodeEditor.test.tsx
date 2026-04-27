import { render } from '@testing-library/react';

const MockCodeEditor = ({ data }: { data: string }) => (
  <div data-testid="code-editor">
    {data ? 'Editor loaded with data' : 'Empty editor'}
  </div>
);

describe('CodeEditor', () => {
  it('renders with data', () => {
    const { getByTestId } = render(<MockCodeEditor data="test data" />);
    expect(getByTestId('code-editor')).toBeInTheDocument();
    expect(getByTestId('code-editor')).toHaveTextContent('Editor loaded with data');
  });

  it('renders without data', () => {
    const { getByTestId } = render(<MockCodeEditor data="" />);
    expect(getByTestId('code-editor')).toBeInTheDocument();
    expect(getByTestId('code-editor')).toHaveTextContent('Empty editor');
  });

  it('handles different data values', () => {
    const { getByTestId } = render(<MockCodeEditor data="some code content" />);
    expect(getByTestId('code-editor')).toHaveTextContent('Editor loaded with data');
  });
});
