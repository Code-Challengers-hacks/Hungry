"use client";

import { NavBar } from "@/app/Components/NavBar";
import MenuCard from "@/app/Components/sellerComponents/menuCard";
import SellerOrders from "@/app/Components/sellerComponents/sellerOrders";
import UsersList from "@/app/Components/sellerComponents/usersList";
import FeedbackList from "@/app/Components/sellerComponents/feedbackList";
import "./styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";

const SellerPage = () => {
  const seller: localStore = JSON.parse(localStorage.getItem("Auth") || "");
  const sellerName = seller.name

  class TextScramble {
    private el: HTMLElement;
    private chars: string;
    private queue: {
      from: string;
      to: string;
      start: number;
      end: number;
      char?: string;
    }[];
    private frame: any;
    private frameRequest: any;
    private resolve: any;

    constructor(el: HTMLElement) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}—=+*^?#________";
      this.queue = [];
      this.update = this.update.bind(this);
    }

    setText(newText: string): Promise<void> {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise<void>((resolve) => (this.resolve = resolve));

      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 25);
        const end = start + Math.floor(Math.random() * 25);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();

      return promise;
    }

    private update(): void {
      let output = "";
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        const { from, to, start, end } = this.queue[i];
        let char = this.queue[i].char;

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += '<span class="dud">' + char + "</span>";
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    private randomChar(): string {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const phrases: string[] = [
    "Welcome " + sellerName + "!", 
    "You are Awesome",
    "Share Your Delicious Creations!",
    "Create Culinary Masterpieces!",
    "Offer Irresistible Flavors!",
    "Join the Culinary Revolution!"
  ];

  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const fx = new TextScramble(textRef.current);
      let counter = 0;
      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, 2500);
        });
        counter = (counter + 1) % phrases.length;
      };

      next();
    }
  }, []);
  
  return (
      <div className="w-full h-full bg-black text-white">
        <NavBar />
        <div className="flex flex-col w-full p-5 h-full flex-wrap">
            <div className="text-4xl flex justify-center content-center align-middle w-full h-30 welcomeSeller" ref={textRef}>
              {/* Welcome back {seller ? sellerName : "Seller"} */}
            </div>
            <div className="flex w-full justify-center align-middle content-center p-5 mt-5">
              <div className="flex flex-col justify-center align-middle content-center w-2/5 border-4 m-3 rounded-xl border-indigo-700 shadow-2xl shadow-purple-700/65">
                <div className="text-2xl flex justify-start content-center text-left pl-5 pt-2 font-extrabold underline text-purple-600">
                  MenuCard
                </div>
                <div className="flex justify-center content-center w-full p-5 overflow-auto sellerSegment">
                  <MenuCard />
                </div>
              </div>
              <div className="flex flex-col justify-center align-middle content-center w-3/5 border-4 m-3 rounded-xl border-indigo-700 shadow-2xl shadow-purple-700/65">
                <div className="text-2xl flex justify-start content-center text-left pl-5 pt-2 font-extrabold underline text-purple-600">
                  Orders
                </div>
                <div className="flex justify-center content-center  w-full p-5 overflow-auto sellerSegment">
                  <SellerOrders />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center align-middle content-center p-5 mt-5 ">
              <div className="flex flex-col justify-center align-middle content-center w-2/5 border-4 m-3 rounded-xl border-indigo-700 shadow-2xl shadow-purple-700/65">
                <div className="text-2xl flex justify-start content-center text-left pl-5 pt-2 font-extrabold underline text-purple-600">
                  Users
                </div>
                <div className="flex justify-center content-center w-full p-5 overflow-auto sellerSegment2">
                  <UsersList  />
                </div>
              </div>

              <div className="flex flex-col justify-center align-middle content-center w-3/5 border-4 m-3 rounded-xl border-indigo-700 shadow-2xl shadow-purple-700/65">
                <div className="text-2xl flex justify-start content-center text-left pl-5 pt-2  font-extrabold underline text-purple-600">
                  Feedback
                </div>
                <div className="flex justify-center content-center w-full p-5 overflow-auto sellerSegment2">
                  <FeedbackList />
                </div>
              </div>
            </div>
            <ToastContainer className={'z-50'} />
          </div>
      </div>
  );
};

export default SellerPage;
