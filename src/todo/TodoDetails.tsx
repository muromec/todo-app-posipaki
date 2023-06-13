import { useParams } from "react-router-dom";
import { useTodoDetails } from './useTodos';

export default function TodoDetails () {
  const { id } = useParams() as { id: string };
  const { details, isLoading } = useTodoDetails(id);
  console.log('d', details);
  return <>
    <h2>Here are details of {id}</h2>
    {isLoading && <span>Loading...</span>}
    {details && <p>
      {details.description}
    </p>}
  </>
}
