import { CartsContext } from "@/app/Context/cartContext";
import { OrderedContext } from "@/app/Context/orderedContext";
import { SellerOrdersContext } from "@/app/Context/sellerOrderContext";
import { Button } from "@mantine/core";
import { useContext } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  processedCart: CurrentCart | undefined;
  close : () => void
};

const PaymentModel = (props: Props) => {
  const { processedCart , close} = props;
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const { dispatch: orderDispatch } = useContext(OrderedContext) || {};
  const { dispatch: sellerOrderDispatch } = useContext(SellerOrdersContext) || {};
  const { dispatch: cartDispatch } = useContext(CartsContext) || {};
  const sellerName = processedCart?.adminName;

  const handlePlaceOrder = async () => {
    if(processedCart){
      if(processedCart.total <= 0){
        toast.info("Cart is empty!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        })
        return;
      }
    
        fetch("http://localhost:4000/api/user/orderPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'authorization': 'Bearer ' + user.token,
          },
          body: JSON.stringify({
            processedCart,
            userName,
          }),
        })
          .then(async (res) => {
            if (res.ok) return res.json();
            return res.json().then((json) => Promise.reject(json));
          })
          .then(({ url }) => {
            console.log(url)
            window.location = url;
            close()
          })
          .catch((e) => {
            console.error(e.message);
            toast.error(e.message, {
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
          
        try {
          const response = await fetch(
            `http://localhost:4000/api/user/placeOrder`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" , 
                'authorization': 'Bearer ' + user.token,
               },
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
              cartDispatch
                ? cartDispatch({ type: "PLACE_ORDER", payload: data })
                : {};
              orderDispatch
                ? orderDispatch({ type: "CREATE_ORDERED", payload: data })
                : {};
              const newData = {
                items: data.items,
                total: data.total,
                username: userName,
                id: data.id,
              };
              sellerOrderDispatch
                ? sellerOrderDispatch({
                    type: "CREATE_SELLER_ORDER",
                    payload: newData,
                  })
                : {};
              toast.success("Order placed successfully!", {
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
        }
      }
  };
  return (
    <div className="flex flex-col w-full h-full justify-center align-middle content-center pt-8">
      <div className="text-lg w-full flex justify-start align-middle content-center mb-1">
        Confirm to place your order ?{" "}
      </div>
      <div className="text-md w-full flex justify-start align-middle content-center mt-1">
        Total : ₹ {processedCart ? processedCart.total : 0}
      </div>
      <Button
        size="lg"
        className="flex w-full h-fit mt-5 justify-center align-middle content-center"
        onClick={handlePlaceOrder}
      >
        Pay
      </Button>
    </div>
  );
};

export default PaymentModel;
