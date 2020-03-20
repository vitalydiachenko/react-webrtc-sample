import { SOCKET_ENDPOINT, SocketEvent } from 'consts';
import { Reducer, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import * as io from 'socket.io-client';

enum CallDispatcherActions {
  AddUser = 'ADD_USER',
  RemoveUser = 'REMOVE_USER',
  SetActiveUser = 'SET_ACTIVE_USER',
  SetCurrentId = 'SET_CURRENT_ID',
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
  currentId: string;
  localStream: MediaStream | null;
  localVideoNode: HTMLVideoElement | null;
  remoteStream: MediaStream | null;
  remoteVideoNode: HTMLVideoElement | null;
  users: string[];
}

export interface ICallDispatcherHook {
  callUser: (user: string) => Promise<void>;
  endCall: (user: string) => void;
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

function setCurrentId(id: string): ICallDispatcherAction<{ id: string }> {
  return {
    type: CallDispatcherActions.SetCurrentId,
    payload: { id },
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

function setRemoteStream(
  stream: MediaStream | null,
): ICallDispatcherAction<{ stream: MediaStream | null }> {
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

    case CallDispatcherActions.SetCurrentId: {
      const { id }: { id: string } = payload;

      return {
        ...state,
        currentId: id,
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
  currentId: '',
  localStream: null,
  localVideoNode: null,
  remoteStream: null,
  remoteVideoNode: null,
  users: [],
};

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

  const localStreamRef = useRef<MediaStream | null>(initialState.localStream);
  const remoteStreamRef = useRef<MediaStream | null>(initialState.remoteStream);

  useEffect(() => {
    localStreamRef.current = state.localStream;
  }, [state.localStream]);

  useEffect(() => {
    remoteStreamRef.current = state.remoteStream;
  }, [state.remoteStream]);

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

  const gotIceCandidate = useCallback<
    (socketId: string) => (event: RTCPeerConnectionIceEvent) => void
  >(
    (socketId: string) => ({ candidate }: RTCPeerConnectionIceEvent) => {
      if (candidate) {
        socket.emit(SocketEvent.SendIceCandidate, {
          candidate,
          to: socketId,
        });
      }
    },
    [],
  );

  const onIceCandidateReceived = useCallback<
    (data: { candidate: RTCIceCandidate }) => Promise<void>
  >(async ({ candidate }) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
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

        peerConnection.onicecandidate = gotIceCandidate(user);

        localStream.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.addTrack(track, localStream);
        });

        const offer: RTCSessionDescriptionInit = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

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
    const localStream = localStreamRef.current;

    if (localStream) {
      dispatch(setActiveUser(socketId));

      peerConnection = new RTCPeerConnection();

      peerConnection.ontrack = gotRemoteStream;

      peerConnection.onicecandidate = gotIceCandidate(socketId);

      localStream.getTracks().forEach((track: MediaStreamTrack) => {
        peerConnection.addTrack(track, localStream);
      });

      await peerConnection.setRemoteDescription(offer);

      const answer: RTCSessionDescriptionInit = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      socket.emit(SocketEvent.MakeAnswer, { answer, to: socketId });
    } else {
      throw new Error('Local stream is not available now');
    }
  }, []);

  const onAnswerMade = useCallback<
    (data: { socket: string; answer: RTCSessionDescriptionInit }) => Promise<void>
  >(async ({ answer }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer);
    } else {
      throw new Error('Peer connection is not available');
    }
  }, []);

  const closePeerConnection = () => {
    peerConnection.close();

    peerConnection = null;
  };

  const onEndCall = () => {
    closePeerConnection();

    remoteStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    dispatch(setRemoteStream(null));

    dispatch(setActiveUser(''));
  };

  const endCall = useCallback<(user: string) => void>((user: string) => {
    socket.emit(SocketEvent.EndCall, { to: user });

    onEndCall();
  }, []);

  useEffect(() => {
    initialiseLocalStream().catch(error => {
      throw error;
    });

    socket.on('connect', () => {
      dispatch(setCurrentId(socket.id));
    });

    dispatch(setCurrentId(socket.id));

    socket.on(SocketEvent.AddUserToList, ({ user }: { user: string }) => {
      dispatch(addUser(user));
    });

    socket.on(SocketEvent.AnswerMade, onAnswerMade);

    socket.on(SocketEvent.CallMade, onCallMade);

    socket.on(SocketEvent.CallEnded, onEndCall);

    socket.on(
      SocketEvent.IceReceived,
      async ({ socket: socketId, candidate }: { socket: string; candidate: RTCIceCandidate }) => {
        try {
          await onIceCandidateReceived({ candidate });
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.error(error);

          throw new Error(`Cannot process ICE candidate from "#${socketId}"`);
        }
      },
    );

    socket.on(SocketEvent.RemoveUserFromList, ({ user }: { user: string }) => {
      dispatch(removeUser(user));
    });

    socket.on(SocketEvent.UpdateUsersList, ({ users }: { users: string[] }) => {
      dispatch(updateUsers(users));
    });
  }, []);

  return {
    callUser,
    endCall,
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
