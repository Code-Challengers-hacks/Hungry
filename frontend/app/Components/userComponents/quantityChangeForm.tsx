"use client";

import { CartsContext } from "@/app/Context/cartContext";
import { Button, NumberInput } from "@mantine/core";
import { useContext, useState } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  item: UserItem;
  close : () => void
};

const QuantityChangeForm = (props: Props) => {
  const { item , close } = props;
  console.log(item);
  const [quantity, setQuantity] = useState(1);
  const itemName = item.name;
  const sellerName = item.adminName;
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const [quantityError, setQuantityError] = useState("");
  const { dispatch } = useContext(CartsContext) || {};

  const handleChangeQuantity = async (e: any) => {
    if (quantity < 1) {
      setQuantityError("Enter a valid quantity greater than 0");
      return;
    }
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/changeQuantity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + user.token,
          },
          body: JSON.stringify({
            userName,
            sellerName,
            quantity,
            itemName,
          }),
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
          const { total, item } = data;
          toast.success(
            itemName +
              "'s quantity upadated in cart to " +
              item.adminName +
              " successfully!",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            }
          );
          dispatch
            ? dispatch({
                type: "UPDATE_QUANTITY",
                payload: {
                  item: item,
                  quantity: quantity,
                  total: total,
                },
              })
            : {};
          setQuantity(1);
          close();
        });
    } catch (error: any) {
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
      close();
    }
  };
  return (
    <div className="flex flex-col w-full h-fit justify-center content-center align-middle p-3">
      <div className="flex w-full h-auto justify-start content-center align-middle my-3">
        Update your food quantity :{" "}
      </div>
      <div>
        <NumberInput
          label="Quantity"
          description="Enter your updated food quantity"
          placeholder="Enter updated food quantity"
          className="my-3"
          onChange={(value) => setQuantity(Number(value))}
          withAsterisk
          styles={{
            input: {
              backgroundColor: "black",
              color: "white",
              borderBottomColor: "blue",
              borderBottomWidth: "3.5px",
              borderTopColor: "black",
              borderLeftColor: "black",
              borderRightColor: "black",
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
          onClick={(e) => handleChangeQuantity(e)}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default QuantityChangeForm;
