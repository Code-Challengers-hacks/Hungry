"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import UserQuantity from "./userQuantityForm";
import Image from "next/image";
import Add from "@/public/add.png";

type Props = {
  item: MenuItem;
};

const GetItemQuantity = (props: Props) => {
  const { item } = props;

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Quantity"
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
        <UserQuantity item={item} close={close} />
      </Modal>
      <Tooltip label="Add Item" position="left">
        <Image src={Add} alt="add" width={30} height={30} onClick={open} />
      </Tooltip>
    </>
  );
};

export default GetItemQuantity;
