import { parseObject } from '../utils/formatters';

interface ObjectCellProps {
  value: Record<string, any> | null,
}

const ObjectCell = ({ value }: ObjectCellProps) => {
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {parseObject(value ?? '')}
    </pre>
  );
};

export { ObjectCell };
