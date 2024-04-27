"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import QuantityChangeForm from "./quantityChangeForm";
import Image from "next/image";
import Change from "@/public/currency.png";
import Update from "@/public/update.png";

type Props = {
  item: UserItem;
};

const ChangeItemQuantity = (props: Props) => {
  const { item } = props;

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Update Quantity"
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
        <QuantityChangeForm item={item} close={close} />
      </Modal>
      <Tooltip label="Change Quantity" position="right">
        <Image src={Update} alt="add" width={20} height={10} onClick={open} />
      </Tooltip>
    </>
  );
};

export default ChangeItemQuantity;
