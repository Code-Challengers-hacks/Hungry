import { Rating } from "@mantine/core";

type Props = {
  item: Feedback;
};

const FeedbackListItem = (props: Props) => {
  const { item } = props;
  return (
    <div className="flex flex-col justify-start content-center align-middle w-full h-auto py-5">
      <div className="flex content-center align-middle w-full h-auto mb-1">
        <div className="flex justify-center content-center align-middle h-auto mr-3 font-extrabold">
          {item.username}
        </div>
        :
        <div className="flex justify-center content-center align-middle h-auto ml-3">
          <Rating value={item.rating} fractions={2} readOnly />
        </div>
      </div>
      <div className="flex justify-start content-center align-middle w-full h-auto italic pl-5 mt-1">
         {item.feedback}
      </div>
    </div>
  );
};

export default FeedbackListItem;
