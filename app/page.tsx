"use client";

import Image from "next/image";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chat() {
  const chatRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      initialMessages: [
        {
          id: "1;lk;lkm;lkm;klm",
          role: "system",
          content: "You are a support agent. You are here to help the user.",
        },
        {
          id: "2;okm;oklm;lokm;olkm;km",
          role: "system",
          content:
            "questions can only be answered using the function `search_knowledge_base`. for example, if the user asks `how do i change my password?`, you should call the function with search params `search_knowledge_base('change password')`",
        },
        {
          id: "2;ok;lokm;olkm;km",
          role: "system",
          content:
            "if no results are found, you should ask the user if they want to talk to a human support agent. for example, `sorry, i couldn't find anything. do you want to talk to a human support agent?`",
        },
        {
          id: "2;ok;lokm;tgtgolkm;km",
          role: "system",
          content:
            "never give the user a general response. the goal is to use the data from the api not to give a general response, but to give a specific response. it doesn't matter if the response is wrong, as long as it is specific.",
        },
      ],
    });

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleClear = () => setMessages([]);

  // scroll to bottom on new message
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <main className="mx-auto grid h-full w-[min(64rem,100svw)] max-w-5xl grid-rows-[1fr,auto]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full flex-col items-center gap-2 overflow-x-visible overflow-y-scroll"
        >
          <h1 className="flex gap-1 text-3xl font-bold">
            {/* <span>Welcome</span> */}
            <span className="flex bg-gradient-to-tl from-blue-600 to-rose-400 bg-clip-text text-transparent">
              Welcome
            </span>
          </h1>
          <p className="font-medium">
            Ask me anything about <span className="font-bold">Company X</span>!
            🤖
          </p>
          <div
            ref={chatRef}
            className="flex h-full w-full flex-col gap-6 overflow-x-visible overflow-y-scroll scroll-smooth p-4 py-8 text-center text-base font-medium"
          >
            {messages.map((message, i) =>
              message.role === "system" ? null : (
                <div
                  key={`message#${i}`}
                  className="flex h-max w-full text-left"
                  style={{
                    justifyContent:
                      message.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {message.role === "user" ? (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: [0.9, 1.1, 1] }}
                      transition={{ delay: 0.2, ease: "easeIn" }}
                      className="h-full max-w-[75%] rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 p-2 px-4 text-white elevation-1"
                    >
                      <ReactMarkdown children={message.content} />
                    </motion.p>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: [0.9, 1.1, 1] }}
                      transition={{ delay: 0.2, ease: "easeIn" }}
                      className="h-full max-w-[75%] rounded-2xl bg-white bg-opacity-60 p-2 px-4 elevation-1"
                    >
                      {/* <ReactMarkdown>{message.content}</ReactMarkdown> */}
                      <ReactMarkdown
                        children={message.content}
                        remarkPlugins={[remarkGfm]}
                        className="markdown prose"
                      />
                    </motion.p>
                  )}
                </div>
              )
            )}
            {messages[messages.length - 1]?.role === "user" && (
              <p className="animate-pulse px-4 text-left text-2xl font-bold">
                ...
              </p>
            )}
          </div>
        </motion.div>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="relative grid h-[6.5rem] w-full grid-cols-[auto,1fr] gap-2 px-4"
          autoComplete="off"
        >
          <motion.button
            initial={{ width: "3rem", y: 0 }}
            whileHover={{ width: "9rem" }}
            whileTap={{ y: 1.5 }}
            transition={{
              duration: 0.4,
              ease: "easeIn",
              y: { duration: 0.1, ease: "linear" },
            }}
            className="group flex h-12 flex-nowrap items-center justify-start gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 p-2 px-3 font-bold text-white"
            type="button"
            onClick={handleClear}
          >
            <Image
              src={"/broom.svg"}
              alt="message"
              width={16}
              height={16}
              className="h-6 w-6 shrink-0"
            />

            <span className="min-w-max shrink-0 opacity-0 transition-all group-hover:opacity-100">
              New Topic
            </span>
          </motion.button>
          <div className="relative">
            <Image
              src={"/message.svg"}
              alt="message"
              width={16}
              height={16}
              className="absolute top-4 left-4 h-4 w-4"
            />
            <motion.textarea
              initial={{ height: "3rem" }}
              animate={{ height: input ? "6rem" : "3rem" }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              name="prompt"
              placeholder="Ask me Anything..."
              value={input}
              // submit on enter
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // @ts-ignore
                  handleSubmit(e);
                }
              }}
              onChange={handleInputChange}
              className="flex w-full resize-none items-center justify-center rounded-[1.5rem] bg-white bg-opacity-60 p-3 px-12 outline-none elevation-1 placeholder:text-[#898989]"
              maxLength={200}
              required
            />
            {input && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-2 right-4 -translate-y-1/2 text-xs text-gray-500"
              >
                {input.length}/200
              </motion.span>
            )}
            {input && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                type="submit"
                className="absolute right-4 top-4 w-6 fill-blue-700"
              >
                <Image
                  src={"/send.svg"}
                  alt="message"
                  width={16}
                  height={16}
                  className="w-6"
                />
              </motion.button>
            )}
          </div>
        </motion.form>
      </AnimatePresence>
    </main>
  );
}
