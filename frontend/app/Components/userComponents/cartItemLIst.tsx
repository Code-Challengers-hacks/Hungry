import { Tooltip } from "@mantine/core";
import Image from "next/image";
import Delete from "@/public/delete.png";
import ChangeItemQuantity from "./changeItemQuantity";
import { useContext } from "react";
import { CartsContext } from "@/app/Context/cartContext";
import { Bounce, toast } from "react-toastify";

type Props = {
    userItem : UserItem
}

const CartItemLIst = (props: Props) => {
  const {userItem}  = props;
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const sellerName = userItem.adminName
  const itemName = userItem.name
  const { dispatch } = useContext(CartsContext) || {};

  const handleDeleteItem = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/deleteItem`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" , 'authorization' : "Bearer " + user.token },
          body: JSON.stringify({ sellerName, userName , itemName}),
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
          const {total , item} = data;
          dispatch ? dispatch({type: 'DELETE_CART_ITEM', payload: {item : item , total : total}}) : {}
          toast.success(itemName + ' deleted from cart to ' + item.adminName + ' successfully!', {
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
    <div
      key={userItem.id}
      className="flex justify-between align-middle content-normal w-full h-fit my-1"
    >
      <div className="flex justify-between align-middle content-center w-full h-full">
        <div className="w-1/5 flex justify-start align-middle content-center">
          {userItem.name}
        </div>
        <div className="flex justify-evenly align-middle content-center w-1/5 h-fit">
          <div className="flex justify-center align-middle content-center h-fit">
            {userItem.quantity}
          </div>
          <div className="flex justify-center align-middle content-center cursor-pointer ">
            <ChangeItemQuantity item={userItem} />
          </div>
        </div>
        <div className="w-1/5 flex justify-center align-middle content-center">
          ₹ {userItem.price}
        </div>
        <div className="w-1/5 flex justify-center align-middle content-center h-fit">
            {userItem.quantity * userItem.price}
        </div>
      </div>
      <div className="flex justify-end align-middle content-center cursor-pointer w-1/5 h-fit pr-4">
        <Tooltip label="Delete Item" position="right">
          <Image
            src={Delete}
            alt="delete"
            height={20}
            width={20}
            onClick={handleDeleteItem}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default CartItemLIst;
