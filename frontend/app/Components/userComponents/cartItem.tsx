'use client'

import Image from "next/image";
import Delete from "@/public/delete.png";
import OrderOk from "@/public/purchase-order.png";
import { Tooltip } from "@mantine/core";
import CartItemLIst from "./cartItemLIst";
import { use, useContext, useState } from "react";
import { CartsContext } from "@/app/Context/cartContext";
import { OrderedContext } from "@/app/Context/orderedContext";
import { SellerOrdersContext } from "@/app/Context/sellerOrderContext";
import { Bounce, toast } from "react-toastify";
import Payment from "./payment";

type Props = {
  item: UserItem[];
  price: number;
  sellerName: String;
};

const CartItem = (props: Props) => {
  const { item, price, sellerName } = props;
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  console.log(item);
  const { dispatch : cartDispatch } = useContext(CartsContext) || {};

  const handleDeleteCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/deleteCart`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" , 'authorization' : "Bearer " + user.token },
          body: JSON.stringify({ sellerName, userName }),
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
          cartDispatch ? cartDispatch({type: 'DELETE_CART', payload: data}) : {}
          toast.success('Cart to ' + data.adminName + ' deleted successfully', {
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
      <div className="flex flex-col justify-center align-middle content-center w-5/6 h-full">
        <div className="flex justify-between align-middle content-center w-full h-full">
          <div className="font-extrabold text-xl pl-2">{sellerName}</div>
          <div className="pr-2">Grand Total : ₹ {price}</div>
        </div>
        <div className="flex flex-col justify-center align-middle content-normal w-full h-fit my-3 border-2 border-blue-700 p-5 py-3 rounded-xl">
          <div className="flex justify-between align-middle content-center w-full h-fit my-2 border-b-2 border-b-blue-700 pb-2">
            <div className="font-extrabold w-1/5 flex justify-start content-center align-middle text-center">
              Item
            </div>
            <div className="font-extrabold w-1/5 flex justify-center content-center align-middle text-center">
              Quantity
            </div>
            <div className="font-extrabold w-1/5 flex justify-center content-center align-middle text-center pl-7">
              Price
            </div>
            <div className="font-extrabold w-1/5 flex justify-center content-center align-middle text-center pl-14">
              Total
            </div>
            <div className="font-extrabold w-1/5 flex justify-end content-center align-middle text-center">
              Delete
            </div>
          </div>
          {item && item.length > 0 ? (
            item.map((userItem) => (
              <CartItemLIst key={userItem.id} userItem={userItem} />
            ))
          ) : (
            <div className="text-md flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
              No orders in the cart! 😟
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center align-middle content-center w-1/6 h-fit my-auto">
        <Tooltip label="Delete cart" position="right">
          <Image
            src={Delete}
            alt="delete"
            height={15}
            width={50}
            className="h-auto  mx-auto my-auto cursor-pointer ml-12 mb-5"
            onClick={handleDeleteCart}
          />
        </Tooltip>
        <Payment sellerName={sellerName} />
      </div>
    </div>
  );
};

export default CartItem;
