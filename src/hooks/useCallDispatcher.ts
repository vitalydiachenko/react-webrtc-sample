import { SOCKET_ENDPOINT, SocketEvent } from 'consts';
import { Reducer, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import * as io from 'socket.io-client';

enum CallDispatcherActions {
  AddUser = 'ADD_USER',
  RemoveUser = 'REMOVE_USER',
  SetActiveUser = 'SET_ACTIVE_USER',
  SetLocalStream = 'SET_LOCAL_STREAM',
  SetLocalVideoNode = 'SET_LOCAL_VIDEO_NODE',
  SetRemoteStream = 'SET_REMOTE_STREAM',
  SetRemoteVideoNode = 'SET_REMOTE_VIDEO_NODE',
  UpdateUsers = 'UPDATE_USERS',
}

interface ICallDispatcherAction<PayloadType = any> {
  type: CallDispatcherActions;
  payload: PayloadType;
}

export interface ICallDispatcherState {
  activeUser: string;
  localStream: MediaStream | null;
  localVideoNode: HTMLVideoElement | null;
  remoteStream: MediaStream | null;
  remoteVideoNode: HTMLVideoElement | null;
  users: string[];
}

export interface ICallDispatcherHook {
  callUser: (user: string) => Promise<void>;
  setActiveUser: (user: string) => void;
  setLocalVideoNode: (node: HTMLVideoElement | null) => void;
  setRemoteVideoNode: (node: HTMLVideoElement | null) => void;
  state: ICallDispatcherState;
}

function addUser(user: string): ICallDispatcherAction<{ user: string }> {
  return {
    type: CallDispatcherActions.AddUser,
    payload: { user },
  };
}

function removeUser(user: string): ICallDispatcherAction<{ user: string }> {
  return {
    type: CallDispatcherActions.RemoveUser,
    payload: { user },
  };
}

function setActiveUser(user: string): ICallDispatcherAction<{ user: string }> {
  return {
    type: CallDispatcherActions.SetActiveUser,
    payload: { user },
  };
}

function setLocalStream(stream: MediaStream): ICallDispatcherAction<{ stream: MediaStream }> {
  return {
    type: CallDispatcherActions.SetLocalStream,
    payload: { stream },
  };
}

function setLocalVideoNode(
  node: HTMLVideoElement | null,
): ICallDispatcherAction<{ node: HTMLVideoElement | null }> {
  return {
    type: CallDispatcherActions.SetLocalVideoNode,
    payload: { node },
  };
}

function setRemoteStream(stream: MediaStream): ICallDispatcherAction<{ stream: MediaStream }> {
  return {
    type: CallDispatcherActions.SetRemoteStream,
    payload: { stream },
  };
}

function setRemoteVideoNode(
  node: HTMLVideoElement | null,
): ICallDispatcherAction<{ node: HTMLVideoElement | null }> {
  return {
    type: CallDispatcherActions.SetRemoteVideoNode,
    payload: { node },
  };
}

function updateUsers(users: string[]): ICallDispatcherAction<{ users: string[] }> {
  return {
    type: CallDispatcherActions.UpdateUsers,
    payload: { users },
  };
}

function reducer(state: ICallDispatcherState, action: ICallDispatcherAction): ICallDispatcherState {
  const { type, payload } = action;

  switch (type) {
    case CallDispatcherActions.AddUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        users: state.users.includes(user) ? state.users : state.users.concat([user]),
      };
    }

    case CallDispatcherActions.RemoveUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        activeUser: state.activeUser === user ? initialState.activeUser : state.activeUser,
        users: state.users.filter(currentUser => currentUser !== user),
      };
    }

    case CallDispatcherActions.SetActiveUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        activeUser: user,
      };
    }

    case CallDispatcherActions.SetLocalStream: {
      const { stream }: { stream: MediaStream | null } = payload;

      return {
        ...state,
        localStream: stream,
      };
    }

    case CallDispatcherActions.SetLocalVideoNode: {
      const { node }: { node: HTMLVideoElement | null } = payload;

      return {
        ...state,
        localVideoNode: node,
      };
    }

    case CallDispatcherActions.SetRemoteStream: {
      const { stream }: { stream: MediaStream } = payload;

      return {
        ...state,
        remoteStream: stream,
      };
    }

    case CallDispatcherActions.SetRemoteVideoNode: {
      const { node }: { node: HTMLVideoElement | null } = payload;

      return {
        ...state,
        remoteVideoNode: node,
      };
    }

    case CallDispatcherActions.UpdateUsers: {
      const { users }: { users: string[] } = payload;

      return {
        ...state,
        activeUser: users.includes(state.activeUser) ? state.activeUser : initialState.activeUser,
        users: [...users],
      };
    }

    default:
      return state;
  }
}

const initialState: ICallDispatcherState = {
  activeUser: '',
  localStream: null,
  localVideoNode: null,
  remoteStream: null,
  remoteVideoNode: null,
  users: [],
};

let isAlreadyCalling = false;

let peerConnection: RTCPeerConnection | null = null;

function useCallDispatcher(): ICallDispatcherHook {
  const socket: SocketIOClient.Socket = useMemo<SocketIOClient.Socket>(
    () => io(SOCKET_ENDPOINT),
    [],
  );

  const [state, dispatch] = useReducer<Reducer<ICallDispatcherState, ICallDispatcherAction>>(
    reducer,
    initialState,
  );

  const localStreamRef = useRef(initialState.localStream);

  useEffect(() => {
    localStreamRef.current = state.localStream;
  }, [state.localStream]);

  const initialiseLocalStream = useCallback<() => Promise<void>>(async () => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      dispatch(setLocalStream(stream));
    } catch (e) {
      throw new Error('Cannot initialise local stream');
    }
  }, []);

  const gotRemoteStream = useCallback<(event: RTCTrackEvent) => void>(({ streams: [stream] }) => {
    dispatch(setRemoteStream(stream));
  }, []);

  const sendOffer = useCallback<(user: string) => Promise<void>>(
    async user => {
      const localStream = localStreamRef.current;

      if (localStream) {
        peerConnection = new RTCPeerConnection();

        peerConnection.ontrack = gotRemoteStream;

        localStream.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.addTrack(track, localStream);
        });

        const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();

        await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        socket.emit(SocketEvent.CallUser, {
          offer,
          to: user,
        });
      } else {
        throw new Error('Local stream is not available now');
      }
    },
    [state],
  );

  const callUser = useCallback<(user: string) => Promise<void>>(async user => {
    dispatch(setActiveUser(user));

    await sendOffer(user);
  }, []);

  const onCallMade = useCallback<
    (data: { socket: string; offer: RTCSessionDescriptionInit }) => Promise<void>
  >(async ({ socket: socketId, offer }) => {
    dispatch(setActiveUser(socketId));

    peerConnection = new RTCPeerConnection();

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer: RTCSessionDescriptionInit = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(SocketEvent.MakeAnswer, { answer, to: socketId });
  }, []);

  const onAnswerMade = useCallback<
    (data: { socket: string; answer: RTCSessionDescriptionInit }) => Promise<void>
  >(async ({ socket: socketId, answer }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

      if (!isAlreadyCalling) {
        isAlreadyCalling = true;
      }
    } else {
      throw new Error('Peer connection is not available');
    }
  }, []);

  useEffect(() => {
    initialiseLocalStream().catch(error => {
      throw error;
    });

    socket.on(SocketEvent.AddUserToList, ({ user }: { user: string }) => {
      dispatch(addUser(user));
    });

    socket.on(SocketEvent.AnswerMade, onAnswerMade);

    socket.on(SocketEvent.CallMade, onCallMade);

    socket.on(SocketEvent.RemoveUserFromList, ({ user }: { user: string }) => {
      dispatch(removeUser(user));
    });

    socket.on(SocketEvent.UpdateUsersList, ({ users }: { users: string[] }) => {
      dispatch(updateUsers(users));
    });
  }, []);

  return {
    callUser,
    setActiveUser: useCallback<(user: string) => void>((user: string) => {
      dispatch(setActiveUser(user));
    }, []),
    setLocalVideoNode: useCallback<(node: HTMLVideoElement | null) => void>(
      (node: HTMLVideoElement | null) => {
        dispatch(setLocalVideoNode(node));
      },
      [],
    ),
    setRemoteVideoNode: useCallback<(node: HTMLVideoElement | null) => void>(
      (node: HTMLVideoElement | null) => {
        dispatch(setRemoteVideoNode(node));
      },
      [],
    ),
    state,
  };
}

export default useCallDispatcher;
