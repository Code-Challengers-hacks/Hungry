"use client";

import { FeedbackContext } from "@/app/Context/feedbackContext";
import {
  Button,
  FileInput,
  NumberInput,
  Rating,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useContext, useState } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {
  close: () => void;
}

const AddFeedbackForm = (props :Props) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(5);
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");
  const user: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const userName = user.name;
  const { dispatch } = useContext(FeedbackContext) || {};

  const handleSubmit = async (e: any) => {
    let flag = 0;
    e.preventDefault();
    if (name == "") {
      setNameError("Enter a food item's name");
      flag++;
    }
    if (desc == "") {
      setDescError("Give a valid feeedback");
      flag++;
    }
    if (flag == 0) {
      try {
      const response = await fetch(`http://localhost:4000/api/user/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({ name, desc, rating, userName }),
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
        dispatch ? dispatch({ type: "CREATE_FEEDBACK", payload: data }) : {};
          toast.success("Feedback sent to " + name + " successfully!", {
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
          props.close();
          setName("");
          setDesc("");
          setNameError("");
          setDescError("");
          setRating(5);
      })
      } catch (error: any) {
        console.log(error.message);
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
        props.close();
      }
    }
  };

  return (
    <div className="flex flex-col justify-center content-center align-middle w-full h-fit p-3">
      <div className="flex justify-start content-center align-middle w-full h-auto mb-2">
        Enter your feedback :
      </div>
      <div>
        <TextInput
          label="Name"
          description="Enter seller's name to whom you want to give feedback"
          placeholder="seller"
          className="my-3"
          onChange={(e) => setName(e.target.value)}
          withAsterisk
          styles={{
            input: {
              backgroundColor: "black",
              color: "white",
              borderBottomColor: "blue",
              borderBottomWidth: "3.5px",
              borderTopColor: "black",
              borderLeftColor: "black",
              borderRightColor: "black",
            },
          }}
          error={nameError}
        />
        <Textarea
          label="Feeedback"
          description="Enter your feedback (max 15 words) "
          placeholder="Awesome food! Loved it!"
          className="my-3"
          onChange={(e) => setDesc(e.target.value)}
          withAsterisk
          styles={{
            input: {
              backgroundColor: "black",
              color: "white",
              borderBottomColor: "blue",
              borderBottomWidth: "3.5px",
              borderTopColor: "black",
              borderLeftColor: "black",
              borderRightColor: "black",
            },
          }}
          error={descError}
        />
        <div className="my-3">
          <div className="flex justify-start content-center align-middle w-full text-sm font-medium">
            Rating
          </div>
          <div className="flex justify-start content-center align-middle w-full text-xs font-extralightlight my-1 text-stone-600">
            Give your rating{" "}
          </div>
          <Rating
            fractions={2}
            defaultValue={5}
            size="lg"
            onChange={(value) => setRating(Number(value))}
          />
        </div>
        <Button
          fullWidth
          className="flex justify-center align-middle content-center w-full h-auto mt-5"
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddFeedbackForm;
