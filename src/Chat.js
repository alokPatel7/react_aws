import React, { useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  MessageList,
  TypingIndicator,
  MessageSeparator,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { createChannel } from "./chimeAPI";
import appConfig from "./aws_config";

export default function Chat() {
  let [textValue, setTextValue] = useState("");
  const setMessageInputValue = (val) => {
    setTextValue(val);
  };
  const sendMessageInputValue = async (val) => {
    console.log("this is send callesd");
    const channel = await createChannel(
      appConfig.appInstanceArn,
      null,
      "TEST channesl 0001",
      "UNRESTRICTED",
      "PRIVATE",
      "9fd58a7e-59e7-41b7-a4d2-1b595664cca6"
    );
    console.log("channel response", channel);

    setTextValue("");
  };

  const onClickConversationList = () => {
    console.log("yy");
  };

  return (
    <div>
      <MainContainer style={{ height: "100vh" }}>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            <Conversation
              name="Lilly"
              lastSenderName="Lilly"
              info="Yes i can do it for you"
            >
              <Avatar
                src={
                  "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
                }
                name="Lilly"
                status="available"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              src={
                "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
              }
              name="Zoe"
            />
            <ConversationHeader.Content
              userName="Zoe"
              info="Active 10 mins ago"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
          // typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            <MessageSeparator content="Saturday, 30 November 2019" />

            <Message
              model={{
                message: "Hello my friend",
                sentTime: "15 mins ago",
                sender: "Zoe",
                direction: "incoming",
                position: "single",
              }}
            >
              <Avatar
                src={
                  "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
                }
                name="Zoe"
              />
            </Message>

            {/* <Avatar
              src={
                "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
              }
              name="Zoe"
            /> */}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={textValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={() => sendMessageInputValue("")}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
