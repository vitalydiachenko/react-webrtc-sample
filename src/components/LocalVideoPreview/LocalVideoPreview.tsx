import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import './LocalVideoPreview.less';

interface ILocalVideoPreviewProps {
  setVideoNode: (videoNode: HTMLVideoElement) => void;
}

const useStyles = makeStyles({
  previewCard: {
    padding: 0,
  },
});

function LocalVideoPreview(props: ILocalVideoPreviewProps) {
  const { setVideoNode } = props;

  const classes = useStyles();

  return (
    <div className="LocalVideoPreview">
      <Card className={classes.previewCard}>
        <div className="LocalVideoPreview__Content">
          <div className="LocalVideoPreview__Content__Video">
            <video autoPlay={true} muted={true} ref={setVideoNode} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default React.memo(LocalVideoPreview);
