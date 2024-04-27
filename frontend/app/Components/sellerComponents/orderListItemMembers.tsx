import React from "react";

type Props = {
  userItem: UserItem;
};

const OrderListItemMembers = (props: Props) => {
  const { userItem } = props;

  return (
    <div className="flex justify-between align-middle content-center w-full h-fit my-1">
      <div className="flex justify-between align-middle content-center w-full h-full">
        <div className="w-1/5 flex justify-start align-middle content-center">
          {userItem.name}
        </div>
        <div className="flex justify-center align-middle content-center w-1/5 h-fit pr-6">
            {userItem.quantity}
        </div>
        <div className="w-1/5 flex justify-center align-middle content-center pl-10">
          ₹ {userItem.price}
        </div>
        <div className="w-1/5 flex justify-end align-middle content-center">
          ₹ {userItem.price * userItem.quantity}
        </div>
      </div>
    </div>
  );
};

export default OrderListItemMembers;
