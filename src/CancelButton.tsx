import { useFormStatus } from "react-dom";

const CancelButton = () => {
    const { pending } = useFormStatus();
    console.log("Button component is disabled", pending);
  return <button disabled={pending}>Cancel</button>;
};

export default CancelButton;
