import { useContext, useEffect, useState } from "react";
import OrderListItem from "./orderListitem";
import { SellerOrdersContext } from "@/app/Context/sellerOrderContext";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const SellerOrders = () => {
  //const [orders,setorders] = useState<OrderedCart[] | null>(null);
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const sellerId = seller.id;
  const { sellerOrders, dispatch } = useContext(SellerOrdersContext) || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getorders = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/seller/orders/${sellerId}`,
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
        .then((orders) => {
          dispatch ? dispatch({ type: "SET_SELLER_ORDERS", payload: orders }) : {};
          console.log(sellerOrders);
          setLoading(false);
        });
        //setorders(orders);
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
    getorders();
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
      ) : sellerOrders && sellerOrders.length > 0 ? (
        sellerOrders.map((item) => (
          <OrderListItem
            key={item.id}
            item={item.items}
            price={item.total}
            username={item.username}
          />
        ))
      ) : (
        <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
          No orders recieved yet! 😕
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
