import { SOCKET_ENDPOINT, SocketEvent } from 'consts';
import { Reducer, useEffect, useMemo, useReducer } from 'react';
import * as io from 'socket.io-client';

enum SocketActions {
  AddUser = 'ADD_USER',
  RemoveUser = 'REMOVE_USER',
  UpdateUsers = 'UpdateUsers',
}

interface ISocketAction<PayloadType = any> {
  type: SocketActions;
  payload: PayloadType;
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

function updateUsers(users: string[]): ISocketAction<{ users: string[] }> {
  return {
    type: SocketActions.UpdateUsers,
    payload: { users },
  };
}

export interface ISocketState {
  users: string[];
}

function reducer(state: ISocketState, action: ISocketAction): ISocketState {
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
        users: state.users.filter(currentUser => currentUser !== user),
      };
    }

    case SocketActions.UpdateUsers: {
      const { users }: { users: string[] } = payload;

      return {
        ...state,
        users: [...users],
      };
    }

    default:
      return state;
  }
}

const initialState: ISocketState = {
  users: [],
};

function useSocket(): { state: ISocketState } {
  const socket = useMemo(() => io(SOCKET_ENDPOINT), [io]);

  const [state, dispatch] = useReducer<Reducer<ISocketState, ISocketAction>>(reducer, initialState);

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

  return { state };
}

export default useSocket;
