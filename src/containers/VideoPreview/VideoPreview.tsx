import LocalVideoPreview from 'components/LocalVideoPreview';
import RemoteVideoPreview from 'components/RemoteVideoPreview';
import * as React from 'react';
import './VideoPreview.less';

interface IVideoPreviewProps {
  localStream: MediaStream | null;
  localVideoNode: HTMLVideoElement | null;
  remoteStream: MediaStream | null;
  remoteVideoNode: HTMLVideoElement | null;
  setLocalVideoNode: (node: HTMLVideoElement) => void;
  setRemoteVideoNode: (node: HTMLVideoElement) => void;
  unsetActiveUser: () => void;
}

function VideoPreview(props: IVideoPreviewProps) {
  const {
    localStream,
    localVideoNode,
    remoteStream,
    remoteVideoNode,
    setLocalVideoNode,
    setRemoteVideoNode,
    unsetActiveUser,
  } = props;

  const handleEndCall = () => {
    unsetActiveUser();
  };

  return (
    <div className="VideoPreview">
      <div className="VideoPreview__Remote">
        <RemoteVideoPreview
          onEndCall={handleEndCall}
          remoteStream={remoteStream}
          remoteVideoNode={remoteVideoNode}
          setVideoNode={setRemoteVideoNode}
        />
      </div>
      <div className="VideoPreview__Local">
        <LocalVideoPreview
          localStream={localStream}
          localVideoNode={localVideoNode}
          setVideoNode={setLocalVideoNode}
        />
      </div>
    </div>
  );
}

export default React.memo(VideoPreview);
