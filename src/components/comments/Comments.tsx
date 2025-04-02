import { use } from "react";

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

type Props = {
  commentsPromise: Promise<Comment[]>;
};

export const Comments = ({ commentsPromise }: Props) => {
  const comments = use(commentsPromise);
  return (
    <div>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.body}</p>
          </div>
        );
      })}
    </div>
  );
};

