'use client'

import Image from "next/image";
import Delete from "@/public/delete.png";
import ChangeItemPrice from "./changeItemPrice";
import { Tooltip } from "@mantine/core";
import PlaceHolder from "@/public/food_placeholder.jpg";
import { MenuContext } from "@/app/Context/menuContext";
import { useContext, useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  item: MenuItem;
};

const MenuListItem = (props: Props) => {
  const { item } = props;
  const itemName = item.name;
  const description = item.description;
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "")
  const sellerName = seller.name
  const imageName = item.image
  const { dispatch } = useContext(MenuContext) || {};

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch(`http://localhost:4000/api/images/${imageName}`)
      .then(response => {
        if (response.ok) {
          console.log(response)
          return response.blob();
        }
        throw new Error('Network response was not ok.');
      })
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        console.log(imageUrl)
        setImageUrl(imageUrl);
      })
      .catch(error => console.error('Error fetching image:', error));
  }, []);


  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/seller/deleteMenuItem`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" , 'authorization' : "Bearer " + seller.token},
          body: JSON.stringify({ sellerName,itemName,description }),
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
          dispatch ? dispatch({type: 'DELETE_MENU', payload: data}) : {}
          toast.success(itemName + ' successfully deleted from Menu!', {
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
      toast.success(error.message , {
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
  }


  return (
    <div className="flex justify-between align-middle content-center w-full h-auto p-3 ">
      <div className="w-1/6 mr-2 h-full">
        <Tooltip label={item.name} position="left">
        <Image src={item.image ? imageUrl : PlaceHolder} alt={item.name} width={80} height={80} className="rounded-xl" />
        </Tooltip>
      </div>
      <div className="w-5/6 ml-2 h-full flex justify-around content-center align-middle">
        <div className="flex-col justify-center content-center align-middle h-full w-5/6">
          <div className="text-lg font-extrabold">{item.name}</div>
          <div className="italic">{item.description}</div>
          <div>₹ {item.price}</div>
        </div>
        <div className="flex-col justify-center align-middle content-center w-1/6 h-full">
          <div className=" h-1/2 flex justify-center align-middle content-center cursor-pointer pb-1">
            <Tooltip label="Delete Item" position="left">
              <Image src={Delete} alt="delete" height={10} width={35} onClick={handleDelete} />
            </Tooltip>
          </div>
          <div className="h-1/2 flex justify-center align-middle content-center cursor-pointer pt-1">
            <ChangeItemPrice item={item} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuListItem;
