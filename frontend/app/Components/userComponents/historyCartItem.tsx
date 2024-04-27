type Props = {
  item: CurrentCart;
};

const HistoryCartItem = (props: Props) => {
  const { item } = props;
  return (
      <div className="flex flex-col justify-center align-middle content-center w-full h-full p-5">
        <div className="flex justify-between align-middle content-center w-full h-full">
          <div className="font-extrabold text-xl pl-2">{item.adminName}</div>
          <div className="pr-2">Total : ₹ {item.total}</div>
        </div>
        <div className="flex flex-col justify-center align-middle content-normal w-full h-fit my-3 border-2 border-blue-700 p-5 py-3 rounded-xl">
          <div className="flex justify-between align-middle content-center w-full h-fit my-2 border-b-2 border-b-blue-700 pb-2">
            <div className="font-extrabold w-1/3 flex justify-start content-center align-middle text-center">
              Item
            </div>
            <div className="font-extrabold w-1/3 flex justify-center content-center align-middle text-center">
              Quantity
            </div>
            <div className="font-extrabold w-1/3 flex justify-end content-center align-middle text-center">
              Price
            </div>
          </div>
          {item.items.map((userItem) => (
            <div
              key={userItem.id}
              className="flex justify-between align-middle content-center w-full h-fit my-1"
            >
              <div className="w-1/3 flex justify-start align-middle content-center">
                {userItem.name}
              </div>
              <div className="flex justify-center align-middle content-center w-1/3">
                {userItem.quantity}
              </div>
              <div className="w-1/3 flex justify-end align-middle content-center">
                ₹ {userItem.price}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default HistoryCartItem;
