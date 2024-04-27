"use client";

import { CartsContext } from "@/app/Context/cartContext";
import { Button, NumberInput } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { toast, Bounce} from 'react-toastify'

type Props = {
  item: MenuItem;
  close : () => void
};

const UserQuantity = (props: Props) => {
  const { item ,close } = props;
  const itemName = item.name;
  const itemPrice = item.price;
  const itemImage = item.image;
  const sellerName = item.sellerName;
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const userId = user.id;
  const { dispatch } = useContext(CartsContext) || {};

  const handleAdd = async (e: any) => {

    e.preventDefault();
    if(quantity < 1){
      setQuantityError("Enter a valid quantity greater than or equal to 1");
      return;
    }
    console.log(userName, itemName, sellerName, quantity, itemPrice, userId)
    try{
    const response = await fetch(`http://localhost:4000/api/user/addToCart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" , 'authorization' : "Bearer " + user.token },
      body: JSON.stringify({
        userName,
        itemName,
        sellerName,
        quantity,
        itemPrice,
        userId,
      }),
    })
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
          const {item , cart , order,  status  } = data;
          const total = cart.total;
          const cartID = cart.id;
          if(status == 0){
            console.log(order)
            dispatch ? dispatch({type: 'CREATE_CART', payload: order}) : {}
          }
          else if(status == 1){
            dispatch ? dispatch({type: 'ADD_ITEMS_CART', payload: {id : cartID , item : item , total : total}}) : {}
          }
          else if(status == 2){
            dispatch ? dispatch({type: 'UPDATE_BY_QUANTITY', payload: {item : item , quantity : quantity , total : total}}) : {}
          }
          toast.success(itemName + " successfully added to the cart to " + cart.adminName + " !", {
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
          setQuantityError("");
          close()
        })
      }catch(error : any){
        console.log(error.message)
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
        setQuantity(1);
        close()
      }
  };

  return (
    <div className="flex flex-col w-full h-fit justify-center content-center align-middle p-3">
      <div className="flex w-full h-auto justify-start content-center align-middle my-3">
        Food quantity :
      </div>
      <div>
        <NumberInput
          label="Quantity"
          description="Enter your food quantity"
          placeholder="1"
          className="my-3"
          onChange={(value) => setQuantity(Number(value))}
          withAsterisk
          styles={{
            input: {
              backgroundColor: 'black', 
              color : 'white',
              borderBottomColor : 'blue',
              borderBottomWidth : '3.5px',
              borderTopColor : 'black',
              borderLeftColor : 'black',
              borderRightColor : 'black',
            },
            control: {
              color: "blue",
              borderLeft: "black",
            },
            controls: {
              borderLeft: "black",
            },
          }}
          error={quantityError}
        />
        <Button
          fullWidth
          className="flex w-full h-auto justify-center align-middle content-center mt-7"
          onClick={(e) => handleAdd(e)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default UserQuantity;
