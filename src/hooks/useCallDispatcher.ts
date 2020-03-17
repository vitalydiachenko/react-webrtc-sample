import { SOCKET_ENDPOINT, SocketEvent } from 'consts';
import { Reducer, useEffect, useMemo, useReducer } from 'react';
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

function useCallDispatcher(): ICallDispatcherHook {
  const socket = useMemo(() => io(SOCKET_ENDPOINT), [io]);

  const [state, dispatch] = useReducer<Reducer<ICallDispatcherState, ISocketAction>>(
    reducer,
    initialState,
  );

  useEffect(() => {
    socket.on(SocketEvent.AddUserToList, ({ user }: { user: string }) => {
      dispatch(addUser(user));
    });

    socket.on(SocketEvent.RemoveUserFromList, ({ user }: { user: string }) => {
      dispatch(removeUser(user));
    });

    socket.on(SocketEvent.UpdateUsersList, ({ users }: { users: string[] }) => {
      dispatch(updateUsers(users));
    });
  }, []);

  return {
    setActiveUser: (user: string) => {
      dispatch(setActiveUser(user));
    },
    state,
  };
}

export default useCallDispatcher;
