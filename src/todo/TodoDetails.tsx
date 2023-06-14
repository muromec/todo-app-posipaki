import { useParams } from "react-router-dom";
import { useTodoDetails } from './useTodos';

import './TodoDetails.css';

export default function TodoDetails () {
  const { id } = useParams() as { id: string };
  const { details, isLoading, patch } = useTodoDetails(id);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const FD = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(FD.entries());
    patch(data);
  }

  return <div className="TodoDetails">
    <h2>Here are details of {id}</h2>
    {isLoading && <span>Loading...</span>}
    {details && <div>
      <form onSubmit={onSubmit}>
        <input name="name" defaultValue={details.name} />
        
        {details.description}
        
        <button type="submit">Save</button>

      </form>
    </div>}
  </div>
}
