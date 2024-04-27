type Props = {
  item: SellerUser;
};

const UserListItem = (props: Props) => {
  const { item } = props;
  return (
      <div className="flex justify-start content-center align-middle w-full h-auto py-5">
        <div className="text-lg font-extrabold">{item.username} : </div>
        <div className="text-lg font-extralight italic">{item.email}</div>
      </div>
  );
};

export default UserListItem;
