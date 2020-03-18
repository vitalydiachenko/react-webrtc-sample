import LocalVideoPreview from 'components/LocalVideoPreview';
import * as React from 'react';
import './VideoPreview.less';

interface IVideoPreviewProps {
  unsetActiveUser: () => void;
}

class VideoPreview extends React.PureComponent<IVideoPreviewProps> {
  private localStream: MediaStream | null;
  private videoNode: HTMLVideoElement | null;

  constructor(props: IVideoPreviewProps) {
    super(props);

    this.videoNode = null;
  }

  public componentDidMount(): void {
    this.turnOnLocalVideoPreview();
  }

  public handleEndCall = () => {
    const { unsetActiveUser } = this.props;

    this.turnOffLocalVideoPreview();

    unsetActiveUser();
  };

  public turnOffLocalVideoPreview = (): void => {
    if (this.videoNode) {
      this.videoNode.pause();
      this.videoNode.srcObject = null;

      if (this.localStream) {
        this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    }
  };

  public turnOnLocalVideoPreview = (): void => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true, audio: true },
        stream => {
          this.localStream = stream;

          if (this.videoNode) {
            this.videoNode.srcObject = this.localStream;
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

  public setVideoNode = (videoNode: HTMLVideoElement): void => {
    this.videoNode = videoNode;
  };

  public render(): React.ReactNode {
    return (
      <div className="VideoPreview">
        <div className="VideoPreview__Local">
          <LocalVideoPreview onEndCall={this.handleEndCall} setVideoNode={this.setVideoNode} />
        </div>
      </div>
    );
  }
}

export default VideoPreview;
