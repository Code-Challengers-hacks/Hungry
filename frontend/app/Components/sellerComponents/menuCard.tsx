"use client";

import MenuListItem from "@/app/Components/sellerComponents/menuListItem";
import AddMenuItem from "@/app/Components/sellerComponents/addMenuItem";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "@/app/Context/menuContext";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Hourglass } from "react-loader-spinner";

const MenuCard = () => {
  //onst [menuCard, setMenuCard] = useState<MenuItem[] | null>(null);
  const data: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const sellerName = data.name;

  const { menu, dispatch } = useContext(MenuContext) || {};
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const getMenu = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/seller/menu/${sellerName}`,{
            headers: {
              'authorization': "Bearer " + data.token,
            }
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
            dispatch ? dispatch({ type: "SET_MENU", payload: data }) : {};
            console.log(data);
            setLoading(false);
          });
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
    getMenu();
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-center align-middle content-center w-full h-fit">
      <div className="flex flex-col justify-center align-middle content-center w-full divide-y-2 divide-cyan-400 h-full">
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
        ) : menu && menu?.length != 0 ? (
          menu.map((item) => <MenuListItem key={item.id} item={item} />)
        ) : (
          <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
            No menu items provided! 😥
          </div>
        )}
      </div>
      <div className="flex flex-col jus align-middle content-center w-full p-5">
        <AddMenuItem />
      </div>
    </div>
  );
};

export default MenuCard;
