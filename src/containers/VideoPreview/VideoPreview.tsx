import LocalVideoPreview from 'components/LocalVideoPreview';
import RemoteVideoPreview from 'components/RemoteVideoPreview';
import * as React from 'react';
import './VideoPreview.less';

interface IVideoPreviewProps {
  callingMode: boolean;
  localStream: MediaStream | null;
  localVideoNode: HTMLVideoElement | null;
  onEndCall: () => void;
  remoteStream: MediaStream | null;
  remoteVideoNode: HTMLVideoElement | null;
  setLocalVideoNode: (node: HTMLVideoElement) => void;
  setRemoteVideoNode: (node: HTMLVideoElement) => void;
}

function VideoPreview(props: IVideoPreviewProps) {
  const {
    callingMode,
    localStream,
    localVideoNode,
    onEndCall,
    remoteStream,
    remoteVideoNode,
    setLocalVideoNode,
    setRemoteVideoNode,
  } = props;

  const handleEndCall = () => {
    onEndCall();
  };

  return (
    <div className="VideoPreview">
      <div className="VideoPreview__Remote">
        <RemoteVideoPreview
          callingMode={callingMode}
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
