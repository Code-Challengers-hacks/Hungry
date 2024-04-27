"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import PriceChangeForm from "./priceChangeForm";
import Image from "next/image";
import Change from "@/public/currency.png";
import Update from "@/public/update.png";

type Props = {
  item: MenuItem;
};

const ChangeItemPrice = (props: Props) => {
  const { item } = props;

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Update Price"
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
        <PriceChangeForm item={item} close={close} />
      </Modal>
      <Tooltip label="Change Price" position="left">
        <Image src={Update} alt="add" width={24} height={24} onClick={open} />
      </Tooltip>
    </>
  );
};

export default ChangeItemPrice;
