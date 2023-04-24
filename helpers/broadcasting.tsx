import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { fetchCookie, isAuthenticated } from './helpers';


function listen(callBack: (payload: any) => void, channel: string, event: string, isPrivate: boolean = false) {
    window.Echo.channel(channel).listen(event, (payload: any) => {
        callBack(payload);
    });

    return function cleanUp() {
        window.Echo.channel(channel).stopListening(event, callBack);
        window.Echo.leaveChannel(channel);
    };
}

type Options = {
    channel: string,
    event: string,
    callBack: (payload: any) => void,
    isPrivate: boolean,
};

const channelOptions = {
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
    authEndpoint: process.env.NEXT_PUBLIC_BACKEND_CHANNEL_AUTH
  }

function createSocketConnection() {
    if (!window.Echo) {
      window.Echo = new Echo({
          ...channelOptions,
          client: new Pusher(channelOptions.key, channelOptions)
      });

      axios.defaults.headers.common['X-Socket-Id'] = window.Echo.socketId();
    }

    if (typeof window.Echo.options.auth === 'undefined' && isAuthenticated()) {
        window.Echo.auth = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + fetchCookie(),
            }
          }
    }
  }

export const useSocket = ({ channel, event, callBack, isPrivate = false }: Options) => {
  useEffect(() => {
    createSocketConnection();
    return listen(callBack, channel, event, isPrivate);
  });
};