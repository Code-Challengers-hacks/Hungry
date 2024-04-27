"use client";

import { useContext, useEffect, useState } from "react";
import CartItem from "./cartItem";
import { CartsContext } from "@/app/Context/cartContext";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const UserCarts = () => {
  //const [currentCarts,setCurrentCarts] = useState<CurrentCart[] | null>()
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userId = user.id;
  const { cart, dispatch } = useContext(CartsContext) || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentCarts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/user/currentCarts/${userId}` , {
            headers : {
              'authorization' : 'Bearer ' + user.token
            }
          }
        )
        .then(async (response) => {
          console.log(response.status)
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
            dispatch ? dispatch({ type: "SET_CARTS", payload: data }) : {};
            //setCurrentCarts(data)
            setLoading(false);
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
    getCurrentCarts();
    //console.log(currentCarts)
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
      ) : cart && cart.length != 0 ? (
        cart.map((item) => (
          <CartItem
            key={item.id}
            item={item.items}
            price={item.total}
            sellerName={item.adminName}
          />
        ))
      ) : (
        <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
          You do not have any carts open yet! 😟
        </div>
      )}
    </div>
  );
};

export default UserCarts;
