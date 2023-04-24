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
        listen: ".recieved"
    },
    notificationRemoved: {
        channel: "notificationRemoved.",
        listen: ".removed"
    },
    postReaction: {
        channel: "postReaction.",
        listen: ".reaction"
    }
}

export { ChannelList }