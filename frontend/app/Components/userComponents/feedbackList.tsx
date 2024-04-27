import FeedbackListItem from "./feedbackListItem";
import AddFeedback from "./addFeedback";
import { useContext, useEffect, useState } from "react";
import { FeedbackContext } from "@/app/Context/feedbackContext";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const FeedbackList = () => {
  //const [feedback,setFeedback] = useState<Feedback[] | null>()
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const { feedback, dispatch } = useContext(FeedbackContext) || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user/feedback/${userName}` , {
            headers: { 
              'authorization': "Bearer " + user.token,
            }
          }
        )
        .then(async (response) => {
          if (response.status == 201) {
            return response.json();
          } else {
            return response.json().then((json) => {
              throw new Error(json.message);
            });
          }
        })
          .then((data) => {
            console.log(data);
            dispatch ? dispatch({ type: "SET_FEEDBACK", payload: data }) : {};
            setLoading(false);
            //setFeedback(data)
          });
      } catch (error: any) {
        console.error(error.message);
        setLoading(false);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    };
    getFeedbacks();
  }, []);

  return (
    <div className="flex flex-col justify-center align-middle content-center w-full p-3 pt-0 h-fit">
      <div className="flex flex-col justify-center content-center align-middle w-full h-full divide-y-2 divide-teal-400">
        {loading ? (
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass="flex justify-center align-middle content-center w-full mt-36"
            colors={["#306cce", "#72a1ed"]}
          />
        ) : feedback && feedback?.length != 0 ? (
          feedback.map((item) => <FeedbackListItem key={item.id} item={item} />)
        ) : (
          <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
            You have not provided any feedback yet! 😟
          </div>
        )}
      </div>
      <div className="flex flex-col jus align-middle content-center w-full p-5">
        <AddFeedback />
      </div>
    </div>
  );
};

export default FeedbackList;
