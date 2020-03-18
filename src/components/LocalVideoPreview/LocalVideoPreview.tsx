import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { default as CallEndIcon } from '@material-ui/icons/CallEnd';
import * as React from 'react';
import './LocalVideoPreview.less';

interface ILocalVideoPreviewProps {
  onEndCall: () => void;
  setVideoNode: (videoNode: HTMLVideoElement) => void;
}

const useStyles = makeStyles({
  previewCard: {
    padding: 0,
  },
});

function LocalVideoPreview(props: ILocalVideoPreviewProps) {
  const { onEndCall, setVideoNode } = props;

  const classes = useStyles();

  const handleEndCallClick = () => {
    onEndCall();
  };

  return (
    <div className="LocalVideoPreview">
      <Card className={classes.previewCard}>
        <div className="LocalVideoPreview__Content">
          <div className="LocalVideoPreview__Content__Video">
            <video autoPlay={true} muted={true} ref={setVideoNode} />
          </div>
          <div className="LocalVideoPreview__Content__Controls">
            <Button variant="contained" color="secondary" onClick={handleEndCallClick}>
              <CallEndIcon />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default React.memo(LocalVideoPreview);
