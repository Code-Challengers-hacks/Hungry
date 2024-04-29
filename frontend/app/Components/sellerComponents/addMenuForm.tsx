"use client";

import { MenuContext } from "@/app/Context/menuContext";
import {
  Button,
  FileInput,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Image_Placeholder from "@/public/food_placeholder.jpg";

async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const blob = await response.blob();
  return blob;
}


type Props =  {
  close : () => void;
}

const AddMenuForm = (props : Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [image, setImage] = useState<File | Blob | string | null>('');
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const sellerName = seller.name;
  const sellerMail = seller.email;
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const { dispatch } = useContext(MenuContext) || {};

  useEffect(() => {
    urlToBlob(Image_Placeholder.src)
      .then(blob => setImage(blob))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const lsData: localStore = JSON.parse(localStorage.getItem("Auth") || "");
    if (name == "") {
      setNameError("Enter a food name");
    }
    if (description == "") {
      setDescriptionError("Enter description about the food");
    }
    if (price <= 0) {
      setPriceError("Price of food must be above ₹1!");
    }
    try {
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("sellerName", sellerName);
      formData.append("image", image as Blob);
      const response = await fetch(`http://localhost:4000/api/seller/menu`, {
        method: "POST",
        headers: {
          authorization: "Bearer " + lsData.token,
        },
        body: formData,
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
          console.log(data);
          dispatch ? dispatch({ type: "CREATE_MENU", payload: data }) : {};
          toast.success(name + " successfully added to the menu!", {
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
          props.close();
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
      props.close();
    }
  };

  return (
    <div className="flex flex-col justify-center content-center align-middle w-full h-fit p-3">
      <div className="flex justify-start content-center align-middle w-full h-auto mb-2">
        Enter your food details
      </div>
      <div>
        <TextInput
          label="Name"
          description="Enter your food name"
          placeholder="Sandwich"
          className="my-3"
          error={nameError}
          onChange={(event) => setName(event.currentTarget.value)}
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
          }}
        />
        <Textarea
          label="Description"
          description="Enter your food description (max 10 words)"
          placeholder="Buttery and cheesy filled with vegies!"
          className="my-3"
          error={descriptionError}
          onChange={(event) => setDescription(event.currentTarget.value)}
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
          }}
        />
        <NumberInput
          label="Price"
          description="Enter your food price"
          placeholder="5"
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
        <FileInput
          clearable
          label="Image"
          placeholder="Upload Image"
          className="my-3"
          onChange={setImage}
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
          }}
        />
        <Button
          fullWidth
          className="flex justify-center align-middle content-center w-full h-auto mt-5"
          onClick={(e) => handleSubmit(e)}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddMenuForm;
