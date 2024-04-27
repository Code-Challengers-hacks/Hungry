import { useEffect, useState } from "react";
import FeedbackListItem from "./feedbackListItem";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[] | null>(null);
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const sellerName = seller.name;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getfeedback = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/seller/feedback/${sellerName}`,
          {
            headers: {
              authorization: "Bearer " + seller.token,
            },
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
        .then((feedbacks) => {
          setFeedbacks(feedbacks);
          setLoading(false);
          console.log(feedbacks);
        })
      } catch(error : any) {
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
      }
    getfeedback();
  }, []);

  return (
    <div className="flex flex-col justify-center content-center align-middle w-full p-3 pt-0 h-fit divide-y-2 divide-teal-400">
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
      ) : feedbacks && feedbacks.length != 0 ? (
        feedbacks.map((item) => <FeedbackListItem key={item.id} item={item} />)
      ) : (
        <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
          No feedback provided yet! 😔
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
