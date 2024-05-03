import { useEffect } from "react";
import useAPIError from "../../hooks/useAPIError";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const APIErrorNotification = () => {
  const { error, removeError } = useAPIError();

  const notify = () => {
    toast.error(error?.message || "An error occurred");
    removeError();
  };

  useEffect(() => {
    if (error) {
      notify();
    }
  }, [error]);

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default APIErrorNotification;
