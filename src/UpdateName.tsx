import {
  useActionState,
  useEffect,
  useOptimistic,
  useState,
  Suspense,
} from "react";
import { CancelButton } from "./components/cancelButton";
import { Comments, type Comment } from "./components/comments/Comments";


type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type ActionStateType = {
  data: { title: string };
  error: string | null;
};


const fetchComment = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/comments");
  const comments: Comment[] = await data.json();
  return comments;
};

const UpdateName = () => {
  const [title, setTitle] = useState("");

  // use API
  const commentsPromise = fetchComment();

  // useTransition
  // const [error, setError] = useState<Error | null>(null);
  // const [isPending, startTransition] = useTransition();

  // Using <form> Actions and useActionState. It allows you to handle form submission.
  // Previously known as useFormState
  const [actionState, submitAction, isPending] = useActionState(
    async (
      previousState: ActionStateType,
      formData: FormData
    ): Promise<ActionStateType> => {
      console.log("formData", previousState);
      const newTitle = formData.get("title") as string;
      setOptimisticTitle(newTitle);
      const error = await updateName(newTitle);
      if (error) {
        return { data: { title: newTitle }, error };
      }

      return { data: { title: newTitle }, error: null };
    },
    // Make sure to pass the initial state like useReducer
    { data: { title: "" }, error: null }
  );

  // useOptimistic
  const [optimisticTitle, setOptimisticTitle] = useOptimistic(
    actionState.data.title,
    (currentTitle, optimisticValue) => {
      return `${currentTitle} (This is an optimistic result: ${optimisticValue})`;
    }
  );

  const fetchTitle = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data: Post = await res.json();
    setTitle(data.title);
  };

  const updateName = async (title: string) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          id: 1,
          title,
          body: "bar",
          userId: 1,
        }),
      });
      const data: Post = await res.json();
      setTitle(data.title);
    } catch (error) {
      console.error(error);
      return error instanceof Error
        ? error.message
        : "An unknown error occurred";
    }
  };

  // const handleSubmit = () => {
  //   startTransition(async () => {
  //     const error = await updateName(title);
  //     if (error) {
  //       setError(error);
  //       return;
  //     }
  //   });
  // };

  useEffect(() => {
    fetchTitle();
  }, []);

  return (
    <div>
      <h2>Update title</h2>
      <p>title: {optimisticTitle}</p>
      <form action={submitAction}>
        <input
          value={title}
          type='text'
          name='title'
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <button type='submit' disabled={isPending}>
          Update
        </button>
        <CancelButton />
        {actionState && <p style={{ color: "red" }}>{actionState.error}</p>}
      </form>
      <h3>Comments via use API</h3>
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
};

export default UpdateName;
