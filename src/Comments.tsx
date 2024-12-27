import { use } from "react";
import { Comment } from "./UpdateName";

type Props = {
  commentsPromise: Promise<Comment[]>;
};

const Comments = ({ commentsPromise }: Props) => {
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

export default Comments;
