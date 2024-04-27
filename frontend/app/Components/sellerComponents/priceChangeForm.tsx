"use client";

import { MenuContext } from "@/app/Context/menuContext";
import { Button, NumberInput } from "@mantine/core";
import { useContext, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  item: MenuItem;
  close : () => void
};

const PriceChangeForm = (props: Props) => {
  const { item , close } = props;
  const [price, setPrice] = useState<number>(0);
  const itemName = item.name;
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const [priceError, setPriceError] = useState("");
  const sellerName = seller.name;
  const { dispatch } = useContext(MenuContext) || {};

  const handleUpdate = async () => {
    if (price <= 0) {
      setPriceError("Price of food must be above ₹1!");
    } else {
      try {
        const response = await fetch(
          `http://localhost:4000/api/seller/updateMenuItem`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + seller.token,
            },
            body: JSON.stringify({ sellerName, itemName, price }),
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
            setPriceError("");
            dispatch
              ? dispatch({
                  type: "UPDATE_PRICE",
                  payload: {
                    item: data,
                    price: price,
                  },
                })
              : {};
            toast.success(itemName + "'s price updated successfully!", {
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
            close()
          });
      } catch (error: any) {
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
        close()
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-fit justify-center content-center align-middle p-3">
      <div className="flex w-full h-auto justify-start content-center align-middle my-3">
        Update your foods price :{" "}
      </div>
      <div>
        <NumberInput
          label="Price"
          description="Enter your updated food price"
          placeholder="₹50"
          className="my-3"
          onChange={(value) => setPrice(Number(value))}
          withAsterisk
          error={priceError}
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
        />
        <Button
          fullWidth
          className="flex w-full h-auto justify-center align-middle content-center mt-7"
          onClick={handleUpdate}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default PriceChangeForm;
