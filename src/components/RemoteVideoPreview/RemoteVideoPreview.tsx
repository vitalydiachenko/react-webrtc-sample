import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { default as CallEndIcon } from '@material-ui/icons/CallEnd';
import * as React from 'react';
import './RemoteVideoPreview.less';

interface IRemoteVideoPreviewProps {
  onEndCall: () => void;
  setVideoNode: (videoNode: HTMLVideoElement) => void;
}

const useStyles = makeStyles({
  previewCard: {
    padding: 0,
  },
});

function RemoteVideoPreview(props: IRemoteVideoPreviewProps) {
  const { onEndCall, setVideoNode } = props;

  const classes = useStyles();

  const handleEndCallClick = () => {
    onEndCall();
  };

  return (
    <div className="RemoteVideoPreview">
      <Card className={classes.previewCard}>
        <div className="RemoteVideoPreview__Content">
          <div className="RemoteVideoPreview__Content__Video">
            <video autoPlay={true} ref={setVideoNode} />
          </div>
          <div className="RemoteVideoPreview__Content__Controls">
            <Button variant="contained" color="secondary" onClick={handleEndCallClick}>
              <CallEndIcon />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default React.memo(RemoteVideoPreview);
