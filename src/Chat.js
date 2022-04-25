import React, { useEffect, useState } from "react";
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
import {
  createChannel,
  describeChannel,
  getChannelMessage,
  listChannelFlows,
  listChannelMembershipsForAppInstanceUser,
  listChannelMessages,
  listChannelModerators,
  listChannels,
  listChannelsForAppInstanceUser,
  MessageType,
  Persistence,
  sendChannelMessage,
} from "./chimeAPI";
import appConfig from "./aws_config";
import {
  userSignIn,
  getAwsCredentialsFromCognito,
} from "./providers/AuthProvider";
import mergeArrayOfObjects from "./utilities/mergeArray";

export default function Chat() {
  let [textValue, setTextValue] = useState("");
  let [channelList, setCannelList] = useState([]);
  let [userId, setuserId] = useState();
  const [channelMessageList, setChannelMessage] = useState([]);
  const [activeChannelArn, setActiveChannelArn] = useState("");
  const [activeChannelDetails, setCurrentActiveChannel] = useState([]);

  const messagingUserArn = `${appConfig.appInstanceArn}/user/${userId}`;
  const [activeChannelModerators, setActiveChannelModerators] = useState([]);
  const setMessageInputValue = (val) => {
    setTextValue(val);
  };

  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userId"));
    setuserId(userId);
    if (!userId) return;
    const fetchChannels = async () => {
      const isAuthenticated = await getAwsCredentialsFromCognito();
      const userChannelMemberships =
        await listChannelMembershipsForAppInstanceUser(userId);
      const userChannelList = userChannelMemberships.map(
        (channelMembership) => channelMembership.ChannelSummary
      );
      const publicChannels = await listChannels(
        appConfig.appInstanceArn,
        userId
      );

      setCannelList(
        mergeArrayOfObjects(userChannelList, publicChannels, "ChannelArn")
      );

      // console.log("this is user", user);
      // console.log("channels list", channels);
      // console.log("channel response", isAuthenticated);
      // await publishStatusToAllChannels();
    };
    fetchChannels();
    // const getData = async () => {
    //   const user = await userSignIn("Mark", "Test@1mark");
    //   const isAuthenticated = await getAwsCredentialsFromCognito();
    //   const userId = JSON.parse(localStorage.getItem("userId"));
    //   let channels = await listChannelMembershipsForAppInstanceUser(userId);
    //   channels = channels.map((ch) => ch.ChannelSummary);
    //   setCannelList(channels);
    //   console.log("this is user", user);
    //   console.log("channels list", channels);
    //   console.log("channel response", isAuthenticated);
    // };
    // getData();
  }, []);

  const sendMessageInputValue = async () => {
    console.log("this is send callesd", textValue);
    const member = {
      userId: JSON.parse(localStorage.getItem("userId")),
      username: "Mark",
    };
    const sendMessageResponse = await sendChannelMessage(
      activeChannelArn,
      textValue,
      Persistence.PERSISTENT,
      MessageType.STANDARD,
      member
    );
    console.log("sendMessageResponse ksjdkjhks", sendMessageResponse);
    // setTextValue("");
    const newMessages = await listChannelMessages(activeChannelArn, userId);
    const channel = await describeChannel(activeChannelArn, userId);
    setActiveChannelModerators(channel);
    setChannelMessage(newMessages.Messages);
    // if (sendMessageResponse.response.Status.Value == "SENT") {
    //   const sentMessage = await getChannelMessage(
    //     activeChannelArn,
    //     member,
    //     sendMessageResponse.response.MessageId
    //   );
    //   const newMessages = [...channelMessageList, sentMessage];
    //   console.log("resp", newMessages);
    //   // setChannelMessage(newMessages);
    // }
  };

  const onSelectUserList = async (channelArn) => {
    setActiveChannelArn(channelArn);
    // if (activeChannel.ChannelArn === channelArn) return;
    let mods = [];
    setActiveChannelModerators([]);
    try {
      mods = await listChannelModerators(channelArn, userId);
      setActiveChannelModerators(mods);
    } catch (err) {
      console.error("ERROR", err);
    }

    const isModerator =
      mods?.find((moderator) => moderator.Moderator.Arn === messagingUserArn) ||
      false;

    // Assessing user role for given channel
    // userPermission.setRole(isModerator ? "moderator" : "user");

    const newMessages = await listChannelMessages(channelArn, userId);
    const channel = await describeChannel(channelArn, userId);
    setActiveChannelModerators(channel);
    setChannelMessage(newMessages.Messages);
    // console.log("describe chnnel", channel);
    // console.log("channel new Message", newMessages);
  };

  return (
    <div>
      <MainContainer style={{ height: "100vh" }}>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            {channelList.map((ch) => (
              <Conversation
                key={ch.ChannelArn}
                name={ch.Name}
                lastSenderName="Lilly"
                info="Yes i can do it for you"
                onClick={() => onSelectUserList(ch.ChannelArn)}
              >
                <Avatar
                  src={
                    "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
                  }
                  name="Lilly"
                  status="available"
                />
              </Conversation>
            ))}
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
              userName={activeChannelModerators.Name}
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

            {channelMessageList.map((msg) => (
              <Message
                key={msg.MessageId}
                model={{
                  message: msg.Content,
                  sentTime: "15 min ago",
                  sender: msg.Sender.Name,
                  direction: "incoming",
                  position: "single",
                }}
              >
                <Avatar
                  src={
                    "https://chatscope.io/storybook/react/static/media/emily.d34aecd9.svg"
                  }
                  name={msg.Sender.Name}
                />
              </Message>
            ))}

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
            onSend={() => sendMessageInputValue()}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
