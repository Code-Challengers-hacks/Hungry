"use client";

import { useContext, useEffect, useState } from "react";
import HistoryCartItem from "./historyCartItem";
import { OrderedContext } from "@/app/Context/orderedContext";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const UserOrderHistory = () => {
  //const [orderedCarts,setOrderedCarts] = useState<CurrentCart[] | null>()
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userId = user.id;
  const { ordered, dispatch } = useContext(OrderedContext) || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderedCarts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user/orderedCarts/${userId}` , {
            headers : {
              'authorization' : 'Bearer ' + user.token
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
            dispatch ? dispatch({ type: "SET_ORDERED", payload: data }) : {};
            setLoading(false);
            //setOrderedCarts(data)
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
    getOrderedCarts();
    //console.log(orderedCarts)
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
      ) : ordered && ordered?.length != 0 ? (
        ordered.map((item) => <HistoryCartItem key={item.id} item={item} />)
      ) : (
        <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
          You have not ordered anything yet! 😟
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
