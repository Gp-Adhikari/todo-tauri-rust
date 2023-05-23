import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import bin from "./assets/remove.svg";

interface Todo {
  id: number;
  todo: string;
}

const App = (): JSX.Element => {
  const [todo, setTodo] = useState<string>("");

  const [lists, setLists] = useState<Todo[]>([]);

  const sendTodo = async (): Promise<void> => {
    setTodo("");
    setLists(await invoke("get_todo", { todo }));
  };

  const removeTodo = async (id: Number): Promise<void> => {
    setLists(await invoke("remove_todo", { id }));
  };

  return (
    <div className="wrapper">
      <h1>TODO APP</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendTodo();
        }}
      >
        <input
          type="text"
          placeholder="Add Task"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="button" onClick={() => sendTodo()}>
          Add
        </button>
      </form>

      <div className="todo-wrapper">
        <h3>Lists</h3>

        {lists[0] !== undefined ? (
          lists.map((list, idx) => (
            <div className="todo" key={list.id}>
              <div className="flex-separator">
                <p className="sn">{idx + 1}.</p>
                <p className="text">{list.todo}</p>
              </div>
              <div className="remove" onClick={() => removeTodo(list.id)}>
                <img src={bin} alt="remove" />
              </div>
            </div>
          ))
        ) : (
          <p className="no-tasks">No Tasks Today!</p>
        )}
      </div>
    </div>
  );
};

export default App;
