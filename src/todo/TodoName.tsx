import { useTodoDetails } from './useTodos';

export default function TodoName ({ id } : { id: string }) {
  const { details, isLoading } = useTodoDetails(id);
  return <>
    {isLoading && <span>Loading...</span>}
    {details && <span>{details.name}</span>}
  </>
}
