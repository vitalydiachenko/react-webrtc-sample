import LocalVideoPreview from 'components/LocalVideoPreview';
import RemoteVideoPreview from 'components/RemoteVideoPreview';
import * as React from 'react';
import './VideoPreview.less';

interface IVideoPreviewProps {
  peerConnection: RTCPeerConnection;
  unsetActiveUser: () => void;
}

class VideoPreview extends React.PureComponent<IVideoPreviewProps> {
  private localStream: MediaStream | null;
  private localVideoNode: HTMLVideoElement | null;
  private remoteVideoNode: HTMLVideoElement | null;

  constructor(props: IVideoPreviewProps) {
    super(props);

    this.localVideoNode = null;
  }

  public componentDidMount(): void {
    this.turnOnLocalVideoPreview(this.turnOnLocalVideoBroadcasting);
  }

  public handleEndCall = () => {
    const { unsetActiveUser } = this.props;

    this.turnOffLocalVideoPreview();

    unsetActiveUser();
  };

  public setPeerConnectionListeners = () => {
    const { peerConnection } = this.props;

    peerConnection.ontrack = ({ streams: [stream] }) => {
      if (this.remoteVideoNode) {
        this.remoteVideoNode.srcObject = stream;
      }
    };
  };

  public turnOffLocalVideoPreview = (): void => {
    if (this.localVideoNode) {
      this.localVideoNode.pause();
      this.localVideoNode.srcObject = null;

      if (this.localStream) {
        this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    }
  };

  public turnOnLocalVideoBroadcasting = (): void => {
    const { peerConnection } = this.props;

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream);
      });
    }

    this.setPeerConnectionListeners();
  };

  public turnOnLocalVideoPreview = (onSuccess: (() => void) | null = null): void => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
          this.localStream = stream;

          if (this.localVideoNode) {
            this.localVideoNode.srcObject = this.localStream;
          }

          if (onSuccess) {
            onSuccess();
          }
        },
        error => {
          throw error;
        },
      );
    } else {
      throw new Error('Cannot turn on video broadcasting from the camera');
    }
  };

  public setLocalVideoNode = (videoNode: HTMLVideoElement): void => {
    this.localVideoNode = videoNode;
  };

  public setRemoteVideoNode = (videoNode: HTMLVideoElement): void => {
    this.remoteVideoNode = videoNode;
  };

  public render(): React.ReactNode {
    return (
      <div className="VideoPreview">
        <div className="VideoPreview__Remote">
          <RemoteVideoPreview
            onEndCall={this.handleEndCall}
            setVideoNode={this.setRemoteVideoNode}
          />
        </div>
        <div className="VideoPreview__Local">
          <LocalVideoPreview setVideoNode={this.setLocalVideoNode} />
        </div>
      </div>
    );
  }
}

export default VideoPreview;
