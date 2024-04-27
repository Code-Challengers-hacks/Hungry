import Image from "next/image";
import Delete from "@/public/delete.png";
import { Tooltip } from "@mantine/core";
import OrderListItemMembers from "./orderListItemMembers";
import { SellerOrdersContext } from "@/app/Context/sellerOrderContext";
import { useContext } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  item: UserItem[];
  price: number;
  username: String;
};


const OrderListItem = (props: Props) => {
  const { item , price , username } = props; 
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "")
  const sellerName = seller.name
  const {dispatch} = useContext(SellerOrdersContext) || {}


  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/seller/deleteOrder`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" , 'authorization' : "Bearer " + seller.token },
          body: JSON.stringify({ sellerName , username }),
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
          dispatch ? dispatch({type : 'DELETE_SELLER_ORDER' , payload : data}) : {}
          toast.success("Order deleted successfully!", {
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
        });
    } catch (error : any) {
      console.error(error.message);
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

  return (
    <div className="flex justify-center align-middle content-center w-full p-5">
      <div className="flex flex-col justify-center align-middle content-center w-5/6 h-full+">
        <div className="flex justify-between align-middle content-center w-full h-full+">
          <div className="font-extrabold text-xl pl-2">{username}</div>
          <div className="pr-2">Grand Total : ₹ {price}</div>
        </div>
        <div className="flex flex-col justify-center align-middle content-normal w-full h-fit my-3 border-2 border-blue-700 p-5 py-3 rounded-xl">
          <div className="flex justify-between align-middle content-center w-full h-fit my-2 border-b-2 border-b-blue-700 pb-2">
            <div className="font-extrabold">Item</div>
            <div className="font-extrabold">Quantity</div>
            <div className="font-extrabold">Price</div>
            <div className="font-extrabold">Total</div>
          </div>
          {item ? (
            item.map((item) => (
           <OrderListItemMembers key={item.id} userItem={item} />
            ))) : <div className="text-md flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
            No orders recieved! 😟
          </div> }
        </div>
      </div>
      <div className="flex justify-center align-middle content-center w-1/6">
        <Tooltip label="Delete Order" position="top">
          <Image
            src={Delete}
            alt="delete"
            height={15}
            width={55}
            className="h-auto  mx-auto my-auto cursor-pointer ml-12"
            onClick={handleDeleteOrder}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default OrderListItem;
