"use client";
import axios from "axios";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import z from "zod";
import { text } from "stream/consumers";
import { register } from "module";

const page = ({ params }: any) => {
  const [isSending, setIsSending] = useState(false);
  const [messageData, setIsmessageData] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (msg: string) => {
    form.setValue("content", msg, { shouldDirty: true, shouldValidate: true });
  };

  const {
    completion,
    complete,
    isLoading: isSuggestingFlag,
    input,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialInput:
      "What's your favorite movie?||Do you have any pets?||What's your dream job?",
    streamProtocol: "data",
    onError(error: any) {
      toast.error(error?.error?.message || "API error");
    },
  });

  const specialChar = "||";
  const breakMessage = (AImessage: string) => {
    return AImessage.split(specialChar);
  };

  const { username }: any = React.use(params);

  const sendMessages = async (data: z.infer<typeof messageSchema>) => {
    setIsSuggesting(true);
    try {
      const response = await axios.post("/api/send-message", {
        content: messageContent,
        username: username,
      });
      setIsmessageData(response.data.messages);
      form.reset({ ...form.getValues(), content: "" });
      toast("Success", {
        description: <p className="text-black">Message send Successfully</p>,
      });
    } catch (error) {
      console.error("Message is not sending successfully due to", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description: (
          <span className="text-black">
            {axiosError.response?.data.message}
          </span>
        ),
      });
    } finally {
      setIsSending(false);
    }
  };

  const SuggestMessages = async () => {
    setIsSuggesting(true);
    try {
      complete("");
      if (completion.length && completion.length > 0) {
        toast("AI Response", {
          description: <p className="text-black">{completion}</p>,
        });
        toast("AI Response", { description: "No message received yet" });
      }
      setIsSuggesting(false);
    } catch (error) {
      console.error("Error in suggesting messages", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error in Suggesting Messages", {
        description: (
          <p className="text-black">
            {axiosError.response?.data.message || "Error"}
          </p>
        ),
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 lg:text-5xl mb-2">
            Public Messages
          </h1>
          <p className="text-gray-500">Craft your best anonymous thoughts</p>
        </div>

        <div className="grid w-full gap-3 mb-6">
          <Label htmlFor="message" className="text-gray-700 font-semibold">
            Your message
          </Label>
          <Textarea
            placeholder="Type your message here..."
            {...form.register("content")}
            className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex gap-3 mb-8">
          <form onSubmit={form.handleSubmit(sendMessages)}>
            <Button
              type="submit"
              className="flex-1 bg-black hover:bg-black text-white rounded-lg py-2 font-medium shadow-md transition-all"
            >
              Submit Now
            </Button>
          </form>

          <Button
            disabled={isSuggestingFlag}
            onClick={SuggestMessages}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-2 font-medium shadow-sm transition-all"
          >
            Suggest Messages
          </Button>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Click on a message below to select it
          </p>
          <div className="mt-4 flex flex-col justify-center items-center gap-4 justify-items-center">
            {breakMessage.length > 0 ? (
              breakMessage(completion).map(
                (breakMessage: any, index: number) => (
                  <Card className="w-full sm:w-[500px]" key={index}>
                    <CardHeader>
                      <CardTitle>Find your suggesting messages here</CardTitle>
                      <CardDescription>
                        Select any message you want and become a mysterous
                        wizard by sending it
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <button className="flex flex-col gap-3">
                        {breakMessage ? (
                          <span className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                            {breakMessage}
                          </span>
                        ) : (
                          input.split("||").map((msg, i) => (
                            <span
                              onClick={() => handleMessageClick(msg)}
                              key={i}
                              className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm text-left"
                            >
                              {msg}
                            </span>
                          ))
                        )}
                      </button>
                    </CardContent>
                  </Card>
                )
              )
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No messages to display.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
