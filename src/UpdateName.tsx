import { useActionState, useEffect, useState } from "react";

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

const UpdateName = () => {
  const [title, setTitle] = useState("");
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
      const error = await updateName(newTitle);
      if (error) {
        return { data: { title: newTitle }, error };
      }

      return { data: { title: newTitle }, error: null };
    },
    // Make sure to pass the initial state like useReducer
    { data: { title: "" }, error: null }
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
        {actionState && <p style={{ color: "red" }}>{actionState.error}</p>}
      </form>
    </div>
  );
};

export default UpdateName;
