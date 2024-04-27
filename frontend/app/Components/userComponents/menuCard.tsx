import UserListItem from "@/app/Components/userComponents/userListItem";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const MenuCard = () => {
  const [menus, setMenus] = useState<MenuItem[] | null>();
  const [loading, setLoading] = useState(true);
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");

  useEffect(() => {
    const getMenus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user/menu/`, {
          headers: {
            authorization: "Bearer " + user.token,
          },
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
            setLoading(false);
            setMenus(data);
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
    getMenus();
  }, []);

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
        ) : menus && menus.length > 0 ? (
          menus.map((item) => <UserListItem key={item.name} item={item} />)
        ) : (
          <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
            No menu items available to order! 😟
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
