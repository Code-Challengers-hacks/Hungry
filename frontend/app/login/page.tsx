"use client";

import { Button, Group, PasswordInput, Radio } from "@mantine/core";
import { Input } from "@mantine/core";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { NavBar } from "../Components/NavBar";
import "./styles.css";
import { AuthContext } from "../Context/authContext";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import { Hourglass } from "react-loader-spinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mode, setMode] = useState("user");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext) || {};

    useEffect(() => {
      const  data = JSON.parse(localStorage.getItem('Auth') as string) 
  
      if (data) {
        console.log(data);
          dispatch ? dispatch({ type: 'LOGIN', payload: { name : data.name, mode : data.mode } }) : {}
          if(data.mode == "User")
              router.push(`/user/${data.name}`)
          else if(data.mode == "Seller")
              router.push(`/seller/${data.name}`)
      }
  }, [])

  const handleLogin = () => {
    setLoading(true);
    let flag = 0;
    if (username == "") {
      setUsernameError("Enter a valid username");
      flag++;
      setLoading(false);
    }
    const checkEmail = validator.isEmail(email);
    if (email == "" || !checkEmail) {
      setEmailError("Enter a valid email");
      flag++;
      setLoading(false);
    }
    if (password == "") {
      setPasswordError("Enter a valid password");
      flag++;
      setLoading(false);
    }
    if (flag == 0) {
      if (mode == "user") {
        fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            mode: "User",
          }),
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
            setLoading(false);
            console.log(data);
            toast.success(username + " successfully logged in!", {
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
            localStorage.setItem(
              "Auth",
              JSON.stringify({
                name: data.user.name,
                email: data.user.email,
                id: data.user.id,
                token: data.token,
                mode: "User",
              })
            );
            dispatch
              ? dispatch({
                  type: "LOGIN",
                  payload: { name: data.user.name, mode: "user" },
                })
              : {};
            router.push(`/user/${data.user.name}`);
            setUsername("");
            setEmail("");
            setPassword("");
            setMode("user");
          })
          .catch((error) => {
            setLoading(false);
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
            setUsername("");
            setEmail("");
            setPassword("");
            setMode("user");
          });
      } else if (mode == "seller") {
        fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            mode: "Seller",
          }),
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
            setLoading(false);
            console.log(data);
            toast.success(username + " successfully logged in!", {
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
            localStorage.setItem(
              "Auth",
              JSON.stringify({
                name: data.seller.name,
                email: data.seller.email,
                id: data.seller.id,
                token: data.token,
                mode: "Seller",
              })
            );
            dispatch
              ? dispatch({
                  type: "LOGIN",
                  payload: { name: data.seller.name, mode: "seller" },
                })
              : {};
            console.log(data.seller.name);
            router.push(`/seller/${data.seller.name}`);
            setUsername("");
            setEmail("");
            setPassword("");
            setMode("seller");
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.messgae, {
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
            setUsername("");
            setEmail("");
            setPassword("");
            setMode("user");
          });
      }
    }
  };

  return (
    <div className="w-full h-screen text-white bg-black ">
      <NavBar />
      <div className="w-2/5 h-4/5 flex justify-center mx-auto content-center align-middle flex-col px-8 mb-2 pb-3 text-2xl text-center border-5 rounded-3xl border-green-500 shadow-2xl shadow-green-500/70 bg-blend-multiply text-">
        <div className="flex w-full h-80 text-4xl justify-start content-center flex-col pb-2 pt-10 mb-2 login_heading hero glitch layers" data-text="LOGIN">
          LOGIN
        </div>
        <Radio.Group
          name="Login as"
          label="Login Mode"
          description="Select your Login mode"
          className="flex w-full h-30 justify-start content-center align-middle flex-col text-left pt-2 pb-2 mt-2"
          withAsterisk
        >
          <Radio.Group
            mt="xs"
            className="border-b-2 pb-4 border-b-green-500 flex justify-start align-middle content-center"
            value={mode}
            onChange={setMode}
          >
            <Radio value="user" label="User" className="inline-block mr-5" />
            <Radio value="seller" label="Seller" className="inline-block" />
          </Radio.Group>
        </Radio.Group>
        <div className="flex w-fill h-60 justify-center content-center align-middle flex-col text-left pt-8 pb-5 mt-10 mb-5">
          <Input.Wrapper
            label="Username"
            description="Please enter your username"
            error={usernameError}
            withAsterisk
            className="mb-1"
          >
            <Input
              placeholder="Jhon Doe"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
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
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Email"
            description="Please enter your email"
            error={emailError}
            withAsterisk
            className="mb-2 mt-2"
          >
            <Input
              placeholder="jhondoe@hungry.dev"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
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
            />
          </Input.Wrapper>
          <PasswordInput
            label="Password"
            description="Please enter your password"
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            error={passwordError}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            withAsterisk
            className="mb-1"
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
          />
        </div>
        <div className="h-10 mt-16 mb-2">
          {loading ? (
            <Hourglass
              visible={true}
              height="40"
              width="40"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass="flex justify-center align-middle content-center w-full"
              colors={["#306cce", "#72a1ed"]}
            />
          ) : (
            <Button fullWidth variant="filled" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
        <p className="text-sm flex text-center justify-center content-center mb-2">
          Do not have an account? ,{" "}
          <Link
            href="/register"
            className="text-decoration-line: underline text-blue-500"
          >
            Register
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
