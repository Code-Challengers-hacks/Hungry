'use client'

import Image from "next/image";
import GetItemQuantity from "./getItemQuantity";
import { Tooltip } from "@mantine/core";
import Food_Placeholder from '@/public/food_placeholder.jpg'
import { useEffect, useState } from "react";

type Props = {
  item: MenuItem;
};

const UserListItem = (props: Props) => {
  const { item } = props;
  const imageName = item.image

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



  return (
    <div className="flex justify-between align-middle content-center w-full h-auto p-3 ">
      <div className="w-1/6 mr-2 h-full">
      <Tooltip label={item.name} position="left">
          <Image src={item.image ? imageUrl : Food_Placeholder} alt={item.name} width={80} height={80} className="rounded-xl" />
        </Tooltip>
      </div>
      <div className="w-5/6 ml-2 h-full flex justify-around content-center align-middle">
        <div className="flex-col justify-center content-center align-middle h-full w-5/6">
          <div className="text-lg font-extrabold">{item.name} : <span className="font-extralight italic text-md">{item.sellerName}</span></div>
          <div className="italic">{item.description}</div>
          <div>₹ {item.price}</div>
        </div>
        <div className="flex justify-center align-middle content-center w-1/6 h-fit mt-6 cursor-pointer">
            <GetItemQuantity item={item} />
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
