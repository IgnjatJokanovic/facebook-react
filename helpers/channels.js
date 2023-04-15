var ChannelList = {
    friends: {
        channel: "friendRequestSent.",
        listen: ".recieved"
    },
    friendCanceled: {
        channel: "friendRequestCanceled.",
        listen: ".canceled"
    },
    notification: {
        channel: "notification.",
        listen: ".canceled"
    },
    postReaction: {
        channel: "postReaction.",
        listen: ".recieved"
    }
}

export { ChannelList }