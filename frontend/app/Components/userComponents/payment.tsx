"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import Image from "next/image";
import OrderOk from "@/public/purchase-order.png";
import PaymentModel from "./paymentModel";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  sellerName: String;
};

const Payment = (props: Props) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { sellerName } = props;
    const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
    const userName = user.name;
    const [processedCart,setProcessedCart] = useState<CurrentCart>();

    useEffect(() => {
        const getProcessedCart = async () => {
          try {
            const response = await fetch(`http://localhost:4000/api/user/processedCart/${sellerName}/${userName}` , {
              headers : {
                'authorization' : 'Bearer ' + user.token,
              }
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
                setProcessedCart(data);
              });
          } catch (error : any) {
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
        };
        getProcessedCart();
      },[opened])  

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Proceed to payment"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          body: {
            backgroundColor: 'powderblue',
          },
          header : {
            backgroundColor : "#318CE7",
            color : 'white',
          }
        }}
      >
        <PaymentModel processedCart={processedCart} close={close} />
      </Modal>
      <Tooltip label="Place Order" position="right">
          <Image
            src={OrderOk}
            alt="place order"
            height={15}
            width={50}
            className="h-auto  mx-auto my-auto cursor-pointer ml-12"
            onClick={open}
          />
        </Tooltip>
    </>
  );
};

export default Payment;
