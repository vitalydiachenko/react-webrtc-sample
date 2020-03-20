import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { default as AccountBoxIcon } from '@material-ui/icons/AccountBox';
import * as React from 'react';
import './UsersList.less';

interface IUsersListProps {
  onSelect: (user: string) => void;
  users: string[];
}

const useStyles = makeStyles({
  usersListItem: {
    cursor: 'pointer',
  },
});

function UsersList(props: IUsersListProps) {
  const { onSelect, users } = props;

  const handleUserSelect = (user: string) => () => {
    onSelect(user);
  };

  const classes = useStyles();

  return (
    <div className="UsersList">
      <div className="UsersList__Header">
        <Typography variant="h5" color="textPrimary">
          Contacts
        </Typography>
      </div>
      <div className="UsersList__Main">
        {!users.length ? (
          <Typography variant="overline">Nobody is connected now!</Typography>
        ) : (
          <List>
            {users.map(user => (
              <ListItem
                key={`USERS_LIST_${user}`}
                className={classes.usersListItem}
                onClick={handleUserSelect(user)}
              >
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText>User #{user}</ListItemText>.
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

export default React.memo(UsersList);
