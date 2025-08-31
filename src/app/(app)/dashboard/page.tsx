"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchems";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserDashboard = () => {
  const testimonials = [
    {
      quote: "Dark Mode DMs — Speak freely, stay unseen",
      name: "Ava Night",
      designation: "Early Beta User",
      src: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote: "Shadow Chat — Say more, show less",
      name: "Liam Cross",
      designation: "Community Member",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote: "Ghost Messages — Your voice, no face",
      name: "Noah Vale",
      designation: "Anonymous Advocate",
      src: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote: "Masked Mailbox — Secrets in, identity out",
      name: "Mia Veil",
      designation: "Private Messaging Enthusiast",
      src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote: "Whisper Network — Anonymous words, real impact",
      name: "Ethan Shade",
      designation: "Longtime User",
      src: "https://images.unsplash.com/photo-1603415526960-f7e0328e61b5?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = async (messageId: string) => {
    console.log("It is triggiring");

    try {
      await axios.delete<ApiResponse>(`/api/delete-messages/${messageId}`);
      setMessages(messages.filter((message) => message._id !== messageId));
      toast("Message deleted Successfully");
    } catch (error) {
      console.log("The reason why errror is not deleting is this" , error);
      
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error in deleting Message", {
        description: (
          <span className="text-black">
            {axiosError.response?.data.message}
          </span>
        ),
      });
    }
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages") as boolean;

  const fetchAcceptMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      console.log("Not hitting the route");

      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: (
          <span style={{ color: "black" }}>
            {axiosError.response?.data.message ||
              "Failed to fetch message setting"}
          </span>
        ),
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log(response.data.message);

        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast("Error", {
          description: (
            <span style={{ color: "black" }}>
              {axiosError.response?.data.message ||
                "Failed to fetch message setting"}
            </span>
          ),
        });
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      console.error("This is why failed to fetch message setting", error);

      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: (
          <span style={{ color: "black" }}>
            {axiosError.response?.data.message ||
              "Failed to fetch message setting"}
          </span>
        ),
      });
    }
  };

  if (!session || !session.user) {
    return <AnimatedTestimonials testimonials={testimonials} />;
  }

  const { username } = session?.user as User;
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  console.log(baseURL);
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipBoard = async () => {
    await navigator.clipboard?.writeText(profileURL);
    toast("URL copied", {
      description: <span className="text-black">URL copied to clipboard</span>,
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accepting Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message , index) => (
            <CardContainer className="inter-var"
            key={index}>
              <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  See Below you get your Message
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  {message.content}
                </CardItem>
                <div className="flex justify-between items-center mt-20">
                  <button
                    onClick={() => handleDeleteMessage(message._id as string)}
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </CardBody>
            </CardContainer>
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
