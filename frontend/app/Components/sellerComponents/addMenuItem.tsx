'use client'

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import AddMenuForm from "./addMenuForm";
import Image from "next/image";
import Add from '@/public/add.svg';

const AddMenuItem = () => {
  

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add Menu Item"
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
        <AddMenuForm close={close} />
      </Modal>

      <Button onClick={open}>
        <Image src={Add} alt="add" width={25} height={25}  /> 
      </Button>
    </>
  );
};

export default AddMenuItem;
