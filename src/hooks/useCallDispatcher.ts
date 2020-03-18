import { SOCKET_ENDPOINT, SocketEvent } from 'consts';
import { Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import * as io from 'socket.io-client';

enum SocketActions {
  AddUser = 'ADD_USER',
  RemoveUser = 'REMOVE_USER',
  SetActiveUser = 'SET_ACTIVE_USER',
  UpdateUsers = 'UpdateUsers',
}

interface ISocketAction<PayloadType = any> {
  type: SocketActions;
  payload: PayloadType;
}

export interface ICallDispatcherState {
  activeUser: string;
  users: string[];
}

export interface ICallDispatcherHook {
  callUser: (user: string) => Promise<void>;
  peerConnection: RTCPeerConnection;
  setActiveUser: (user: string) => void;
  state: ICallDispatcherState;
}

function addUser(user: string): ISocketAction<{ user: string }> {
  return {
    type: SocketActions.AddUser,
    payload: { user },
  };
}

function removeUser(user: string): ISocketAction<{ user: string }> {
  return {
    type: SocketActions.RemoveUser,
    payload: { user },
  };
}

function setActiveUser(user: string): ISocketAction<{ user: string }> {
  return {
    type: SocketActions.SetActiveUser,
    payload: { user },
  };
}

function updateUsers(users: string[]): ISocketAction<{ users: string[] }> {
  return {
    type: SocketActions.UpdateUsers,
    payload: { users },
  };
}

function reducer(state: ICallDispatcherState, action: ISocketAction): ICallDispatcherState {
  const { type, payload } = action;

  switch (type) {
    case SocketActions.AddUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        users: state.users.includes(user) ? state.users : state.users.concat([user]),
      };
    }

    case SocketActions.RemoveUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        activeUser: state.activeUser === user ? initialState.activeUser : state.activeUser,
        users: state.users.filter(currentUser => currentUser !== user),
      };
    }

    case SocketActions.SetActiveUser: {
      const { user }: { user: string } = payload;

      return {
        ...state,
        activeUser: user,
      };
    }

    case SocketActions.UpdateUsers: {
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
  users: [],
};

let isAlreadyCalling = false;

function useCallDispatcher(): ICallDispatcherHook {
  const socket: SocketIOClient.Socket = useMemo<SocketIOClient.Socket>(
    () => io(SOCKET_ENDPOINT),
    [],
  );

  const peerConnection: RTCPeerConnection = useMemo<RTCPeerConnection>(
    () => new RTCPeerConnection(),
    [],
  );

  const [state, dispatch] = useReducer<Reducer<ICallDispatcherState, ISocketAction>>(
    reducer,
    initialState,
  );

  const sendOffer = useCallback<(user: string) => Promise<void>>(async user => {
    const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit(SocketEvent.CallUser, {
      offer,
      to: user,
    });
  }, []);

  const callUser = useCallback<(user: string) => Promise<void>>(async user => {
    dispatch(setActiveUser(user));

    await sendOffer(user);
  }, []);

  const onCallMade = useCallback<
    (data: { socket: string; offer: RTCSessionDescriptionInit }) => Promise<void>
  >(async ({ socket: socketId, offer }) => {
    dispatch(setActiveUser(socketId));

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer: RTCSessionDescriptionInit = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(SocketEvent.MakeAnswer, { answer, to: socketId });
  }, []);

  const onAnswerMade = useCallback<
    (data: { socket: string; answer: RTCSessionDescriptionInit }) => Promise<void>
  >(async ({ socket: socketId, answer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    if (!isAlreadyCalling) {
      isAlreadyCalling = true;

      await sendOffer(socketId);
    }
  }, []);

  useEffect(() => {
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
    peerConnection,
    setActiveUser: (user: string) => {
      dispatch(setActiveUser(user));
    },
    state,
  };
}

export default useCallDispatcher;
