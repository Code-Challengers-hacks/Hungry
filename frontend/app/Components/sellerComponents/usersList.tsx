import { useEffect, useState } from "react";
import UserListItem from "./userListItem";
import { Bounce, toast } from "react-toastify";
import { Hourglass } from "react-loader-spinner";

const UsersList = () => {
  const member: boolean = localStorage.getItem("Auth") !== null;
  let seller: localStore;
  let sellerName: string;
  if (member) {
    seller = JSON.parse(localStorage.getItem("Auth") || "");
    sellerName = seller.name;
  }
  const [users, setUsers] = useState<SellerUser[] | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/seller/users/${sellerName}`,
          {
            headers: {
              authorization: "Bearer " + seller.token,
            },
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
        .then((users) => {
          console.log(users)
          setLoading(false);
          setUsers(users);
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
    getuser();
  },[]);

  return (
    <div className="flex flex-col justify-center content-center align-middle w-full p-3 pt-0 h-fit divide-y-2 divide-teal-400">
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
      ) : users && users.length > 0 ? (
        users.map((item) => <UserListItem key={item.id} item={item} />)
      ) : (
        <div className="text-2xl flex justify-center align-middle content-center w-full h-fit text-center text-red-600 font-extrabold">
          No users ordered your item! 😟
        </div>
      )}
    </div>
  );
};

export default UsersList;
